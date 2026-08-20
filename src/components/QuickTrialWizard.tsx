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
import { Colors } from '../theme/colors';
import { useAuth, DietaryType, EquipmentType } from '../context/AuthContext';
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
} from 'lucide-react-native';

interface QuickPlanWizardProps {
  visible: boolean;
  onClose: () => void;
}

export const QuickTrialWizard: React.FC<QuickPlanWizardProps> = ({ visible, onClose }) => {
  const { startFreePlan, user } = useAuth();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [weightKg, setWeightKg] = useState<string>('72');
  const [targetWeightKg, setTargetWeightKg] = useState<string>('68');
  const [city, setCity] = useState<string>('delhi');
  const [equipment, setEquipment] = useState<EquipmentType[]>(['bodyweight']);
  const [diet, setDiet] = useState<DietaryType>('veg');
  const [budget, setBudget] = useState<number>(1000);

  const toggleEquipment = (item: EquipmentType) => {
    if (equipment.includes(item)) {
      if (equipment.length > 1) setEquipment(equipment.filter((e) => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleFinish = () => {
    const w = parseFloat(weightKg) || 72;
    const tw = parseFloat(targetWeightKg) || 68;
    const tdee = Math.round(10 * w + 6.25 * 175 - 5 * 26 + 5);
    const calorieTarget = tdee - 500;
    const proteinTarget = Math.round(w * 1.8);

    startFreePlan({
      weightKg: w,
      targetWeightKg: tw,
      city,
      equipment,
      dietaryPreference: diet,
      weeklyBudgetInr: budget,
      dailyCalorieTarget: calorieTarget,
      proteinTargetG: proteinTarget,
    });
    setStep(1);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Sparkles size={13} color={Colors.primary} />
              <Text style={styles.badgeText}>STEP {step} OF 3</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Step 1: Goal & City */}
            {step === 1 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>Your Goal & Location</Text>
                <Text style={styles.stepDesc}>
                  We calibrate water needs to your city heat and calculate safe weight targets.
                </Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Current Weight (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={weightKg}
                      onChangeText={setWeightKg}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputHalf}>
                    <Text style={styles.inputLabel}>Target Weight (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={targetWeightKg}
                      onChangeText={setTargetWeightKg}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.citySection}>
                  <Text style={styles.inputLabel}>Enter Your City / Location</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="e.g. Pune, Jaipur, Lucknow, Indore, Delhi..."
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => setStep(2)}
                  style={styles.nextBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextBtnText}>Next: Equipment</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Equipment */}
            {step === 2 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>What Equipment Do You Have?</Text>
                <Text style={styles.stepDesc}>
                  Your workouts will only include exercises you can actually perform at home.
                </Text>

                <View style={styles.optionsList}>
                  {[
                    { key: 'bodyweight', title: 'Zero Equipment (Living Room Floor)', sub: 'Bodyweight tempo squats, pushup progressions' },
                    { key: 'bands', title: 'Resistance Bands', sub: 'Loop & tube bands for rows and presses' },
                    { key: 'dumbbells', title: 'Dumbbells or Water Bottles', sub: 'Adjustable or fixed home weights' },
                    { key: 'gym', title: 'Full Gym Access', sub: 'Barbells, cables & machines' },
                  ].map((eq) => {
                    const active = equipment.includes(eq.key as EquipmentType);
                    return (
                      <TouchableOpacity
                        key={eq.key}
                        onPress={() => toggleEquipment(eq.key as EquipmentType)}
                        style={[styles.optionCard, active && styles.optionCardActive]}
                        activeOpacity={0.8}
                      >
                        <View style={styles.optionTextCol}>
                          <Text style={[styles.optionTitle, active && styles.optionTitleActive]}>
                            {eq.title}
                          </Text>
                          <Text style={styles.optionSub}>{eq.sub}</Text>
                        </View>
                        <View style={[styles.checkCircle, active && styles.checkCircleActive]}>
                          {active && <Check size={12} color="#000000" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setStep(3)}
                    style={styles.nextBtnFlex}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.nextBtnText}>Next: Diet & Budget</Text>
                    <ArrowRight size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 3: Diet & Budget */}
            {step === 3 && (
              <View style={styles.stepBox}>
                <Text style={styles.stepTitle}>Diet & Kirana Budget</Text>
                <Text style={styles.stepDesc}>
                  Our optimizer will create meal combinations within your grocery spend limit.
                </Text>

                <View style={styles.subSection}>
                  <Text style={styles.inputLabel}>Dietary Preference</Text>
                  <View style={styles.dietGrid}>
                    {[
                      { key: 'veg', label: 'Pure Veg' },
                      { key: 'jain', label: 'Jain' },
                      { key: 'eggetarian', label: 'Eggetarian' },
                      { key: 'non_veg', label: 'Non-Veg' },
                    ].map((d) => (
                      <TouchableOpacity
                        key={d.key}
                        onPress={() => setDiet(d.key as DietaryType)}
                        style={[styles.dietCard, diet === d.key && styles.dietCardActive]}
                      >
                        <Text style={[styles.dietCardText, diet === d.key && styles.dietCardTextActive]}>
                          {d.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.subSection}>
                  <Text style={styles.inputLabel}>Weekly Kirana Grocery Budget</Text>
                  <View style={styles.budgetRow}>
                    {[
                      { val: 700, label: '₹700 / wk' },
                      { val: 1000, label: '₹1,000 / wk' },
                      { val: 1400, label: '₹1,400 / wk' },
                      { val: 2000, label: '₹2,000 / wk' },
                    ].map((b) => (
                      <TouchableOpacity
                        key={b.val}
                        onPress={() => setBudget(b.val)}
                        style={[styles.budgetBtn, budget === b.val && styles.budgetBtnActive]}
                      >
                        <Text style={[styles.budgetBtnText, budget === b.val && styles.budgetBtnTextActive]}>
                          {b.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity onPress={() => setStep(2)} style={styles.backBtn}>
                    <Text style={styles.backBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFinish}
                    style={styles.finishBtnFlex}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.finishBtnText}>Launch Free Plan</Text>
                    <Check size={16} color="#FFFFFF" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 36,
  },
  stepBox: {
    gap: 16,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  citySection: {
    gap: 8,
  },
  pillRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cityPillActive: {
    backgroundColor: Colors.cyanLight,
    borderColor: Colors.cyan,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  cityTextActive: {
    color: Colors.cyan,
    fontWeight: '700',
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
  },
  optionCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  optionTextCol: {
    flex: 1,
    gap: 3,
    paddingRight: 10,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  optionTitleActive: {
    color: Colors.textPrimary,
  },
  optionSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  subSection: {
    gap: 8,
  },
  dietGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietCard: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dietCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  dietCardText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dietCardTextActive: {
    color: Colors.primary,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 6,
  },
  budgetBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  budgetBtnActive: {
    backgroundColor: Colors.amberLight,
    borderColor: Colors.amber,
  },
  budgetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  budgetBtnTextActive: {
    color: Colors.amber,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  nextBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  nextBtnFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  finishBtnFlex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  finishBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
