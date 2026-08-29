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

export interface SavedCustomMeal {
  id: string;
  name: string; // User given custom name, e.g. "Govind's Power Lunch"
  dishDescription: string; // e.g. "2 Rotis + 1 Bowl Moong Dal + 100g Dahi"
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  costInr: number;
  slot: MealSlot;
  createdAt: string;
}

export interface UserProfile {
  id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  authProvider?: 'local' | 'guest';
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
  preferredLanguage?: string;
  notifications: {
    water: boolean;
    meals: boolean;
    workouts: boolean;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  isGuest: boolean;
  isLoadingAuth: boolean;
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

  // Saved / Repeatable Custom Meals Engine
  savedMeals: SavedCustomMeal[];
  saveCustomMeal: (meal: Omit<SavedCustomMeal, 'id' | 'createdAt'>) => void;
  deleteSavedMeal: (id: string) => void;
  repeatSavedMeal: (savedMealId: string, targetDate?: string) => void;

  login: (email: string, fullName?: string) => void;
  loginWithEmail: (email: string, password?: string) => Promise<void>;
  registerWithEmail: (data: {
    fullName: string;
    email: string;
    password?: string;
    dietaryPreference?: DietaryType;
    weeklyBudgetInr?: number;
    city?: string;
    goalType?: GoalType;
    gender?: 'male' | 'female';
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
  isLoadingAuth: true,
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
  savedMeals: [],
  saveCustomMeal: () => {},
  deleteSavedMeal: () => {},
  repeatSavedMeal: () => {},
  addCustomMeal: () => {},
  deleteLoggedMeal: () => {},
  getMealsForDate: () => [],
  getDayTotals: () => ({ calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 }),

  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: () => {},
  login: () => {},
  loginWithEmail: async () => {},
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
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(defaultGuestUser);
  const [authToken, setTokenState] = useState<string | null>(null);

  // History & Custom Meals State
  const [loggedMealsHistory, setLoggedMealsHistory] = useState<LoggedMealEntry[]>(defaultMealsHistory);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(getTodayDateStr());
  const [savedMeals, setSavedMeals] = useState<SavedCustomMeal[]>([
    {
      id: 'saved_1',
      name: 'Power Soya & Dal Lunch',
      dishDescription: '50g Soya Bhurji + 1 Bowl Moong Dal + 2 Phulkas',
      calories: 480,
      proteinG: 38.5,
      carbsG: 52,
      fatG: 12,
      costInr: 28,
      slot: 'lunch',
      createdAt: getTodayDateStr(),
    },
    {
      id: 'saved_2',
      name: 'Morning Sattu Kickstart',
      dishDescription: '1 Big Glass Chana Sattu Buttermilk + Lemon + Jeera',
      calories: 220,
      proteinG: 22.5,
      carbsG: 26,
      fatG: 3.5,
      costInr: 12,
      slot: 'breakfast',
      createdAt: getTodayDateStr(),
    },
  ]);

  // Interactive Live Tracker State for Today
  const [loggedMealIds, setLoggedMealIds] = useState<string[]>(['breakfast', 'lunch']);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(['ex_1', 'ex_2']);

  // Load saved session on startup & verify cloud JWT validity with MongoDB Atlas
  useEffect(() => {
    (async () => {
      try {
        const savedIsLoggedIn = await SafeStorage.getItem('mealfit_is_logged_in');
        const savedToken = await SafeStorage.getItem('mealfit_auth_token');
        const savedUserStr = await SafeStorage.getItem('mealfit_user_profile');
        const savedOnboarded = await SafeStorage.getItem('mealfit_has_onboarded');
        const savedHistoryStr = await SafeStorage.getItem('mealfit_meals_history');
        const savedCustomMealsStr = await SafeStorage.getItem('mealfit_saved_custom_meals');
        const savedLoggedMealIdsStr = await SafeStorage.getItem('mealfit_logged_meals');
        const savedCompletedExercisesStr = await SafeStorage.getItem('mealfit_completed_exercises');

        if (savedOnboarded === 'true') {
          setHasCompletedOnboardingState(true);
        }

        if (savedHistoryStr) {
          try {
            const parsed = JSON.parse(savedHistoryStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setLoggedMealsHistory(parsed);
            }
          } catch {}
        }

        if (savedCustomMealsStr) {
          try {
            const parsed = JSON.parse(savedCustomMealsStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setSavedMeals(parsed);
            }
          } catch {}
        }

        if (savedLoggedMealIdsStr) {
          try {
            const parsed = JSON.parse(savedLoggedMealIdsStr);
            if (Array.isArray(parsed)) {
              setLoggedMealIds(parsed);
            }
          } catch {}
        }

        if (savedCompletedExercisesStr) {
          try {
            const parsed = JSON.parse(savedCompletedExercisesStr);
            if (Array.isArray(parsed)) {
              setCompletedExerciseIds(parsed);
            }
          } catch {}
        }

        // 1. Restore logged in state if user previously logged in, has active token, or has stored non-guest profile
        let parsedSavedUser: any = null;
        if (savedUserStr) {
          try {
            parsedSavedUser = JSON.parse(savedUserStr);
            const targets = calculateRealisticTargets(
              parsedSavedUser.weightKg || 70,
              parsedSavedUser.heightCm || 172,
              parsedSavedUser.age || 26,
              parsedSavedUser.gender || 'male',
              parsedSavedUser.goalType || 'fat_loss',
              parsedSavedUser.targetWeightKg || 65
            );
            const userProfile: UserProfile = {
              ...defaultGuestUser,
              ...parsedSavedUser,
              dailyCalorieTarget: targets.dailyCalorieTarget,
              proteinTargetG: targets.proteinTargetG,
              carbsTargetG: targets.carbsTargetG,
              fatTargetG: targets.fatTargetG,
              estimatedWeeksToGoal: targets.estimatedWeeksToGoal,
            };
            setUser(userProfile);
            const isSuper = userProfile.role === 'super_admin' || userProfile.email?.toLowerCase().includes('govind');
            setIsSuperAdmin(isSuper);
          } catch {}
        }

        const hasValidUserEmail = Boolean(parsedSavedUser?.email && parsedSavedUser.email.trim().length > 0 && parsedSavedUser.authProvider !== 'guest');
        const shouldBeLoggedIn = savedIsLoggedIn === 'true' || Boolean(savedToken) || hasValidUserEmail;

        if (shouldBeLoggedIn) {
          if (savedToken) {
            setTokenState(savedToken);
            setAuthToken(savedToken);
          }
          setIsLoggedIn(true);
          setIsGuest(false);
          // Reinforce persistent flag
          SafeStorage.setItem('mealfit_is_logged_in', 'true');

          // Verify/refresh profile from MongoDB server in background without blocking or unprompted logout
          if (savedToken && !savedToken.startsWith('local_jwt_session_')) {
            MobileApiService.getMe()
              .then((cloudUser) => {
                if (cloudUser) {
                  const isGovind = cloudUser.email?.toLowerCase().includes('govind') || cloudUser.role === 'super_admin';
                  setUser((prev) => {
                    const updated: UserProfile = {
                      ...prev,
                      ...cloudUser,
                      role: cloudUser.role || (isGovind ? 'super_admin' : 'user'),
                    };
                    SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
                    return updated;
                  });
                  setIsSuperAdmin(isGovind);
                  if (Array.isArray(cloudUser.savedMeals) && cloudUser.savedMeals.length > 0) {
                    setSavedMeals(cloudUser.savedMeals);
                    SafeStorage.setItem('mealfit_saved_custom_meals', JSON.stringify(cloudUser.savedMeals));
                  }
                }
              })
              .catch((err: any) => {
                // NEVER log out on network/timeout/cold-start glitches! Retain local session permanently.
                console.log('[MealFit Auth] Background profile sync offline or delayed, retaining persistent local session:', err?.message);
              });

            // Fetch today's MongoDB Daily Logs in background
            MobileApiService.getDailyLogs(getTodayDateStr())
              .then((res: any) => {
                const cloudMeals = res?.log?.meals;
                if (Array.isArray(cloudMeals) && cloudMeals.length > 0) {
                  const formattedEntries: LoggedMealEntry[] = cloudMeals.map((m: any) => ({
                    id: m.customId || m._id || `entry_${Date.now()}_${Math.random()}`,
                    name: m.dishName || 'Home Meal',
                    hindiName: m.hindiName,
                    calories: m.calories || 0,
                    proteinG: m.proteinG || 0,
                    carbsG: m.carbsG || 0,
                    fatG: m.fatG || 0,
                    slot: (m.slot || (m.mealType === 'snack' ? 'evening_snack' : m.mealType) || 'lunch') as MealSlot,
                    quantity: m.quantity || `${m.portionKatoris || 1} Katori`,
                    costInr: m.costInr || 25,
                    date: res.log.logDate || getTodayDateStr(),
                    time: m.time || '12:00 PM',
                  }));

                  setLoggedMealsHistory((prev) => {
                    const otherDates = prev.filter((p) => p.date !== getTodayDateStr());
                    const merged = [...formattedEntries, ...otherDates];
                    SafeStorage.setItem('mealfit_meals_history', JSON.stringify(merged));
                    return merged;
                  });

                  const mealIds = formattedEntries.map((e) => e.id);
                  setLoggedMealIds(mealIds);
                  SafeStorage.setItem('mealfit_logged_meals', JSON.stringify(mealIds));
                }
              })
              .catch(() => {});
          }
        } else {
          setIsLoggedIn(false);
          setIsGuest(true);
        }
      } catch (err) {
        console.log('Session load error', err);
      } finally {
        setIsLoadingAuth(false);
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

    const newMealId = `custom_meal_${Date.now()}`;
    const newMeal: LoggedMealEntry = {
      id: newMealId,
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

    setLoggedMealsHistory((prev) => {
      const updated = [newMeal, ...prev];
      SafeStorage.setItem('mealfit_meals_history', JSON.stringify(updated));
      return updated;
    });

    if (targetDate === getTodayDateStr()) {
      setLoggedMealIds((prev) => {
        const updated = [...prev, newMealId];
        SafeStorage.setItem('mealfit_logged_meals', JSON.stringify(updated));
        return updated;
      });
    }

    // Sync directly to MongoDB Atlas
    if (authToken) {
      MobileApiService.logMeal({
        customId: newMealId,
        logDate: targetDate,
        mealType: entry.slot === 'evening_snack' ? 'snack' : entry.slot,
        dishName: entry.name.trim(),
        hindiName: entry.hindiName,
        calories: Math.max(0, Math.round(entry.calories)),
        proteinG: Math.max(0, parseFloat(entry.proteinG.toFixed(1))),
        carbsG: Math.max(0, Math.round(entry.carbsG)),
        fatG: Math.max(0, Math.round(entry.fatG)),
        slot: entry.slot,
        quantity: entry.quantity || '1 Portion',
        costInr: entry.costInr || 25,
        time: timeStr,
      }).catch((err) => console.log('[MongoDB Sync] logMeal sync error:', err));
    }
  };

  const saveCustomMeal = (meal: Omit<SavedCustomMeal, 'id' | 'createdAt'>) => {
    const newSaved: SavedCustomMeal = {
      ...meal,
      id: `saved_${Date.now()}`,
      createdAt: getTodayDateStr(),
    };
    setSavedMeals((prev) => {
      const updated = [newSaved, ...prev];
      SafeStorage.setItem('mealfit_saved_custom_meals', JSON.stringify(updated));
      return updated;
    });

    // Persist saved repeatable meals to User Profile in MongoDB Atlas
    if (authToken) {
      setSavedMeals((prev) => {
        MobileApiService.updateProfile({ savedMeals: prev }).catch(() => {});
        return prev;
      });
    }
  };

  const deleteSavedMeal = (id: string) => {
    setSavedMeals((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      SafeStorage.setItem('mealfit_saved_custom_meals', JSON.stringify(updated));
      if (authToken) {
        MobileApiService.updateProfile({ savedMeals: updated }).catch(() => {});
      }
      return updated;
    });
  };

  const repeatSavedMeal = (savedMealId: string, targetDate?: string) => {
    const found = savedMeals.find((m) => m.id === savedMealId);
    if (!found) return;
    addCustomMeal({
      name: found.name,
      calories: found.calories,
      proteinG: found.proteinG,
      carbsG: found.carbsG,
      fatG: found.fatG,
      slot: found.slot,
      quantity: found.dishDescription || '1 Portion',
      costInr: found.costInr,
      date: targetDate || selectedHistoryDate,
    });
  };

  const deleteLoggedMeal = (id: string) => {
    setLoggedMealsHistory((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      SafeStorage.setItem('mealfit_meals_history', JSON.stringify(updated));
      return updated;
    });
    setLoggedMealIds((prev) => {
      const updated = prev.filter((mid) => mid !== id);
      SafeStorage.setItem('mealfit_logged_meals', JSON.stringify(updated));
      return updated;
    });

    if (authToken) {
      MobileApiService.deleteMeal(id, selectedHistoryDate).catch(() => {});
    }
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

  const login = (_email: string, _fullName?: string) => {
    console.warn('[MealFit Auth] Please use loginWithEmail to authenticate securely with JWT.');
  };

  const loginWithEmail = async (email: string, password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const res = await MobileApiService.loginUser({ email: trimmedEmail, password });
    
    if (!res?.token) {
      throw new Error('Authentication failed: No session token returned.');
    }

    setTokenState(res.token);
    setAuthToken(res.token);
    await SafeStorage.setItem('mealfit_auth_token', res.token);

    const u = res.user;
    const isGovind = u?.email?.toLowerCase().includes('govind') || u?.role === 'super_admin';
    const updated: UserProfile = {
      ...user,
      id: u?.id || user.id,
      fullName: u?.fullName || user.fullName,
      email: u?.email || trimmedEmail,
      gender: u?.gender || user.gender,
      heightCm: u?.heightCm || user.heightCm,
      weightKg: u?.weightKg || user.weightKg,
      targetWeightKg: u?.targetWeightKg || user.targetWeightKg,
      goalType: u?.goalType || user.goalType,
      city: u?.city || user.city,
      dietaryPreference: u?.dietaryPreference || user.dietaryPreference,
      weeklyBudgetInr: u?.weeklyBudgetInr || user.weeklyBudgetInr,
      authProvider: 'local',
      role: u?.role || (isGovind ? 'super_admin' : 'user'),
    };

    // Recompute accurate targets
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

    setUser(updated);
    setIsSuperAdmin(updated.role === 'super_admin');
    await SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
    await SafeStorage.setItem('mealfit_has_onboarded', 'true');
    await SafeStorage.setItem('mealfit_is_logged_in', 'true');
    setIsLoggedIn(true);
    setIsGuest(false);
    setHasCompletedOnboardingState(true);

    if (Array.isArray(u?.savedMeals) && u.savedMeals.length > 0) {
      setSavedMeals(u.savedMeals);
      await SafeStorage.setItem('mealfit_saved_custom_meals', JSON.stringify(u.savedMeals));
    }

    // Fetch and populate today's MongoDB meal logs
    MobileApiService.getDailyLogs(getTodayDateStr())
      .then((dailyRes: any) => {
        const cloudMeals = dailyRes?.log?.meals;
        if (Array.isArray(cloudMeals) && cloudMeals.length > 0) {
          const formattedEntries: LoggedMealEntry[] = cloudMeals.map((m: any) => ({
            id: m.customId || m._id || `entry_${Date.now()}_${Math.random()}`,
            name: m.dishName || 'Home Meal',
            hindiName: m.hindiName,
            calories: m.calories || 0,
            proteinG: m.proteinG || 0,
            carbsG: m.carbsG || 0,
            fatG: m.fatG || 0,
            slot: (m.slot || (m.mealType === 'snack' ? 'evening_snack' : m.mealType) || 'lunch') as MealSlot,
            quantity: m.quantity || `${m.portionKatoris || 1} Katori`,
            costInr: m.costInr || 25,
            date: dailyRes.log.logDate || getTodayDateStr(),
            time: m.time || '12:00 PM',
          }));

          setLoggedMealsHistory((prev) => {
            const otherDates = prev.filter((p) => p.date !== getTodayDateStr());
            const merged = [...formattedEntries, ...otherDates];
            SafeStorage.setItem('mealfit_meals_history', JSON.stringify(merged));
            return merged;
          });

          const mealIds = formattedEntries.map((e) => e.id);
          setLoggedMealIds(mealIds);
          SafeStorage.setItem('mealfit_logged_meals', JSON.stringify(mealIds));
        }
      })
      .catch(() => {});
  };

  const registerWithEmail = async (data: {
    fullName: string;
    email: string;
    password?: string;
    dietaryPreference?: DietaryType;
    weeklyBudgetInr?: number;
    city?: string;
    goalType?: GoalType;
    gender?: 'male' | 'female';
  }) => {
    const trimmedEmail = data.email.trim().toLowerCase();
    const res = await MobileApiService.registerUser({
      fullName: data.fullName.trim(),
      email: trimmedEmail,
      password: data.password,
      gender: data.gender || user.gender,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      targetWeightKg: user.targetWeightKg,
      goalType: data.goalType || user.goalType,
      dietaryPreference: data.dietaryPreference || user.dietaryPreference,
      weeklyBudgetInr: data.weeklyBudgetInr || user.weeklyBudgetInr,
      city: data.city || user.city,
      dailyCalorieTarget: user.dailyCalorieTarget,
      proteinTargetG: user.proteinTargetG,
      carbsTargetG: user.carbsTargetG,
      fatTargetG: user.fatTargetG,
    });

    if (!res?.token) {
      throw new Error('Registration failed: No session token returned.');
    }

    setTokenState(res.token);
    setAuthToken(res.token);
    await SafeStorage.setItem('mealfit_auth_token', res.token);

    if (res.user) {
      const u = res.user;
      const isGovind = u.email?.toLowerCase().includes('govind') || u.role === 'super_admin';
      const updated: UserProfile = {
        ...user,
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        gender: u.gender || user.gender,
        heightCm: u.heightCm || user.heightCm,
        weightKg: u.weightKg || user.weightKg,
        targetWeightKg: u.targetWeightKg || user.targetWeightKg,
        goalType: u.goalType || user.goalType,
        dietaryPreference: (u.dietaryPreference as any) || data.dietaryPreference || user.dietaryPreference,
        weeklyBudgetInr: u.weeklyBudgetInr || data.weeklyBudgetInr || user.weeklyBudgetInr,
        city: u.city || data.city || user.city,
        role: u.role || (isGovind ? 'super_admin' : 'user'),
        authProvider: 'local',
      };
      setUser(updated);
      setIsSuperAdmin(updated.role === 'super_admin');
      await SafeStorage.setItem('mealfit_user_profile', JSON.stringify(updated));
    }
    await SafeStorage.setItem('mealfit_is_logged_in', 'true');
    setIsLoggedIn(true);
    setIsGuest(false);
    await setHasCompletedOnboarding(true);
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
    SafeStorage.removeItem('mealfit_is_logged_in');
    SafeStorage.removeItem('mealfit_auth_token');
    SafeStorage.removeItem('mealfit_user_profile');
    SafeStorage.removeItem('mealfit_meals_history');
    SafeStorage.removeItem('mealfit_logged_meals');
    SafeStorage.removeItem('mealfit_completed_exercises');
    SafeStorage.removeItem('mealfit_saved_custom_meals');
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
      setLoggedMealIds((prev) => {
        const updated = prev.filter((id) => id !== mealId);
        SafeStorage.setItem('mealfit_logged_meals', JSON.stringify(updated));
        return updated;
      });
      // Remove matching today entry
      setLoggedMealsHistory((prev) => {
        const updated = prev.filter((m) => m.id !== mealId);
        SafeStorage.setItem('mealfit_meals_history', JSON.stringify(updated));
        return updated;
      });

      if (authToken) {
        MobileApiService.deleteMeal(mealId, getTodayDateStr()).catch(() => {});
      }
    } else {
      setLoggedMealIds((prev) => {
        const updated = [...prev, mealId];
        SafeStorage.setItem('mealfit_logged_meals', JSON.stringify(updated));
        return updated;
      });

      // Add to today's history
      const newEntry: LoggedMealEntry = {
        id: mealId,
        name: mealId.replace('quick_meal_', 'Quick Meal ').replace(/_/g, ' ').toUpperCase(),
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

      setLoggedMealsHistory((prev) => {
        const updated = [newEntry, ...prev];
        SafeStorage.setItem('mealfit_meals_history', JSON.stringify(updated));
        return updated;
      });

      if (authToken) {
        MobileApiService.logMeal({
          customId: mealId,
          logDate: getTodayDateStr(),
          mealType: 'lunch',
          dishName: newEntry.name,
          calories,
          proteinG: protein,
          carbsG: carbs,
          fatG: fat,
          slot: 'lunch',
          quantity: '1 Serving',
          costInr: 25,
          time: newEntry.time,
        }).catch((err) => console.log('[MongoDB Sync] toggleMeal error:', err));
      }
    }
  };

  const toggleExerciseCompleted = (exerciseId: string, caloriesBurned: number = 35) => {
    setCompletedExerciseIds((prev) => {
      const updated = prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId];
      SafeStorage.setItem('mealfit_completed_exercises', JSON.stringify(updated));
      return updated;
    });

    if (authToken) {
      MobileApiService.updateMetrics({
        activeCaloriesBurnedDelta: caloriesBurned || 35,
      }).catch(() => {});
    }
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
        isLoadingAuth,
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
        savedMeals,
        saveCustomMeal,
        deleteSavedMeal,
        repeatSavedMeal,
        addCustomMeal,
        deleteLoggedMeal,
        getMealsForDate,
        getDayTotals,
        login,
        loginWithEmail,
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
