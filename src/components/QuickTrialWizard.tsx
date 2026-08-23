import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth, DietaryType, EquipmentType, GoalType, calculateRealisticTargets } from '../context/AuthContext';
import {
  Sparkles,
  X,
  ArrowRight,
  Check,
  Dumbbell,
  Utensils,
  MapPin,
  Target,
  User,
  Zap,
  Activity,
  Flame,
  IndianRupee,
  ShieldCheck,
  Leaf,
  Egg,
} from 'lucide-react-native';

interface QuickPlanWizardProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickTrialWizard: React.FC<QuickPlanWizardProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { startFreePlan, user, updateUserProfile } = useAuth();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [name, setName] = useState<string>(user.fullName === 'New Member' ? '' : user.fullName);
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || 'male');
  const [age, setAge] = useState<string>(user.age ? user.age.toString() : '26');
  const [heightCm, setHeightCm] = useState<string>(user.heightCm ? user.heightCm.toString() : '172');
  const [weightKg, setWeightKg] = useState<string>(user.weightKg ? user.weightKg.toString() : '70');
  const [targetWeightKg, setTargetWeightKg] = useState<string>(user.targetWeightKg ? user.targetWeightKg.toString() : '65');
  const [goal, setGoal] = useState<GoalType>(user.goalType || 'fat_loss');
  const [city, setCity] = useState<string>(user.city || 'delhi');
  const [equipment, setEquipment] = useState<EquipmentType[]>(user.equipment || ['bodyweight']);
  const [diet, setDiet] = useState<DietaryType>(user.dietaryPreference || 'veg');
  const [budget, setBudget] = useState<number>(user.weeklyBudgetInr || 1000);

  const toggleEquipment = (item: EquipmentType) => {
    if (equipment.includes(item)) {
      if (equipment.length > 1) setEquipment(equipment.filter((e) => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const currentW = parseFloat(weightKg) || 70;
  const targetW = parseFloat(targetWeightKg) || 65;
  const currentH = parseFloat(heightCm) || 172;
  const currentA = parseInt(age, 10) || 26;

  // Real-time calculation preview
  const previewTargets = calculateRealisticTargets(
    currentW,
    currentH,
    currentA,
    gender,
    goal,
    targetW
  );

  const handleFinish = () => {
    const finalName = name.trim() || (gender === 'male' ? 'Brother' : 'Sister');
    startFreePlan({
      fullName: finalName,
      gender,
      age: currentA,
      heightCm: currentH,
      weightKg: currentW,
      targetWeightKg: targetW,
      goalType: goal,
      city: city.trim() || 'delhi',
      equipment,
      dietaryPreference: diet,
      weeklyBudgetInr: budget,
    });
    setStep(1);
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
            <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
              <Sparkles size={13} color={theme.primary} />
              <Text style={[styles.badgeText, { color: theme.primary }]}>STEP {step} OF 3</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Step 1: Name, Gender & Biometrics */}
            {step === 1 && (
              <View style={styles.stepBox}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Your Biometrics & Body Stats
                </Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  We use Mifflin-St Jeor equations to calculate your exact resting metabolic rate.
                </Text>

                {/* Name */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Your Name / Nickname</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Arjun"
                    placeholderTextColor={theme.textMuted}
                  />
                </View>

                {/* Gender */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Gender</Text>
                  <View style={styles.chipRow}>
                    {(['male', 'female'] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => setGender(g)}
                        style={[
                          styles.genderChip,
                          {
                            backgroundColor: gender === g ? theme.primaryLight : theme.backgroundSecondary,
                            borderColor: gender === g ? theme.primary : theme.cardBorder,
                          },
                        ]}
                      >
                        <User size={15} color={gender === g ? theme.primary : theme.textSecondary} />
                        <Text style={[styles.genderChipText, { color: gender === g ? theme.primary : theme.textSecondary }]}>
                          {g === 'male' ? 'Male' : 'Female'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Age, Height & Weight Row */}
                <View style={styles.tripleInputRow}>
                  <View style={styles.tripleCol}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Age (yrs)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder, color: theme.textPrimary }]}
                      value={age}
                      onChangeText={setAge}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.tripleCol}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Height (cm)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder, color: theme.textPrimary }]}
                      value={heightCm}
                      onChangeText={setHeightCm}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.tripleCol}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Weight (kg)</Text>
                    <TextInput
                      style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder, color: theme.textPrimary }]}
                      value={weightKg}
                      onChangeText={setWeightKg}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setStep(2)}
                  style={[styles.nextBtn, { backgroundColor: theme.primary }]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.nextBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                    Next: Goal & Target Weight
                  </Text>
                  <ArrowRight size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Goal, Target Weight & Equipment */}
            {step === 2 && (
              <View style={styles.stepBox}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Your Goal & Fitness Setup
                </Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Select your primary fitness transformation target and available home gear.
                </Text>

                {/* Goal Selector */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Primary Goal</Text>
                  <View style={styles.goalGrid}>
                    {[
                      { key: 'fat_loss', label: 'Fat Loss & Toning', desc: 'Caloric deficit with high protein', icon: Flame, iconColor: theme.rose },
                      { key: 'muscle_gain', label: 'Muscle Building', desc: 'Lean surplus with progressive overload', icon: Dumbbell, iconColor: theme.primary },
                      { key: 'recomp', label: 'Body Recomposition', desc: 'Lose fat & build muscle simultaneously', icon: Activity, iconColor: theme.amber },
                      { key: 'low_gi_pcod', label: 'Low GI & PCOD Control', desc: 'Insulin-stabilizing Indian meals', icon: ShieldCheck, iconColor: theme.cyan },
                    ].map((g) => {
                      const IconComp = g.icon;
                      return (
                        <TouchableOpacity
                          key={g.key}
                          onPress={() => setGoal(g.key as GoalType)}
                          style={[
                            styles.goalCard,
                            {
                              backgroundColor: goal === g.key ? theme.primaryLight : theme.backgroundSecondary,
                              borderColor: goal === g.key ? theme.primary : theme.cardBorder,
                            },
                          ]}
                        >
                          <View style={styles.goalTitleRow}>
                            <IconComp size={16} color={goal === g.key ? theme.primary : g.iconColor} />
                            <Text style={[styles.goalCardTitle, { color: goal === g.key ? theme.primary : theme.textPrimary }]}>
                              {g.label}
                            </Text>
                          </View>
                          <Text style={[styles.goalCardDesc, { color: theme.textMuted }]}>{g.desc}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Target Weight */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Target Weight (kg)</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    value={targetWeightKg}
                    onChangeText={setTargetWeightKg}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    style={[styles.backBtn, { borderColor: theme.cardBorder }]}
                  >
                    <Text style={[styles.backBtnText, { color: theme.textSecondary }]}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setStep(3)}
                    style={[styles.nextBtnFlex, { backgroundColor: theme.primary }]}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.nextBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                      Next: Diet & Budget
                    </Text>
                    <ArrowRight size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 3: Diet, Weekly Kirana Budget & Summary */}
            {step === 3 && (
              <View style={styles.stepBox}>
                <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>
                  Diet & Grocery Budget
                </Text>
                <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                  Our optimizer ensures 100% of your meals fit within your weekly grocery budget.
                </Text>

                {/* Dietary Preference */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Dietary Preference</Text>
                  <View style={styles.dietRow}>
                    {[
                      { key: 'veg', label: 'Pure Veg', icon: Leaf },
                      { key: 'jain', label: 'Jain', icon: Sparkles },
                      { key: 'eggetarian', label: 'Eggetarian', icon: Egg },
                      { key: 'non_veg', label: 'Non-Veg', icon: Utensils },
                    ].map((d) => {
                      const DietIcon = d.icon;
                      return (
                        <TouchableOpacity
                          key={d.key}
                          onPress={() => setDiet(d.key as DietaryType)}
                          style={[
                            styles.dietCard,
                            {
                              backgroundColor: diet === d.key ? theme.primaryLight : theme.backgroundSecondary,
                              borderColor: diet === d.key ? theme.primary : theme.cardBorder,
                            },
                          ]}
                        >
                          <DietIcon size={14} color={diet === d.key ? theme.primary : theme.textSecondary} />
                          <Text style={[styles.dietCardText, { color: diet === d.key ? theme.primary : theme.textSecondary }]}>
                            {d.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Weekly Kirana Budget */}
                <View style={styles.inputGroup}>
                  <View style={styles.budgetHeader}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Weekly Grocery Spend</Text>
                    <Text style={[styles.budgetValText, { color: theme.amber }]}>₹{budget}/week</Text>
                  </View>
                  <View style={styles.budgetRow}>
                    {[300, 500, 800, 1500].map((b) => (
                      <TouchableOpacity
                        key={b}
                        onPress={() => setBudget(b)}
                        style={[
                          styles.budgetBtn,
                          {
                            backgroundColor: budget === b ? theme.amberLight : theme.backgroundSecondary,
                            borderColor: budget === b ? theme.amber : theme.cardBorder,
                          },
                        ]}
                      >
                        <Text style={[styles.budgetBtnText, { color: budget === b ? theme.amber : theme.textSecondary }]}>
                          ₹{b}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* City */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Your City / Location</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder, color: theme.textPrimary }]}
                    value={city}
                    onChangeText={setCity}
                    placeholder="e.g. Pune, Delhi, Mumbai, Jaipur..."
                    placeholderTextColor={theme.textMuted}
                  />
                </View>

                {/* Real-time Calculated Targets Summary Card */}
                <View style={[styles.calcSummaryCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                  <View style={styles.calcSummaryHeader}>
                    <Flame size={16} color={theme.primary} />
                    <Text style={[styles.calcSummaryTitle, { color: theme.primary }]}>
                      Calculated Targets for You
                    </Text>
                  </View>
                  <View style={styles.calcGrid}>
                    <View style={styles.calcItem}>
                      <Text style={[styles.calcLabel, { color: theme.textMuted }]}>Calories</Text>
                      <Text style={[styles.calcValue, { color: theme.textPrimary }]}>
                        {previewTargets.dailyCalorieTarget} kcal
                      </Text>
                    </View>
                    <View style={styles.calcItem}>
                      <Text style={[styles.calcLabel, { color: theme.textMuted }]}>Protein</Text>
                      <Text style={[styles.calcValue, { color: theme.primary }]}>
                        {previewTargets.proteinTargetG}g / day
                      </Text>
                    </View>
                    <View style={styles.calcItem}>
                      <Text style={[styles.calcLabel, { color: theme.textMuted }]}>Est. Timeline</Text>
                      <Text style={[styles.calcValue, { color: theme.amber }]}>
                        ~{previewTargets.estimatedWeeksToGoal} wks
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    onPress={() => setStep(2)}
                    style={[styles.backBtn, { borderColor: theme.cardBorder }]}
                  >
                    <Text style={[styles.backBtnText, { color: theme.textSecondary }]}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFinish}
                    style={[styles.finishBtnFlex, { backgroundColor: theme.primary }]}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.finishBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                      Apply & View Indian Diet
                    </Text>
                    <Check size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    maxHeight: '92%',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 14,
    gap: 16,
    paddingBottom: 36,
  },
  stepBox: {
    gap: 14,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tripleInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tripleCol: {
    flex: 1,
    gap: 6,
  },
  goalGrid: {
    gap: 8,
  },
  goalCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalCardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  goalCardDesc: {
    fontSize: 10.5,
    paddingLeft: 24,
  },
  dietRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  dietCardText: {
    fontSize: 12,
    fontWeight: '700',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetValText: {
    fontSize: 12,
    fontWeight: '800',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  budgetBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  calcSummaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  calcSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calcSummaryTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  calcGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcItem: {
    alignItems: 'center',
    gap: 2,
  },
  calcLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  nextBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  backBtn: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  nextBtnFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  finishBtnFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  finishBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
