import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MobileApiService } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';
import { SettingsModal } from '../../src/components/SettingsModal';
import { QuickTrialWizard } from '../../src/components/QuickTrialWizard';
import { LifeStatusModal } from '../../src/components/LifeStatusModal';
import { SuperAdminModal } from '../../src/components/SuperAdminModal';
import { PersonalTrainerModal } from '../../src/components/PersonalTrainerModal';
import { ThemeSelectorModal } from '../../src/components/ThemeSelectorModal';
import { CustomMealModal } from '../../src/components/CustomMealModal';
import { LocationModal } from '../../src/components/LocationModal';
import { SecurityVaultModal } from '../../src/components/SecurityVaultModal';
import { AuthRequiredModal } from '../../src/components/AuthRequiredModal';
import { MasterDietChartModal } from '../../src/components/MasterDietChartModal';
import { SmartCheatDayModal } from '../../src/components/SmartCheatDayModal';
import { RewardsHubModal } from '../../src/components/RewardsHubModal';
import { SavedMealsComposerModal } from '../../src/components/SavedMealsComposerModal';
import { NotificationService } from '../../src/services/notificationService';
import { useRouter } from 'expo-router';
import {
  Flame,
  Droplets,
  CloudSun,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Settings,
  Dumbbell,
  Utensils,
  Target,
  ArrowRight,
  Activity,
  Check,
  HeartHandshake,
  Bot,
  Zap,
  Palette,
  ShieldCheck,
  Lock,
  Bookmark,
  RotateCcw,
  Scale,
} from 'lucide-react-native';

export default function HomeScreen() {
  const {
    isLoggedIn,
    isGuest,
    hasCompletedOnboarding,
    user,
    currentCaloriesLogged,
    currentProteinLogged,
    currentCarbsLogged,
    currentFatLogged,
    toggleMealLogged,
  } = useAuth();

  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topSafeDistance = Math.max(insets.top, Platform.OS === 'android' ? 28 : 20) + 12;

  const [weather, setWeather] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<string>(user.city || 'delhi');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showPlanWizard, setShowPlanWizard] = useState<boolean>(false);
  const [showLifeStatus, setShowLifeStatus] = useState<boolean>(false);
  const [showSuperAdmin, setShowSuperAdmin] = useState<boolean>(false);
  const [showTrainerModal, setShowTrainerModal] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showCustomMealModal, setShowCustomMealModal] = useState<boolean>(false);
  const [showSavedMealsModal, setShowSavedMealsModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const [showDietChartModal, setShowDietChartModal] = useState<boolean>(false);
  const [showCheatModal, setShowCheatModal] = useState<boolean>(false);
  const [showRewardsModal, setShowRewardsModal] = useState<boolean>(false);

  // Volumetric logger state
  const [katoriCount, setKatoriCount] = useState<number>(2);
  const [rotiCount, setRotiCount] = useState<number>(2);
  const [hasDesiGhee, setHasDesiGhee] = useState<boolean>(true);
  const [waterGlasses, setWaterGlasses] = useState<number>(7);

  // Dynamic user goals from AuthContext
  const calorieTarget = user.dailyCalorieTarget || 1618;
  const proteinTarget = user.proteinTargetG || 130;
  const carbsTarget = user.carbsTargetG || 160;
  const fatTarget = user.fatTargetG || 45;

  const remainingProtein = Math.max(0, proteinTarget - Math.round(currentProteinLogged));
  const remainingCalories = calorieTarget - currentCaloriesLogged;

  useEffect(() => {
    loadWeatherData(selectedCity);
    NotificationService.requestPermissions();
  }, [selectedCity]);

  const loadWeatherData = async (city: string) => {
    setLoadingWeather(true);
    try {
      const data = await MobileApiService.getWeatherStatus(city);
      setWeather(data);
    } catch (err) {
      setWeather({
        city: city === 'mumbai' ? 'Mumbai' : city === 'bengaluru' ? 'Bengaluru' : 'New Delhi',
        temperatureC: 32,
        humidityPercent: 62,
        aqi: 162,
        aqiCategory: 'Moderate',
        recommendedWaterMl: 3400,
        hydrationAdjustmentMl: 400,
        heatIndexSeverity: 'moderate',
        smogSafetyAlert: false,
      });
    } finally {
      setLoadingWeather(false);
    }
  };

  const loggedMealCalories =
    katoriCount * 140 + rotiCount * 80 + (hasDesiGhee ? rotiCount * 45 : 0);
  const loggedMealProtein = katoriCount * 8.5 + rotiCount * 2.6;

  const handleQuickAddMeal = () => {
    toggleMealLogged(
      `quick_meal_${Date.now()}`,
      loggedMealCalories,
      loggedMealProtein,
      rotiCount * 15 + katoriCount * 18,
      (hasDesiGhee ? rotiCount * 5 : 0) + katoriCount * 3
    );
    Alert.alert('✅ Meal Logged!', `Added ${katoriCount} katoris & ${rotiCount} phulkas (+${Math.round(loggedMealProtein)}g Protein, +${loggedMealCalories} kcal).`);
  };

  const handleQuickLogFoodItem = (name: string, cal: number, pro: number, carbs: number, fat: number) => {
    toggleMealLogged(`quick_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`, cal, pro, carbs, fat);
    Alert.alert('✅ Item Logged!', `Added ${name} (+${pro}g Protein, +${cal} kcal) to today's diary.`);
  };

  const handleLogMealPress = () => {
    if (!isLoggedIn) {
      setShowAuthGate(true);
      return;
    }
    setShowCustomMealModal(true);
  };

  const getGoalDisplayTitle = (g: string) => {
    switch (g) {
      case 'fat_loss':
        return 'Fat Loss & Belly Trim';
      case 'muscle_gain':
        return 'Lean Muscle Building';
      case 'recomp':
        return 'Body Recomposition';
      case 'low_gi_pcod':
        return 'Low GI & PCOD Control';
      default:
        return 'Personalized Plan';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingTop: topSafeDistance }]}
      >
        {/* 1. Header Bar: Profile, Theme Switcher, Weather & Settings */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={() => setShowSettings(true)}
            style={styles.userProfileRow}
            activeOpacity={0.8}
          >
            <View style={[styles.avatarCircle, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <Text style={[styles.avatarInitial, { color: theme.primary }]}>
                {user.fullName && user.fullName !== 'New Member' ? user.fullName[0].toUpperCase() : 'M'}
              </Text>
            </View>
            <View>
              <Text style={[styles.greetingTitle, { color: theme.textPrimary }]}>
                {user.fullName && user.fullName !== 'New Member' ? `Namaste, ${user.fullName.split(' ')[0]}` : 'Namaste, Seeker'}
              </Text>
              <View style={styles.roleRow}>
                <View style={[styles.onlineDot, { backgroundColor: isLoggedIn ? theme.primary : theme.amber }]} />
                <Text style={[styles.roleText, { color: theme.textSecondary }]}>
                  {user.role === 'super_admin' ? 'Super Admin' : isLoggedIn ? 'Cloud Synced' : 'Waiting for Sign In'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActionRow}>
            {/* Quick Sign In button if not logged in */}
            {!isLoggedIn && (
              <TouchableOpacity
                onPress={() => router.push('/auth/login' as any)}
                style={[styles.quickSignInBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.quickSignInText, { color: theme.primary }]}>Sign In</Text>
              </TouchableOpacity>
            )}

            {/* Weather / Location Badge */}
            <TouchableOpacity
              onPress={() => setShowLocationModal(true)}
              style={[styles.weatherBadge, { backgroundColor: theme.cyanLight, borderColor: 'rgba(20, 136, 166, 0.2)' }]}
              activeOpacity={0.7}
            >
              <CloudSun size={13} color={theme.cyan} />
              <Text style={[styles.weatherBadgeText, { color: theme.cyan }]}>
                {weather?.city ? `${weather.city.split(' ')[0]} ${weather.temperatureC}°C` : `${weather?.temperatureC || 32}°C`}
              </Text>
            </TouchableOpacity>

            {/* Top Right Settings Gear Button */}
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              activeOpacity={0.7}
            >
              <Settings size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Unauthenticated Onboarding / Sign-In Status Card */}
        {!isLoggedIn && (
          <View style={[styles.onboardingCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.onboardingCardTop}>
              <View style={[styles.onboardingIconCircle, { backgroundColor: theme.primaryLight }]}>
                <Sparkles size={16} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.onboardingTitle, { color: theme.textPrimary }]}>
                  Save & Protect Your Indian Diet
                </Text>
                <Text style={[styles.onboardingDesc, { color: theme.textSecondary }]}>
                  Sign in or create an account to unlock the AI Food Scanner, record workout streaks, and sync across devices.
                </Text>
              </View>
            </View>
            <View style={styles.onboardingActionRow}>
              <TouchableOpacity
                onPress={() => router.push('/auth/login' as any)}
                style={[styles.onboardingPrimaryBtn, { backgroundColor: theme.primary }]}
                activeOpacity={0.85}
              >
                <Text style={[styles.onboardingPrimaryBtnText, { color: '#FFFFFF' }]}>
                  Sign In or Register
                </Text>
                <ArrowRight size={14} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowPlanWizard(true)}
                style={styles.onboardingLoginLink}
                activeOpacity={0.7}
              >
                <Text style={[styles.onboardingLoginLinkText, { color: theme.textMuted }]}>
                  Edit Metrics
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 2. Hero Interactive Daily Energy Balance Card */}
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={[styles.heroKicker, { color: theme.textMuted }]}>DAILY ENERGY BALANCE</Text>
              <View style={styles.calorieRow}>
                <Text style={[styles.calorieBig, { color: theme.textPrimary }]}>{currentCaloriesLogged}</Text>
                <Text style={[styles.calorieTarget, { color: theme.textMuted }]}>/ {calorieTarget} kcal</Text>
              </View>
            </View>

            <View style={styles.heroRightActionRow}>
              <TouchableOpacity
                onPress={handleLogMealPress}
                style={[styles.heroLogMealBtn, { backgroundColor: theme.primary }]}
                activeOpacity={0.85}
              >
                <Plus size={13} color="#FFFFFF" />
                <Text style={[styles.heroLogMealText, { color: '#FFFFFF' }]}>
                  Log Meal
                </Text>
              </TouchableOpacity>

              <View style={[styles.statusBadge, { backgroundColor: remainingCalories < 0 ? theme.roseLight : theme.primaryLight }]}>
                <Flame size={12} color={remainingCalories < 0 ? theme.rose : theme.primary} />
                <Text style={[styles.statusBadgeText, { color: remainingCalories < 0 ? theme.rose : theme.primary }]}>
                  {remainingCalories >= 0 ? `${remainingCalories} kcal left` : `+${Math.abs(remainingCalories)} over`}
                </Text>
              </View>
            </View>
          </View>

          {/* Clean Macro Progress Bars */}
          <View style={styles.macroContainer}>
            {/* Protein */}
            <View style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Text style={[styles.macroName, { color: theme.textSecondary }]}>Protein Target</Text>
                <Text style={[styles.macroAmount, { color: theme.primary }]}>
                  {Math.round(currentProteinLogged)} / {proteinTarget}g
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(100, (currentProteinLogged / proteinTarget) * 100)}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Carbs */}
            <View style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Text style={[styles.macroName, { color: theme.textSecondary }]}>Carbohydrates</Text>
                <Text style={[styles.macroAmount, { color: theme.amber }]}>
                  {Math.round(currentCarbsLogged)} / {carbsTarget}g
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(100, (currentCarbsLogged / carbsTarget) * 100)}%`,
                      backgroundColor: theme.amber,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Fats */}
            <View style={styles.macroBlock}>
              <View style={styles.macroHeader}>
                <Text style={[styles.macroName, { color: theme.textSecondary }]}>Healthy Fats</Text>
                <Text style={[styles.macroAmount, { color: theme.rose }]}>
                  {Math.round(currentFatLogged)} / {fatTarget}g
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(100, (currentFatLogged / fatTarget) * 100)}%`,
                      backgroundColor: theme.rose,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* AI Coach Action Nudge */}
          <TouchableOpacity
            onPress={() => setShowTrainerModal(true)}
            style={[styles.coachNudgeBox, { backgroundColor: theme.primaryLight, borderColor: theme.primaryGlow }]}
            activeOpacity={0.8}
          >
            <View style={styles.coachNudgeLeft}>
              <Bot size={16} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.coachNudgeTitle, { color: theme.primary }]}>
                  {getGoalDisplayTitle(user.goalType)} • {user.estimatedWeeksToGoal || 8} Wks Goal
                </Text>
                <Text style={[styles.coachNudgeDesc, { color: theme.textSecondary }]}>
                  {remainingProtein > 0
                    ? `Need ${remainingProtein}g more protein today. Tap to adjust goal or view diet.`
                    : `Daily protein target achieved! Tap to review workout prescription.`}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* 3. Two High-Impact Quick Launch Action Cards */}
        <View style={styles.actionGrid}>
          {/* Today's Workout Card */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/workout')}
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.indigoLight }]}>
              <Dumbbell size={22} color={theme.indigo} />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>Living Room Workout</Text>
              <Text style={[styles.actionSub, { color: theme.textSecondary }]}>
                {user.equipment.includes('dumbbells')
                  ? 'Dumbbells & Floor • 3s Tempo'
                  : 'Apartment Safe • Zero Noise'}
              </Text>
            </View>
            <View style={styles.actionArrowCircle}>
              <ChevronRight size={14} color={theme.textPrimary} />
            </View>
          </TouchableOpacity>

          {/* Today's High-Protein Meals Card */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/meal-plan')}
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.primaryLight }]}>
              <Utensils size={22} color={theme.primary} />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>Budget Indian Meals</Text>
              <Text style={[styles.actionSub, { color: theme.textSecondary }]}>
                {user.dietaryPreference.toUpperCase()} • Meal Diary & Plan
              </Text>
            </View>
            <View style={styles.actionArrowCircle}>
              <ChevronRight size={14} color={theme.textPrimary} />
            </View>
          </TouchableOpacity>

          {/* Smart Cheat Day & Banking Card */}
          <TouchableOpacity
            onPress={() => setShowCheatModal(true)}
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.amberLight }]}>
              <Flame size={22} color={theme.amber} />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>Smart Cheat Day & Banking</Text>
              <Text style={[styles.actionSub, { color: theme.textSecondary }]}>
                Bank calories for Biryani / Chole Bhature • Zero Fat Gain
              </Text>
            </View>
            <View style={styles.actionArrowCircle}>
              <ChevronRight size={14} color={theme.textPrimary} />
            </View>
          </TouchableOpacity>

          {/* FitCoins & Rewards Hub Card */}
          <TouchableOpacity
            onPress={() => setShowRewardsModal(true)}
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.secondaryLight }]}>
              <Sparkles size={22} color={theme.primary} />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>FitCoins & Streak Rewards</Text>
              <Text style={[styles.actionSub, { color: theme.textSecondary }]}>
                380 FitCoins • 5-Day Indian Warrior Streak
              </Text>
            </View>
            <View style={styles.actionArrowCircle}>
              <ChevronRight size={14} color={theme.textPrimary} />
            </View>
          </TouchableOpacity>

          {/* My Saved Meals & Repeats Card */}
          <TouchableOpacity
            onPress={() => setShowSavedMealsModal(true)}
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.primaryLight }]}>
              <Bookmark size={22} color={theme.primary} />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>Saved Meals & 1-Tap Repeat</Text>
              <Text style={[styles.actionSub, { color: theme.textSecondary }]}>
                Compose dishes, save favorites & re-log instantly
              </Text>
            </View>
            <View style={styles.actionArrowCircle}>
              <ChevronRight size={14} color={theme.textPrimary} />
            </View>
          </TouchableOpacity>

          {/* Change Goal & Timeline Card */}
          <TouchableOpacity
            onPress={() => setShowCheatModal(true)}
            style={[styles.actionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.85}
          >
            <View style={[styles.actionIconBox, { backgroundColor: theme.indigoLight }]}>
              <Scale size={22} color={theme.indigo} />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={[styles.actionHeading, { color: theme.textPrimary }]}>Change Goal & Targets</Text>
              <Text style={[styles.actionSub, { color: theme.textSecondary }]}>
                {user.targetWeightKg} kg • {user.goalType === 'muscle_gain' ? 'Muscle Gain' : 'Fat Loss'} • {user.estimatedWeeksToGoal || 8} Wks
              </Text>
            </View>
            <View style={styles.actionArrowCircle}>
              <ChevronRight size={14} color={theme.textPrimary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Master Diet Chart & Nutrition Intelligence Banner */}
        <TouchableOpacity
          onPress={() => setShowDietChartModal(true)}
          style={[
            styles.dietChartHeroCard,
            {
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
            },
          ]}
          activeOpacity={0.88}
        >
          <View style={styles.dietChartHeroLeft}>
            <View style={styles.dietChartBadge}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.dietChartBadgeText}>NUTRITION SCIENCE BLUEPRINT</Text>
            </View>
            <Text style={styles.dietChartHeroTitle}>
              Master Indian Diet Chart & Alternatives
            </Text>
            <Text style={styles.dietChartHeroDesc}>
              Pre-Workout ➔ Bedtime • Science Rationale • 1-Tap Swaps • Kirana Budget Plans
            </Text>
          </View>
          <View style={[styles.dietChartHeroRightBtn, { backgroundColor: '#FFFFFF' }]}>
            <Text style={[styles.dietChartHeroBtnText, { color: theme.primary }]}>View Plan</Text>
            <ChevronRight size={14} color={theme.primary} />
          </View>
        </TouchableOpacity>

        {/* 1-Tap Quick Indian Staples Bar */}
        <View style={[styles.staplesCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.staplesHeader}>
            <Sparkles size={16} color={theme.primary} />
            <Text style={[styles.staplesTitle, { color: theme.textPrimary }]}>1-Tap Indian Protein Staples</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.staplesScroll}>
            {[
              { name: 'Sattu Glass', cal: 220, pro: 22.5, c: 24, f: 4, cost: '₹12', tag: '+22.5g Pro' },
              { name: 'Yellow Dal (1 Bowl)', cal: 140, pro: 9, c: 18, f: 3, cost: '₹14', tag: '+9g Pro' },
              { name: 'Soya Bhurji (60g)', cal: 210, pro: 32, c: 12, f: 2, cost: '₹18', tag: '+32g Pro' },
              { name: 'Ghar Ka Dahi (150g)', cal: 120, pro: 8, c: 6, f: 6, cost: '₹15', tag: '+8g Pro' },
              { name: '3 Boiled Eggs', cal: 210, pro: 18, c: 1, f: 14, cost: '₹21', tag: '+18g Pro' },
              { name: 'Paneer Cubes (80g)', cal: 240, pro: 15, c: 3, f: 18, cost: '₹36', tag: '+15g Pro' },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleQuickLogFoodItem(item.name, item.cal, item.pro, item.c, item.f)}
                style={[styles.staplePill, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}
                activeOpacity={0.75}
              >
                <View style={styles.stapleTopRow}>
                  <Text style={[styles.stapleName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <View style={[styles.stapleBadge, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.stapleBadgeText, { color: theme.primary }]}>{item.tag}</Text>
                  </View>
                </View>
                <Text style={[styles.stapleMeta, { color: theme.textSecondary }]}>
                  {item.cal} kcal • {item.cost}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 4. Quick Volumetric Logger */}
        <View style={[styles.loggerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.loggerHeader}>
            <View>
              <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>QUICK HOME MEAL LOGGER</Text>
              <Text style={[styles.loggerSub, { color: theme.textSecondary }]}>Log volumetric Indian portions in 1-tap</Text>
            </View>
            <View style={[styles.loggerCalBadge, { backgroundColor: theme.amberLight }]}>
              <Text style={[styles.loggerCalText, { color: theme.amber }]}>+{loggedMealCalories} kcal</Text>
            </View>
          </View>

          <View style={styles.stepperContainer}>
            {/* Dal / Sabzi Stepper */}
            <View style={[styles.stepperRow, { borderColor: theme.cardBorder }]}>
              <View style={styles.stepperInfo}>
                <Text style={[styles.stepperTitle, { color: theme.textPrimary }]}>Dal / Sabzi</Text>
                <Text style={[styles.stepperMeta, { color: theme.textMuted }]}>Standard Katori (150ml)</Text>
              </View>
              <View style={[styles.counterBox, { backgroundColor: theme.cardElevated }]}>
                <TouchableOpacity
                  onPress={() => setKatoriCount(Math.max(0, katoriCount - 1))}
                  style={styles.stepperButton}
                >
                  <Minus size={14} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: theme.textPrimary }]}>{katoriCount}</Text>
                <TouchableOpacity
                  onPress={() => setKatoriCount(katoriCount + 1)}
                  style={styles.stepperButton}
                >
                  <Plus size={14} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Whole Wheat Phulka Stepper */}
            <View style={[styles.stepperRow, { borderColor: theme.cardBorder }]}>
              <View style={styles.stepperInfo}>
                <Text style={[styles.stepperTitle, { color: theme.textPrimary }]}>Phulka / Roti</Text>
                <Text style={[styles.stepperMeta, { color: theme.textMuted }]}>Medium wheat (~80 kcal)</Text>
              </View>
              <View style={[styles.counterBox, { backgroundColor: theme.cardElevated }]}>
                <TouchableOpacity
                  onPress={() => setRotiCount(Math.max(0, rotiCount - 1))}
                  style={styles.stepperButton}
                >
                  <Minus size={14} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: theme.textPrimary }]}>{rotiCount}</Text>
                <TouchableOpacity
                  onPress={() => setRotiCount(rotiCount + 1)}
                  style={styles.stepperButton}
                >
                  <Plus size={14} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Desi Ghee & Tadka Toggle */}
            <TouchableOpacity
              onPress={() => setHasDesiGhee(!hasDesiGhee)}
              style={[
                styles.gheeCard,
                {
                  borderColor: hasDesiGhee ? theme.amber : theme.cardBorder,
                  backgroundColor: hasDesiGhee ? theme.amberLight : 'rgba(255, 255, 255, 0.02)',
                },
              ]}
              activeOpacity={0.8}
            >
              <View>
                <Text style={[styles.gheeTitle, { color: theme.textPrimary }]}>Desi Ghee on Phulkas</Text>
                <Text style={[styles.gheeSub, { color: theme.textSecondary }]}>
                  {hasDesiGhee ? '+45 kcal per roti (Healthy fats)' : 'Dry Phulkas (No Ghee)'}
                </Text>
              </View>
              <View style={[styles.checkbox, { backgroundColor: hasDesiGhee ? theme.amber : 'transparent', borderColor: hasDesiGhee ? theme.amber : theme.textMuted }]}>
                {hasDesiGhee && <Check size={12} color="#000000" />}
              </View>
            </TouchableOpacity>

            {/* Log Button */}
            <TouchableOpacity
              onPress={handleQuickAddMeal}
              style={[styles.submitLogButton, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <Plus size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
              <Text style={[styles.submitLogText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                Quick Log (+{Math.round(loggedMealProtein)}g Protein • +{loggedMealCalories} kcal)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 5. Hydration Tracker */}
        <View style={[styles.waterCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.waterHeader}>
            <View style={styles.waterTitleRow}>
              <Droplets size={16} color={theme.cyan} />
              <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>DAILY WATER TRACKER</Text>
            </View>
            <Text style={[styles.waterAmountText, { color: theme.cyan }]}>
              {waterGlasses * 250} / {weather?.recommendedWaterMl || 3200} mL
            </Text>
          </View>

          <View style={styles.glassesGrid}>
            {Array.from({ length: 12 }).map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setWaterGlasses(i < waterGlasses ? i : i + 1)}
                style={[
                  styles.glassButton,
                  {
                    backgroundColor: i < waterGlasses ? theme.cyanLight : 'rgba(255, 255, 255, 0.03)',
                  },
                ]}
              >
                <Droplets
                  size={14}
                  color={i < waterGlasses ? theme.cyan : theme.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>

          {weather?.hydrationAdjustmentMl > 0 && (
            <View style={[styles.heatBonusRow, { backgroundColor: theme.cyanLight }]}>
              <Zap size={12} color={theme.cyan} />
              <Text style={[styles.heatBonusText, { color: theme.cyan }]}>
                +{weather.hydrationAdjustmentMl}mL heatwave hydration bonus applied for {weather.city}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <CustomMealModal
        visible={showCustomMealModal}
        onClose={() => setShowCustomMealModal(false)}
      />
      <ThemeSelectorModal
        visible={showThemeModal}
        onClose={() => setShowThemeModal(false)}
      />
      <PersonalTrainerModal
        visible={showTrainerModal}
        onClose={() => setShowTrainerModal(false)}
      />
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onOpenLifeStatus={() => setShowLifeStatus(true)}
        onOpenSuperAdmin={() => setShowSuperAdmin(true)}
        onOpenThemeModal={() => setShowThemeModal(true)}
      />
      <QuickTrialWizard
        visible={showPlanWizard}
        onClose={() => setShowPlanWizard(false)}
      />
      <LifeStatusModal
        visible={showLifeStatus}
        onClose={() => setShowLifeStatus(false)}
      />
      <SuperAdminModal
        visible={showSuperAdmin}
        onClose={() => setShowSuperAdmin(false)}
      />
      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        currentWeather={weather}
        onSelectCity={(newCity) => {
          setSelectedCity(newCity);
          loadWeatherData(newCity);
        }}
      />
      <SecurityVaultModal
        visible={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
      <AuthRequiredModal
        visible={showAuthGate}
        onClose={() => setShowAuthGate(false)}
      />
      <MasterDietChartModal
        visible={showDietChartModal}
        onClose={() => setShowDietChartModal(false)}
      />
      <SmartCheatDayModal
        visible={showCheatModal}
        onClose={() => setShowCheatModal(false)}
      />
      <RewardsHubModal
        visible={showRewardsModal}
        onClose={() => setShowRewardsModal(false)}
        onOpenCheatPlanner={() => setShowCheatModal(true)}
      />
      <SavedMealsComposerModal
        visible={showSavedMealsModal}
        onClose={() => setShowSavedMealsModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 48,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestSyncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  guestSyncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  guestSyncText: {
    fontSize: 11.5,
    fontWeight: '700',
    flex: 1,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '900',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  headerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  onboardingCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  onboardingIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onboardingTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  onboardingDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  onboardingActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  onboardingPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  onboardingPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  onboardingLoginLink: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  onboardingLoginLinkText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  quickSignInBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSignInText: {
    fontSize: 11,
    fontWeight: '800',
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  weatherBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  securityBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroKicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  calorieBig: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  calorieTarget: {
    fontSize: 14,
    fontWeight: '600',
  },
  heroRightActionRow: {
    alignItems: 'flex-end',
    gap: 6,
  },
  heroLogMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroLogMealText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  macroContainer: {
    gap: 10,
  },
  macroBlock: {
    gap: 4,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroName: {
    fontSize: 12,
    fontWeight: '600',
  },
  macroAmount: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  coachNudgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  coachNudgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  coachNudgeTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  coachNudgeDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 1,
  },
  actionGrid: {
    gap: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextBox: {
    flex: 1,
    gap: 2,
  },
  actionHeading: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionSub: {
    fontSize: 11,
  },
  actionArrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dietChartHeroCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  dietChartHeroLeft: {
    flex: 1,
    gap: 4,
  },
  dietChartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  dietChartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dietChartHeroTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  dietChartHeroDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    lineHeight: 15,
  },
  dietChartHeroRightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dietChartHeroBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  staplesCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  staplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  staplesTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  staplesScroll: {
    gap: 10,
    paddingVertical: 2,
  },
  staplePill: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minWidth: 140,
    gap: 4,
  },
  stapleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  stapleName: {
    fontSize: 12,
    fontWeight: '700',
  },
  stapleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stapleBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  stapleMeta: {
    fontSize: 10,
    fontWeight: '600',
  },
  loggerCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  loggerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  loggerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  loggerCalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loggerCalText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stepperContainer: {
    gap: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  stepperInfo: {
    gap: 2,
  },
  stepperTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepperMeta: {
    fontSize: 10,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stepperButton: {
    padding: 4,
  },
  counterValue: {
    fontSize: 15,
    fontWeight: '800',
    minWidth: 18,
    textAlign: 'center',
  },
  gheeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  gheeTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  gheeSub: {
    fontSize: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLogButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  submitLogText: {
    fontSize: 13,
    fontWeight: '800',
  },
  waterCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  waterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  waterAmountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  glassesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  glassButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatBonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
  },
  heatBonusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
