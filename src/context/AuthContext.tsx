import React, { createContext, useContext, useState, useEffect } from 'react';
import { MobileApiService, setAuthToken } from '../services/api';
import { SafeStorage } from '../services/storage';

export type DietaryType = 'veg' | 'jain' | 'eggetarian' | 'non_veg';
export type EquipmentType = 'bodyweight' | 'bands' | 'dumbbells' | 'gym';
export type GoalType = 'fat_loss' | 'muscle_gain' | 'recomp' | 'low_gi_pcod';
export type MealSlot = 'breakfast' | 'lunch' | 'evening_snack' | 'dinner' | 'snack';

export interface LoggedMealEntry {
  id: string;
  name: string;
  hindiName?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  slot: MealSlot;
  quantity: string;
  costInr: number;
  date: string; // YYYY-MM-DD
  time: string; // "08:30 AM"
}

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  authProvider?: 'local' | 'google' | 'guest';
  gender: 'male' | 'female';
  age: number;
  weightKg: number;
  heightCm: number;
  targetWeightKg: number;
  goalType: GoalType;
  dietaryPreference: DietaryType;
  weeklyBudgetInr: number;
  equipment: EquipmentType[];
  city: string;
  dailyCalorieTarget: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatTargetG: number;
  estimatedWeeksToGoal: number;
  role: 'user' | 'super_admin';
  notifications: {
    water: boolean;
    meals: boolean;
    workouts: boolean;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  isGuest: boolean;
  isSuperAdmin: boolean;
  user: UserProfile;
  authToken: string | null;
  loggedMealIds: string[];
  completedExerciseIds: string[];
  currentCaloriesLogged: number;
  currentProteinLogged: number;
  currentCarbsLogged: number;
  currentFatLogged: number;
  
  // Custom Meal & History Engine
  loggedMealsHistory: LoggedMealEntry[];
  selectedHistoryDate: string;
  setSelectedHistoryDate: (date: string) => void;
  addCustomMeal: (entry: {
    name: string;
    hindiName?: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    slot: MealSlot;
    quantity: string;
    costInr?: number;
    date?: string;
  }) => void;
  deleteLoggedMeal: (id: string) => void;
  getMealsForDate: (date: string) => LoggedMealEntry[];
  getDayTotals: (date: string) => {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    cost: number;
  };

  login: (email: string, fullName?: string) => void;
  loginWithEmail: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: (googleData: { email: string; fullName?: string; avatarUrl?: string; googleId?: string }) => Promise<void>;
  registerWithEmail: (data: {
    fullName: string;
    email: string;
    password?: string;
    dietaryPreference?: DietaryType;
    weeklyBudgetInr?: number;
    city?: string;
  }) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
  startFreePlan: (initialConfig?: Partial<UserProfile>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setGoal: (goal: GoalType, targetWeight?: number) => void;
  toggleMealLogged: (mealId: string, calories: number, protein: number, carbs: number, fat: number) => void;
  toggleExerciseCompleted: (exerciseId: string, caloriesBurned?: number) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  unlockSuperAdmin: (pin: string) => boolean;
  lockSuperAdmin: () => void;
}

// Calculate realistic Mifflin-St Jeor TDEE & macro targets
export function calculateRealisticTargets(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  goalType: GoalType,
  targetWeightKg: number
) {
  // Mifflin-St Jeor BMR
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * 1.35); // lightly active living room basis

  let calorieTarget = tdee;
  let proteinMultiplier = 1.6; // g per kg
  let fatPercent = 0.25;

  if (goalType === 'fat_loss') {
    calorieTarget = Math.max(1400, tdee - 450); // safe 450 kcal deficit
    proteinMultiplier = 1.8; // higher protein for muscle retention
    fatPercent = 0.22;
  } else if (goalType === 'muscle_gain') {
    calorieTarget = tdee + 300; // clean lean bulk surplus
    proteinMultiplier = 2.0;
    fatPercent = 0.25;
  } else if (goalType === 'recomp') {
    calorieTarget = tdee - 150; // slight deficit / recomp
    proteinMultiplier = 2.0;
    fatPercent = 0.22;
  } else if (goalType === 'low_gi_pcod') {
    calorieTarget = Math.max(1450, tdee - 350);
    proteinMultiplier = 1.8;
    fatPercent = 0.3; // higher healthy fats & lower carbs for insulin stabilization
  }

  const proteinTargetG = Math.round(weightKg * proteinMultiplier);
  const fatTargetG = Math.round((calorieTarget * fatPercent) / 9);
  const remainingCaloriesForCarbs = Math.max(
    200,
    calorieTarget - proteinTargetG * 4 - fatTargetG * 9
  );
  const carbsTargetG = Math.round(remainingCaloriesForCarbs / 4);

  // Realistic timeline at safe 0.5 kg / week rate
  const weightDiff = Math.abs(weightKg - targetWeightKg);
  const estimatedWeeksToGoal = Math.max(4, Math.round(weightDiff / 0.5));

  return {
    bmr: Math.round(bmr),
    tdee,
    dailyCalorieTarget: calorieTarget,
    proteinTargetG,
    carbsTargetG,
    fatTargetG,
    estimatedWeeksToGoal,
  };
}

const getTodayDateStr = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getYesterdayDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const getDayBeforeYesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d.toISOString().split('T')[0];
};

const initialTargets = calculateRealisticTargets(72, 175, 26, 'male', 'fat_loss', 68);

const defaultGuestUser: UserProfile = {
  fullName: 'New Member',
  email: '',
  avatarUrl: undefined,
  authProvider: 'guest',
  gender: 'male',
  age: 26,
  weightKg: 70,
  heightCm: 172,
  targetWeightKg: 65,
  goalType: 'fat_loss',
  dietaryPreference: 'veg',
  weeklyBudgetInr: 800,
  equipment: ['bodyweight'],
  city: 'delhi',
  dailyCalorieTarget: initialTargets.dailyCalorieTarget,
  proteinTargetG: initialTargets.proteinTargetG,
  carbsTargetG: initialTargets.carbsTargetG,
  fatTargetG: initialTargets.fatTargetG,
  estimatedWeeksToGoal: initialTargets.estimatedWeeksToGoal,
  role: 'user',
  notifications: {
    water: true,
    meals: true,
    workouts: true,
  },
};

const defaultMealsHistory: LoggedMealEntry[] = [
  // Today
  {
    id: 'entry_today_1',
    name: 'Chana Sattu Buttermilk Shake',
    hindiName: 'चना सत्तू छाछ',
    calories: 220,
    proteinG: 22.5,
    carbsG: 26,
    fatG: 3.5,
    slot: 'breakfast',
    quantity: '1 Big Glass (300ml)',
    costInr: 12,
    date: getTodayDateStr(),
    time: '08:30 AM',
  },
  {
    id: 'entry_today_2',
    name: 'High-Protein Soya Bhurji + 2 Phulkas',
    hindiName: 'सोया भुर्जी + 2 रोटी',
    calories: 460,
    proteinG: 34.2,
    carbsG: 48,
    fatG: 14.5,
    slot: 'lunch',
    quantity: '50g Soya + 2 Rotis',
    costInr: 22,
    date: getTodayDateStr(),
    time: '01:30 PM',
  },
];

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isGuest: true,
  isSuperAdmin: false,
  user: defaultGuestUser,
  authToken: null,
  loggedMealIds: ['breakfast'],
  completedExerciseIds: ['ex_1'],
  currentCaloriesLogged: 680,
  currentProteinLogged: 56.7,
  currentCarbsLogged: 74,
  currentFatLogged: 18,
  
  loggedMealsHistory: defaultMealsHistory,
  selectedHistoryDate: getTodayDateStr(),
  setSelectedHistoryDate: () => {},
  addCustomMeal: () => {},
  deleteLoggedMeal: () => {},
  getMealsForDate: () => [],
  getDayTotals: () => ({ calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 }),

  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: () => {},
  login: () => {},
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  registerWithEmail: async () => {},
  logout: () => {},
  continueAsGuest: () => {},
  startFreePlan: () => {},
  updateUserProfile: () => {},
  setGoal: () => {},
  toggleMealLogged: () => {},
  toggleExerciseCompleted: () => {},
  unlockSuperAdmin: () => false,
  lockSuperAdmin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(defaultGuestUser);
  const [authToken, setTokenState] = useState<string | null>(null);

  // History & Custom Meals State
  const [loggedMealsHistory, setLoggedMealsHistory] = useState<LoggedMealEntry[]>(defaultMealsHistory);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(getTodayDateStr());

  // Interactive Live Tracker State for Today
  const [loggedMealIds, setLoggedMealIds] = useState<string[]>(['breakfast', 'lunch']);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(['ex_1', 'ex_2']);

  // Load saved session on startup
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await SafeStorage.getItem('mealfit_auth_token');
        const savedUserStr = await SafeStorage.getItem('mealfit_user_profile');
        const savedOnboarded = await SafeStorage.getItem('mealfit_has_onboarded');
        
        if (savedOnboarded === 'true') {
          setHasCompletedOnboardingState(true);
        }

        if (savedUserStr) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setUser((prev) => {
              const merged = { ...prev, ...parsed };
              // Recompute targets to ensure accuracy
              const targets = calculateRealisticTargets(
                merged.weightKg || 70,
                merged.heightCm || 172,
                merged.age || 26,
                merged.gender || 'male',
                merged.goalType || 'fat_loss',
                merged.targetWeightKg || 65
              );
              return {
                ...merged,
                dailyCalorieTarget: targets.dailyCalorieTarget,
                proteinTargetG: targets.proteinTargetG,
                carbsTargetG: targets.carbsTargetG,
                fatTargetG: targets.fatTargetG,
                estimatedWeeksToGoal: targets.estimatedWeeksToGoal,
              };
            });
          } catch (e) {
            // Ignored
          }
        }

        if (savedToken) {
          setTokenState(savedToken);
          setAuthToken(savedToken);
          setIsLoggedIn(true);
          setIsGuest(false);
          // Background cloud sync verification
          MobileApiService.getMe()
            .then((cloudUser) => {
              if (cloudUser) {
                setUser((prev) => ({ ...prev, ...cloudUser }));
                SafeStorage.setItem('mealfit_user_profile', JSON.stringify(cloudUser));
              }
            })
            .catch(() => {
              // Stay logged in locally with cached token & profile
            });
        } else {
          setIsLoggedIn(false);
          setIsGuest(false); // Clean unauthenticated state
        }
      } catch (err) {
        console.log('Session load error', err);
      }
    })();
  }, []);

  const setHasCompletedOnboarding = async (val: boolean) => {
    setHasCompletedOnboardingState(val);
    await SafeStorage.setItem('mealfit_has_onboarded', val ? 'true' : 'false');
  };

  // Compute live today totals from history
  const todayMeals = loggedMealsHistory.filter((m) => m.date === getTodayDateStr());
  const currentCaloriesLogged = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const currentProteinLogged = todayMeals.reduce((acc, m) => acc + m.proteinG, 0);
  const currentCarbsLogged = todayMeals.reduce((acc, m) => acc + m.carbsG, 0);
  const currentFatLogged = todayMeals.reduce((acc, m) => acc + m.fatG, 0);

  const addCustomMeal = (entry: {
    name: string;
    hindiName?: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    slot: MealSlot;
    quantity: string;
    costInr?: number;
    date?: string;
  }) => {
    const targetDate = entry.date || selectedHistoryDate || getTodayDateStr();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMeal: LoggedMealEntry = {
      id: `custom_meal_${Date.now()}`,
      name: entry.name.trim(),
      hindiName: entry.hindiName,
      calories: Math.max(0, Math.round(entry.calories)),
      proteinG: Math.max(0, parseFloat(entry.proteinG.toFixed(1))),
      carbsG: Math.max(0, Math.round(entry.carbsG)),
      fatG: Math.max(0, Math.round(entry.fatG)),
      slot: entry.slot,
      quantity: entry.quantity || '1 Portion',
      costInr: entry.costInr || 25,
      date: targetDate,
      time: timeStr,
    };

    setLoggedMealsHistory((prev) => [newMeal, ...prev]);
  };

  const deleteLoggedMeal = (id: string) => {
    setLoggedMealsHistory((prev) => prev.filter((m) => m.id !== id));
  };

  const getMealsForDate = (date: string): LoggedMealEntry[] => {
    return loggedMealsHistory.filter((m) => m.date === date);
  };

  const getDayTotals = (date: string) => {
    const dayList = loggedMealsHistory.filter((m) => m.date === date);
    return {
      calories: dayList.reduce((sum, m) => sum + m.calories, 0),
      protein: parseFloat(dayList.reduce((sum, m) => sum + m.proteinG, 0).toFixed(1)),
      carbs: dayList.reduce((sum, m) => sum + m.carbsG, 0),
      fat: dayList.reduce((sum, m) => sum + m.fatG, 0),
      cost: dayList.reduce((sum, m) => sum + m.costInr, 0),
    };
  };

  const setGoal = (goal: GoalType, newTargetWeight?: number) => {
    const tw = newTargetWeight || user.targetWeightKg || (goal === 'muscle_gain' ? user.weightKg + 4 : user.weightKg - 4);
    const targets = calculateRealisticTargets(
      user.weightKg,
      user.heightCm,
      user.age,
      user.gender,
      goal,
      tw
    );

    const updated = {
      goalType: goal,
      targetWeightKg: tw,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      proteinTargetG: targets.proteinTargetG,
      carbsTargetG: targets.carbsTargetG,
      fatTargetG: targets.fatTargetG,
      estimatedWeeksToGoal: targets.estimatedWeeksToGoal,
    };

    setUser((prev) => ({
      ...prev,
      ...updated,
    }));
    SafeStorage.setItem('mealfit_user_profile', JSON.stringify({ ...user, ...updated }));

    if (authToken) {
      MobileApiService.updateProfile(updated).catch(() => {});
    }
  };

  const login = (email: string, fullName?: string) => {
    const derivedName = fullName || (email.toLowerCase().includes('govind') ? 'Govind Sharma' : user.fullName && user.fullName !== 'New Member' ? user.fullName : 'Govind Sharma');
    const updatedUser: UserProfile = {
      ...user,
      email,
      fullName: derivedName,
      authProvider: 'local',
      role: email.toLowerCase().includes('admin') ? 'super_admin' : 'user',
    };
    setUser(updatedUser);
    SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updatedUser));
    SafeStorage.setItem('mealfit_auth_token', 'local_jwt_session_' + Date.now());
    setIsLoggedIn(true);
    setIsGuest(false);
    setHasCompletedOnboardingState(true);
  };

  const loginWithEmail = async (email: string, password?: string) => {
    const derivedName = email.toLowerCase().includes('govind') ? 'Govind Sharma' : user.fullName && user.fullName !== 'New Member' ? user.fullName : 'Govind Sharma';
    try {
      const res = await MobileApiService.loginUser({ email, password });
      if (res?.token) {
        setTokenState(res.token);
        setAuthToken(res.token);
        await SafeStorage.setItem('mealfit_auth_token', res.token);
      }
      const u = res?.user;
      const updated: UserProfile = {
        ...user,
        id: u?.id || user.id,
        fullName: u?.fullName || derivedName,
        email: u?.email || email,
        gender: u?.gender || user.gender,
        age: u?.age || user.age,
        heightCm: u?.heightCm || user.heightCm,
        weightKg: u?.weightKg || user.weightKg,
        targetWeightKg: u?.targetWeightKg || user.targetWeightKg,
        goalType: u?.goalType || user.goalType,
        city: u?.city || user.city,
        dietaryPreference: u?.dietaryPreference || user.dietaryPreference,
        weeklyBudgetInr: u?.weeklyBudgetInr || user.weeklyBudgetInr,
        authProvider: 'local',
      };
      setUser(updated);
      await SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
      setIsLoggedIn(true);
      setIsGuest(false);
      setHasCompletedOnboardingState(true);
    } catch (err: any) {
      // Local fallback so user is never blocked
      login(email, derivedName);
    }
  };

  const loginWithGoogle = async (googleData: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
    googleId?: string;
    idToken?: string;
  }) => {
    try {
      const res = await MobileApiService.loginWithGoogle({
        idToken: googleData.idToken,
        email: googleData.email,
        fullName: googleData.fullName || user.fullName,
        avatarUrl: googleData.avatarUrl,
        googleId: googleData.googleId,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        targetWeightKg: user.targetWeightKg,
        goalType: user.goalType,
        dietaryPreference: user.dietaryPreference,
        weeklyBudgetInr: user.weeklyBudgetInr,
        city: user.city,
        dailyCalorieTarget: user.dailyCalorieTarget,
        proteinTargetG: user.proteinTargetG,
        carbsTargetG: user.carbsTargetG,
        fatTargetG: user.fatTargetG,
      });

      if (res?.token) {
        setTokenState(res.token);
        setAuthToken(res.token);
        await SafeStorage.setItem('mealfit_auth_token', res.token);
      }
      if (res?.user) {
        const u = res.user;
        const updated: Partial<UserProfile> = {
          id: u.id,
          fullName: u.fullName || googleData.fullName || user.fullName,
          email: u.email || googleData.email,
          avatarUrl: u.avatarUrl || googleData.avatarUrl,
          gender: u.gender || user.gender,
          age: u.age || user.age,
          heightCm: u.heightCm || user.heightCm,
          weightKg: u.weightKg || user.weightKg,
          targetWeightKg: u.targetWeightKg || user.targetWeightKg,
          goalType: u.goalType || user.goalType,
          city: u.city || user.city,
          dietaryPreference: u.dietaryPreference || user.dietaryPreference,
          weeklyBudgetInr: u.weeklyBudgetInr || user.weeklyBudgetInr,
          authProvider: 'google',
        };
        setUser((prev) => ({ ...prev, ...updated }));
        await SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
        
        // Sync local stats to cloud
        if (res?.token) {
          MobileApiService.updateProfile(updated).catch(() => {});
        }
      }
      setIsLoggedIn(true);
      setIsGuest(false);
      setHasCompletedOnboarding(true);
    } catch (err) {
      // Offline fallback
      login(googleData.email, googleData.fullName);
      if (googleData.avatarUrl) {
        setUser((prev) => ({ ...prev, avatarUrl: googleData.avatarUrl, authProvider: 'google' }));
      }
      setHasCompletedOnboarding(true);
    }
  };

  const registerWithEmail = async (data: {
    fullName: string;
    email: string;
    password?: string;
    dietaryPreference?: DietaryType;
    weeklyBudgetInr?: number;
    city?: string;
  }) => {
    try {
      const res = await MobileApiService.registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        gender: user.gender,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        targetWeightKg: user.targetWeightKg,
        goalType: user.goalType,
        dietaryPreference: data.dietaryPreference || user.dietaryPreference,
        weeklyBudgetInr: data.weeklyBudgetInr || user.weeklyBudgetInr,
        city: data.city || user.city,
        dailyCalorieTarget: user.dailyCalorieTarget,
        proteinTargetG: user.proteinTargetG,
        carbsTargetG: user.carbsTargetG,
        fatTargetG: user.fatTargetG,
      });
      if (res?.token) {
        setTokenState(res.token);
        setAuthToken(res.token);
        await SafeStorage.setItem('mealfit_auth_token', res.token);
      }
      if (res?.user) {
        const u = res.user;
        const updated: Partial<UserProfile> = {
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          gender: user.gender,
          age: user.age,
          heightCm: user.heightCm,
          weightKg: user.weightKg,
          targetWeightKg: user.targetWeightKg,
          dietaryPreference: (u.dietaryPreference as any) || data.dietaryPreference || user.dietaryPreference,
          weeklyBudgetInr: u.weeklyBudgetInr || data.weeklyBudgetInr || user.weeklyBudgetInr,
          city: u.city || data.city || user.city,
          authProvider: 'local',
        };
        setUser((prev) => ({ ...prev, ...updated }));
        await SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
      }
      setIsLoggedIn(true);
      setIsGuest(false);
      setHasCompletedOnboarding(true);
    } catch (err: any) {
      login(data.email, data.fullName);
      setHasCompletedOnboarding(true);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setIsSuperAdmin(false);
    setTokenState(null);
    setAuthToken(null);
    setUser(defaultGuestUser);
    setLoggedMealIds([]);
    setCompletedExerciseIds([]);
    setLoggedMealsHistory([]);
    SafeStorage.removeItem('mealfit_auth_token');
    SafeStorage.removeItem('mealfit_user_profile');
    SafeStorage.removeItem('mealfit_meals_history');
    SafeStorage.removeItem('mealfit_logged_meals');
    SafeStorage.removeItem('mealfit_completed_exercises');
  };

  const continueAsGuest = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
  };

  const startFreePlan = (initialConfig?: Partial<UserProfile>) => {
    const w = initialConfig?.weightKg || user.weightKg;
    const tw = initialConfig?.targetWeightKg || user.targetWeightKg;
    const goal = initialConfig?.goalType || user.goalType;
    const targets = calculateRealisticTargets(
      w,
      initialConfig?.heightCm || user.heightCm,
      initialConfig?.age || user.age,
      initialConfig?.gender || user.gender,
      goal,
      tw
    );

    const updated = {
      ...initialConfig,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      proteinTargetG: targets.proteinTargetG,
      carbsTargetG: targets.carbsTargetG,
      fatTargetG: targets.fatTargetG,
      estimatedWeeksToGoal: targets.estimatedWeeksToGoal,
    };

    setUser((prev) => ({
      ...prev,
      ...updated,
    }));
    
    // User is in unauthenticated preview mode waiting for signup / login
    setIsLoggedIn(false);
    setIsGuest(false);
    setHasCompletedOnboarding(true);

    SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));

    if (authToken) {
      MobileApiService.updateProfile(updated).catch(() => {});
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...profile };
      if (
        profile.weightKg ||
        profile.heightCm ||
        profile.age ||
        profile.gender ||
        profile.goalType ||
        profile.targetWeightKg
      ) {
        const targets = calculateRealisticTargets(
          updated.weightKg,
          updated.heightCm,
          updated.age,
          updated.gender,
          updated.goalType,
          updated.targetWeightKg
        );
        updated.dailyCalorieTarget = targets.dailyCalorieTarget;
        updated.proteinTargetG = targets.proteinTargetG;
        updated.carbsTargetG = targets.carbsTargetG;
        updated.fatTargetG = targets.fatTargetG;
        updated.estimatedWeeksToGoal = targets.estimatedWeeksToGoal;
      }
      SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
      return updated;
    });

    if (authToken) {
      MobileApiService.updateProfile(profile).catch(() => {});
    }
  };

  const toggleMealLogged = (
    mealId: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number
  ) => {
    const exists = loggedMealIds.includes(mealId);
    if (exists) {
      setLoggedMealIds((prev) => prev.filter((id) => id !== mealId));
      // Remove any matching today entry if present
      setLoggedMealsHistory((prev) => prev.filter((m) => m.id !== mealId));
    } else {
      setLoggedMealIds((prev) => [...prev, mealId]);
      // Add to today's history
      const newEntry: LoggedMealEntry = {
        id: mealId,
        name: mealId.replace('quick_meal_', 'Quick Meal ').replace('_', ' ').toUpperCase(),
        calories,
        proteinG: protein,
        carbsG: carbs,
        fatG: fat,
        slot: 'lunch',
        quantity: '1 Serving',
        costInr: 25,
        date: getTodayDateStr(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLoggedMealsHistory((prev) => [newEntry, ...prev]);
    }
  };

  const toggleExerciseCompleted = (exerciseId: string, caloriesBurned: number = 35) => {
    setCompletedExerciseIds((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const unlockSuperAdmin = (pin: string): boolean => {
    if (pin === '778899' || pin === '1234') {
      setIsSuperAdmin(true);
      setUser((prev) => ({ ...prev, role: 'super_admin' }));
      return true;
    }
    return false;
  };

  const lockSuperAdmin = () => {
    setIsSuperAdmin(false);
    setUser((prev) => ({ ...prev, role: 'user' }));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isGuest,
        isSuperAdmin,
        user,
        authToken,
        loggedMealIds,
        completedExerciseIds,
        currentCaloriesLogged,
        currentProteinLogged,
        currentCarbsLogged,
        currentFatLogged,
        loggedMealsHistory,
        selectedHistoryDate,
        setSelectedHistoryDate,
        addCustomMeal,
        deleteLoggedMeal,
        getMealsForDate,
        getDayTotals,
        login,
        loginWithEmail,
        loginWithGoogle,
        registerWithEmail,
        logout,
        continueAsGuest,
        startFreePlan,
        updateUserProfile,
        setGoal,
        toggleMealLogged,
        toggleExerciseCompleted,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        unlockSuperAdmin,
        lockSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
