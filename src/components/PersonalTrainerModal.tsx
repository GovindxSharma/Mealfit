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
import { useAuth, GoalType } from '../context/AuthContext';
import {
  Bot,
  X,
  Target,
  Dumbbell,
  Flame,
  Check,
  TrendingDown,
  TrendingUp,
  Activity,
  HeartPulse,
  Scale,
  Zap,
} from 'lucide-react-native';

interface PersonalTrainerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PersonalTrainerModal: React.FC<PersonalTrainerModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { user, setGoal } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<GoalType>(user.goalType || 'fat_loss');
  const [targetWeight, setTargetWeight] = useState<string>(
    user.targetWeightKg ? String(user.targetWeightKg) : '68'
  );

  const goalOptions: {
    key: GoalType;
    title: string;
    sub: string;
    deficitText: string;
    proteinRate: string;
    icon: any;
  }[] = [
    {
      key: 'fat_loss',
      title: 'Fat Loss & Inch Loss',
      sub: 'Burn stubborn belly fat while protecting lean muscle with high-satiety Indian staples.',
      deficitText: '-450 kcal / day safe deficit',
      proteinRate: '1.8g / kg target',
      icon: TrendingDown,
    },
    {
      key: 'muscle_gain',
      title: 'Lean Muscle & Strength',
      sub: 'Build muscle with controlled surplus and living room dumbbell / bodyweight progressive overload.',
      deficitText: '+300 kcal / day clean surplus',
      proteinRate: '2.0g / kg target',
      icon: TrendingUp,
    },
    {
      key: 'recomp',
      title: 'Body Recomposition',
      sub: 'Simultaneously trim fat and tone muscle at maintenance energy balance.',
      deficitText: '-150 kcal / day slight deficit',
      proteinRate: '2.0g / kg target',
      icon: Activity,
    },
    {
      key: 'low_gi_pcod',
      title: 'Low GI & PCOD Control',
      sub: 'Stabilize insulin spikes and reduce visceral inflammation with low GI Indian complex carbs.',
      deficitText: '-350 kcal / day (High fat, low GI)',
      proteinRate: '1.8g / kg target',
      icon: HeartPulse,
    },
  ];

  const currentWeightNum = user.weightKg || 72;
  const targetWeightNum = parseFloat(targetWeight) || 68;
  const diffKg = Math.abs(currentWeightNum - targetWeightNum);
  const estimatedWeeks = Math.max(4, Math.round(diffKg / 0.5));

  const handleApply = () => {
    setGoal(selectedGoal, targetWeightNum);
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
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Bot size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>AI Personal Trainer</Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>Calibrate realistic goals & timeline</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. Target Weight Input */}
            <View style={[styles.weightInputCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
              <View style={styles.weightInputHeader}>
                <Scale size={16} color={theme.primary} />
                <Text style={[styles.weightInputTitle, { color: theme.textPrimary }]}>Target Body Weight</Text>
              </View>

              <View style={styles.weightRow}>
                <View>
                  <Text style={[styles.currentWeightLbl, { color: theme.textMuted }]}>Current Weight</Text>
                  <Text style={[styles.currentWeightBig, { color: theme.textPrimary }]}>{user.weightKg} kg</Text>
                </View>

                <View style={styles.targetCol}>
                  <Text style={[styles.targetWeightLbl, { color: theme.primary }]}>Target Goal</Text>
                  <View style={[styles.targetInputBox, { backgroundColor: theme.card, borderColor: theme.primary }]}>
                    <TextInput
                      value={targetWeight}
                      onChangeText={setTargetWeight}
                      keyboardType="numeric"
                      style={[styles.targetInput, { color: theme.textPrimary }]}
                    />
                    <Text style={[styles.kgUnitText, { color: theme.textSecondary }]}>kg</Text>
                  </View>
                </View>
              </View>

              <View style={styles.rateBadge}>
                <Zap size={13} color={theme.amber} />
                <Text style={[styles.rateBadgeText, { color: theme.amber }]}>
                  Realistic pace: 0.5 kg / week &rarr; ~{estimatedWeeks} Weeks to Goal
                </Text>
              </View>
            </View>

            {/* 2. Goal Options */}
            <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>SELECT YOUR PRIMARY GOAL</Text>

            <View style={styles.goalsList}>
              {goalOptions.map((opt) => {
                const isSelected = selectedGoal === opt.key;
                const IconComp = opt.icon;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setSelectedGoal(opt.key)}
                    style={[
                      styles.goalCard,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : 'rgba(255, 255, 255, 0.02)',
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.goalTop}>
                      <View style={styles.goalTitleRow}>
                        <View style={[styles.goalIconBox, { backgroundColor: isSelected ? theme.primary : 'rgba(255, 255, 255, 0.06)' }]}>
                          <IconComp size={16} color={isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary} />
                        </View>
                        <Text style={[styles.goalTitle, { color: theme.textPrimary }]}>{opt.title}</Text>
                      </View>
                      <View style={[styles.checkbox, { borderColor: isSelected ? theme.primary : theme.textMuted, backgroundColor: isSelected ? theme.primary : 'transparent' }]}>
                        {isSelected && <Check size={12} color={theme.isDark ? '#000000' : '#FFFFFF'} />}
                      </View>
                    </View>

                    <Text style={[styles.goalSub, { color: theme.textSecondary }]}>{opt.sub}</Text>

                    <View style={styles.goalMetaRow}>
                      <View style={[styles.metaPill, { backgroundColor: theme.amberLight }]}>
                        <Text style={[styles.metaPillText, { color: theme.amber }]}>{opt.deficitText}</Text>
                      </View>
                      <View style={[styles.metaPill, { backgroundColor: theme.cyanLight }]}>
                        <Text style={[styles.metaPillText, { color: theme.cyan }]}>{opt.proteinRate}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              onPress={handleApply}
              style={[styles.applyBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.applyBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                Apply & Recalibrate Plan
              </Text>
            </TouchableOpacity>
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
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 14,
    paddingBottom: 40,
  },
  weightInputCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  weightInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weightInputTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  weightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentWeightLbl: {
    fontSize: 10,
    fontWeight: '700',
  },
  currentWeightBig: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  targetCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  targetWeightLbl: {
    fontSize: 10,
    fontWeight: '800',
  },
  targetInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  targetInput: {
    fontSize: 18,
    fontWeight: '900',
    minWidth: 40,
    textAlign: 'center',
    padding: 0,
  },
  kgUnitText: {
    fontSize: 12,
    fontWeight: '700',
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  rateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  goalsList: {
    gap: 10,
  },
  goalCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 8,
  },
  goalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalSub: {
    fontSize: 11,
    lineHeight: 15,
  },
  goalMetaRow: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 2,
  },
  metaPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  applyBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
