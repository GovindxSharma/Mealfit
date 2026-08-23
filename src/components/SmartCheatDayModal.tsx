import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth, GoalType } from '../context/AuthContext';
import {
  X,
  Sparkles,
  Flame,
  Calendar,
  Zap,
  TrendingDown,
  ShieldCheck,
  Check,
  AlertTriangle,
  Info,
  Clock,
  Footprints,
  HeartPulse,
  Scale,
  Utensils,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SmartCheatDayModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SmartCheatDayModal: React.FC<SmartCheatDayModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { user, updateUserProfile, setGoal } = useAuth();

  // Cheat meal state
  const [selectedCheatMeal, setSelectedCheatMeal] = useState<{
    name: string;
    calories: number;
  }>({
    name: 'Amritsari Chole Bhature (2 Pcs)',
    calories: 780,
  });
  const [daysAhead, setDaysAhead] = useState<number>(3);
  const [useCardioOffset, setUseCardioOffset] = useState<boolean>(true);

  // Dynamic Goal adjustment state
  const [targetWeight, setTargetWeight] = useState<number>(user.targetWeightKg || 65);
  const [targetWeeks, setTargetWeeks] = useState<number>(user.estimatedWeeksToGoal || 8);
  const [selectedGoal, setSelectedGoal] = useState<GoalType>(user.goalType || 'fat_loss');

  // Calorie Banking Calculations
  const bankingStrategy = useMemo(() => {
    const totalCheatKcal = selectedCheatMeal.calories;
    const cardioBurnKcal = useCardioOffset ? 200 : 0;
    const netKcalToBank = Math.max(0, totalCheatKcal - cardioBurnKcal);
    const dailyKcalDeficit = Math.round(netKcalToBank / Math.max(1, daysAhead));

    return {
      totalCheatKcal,
      cardioBurnKcal,
      netKcalToBank,
      dailyKcalDeficit,
      walkMinutes: useCardioOffset ? 25 : 0,
    };
  }, [selectedCheatMeal, daysAhead, useCardioOffset]);

  // Goal Feasibility Curve
  const goalAnalysis = useMemo(() => {
    const currentWeight = user.weightKg || 70;
    const weightDiff = Math.abs(currentWeight - targetWeight);
    const weeklyRate = weightDiff / Math.max(1, targetWeeks);

    let safetyStatus: 'safe' | 'moderate' | 'extreme' = 'safe';
    let safetyLabel = 'Scientifically Ideal & Safe (Zero Muscle Loss)';
    let safetyDesc = 'ICMR & NIN clinical standard: preserves basal metabolic rate and skin elasticity.';

    if (weeklyRate > 0.65 && weeklyRate <= 0.95) {
      safetyStatus = 'moderate';
      safetyLabel = 'Aggressive Athletic Deficit';
      safetyDesc = 'Requires high protein intake (>130g/day) to prevent lean skeletal muscle loss.';
    } else if (weeklyRate > 0.95) {
      safetyStatus = 'extreme';
      safetyLabel = 'High Metabolic Adaptation Risk';
      safetyDesc = 'Too fast; may cause thyroid T3 downregulation and rebound hunger. Extend timeline by 3-4 weeks.';
    }

    return {
      currentWeight,
      weightDiff,
      weeklyRate: weeklyRate.toFixed(2),
      safetyStatus,
      safetyLabel,
      safetyDesc,
    };
  }, [targetWeight, targetWeeks, user.weightKg]);

  const handleApplyGoalChanges = () => {
    setGoal(selectedGoal, targetWeight);
    updateUserProfile({
      targetWeightKg: targetWeight,
      goalType: selectedGoal,
      estimatedWeeksToGoal: targetWeeks,
    });
    Alert.alert(
      'Goal & Timeline Updated',
      `Your targets have been recalibrated: ${targetWeight} kg in ${targetWeeks} weeks (${goalAnalysis.weeklyRate} kg/week).`
    );
    onClose();
  };

  const handleActivateCheatProtocol = () => {
    Alert.alert(
      'Cheat Protocol Activated',
      `For the next ${daysAhead} days, bank ~${bankingStrategy.dailyKcalDeficit} kcal/day.\nEnjoy your ${selectedCheatMeal.name} guilt-free with zero fat gain!`
    );
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
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
                  Cheat Day & Goal Timeline Engine
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  Calorie Banking Simulator & Realistic ICMR Timeline
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* ================= 1. SMART CHEAT DAY BANKING ================= */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Flame size={16} color={theme.amber} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  1. Smart Cheat Day & Calorie Banking
                </Text>
              </View>
              <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                Schedule an upcoming indulgence and bank calories ahead so your fat loss never stops:
              </Text>

              {/* Cheat Meal Presets */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cheatScroll}>
                {[
                  { name: 'Chole Bhature (2 Pcs)', calories: 780 },
                  { name: 'Wedding Dum Biryani', calories: 720 },
                  { name: 'Cheese Pizza (3 Slices)', calories: 820 },
                  { name: 'Pav Bhaji (2 Pav)', calories: 540 },
                  { name: 'Gulab Jamun (3 Pcs)', calories: 480 },
                ].map((item, idx) => {
                  const isSel = selectedCheatMeal.name === item.name;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setSelectedCheatMeal(item)}
                      style={[
                        styles.cheatPill,
                        {
                          backgroundColor: isSel ? theme.primaryLight : theme.backgroundSecondary,
                          borderColor: isSel ? theme.primary : theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Utensils size={16} color={isSel ? theme.primary : theme.textSecondary} />
                      <Text
                        style={[
                          styles.cheatName,
                          { color: isSel ? theme.primary : theme.textPrimary, fontWeight: isSel ? '800' : '600' },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text style={[styles.cheatCal, { color: theme.amber }]}>
                        {item.calories} kcal
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Days Ahead Selector */}
              <View style={styles.paramRow}>
                <Text style={[styles.paramLabel, { color: theme.textSecondary }]}>
                  How many days ahead?
                </Text>
                <View style={styles.daysBtnRow}>
                  {[1, 2, 3, 4, 5].map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setDaysAhead(d)}
                      style={[
                        styles.dayBtn,
                        {
                          backgroundColor: daysAhead === d ? theme.primary : theme.backgroundSecondary,
                          borderColor: daysAhead === d ? theme.primary : theme.cardBorder,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayBtnText,
                          { color: daysAhead === d ? '#FFFFFF' : theme.textPrimary, fontWeight: daysAhead === d ? '800' : '600' },
                        ]}
                      >
                        {d} {d === 1 ? 'Day' : 'Days'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Banking Strategy Output Card */}
              <View
                style={[
                  styles.strategyCard,
                  {
                    backgroundColor: theme.primaryLight,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <View style={styles.strategyTop}>
                  <Zap size={16} color={theme.primary} />
                  <Text style={[styles.strategyTitle, { color: theme.primary }]}>
                    Zero-Guilt Banking Formula
                  </Text>
                </View>
                <Text style={[styles.strategyFormula, { color: theme.textPrimary }]}>
                  Save <Text style={{ color: theme.primary, fontWeight: '900' }}>{bankingStrategy.dailyKcalDeficit} kcal/day</Text> for {daysAhead} days
                  {useCardioOffset ? ' + 25-min Post-Meal Brisk Walk' : ''}.
                </Text>
                <View style={styles.strategyBenefit}>
                  <Check size={13} color={theme.primary} />
                  <Text style={[styles.strategyBenefitText, { color: theme.textSecondary }]}>
                    Result: <Text style={{ fontWeight: '800', color: theme.textPrimary }}>0g Fat Stored</Text>. Glycogen stores replenish without spillover!
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleActivateCheatProtocol}
                  style={[styles.activateBtn, { backgroundColor: theme.primary }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.activateBtnText}>Activate {daysAhead}-Day Banking Protocol</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ================= 2. REALISTIC GOAL & TIMELINE ADJUSTER ================= */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Scale size={16} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  2. Recalibrate Weight Goal & Timeline
                </Text>
              </View>
              <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
                Change your target weight and speed anytime. We compute realistic ICMR scientific possibilities:
              </Text>

              {/* Goal Type Selector */}
              <View style={styles.goalPillRow}>
                {[
                  { key: 'fat_loss', label: 'Fat Loss' },
                  { key: 'muscle_gain', label: 'Muscle Gain' },
                  { key: 'recomp', label: 'Body Recomp' },
                  { key: 'low_gi_pcod', label: 'Low GI / PCOD' },
                ].map((g) => (
                  <TouchableOpacity
                    key={g.key}
                    onPress={() => setSelectedGoal(g.key as GoalType)}
                    style={[
                      styles.goalPill,
                      {
                        backgroundColor: selectedGoal === g.key ? theme.primary : theme.backgroundSecondary,
                        borderColor: selectedGoal === g.key ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.goalPillText,
                        { color: selectedGoal === g.key ? '#FFFFFF' : theme.textSecondary, fontWeight: selectedGoal === g.key ? '800' : '600' },
                      ]}
                    >
                      {g.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Target Weight & Timeline Inputs */}
              <View style={styles.inputGrid}>
                <View style={styles.inputBox}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Current Weight</Text>
                  <View style={[styles.readOnlyInput, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
                    <Text style={[styles.readOnlyText, { color: theme.textPrimary }]}>{user.weightKg || 70} kg</Text>
                  </View>
                </View>

                <View style={styles.inputBox}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Target Goal Weight</Text>
                  <View style={[styles.interactiveInput, { backgroundColor: theme.backgroundSecondary, borderColor: theme.primary }]}>
                    <TextInput
                      value={String(targetWeight)}
                      onChangeText={(t) => setTargetWeight(Number(t) || targetWeight)}
                      keyboardType="numeric"
                      style={[styles.textInput, { color: theme.textPrimary }]}
                    />
                    <Text style={[styles.inputUnit, { color: theme.textMuted }]}>kg</Text>
                  </View>
                </View>

                <View style={styles.inputBox}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Timeline (Weeks)</Text>
                  <View style={[styles.interactiveInput, { backgroundColor: theme.backgroundSecondary, borderColor: theme.primary }]}>
                    <TextInput
                      value={String(targetWeeks)}
                      onChangeText={(t) => setTargetWeeks(Number(t) || targetWeeks)}
                      keyboardType="numeric"
                      style={[styles.textInput, { color: theme.textPrimary }]}
                    />
                    <Text style={[styles.inputUnit, { color: theme.textMuted }]}>wks</Text>
                  </View>
                </View>
              </View>

              {/* Realistic Possibility Card */}
              <View
                style={[
                  styles.possibilityCard,
                  {
                    backgroundColor:
                      goalAnalysis.safetyStatus === 'safe'
                        ? theme.primaryLight
                        : goalAnalysis.safetyStatus === 'moderate'
                        ? theme.amberLight
                        : theme.roseLight,
                    borderColor:
                      goalAnalysis.safetyStatus === 'safe'
                        ? theme.primary
                        : goalAnalysis.safetyStatus === 'moderate'
                        ? theme.amber
                        : theme.rose,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.safetyTitle,
                    {
                      color:
                        goalAnalysis.safetyStatus === 'safe'
                          ? theme.primary
                          : goalAnalysis.safetyStatus === 'moderate'
                          ? theme.amber
                          : theme.rose,
                    },
                  ]}
                >
                  {goalAnalysis.safetyLabel}
                </Text>
                <Text style={[styles.safetyRate, { color: theme.textPrimary }]}>
                  Required Rate: <Text style={{ fontWeight: '900' }}>{goalAnalysis.weeklyRate} kg / week</Text> ({goalAnalysis.weightDiff} kg over {targetWeeks} weeks)
                </Text>
                <Text style={[styles.safetyDesc, { color: theme.textSecondary }]}>
                  {goalAnalysis.safetyDesc}
                </Text>

                <TouchableOpacity
                  onPress={handleApplyGoalChanges}
                  style={[styles.applyGoalBtn, { backgroundColor: theme.primary }]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.applyGoalBtnText}>Apply New Goal & Recalibrate Targets</Text>
                </TouchableOpacity>
              </View>
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
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 20,
    paddingBottom: 40,
  },
  section: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  sectionSub: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  cheatScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  cheatPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
    minWidth: 130,
  },
  cheatIcon: {
    fontSize: 22,
  },
  cheatName: {
    fontSize: 11.5,
    textAlign: 'center',
  },
  cheatCal: {
    fontSize: 11,
    fontWeight: '800',
  },
  paramRow: {
    gap: 8,
    marginTop: 4,
  },
  paramLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  daysBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  dayBtnText: {
    fontSize: 11.5,
  },
  strategyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginTop: 6,
  },
  strategyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strategyTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  strategyFormula: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  strategyBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  strategyBenefitText: {
    fontSize: 11.5,
  },
  activateBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  activateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  goalPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalPill: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  goalPillText: {
    fontSize: 11.5,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  inputBox: {
    flex: 1,
    gap: 4,
  },
  inputLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  readOnlyInput: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  readOnlyText: {
    fontSize: 13,
    fontWeight: '800',
  },
  interactiveInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    paddingVertical: 7,
  },
  inputUnit: {
    fontSize: 11,
    fontWeight: '700',
  },
  possibilityCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    marginTop: 6,
  },
  safetyTitle: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  safetyRate: {
    fontSize: 12,
  },
  safetyDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  applyGoalBtn: {
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  applyGoalBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
