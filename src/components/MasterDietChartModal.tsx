import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  MASTER_INDIAN_DIET_CHART,
  MasterDietMeal,
  MealAlternative,
  FitnessGoal,
  DietType,
  getSlotTitle,
} from '../services/dietChartEngine';
import {
  X,
  Sparkles,
  Flame,
  Dumbbell,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  Clock,
  IndianRupee,
  Share2,
  Check,
  Lightbulb,
  Zap,
  Leaf,
  Egg,
  HeartPulse,
  Info,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MasterDietChartModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MasterDietChartModal: React.FC<MasterDietChartModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { user, addCustomMeal, toggleMealLogged } = useAuth();

  const [activeGoal, setActiveGoal] = useState<FitnessGoal>(user.goalType || 'fat_loss');
  const [activeDiet, setActiveDiet] = useState<DietType>(user.dietaryPreference || 'veg');
  const [activeBudget, setActiveBudget] = useState<'all' | 'kirana_budget' | 'standard' | 'high_protein'>('all');
  const [expandedMealId, setExpandedMealId] = useState<string | null>('bf_moong_paneer_chilla');
  const [loggedIds, setLoggedIds] = useState<{ [key: string]: boolean }>({});

  // Filtered meals based on selection
  const filteredMeals = useMemo(() => {
    return MASTER_INDIAN_DIET_CHART.filter((m) => {
      const matchDiet = m.dietTypes.includes(activeDiet);
      const matchGoal = m.goals.includes(activeGoal) || m.goals.length === 4;
      const matchBudget = activeBudget === 'all' || m.budgetTier === activeBudget;
      return matchDiet && matchGoal && matchBudget;
    });
  }, [activeGoal, activeDiet, activeBudget]);

  // Aggregate stats
  const totals = useMemo(() => {
    return filteredMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.proteinG,
        carbs: acc.carbs + m.carbsG,
        fat: acc.fat + m.fatG,
        cost: acc.cost + m.costInr,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, cost: 0 }
    );
  }, [filteredMeals]);

  const handleLogMeal = (meal: MasterDietMeal) => {
    addCustomMeal({
      name: meal.name,
      hindiName: meal.hindiName,
      calories: meal.calories,
      proteinG: meal.proteinG,
      carbsG: meal.carbsG,
      fatG: meal.fatG,
      slot: meal.slot === 'pre_workout' || meal.slot === 'mid_morning' || meal.slot === 'evening_snack' ? 'snack' : meal.slot === 'bedtime' ? 'dinner' : (meal.slot as any),
      quantity: '1 Full Prescribed Portion',
      costInr: meal.costInr,
    });
    setLoggedIds((prev) => ({ ...prev, [meal.id]: true }));
    Alert.alert('✅ Meal Logged', `${meal.name} (+${meal.proteinG}g Protein) has been added to today's nutrition ledger!`);
  };

  const handleLogAlternative = (alt: MealAlternative, parentSlot: string) => {
    addCustomMeal({
      name: alt.name,
      hindiName: alt.hindiName,
      calories: alt.calories,
      proteinG: alt.proteinG,
      carbsG: alt.carbsG,
      fatG: alt.fatG,
      slot: parentSlot === 'pre_workout' || parentSlot === 'mid_morning' || parentSlot === 'evening_snack' ? 'snack' : parentSlot === 'bedtime' ? 'dinner' : (parentSlot as any),
      quantity: '1 Full Swapped Portion',
      costInr: alt.costInr,
    });
    setLoggedIds((prev) => ({ ...prev, [alt.id]: true }));
    Alert.alert('Swap Logged', `${alt.name} (+${alt.proteinG}g Protein) has been added to today's ledger.`);
  };

  const handleShareDietChart = async () => {
    try {
      const mealListText = filteredMeals
        .map(
          (m, idx) =>
            `${idx + 1}. [${getSlotTitle(m.slot).en} - ${m.recommendedTime}]\n` +
            `🥗 ${m.name} (${m.hindiName})\n` +
            `⚡ ${m.calories} kcal | P: ${m.proteinG}g | C: ${m.carbsG}g | F: ${m.fatG}g | ₹${m.costInr}\n` +
            `Why: ${m.whyWeAdviseThis}\n`
        )
        .join('\n');

      const message =
        `MealFit India — My Personalized Daily Indian Diet Plan\n` +
        `Goal: ${activeGoal.toUpperCase()} | Diet: ${activeDiet.toUpperCase()}\n` +
        `Daily Totals: ${totals.calories} kcal | ${totals.protein.toFixed(1)}g Protein | ₹${totals.cost}/day\n\n` +
        mealListText +
        `\n\nPowered by ICMR & NIN Nutrition Guidelines on MealFit India!`;

      await Share.share({ message });
    } catch (e) {
      // Ignored
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.emblemBadge, { backgroundColor: theme.primaryLight }]}>
                <Sparkles size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Master Indian Diet Chart
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  Full Personalized Meal Blueprint & Scientific Rationale
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. Goal Filter Pills */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: theme.textMuted }]}>FITNESS TARGET</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillRow}>
                {[
                  { key: 'fat_loss', label: 'Fat Loss Deficit' },
                  { key: 'muscle_gain', label: 'Muscle Hypertrophy' },
                  { key: 'recomp', label: 'Body Recomp' },
                  { key: 'low_gi_pcod', label: 'Low GI / PCOD Health' },
                ].map((g) => {
                  const isSel = activeGoal === g.key;
                  return (
                    <TouchableOpacity
                      key={g.key}
                      onPress={() => setActiveGoal(g.key as FitnessGoal)}
                      style={[
                        styles.filterPill,
                        {
                          backgroundColor: isSel ? theme.primary : theme.backgroundSecondary,
                          borderColor: isSel ? theme.primary : theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.filterPillText,
                          { color: isSel ? '#FFFFFF' : theme.textSecondary, fontWeight: isSel ? '800' : '600' },
                        ]}
                      >
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* 2. Dietary Preference Pills */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: theme.textMuted }]}>DIETARY PREFERENCE</Text>
              <View style={styles.dietPillRow}>
                {[
                  { key: 'veg', label: 'Pure Veg' },
                  { key: 'jain', label: 'Jain Friendly' },
                  { key: 'eggetarian', label: 'Eggetarian' },
                  { key: 'non_veg', label: 'Non-Veg' },
                ].map((d) => {
                  const isSel = activeDiet === d.key;
                  return (
                    <TouchableOpacity
                      key={d.key}
                      onPress={() => setActiveDiet(d.key as DietType)}
                      style={[
                        styles.dietPill,
                        {
                          backgroundColor: isSel ? theme.primaryLight : theme.backgroundSecondary,
                          borderColor: isSel ? theme.primary : theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dietPillText,
                          { color: isSel ? theme.primary : theme.textSecondary, fontWeight: isSel ? '800' : '600' },
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Daily Macro & Budget Summary Banner */}
            <View
              style={[
                styles.summaryBanner,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                },
              ]}
            >
              <View style={styles.summaryTopRow}>
                <View style={styles.summaryTitleBox}>
                  <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
                    Daily Blueprint Summary
                  </Text>
                  <Text style={[styles.summarySub, { color: theme.textSecondary }]}>
                    {filteredMeals.length} Scientific Meals Planned
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleShareDietChart}
                  style={[styles.sharePill, { backgroundColor: theme.primary }]}
                  activeOpacity={0.8}
                >
                  <Share2 size={13} color="#FFFFFF" />
                  <Text style={styles.sharePillText}>Share Plan</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.macroStatGrid}>
                <View style={[styles.statBox, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statValue, { color: theme.primary }]}>{totals.calories}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Kcal</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statValue, { color: theme.secondary }]}>{totals.protein.toFixed(0)}g</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Protein</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statValue, { color: theme.amber }]}>{totals.carbs}g</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Carbs</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statValue, { color: theme.rose }]}>{totals.fat}g</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Fat</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: theme.card }]}>
                  <Text style={[styles.statValue, { color: theme.primary }]}>₹{totals.cost}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Daily Cost</Text>
                </View>
              </View>
            </View>

            {/* 4. Chronological Meal Cards */}
            <View style={styles.mealsListSection}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                Recommended Daily Timeline
              </Text>

              {filteredMeals.map((meal, index) => {
                const isExpanded = expandedMealId === meal.id;
                const slotInfo = getSlotTitle(meal.slot);
                const isLogged = loggedIds[meal.id];

                return (
                  <View
                    key={meal.id}
                    style={[
                      styles.mealCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: isExpanded ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    {/* Meal Header Strip */}
                    <TouchableOpacity
                      onPress={() => setExpandedMealId(isExpanded ? null : meal.id)}
                      style={styles.mealCardHeader}
                      activeOpacity={0.7}
                    >
                      <View style={styles.slotTagRow}>
                        <View style={[styles.slotBadge, { backgroundColor: theme.primaryLight }]}>
                          <Text style={styles.slotIcon}>{slotInfo.icon}</Text>
                          <Text style={[styles.slotName, { color: theme.primary }]}>
                            {slotInfo.en} • {slotInfo.hi}
                          </Text>
                        </View>
                        <View style={styles.timeTag}>
                          <Clock size={11} color={theme.textMuted} />
                          <Text style={[styles.timeText, { color: theme.textMuted }]}>
                            {meal.recommendedTime}
                          </Text>
                        </View>
                      </View>

                      {/* Main Title Row */}
                      <View style={styles.mealTitleRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.mealMainTitle, { color: theme.textPrimary }]}>
                            {meal.name}
                          </Text>
                          <Text style={[styles.mealHindiTitle, { color: theme.primary }]}>
                            {meal.hindiName}
                          </Text>
                        </View>
                        {isExpanded ? (
                          <ChevronUp size={20} color={theme.textSecondary} />
                        ) : (
                          <ChevronDown size={20} color={theme.textSecondary} />
                        )}
                      </View>

                      {/* Quick Macro Pill Bar */}
                      <View style={styles.macroPillRow}>
                        <View style={[styles.macroPill, { backgroundColor: theme.primaryLight }]}>
                          <Text style={[styles.macroPillText, { color: theme.primary }]}>
                            {meal.calories} kcal
                          </Text>
                        </View>
                        <View style={[styles.macroPill, { backgroundColor: theme.secondaryLight }]}>
                          <Text style={[styles.macroPillText, { color: theme.primary }]}>
                            {meal.proteinG}g Pro
                          </Text>
                        </View>
                        <View style={[styles.macroPill, { backgroundColor: theme.backgroundSecondary }]}>
                          <Text style={[styles.macroPillText, { color: theme.textSecondary }]}>
                            ₹{meal.costInr}
                          </Text>
                        </View>
                        <View style={[styles.macroPill, { backgroundColor: theme.backgroundSecondary }]}>
                          <Text style={[styles.macroPillText, { color: theme.textSecondary }]}>
                            {meal.prepTimeMin}m prep
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Scientific Details */}
                    {isExpanded && (
                      <View style={[styles.expandedContent, { borderTopColor: theme.cardBorder }]}>
                        {/* 1. Why We Advise This Box */}
                        <View
                          style={[
                            styles.whyAdviseBox,
                            {
                              backgroundColor: theme.backgroundSecondary,
                              borderColor: theme.cardBorder,
                            },
                          ]}
                        >
                          <View style={styles.whyHeader}>
                            <Lightbulb size={16} color={theme.amber} />
                            <Text style={[styles.whyTitle, { color: theme.textPrimary }]}>
                              Why We Advise This (Scientific Reason)
                            </Text>
                          </View>
                          <Text style={[styles.whyText, { color: theme.textSecondary }]}>
                            {meal.whyWeAdviseThis}
                          </Text>
                          <View style={styles.benefitRow}>
                            <Zap size={13} color={theme.primary} />
                            <Text style={[styles.benefitText, { color: theme.primary }]}>
                              {meal.scientificBenefit}
                            </Text>
                          </View>
                          {meal.absorptionTip && (
                            <View style={[styles.absorptionBox, { backgroundColor: theme.cyanLight }]}>
                              <Info size={13} color={theme.cyan} />
                              <Text style={[styles.absorptionText, { color: theme.cyan }]}>
                                <Text style={{ fontWeight: '800' }}>Absorption Secret: </Text>
                                {meal.absorptionTip}
                              </Text>
                            </View>
                          )}
                        </View>

                        {/* 2. Key Ingredients */}
                        <View style={styles.ingredientsBox}>
                          <Text style={[styles.ingTitle, { color: theme.textMuted }]}>
                            PANTRY INGREDIENTS & PORTIONS
                          </Text>
                          <View style={styles.ingList}>
                            {meal.ingredients.map((ing, i) => (
                              <View key={i} style={styles.ingBulletRow}>
                                <View style={[styles.ingDot, { backgroundColor: theme.primary }]} />
                                <Text style={[styles.ingText, { color: theme.textSecondary }]}>
                                  {ing}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        {/* 3. Smart Alternatives & 1-Tap Swaps */}
                        {meal.alternatives.length > 0 && (
                          <View style={styles.alternativesBox}>
                            <View style={styles.altHeader}>
                              <RefreshCw size={14} color={theme.primary} />
                              <Text style={[styles.altTitle, { color: theme.textPrimary }]}>
                                Smart Alternatives & 1-Tap Swaps
                              </Text>
                            </View>
                            <Text style={[styles.altSub, { color: theme.textMuted }]}>
                              Don't feel like this meal? Switch instantly without ruining your macros:
                            </Text>

                            {meal.alternatives.map((alt) => (
                              <View
                                key={alt.id}
                                style={[
                                  styles.altCard,
                                  {
                                    backgroundColor: theme.card,
                                    borderColor: theme.cardBorder,
                                  },
                                ]}
                              >
                                <View style={styles.altTopRow}>
                                  <View style={{ flex: 1 }}>
                                    <Text style={[styles.altName, { color: theme.textPrimary }]}>
                                      {alt.name}
                                    </Text>
                                    <Text style={[styles.altHindi, { color: theme.primary }]}>
                                      {alt.hindiName}
                                    </Text>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => handleLogAlternative(alt, meal.slot)}
                                    style={[
                                      styles.swapLogBtn,
                                      {
                                        backgroundColor: loggedIds[alt.id] ? theme.primary : theme.primaryLight,
                                      },
                                    ]}
                                    activeOpacity={0.8}
                                  >
                                    {loggedIds[alt.id] ? (
                                      <Check size={12} color="#FFFFFF" />
                                    ) : (
                                      <Plus size={12} color={theme.primary} />
                                    )}
                                    <Text
                                      style={[
                                        styles.swapLogText,
                                        { color: loggedIds[alt.id] ? '#FFFFFF' : theme.primary },
                                      ]}
                                    >
                                      {loggedIds[alt.id] ? 'Logged' : 'Log Swap'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <Text style={[styles.altQuickNote, { color: theme.textSecondary }]}>
                                  {alt.quickNote}
                                </Text>
                                <View style={styles.altMacroRow}>
                                  <Text style={[styles.altMacroItem, { color: theme.textMuted }]}>
                                    {alt.calories} kcal
                                  </Text>
                                  <Text style={[styles.altMacroItem, { color: theme.primary, fontWeight: '700' }]}>
                                    {alt.proteinG}g Pro
                                  </Text>
                                  <Text style={[styles.altMacroItem, { color: theme.textMuted }]}>
                                    ₹{alt.costInr}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* 4. Action Buttons */}
                        <View style={styles.actionBtnRow}>
                          <TouchableOpacity
                            onPress={() => handleLogMeal(meal)}
                            style={[
                              styles.primaryLogBtn,
                              {
                                backgroundColor: isLogged ? theme.secondary : theme.primary,
                              },
                            ]}
                            activeOpacity={0.85}
                          >
                            {isLogged ? (
                              <Check size={16} color="#FFFFFF" />
                            ) : (
                              <Plus size={16} color="#FFFFFF" />
                            )}
                            <Text style={styles.primaryLogBtnText}>
                              {isLogged ? 'Added to Today’s Ledger' : `Log This ${slotInfo.en} (+${meal.proteinG}g Pro)`}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: '92%',
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  emblemBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11.5,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 40,
  },
  filterSection: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  filterPillRow: {
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  dietPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  dietPillText: {
    fontSize: 12,
  },
  summaryBanner: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitleBox: {
    gap: 2,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  summarySub: {
    fontSize: 11,
  },
  sharePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sharePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  macroStatGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  statBox: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 2,
  },
  mealsListSection: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  mealCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mealCardHeader: {
    padding: 14,
    gap: 8,
  },
  slotTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slotIcon: {
    fontSize: 12,
  },
  slotName: {
    fontSize: 11,
    fontWeight: '800',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  mealMainTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    lineHeight: 20,
  },
  mealHindiTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  macroPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  macroPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  macroPillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  expandedContent: {
    padding: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 14,
  },
  whyAdviseBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  whyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  whyText: {
    fontSize: 11.5,
    lineHeight: 17,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    flex: 1,
  },
  absorptionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    padding: 8,
    borderRadius: 8,
  },
  absorptionText: {
    fontSize: 10.5,
    lineHeight: 15,
    flex: 1,
  },
  ingredientsBox: {
    gap: 6,
  },
  ingTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  ingList: {
    gap: 4,
  },
  ingBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  ingText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  alternativesBox: {
    gap: 8,
  },
  altHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  altTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  altSub: {
    fontSize: 10.5,
  },
  altCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  altTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  altName: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  altHindi: {
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 1,
  },
  swapLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  swapLogText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  altQuickNote: {
    fontSize: 10.5,
    lineHeight: 15,
  },
  altMacroRow: {
    flexDirection: 'row',
    gap: 10,
  },
  altMacroItem: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionBtnRow: {
    marginTop: 4,
  },
  primaryLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryLogBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
