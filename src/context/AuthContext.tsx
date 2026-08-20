import React, { createContext, useContext, useState, useEffect } from 'react';

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
  logout: () => void;
  continueAsGuest: () => void;
  startFreePlan: (initialConfig?: Partial<UserProfile>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setGoal: (goal: GoalType, targetWeight?: number) => void;
  toggleMealLogged: (mealId: string, calories: number, protein: number, carbs: number, fat: number) => void;
  toggleExerciseCompleted: (exerciseId: string, caloriesBurned?: number) => void;
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

const defaultUser: UserProfile = {
  fullName: 'Govind Sharma',
  email: 'govind@mealfit.in',
  gender: 'male',
  age: 26,
  weightKg: 72,
  heightCm: 175,
  targetWeightKg: 68,
  goalType: 'fat_loss',
  dietaryPreference: 'veg',
  weeklyBudgetInr: 650,
  equipment: ['bodyweight', 'dumbbells'],
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

  // Yesterday
  {
    id: 'entry_yest_1',
    name: 'Sprouted Kala Chana Chaat',
    hindiName: 'अंकुरित काला चना चाट',
    calories: 280,
    proteinG: 18.0,
    carbsG: 42,
    fatG: 4.0,
    slot: 'breakfast',
    quantity: '1 Medium Bowl (150g)',
    costInr: 14,
    date: getYesterdayDateStr(),
    time: '08:45 AM',
  },
  {
    id: 'entry_yest_2',
    name: 'Yellow Moong Dal + 2 Multigrain Rotis + Curd',
    hindiName: 'मूंग दाल + 2 रोटी + दही',
    calories: 440,
    proteinG: 26.5,
    carbsG: 62,
    fatG: 10.0,
    slot: 'lunch',
    quantity: '1 Katori Dal + 100g Curd',
    costInr: 25,
    date: getYesterdayDateStr(),
    time: '01:15 PM',
  },
  {
    id: 'entry_yest_3',
    name: 'Roasted Peanuts with Black Pepper',
    hindiName: 'भुनी मूंगफली',
    calories: 190,
    proteinG: 9.0,
    carbsG: 8,
    fatG: 14.0,
    slot: 'evening_snack',
    quantity: '30g Handful',
    costInr: 8,
    date: getYesterdayDateStr(),
    time: '05:30 PM',
  },
  {
    id: 'entry_yest_4',
    name: 'Paneer Tikka Bhurji + 1 Phulka + Cucumber Salad',
    hindiName: 'पनीर भुर्जी + 1 रोटी + खीरा',
    calories: 390,
    proteinG: 24.0,
    carbsG: 24,
    fatG: 22.0,
    slot: 'dinner',
    quantity: '100g Low Fat Paneer',
    costInr: 45,
    date: getYesterdayDateStr(),
    time: '08:30 PM',
  },

  // Day Before Yesterday
  {
    id: 'entry_prev_1',
    name: 'Oats in Warm Milk with Chia Seeds',
    hindiName: 'ओट्स + दूध',
    calories: 310,
    proteinG: 14.0,
    carbsG: 48,
    fatG: 6.5,
    slot: 'breakfast',
    quantity: '40g Oats + 200ml Milk',
    costInr: 20,
    date: getDayBeforeYesterdayStr(),
    time: '08:15 AM',
  },
  {
    id: 'entry_prev_2',
    name: 'Rajma Curry + Brown Rice + Mint Chutney',
    hindiName: 'राजमा चावल + हरी चटनी',
    calories: 520,
    proteinG: 21.0,
    carbsG: 82,
    fatG: 11.0,
    slot: 'lunch',
    quantity: '1 Bowl Rajma + 1 Cup Rice',
    costInr: 32,
    date: getDayBeforeYesterdayStr(),
    time: '01:45 PM',
  },
  {
    id: 'entry_prev_3',
    name: 'Soya Chunks Pulao + Kheera Raita',
    hindiName: 'सोया पुलाव + खीरा रायता',
    calories: 480,
    proteinG: 32.0,
    carbsG: 64,
    fatG: 10.5,
    slot: 'dinner',
    quantity: '1 Plate Pulao',
    costInr: 26,
    date: getDayBeforeYesterdayStr(),
    time: '08:45 PM',
  },
];

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: true,
  isGuest: false,
  isSuperAdmin: false,
  user: defaultUser,
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

  login: () => {},
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);

  // History & Custom Meals State
  const [loggedMealsHistory, setLoggedMealsHistory] = useState<LoggedMealEntry[]>(defaultMealsHistory);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(getTodayDateStr());

  // Interactive Live Tracker State for Today
  const [loggedMealIds, setLoggedMealIds] = useState<string[]>(['breakfast', 'lunch']);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>(['ex_1', 'ex_2']);

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

    setUser((prev) => ({
      ...prev,
      goalType: goal,
      targetWeightKg: tw,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      proteinTargetG: targets.proteinTargetG,
      carbsTargetG: targets.carbsTargetG,
      fatTargetG: targets.fatTargetG,
      estimatedWeeksToGoal: targets.estimatedWeeksToGoal,
    }));
  };

  const login = (email: string, fullName?: string) => {
    const isAdmin = email.toLowerCase().includes('admin');
    setUser((prev) => ({
      ...prev,
      email,
      fullName: fullName || prev.fullName || 'MealFit Member',
      role: isAdmin ? 'super_admin' : 'user',
    }));
    if (isAdmin) setIsSuperAdmin(true);
    setIsLoggedIn(true);
    setIsGuest(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(true);
    setIsSuperAdmin(false);
  };

  const continueAsGuest = () => {
    setIsLoggedIn(false);
    setIsGuest(true);
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

    setUser((prev) => ({
      ...prev,
      ...initialConfig,
      dailyCalorieTarget: targets.dailyCalorieTarget,
      proteinTargetG: targets.proteinTargetG,
      carbsTargetG: targets.carbsTargetG,
      fatTargetG: targets.fatTargetG,
      estimatedWeeksToGoal: targets.estimatedWeeksToGoal,
    }));
    setIsLoggedIn(true);
    setIsGuest(false);
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
      return updated;
    });
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
        logout,
        continueAsGuest,
        startFreePlan,
        updateUserProfile,
        setGoal,
        toggleMealLogged,
        toggleExerciseCompleted,
        unlockSuperAdmin,
        lockSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
