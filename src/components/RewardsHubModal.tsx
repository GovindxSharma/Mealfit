import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Sparkles,
  Trophy,
  Flame,
  Award,
  ShieldCheck,
  Check,
  Zap,
  Gift,
  Target,
  Dumbbell,
  Droplets,
  Utensils,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface RewardsHubModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenCheatPlanner?: () => void;
}

export const RewardsHubModal: React.FC<RewardsHubModalProps> = ({
  visible,
  onClose,
  onOpenCheatPlanner,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [unlockedPerks, setUnlockedPerks] = useState<{ [key: string]: boolean }>({
    perk_cheat: true,
    perk_pdf: false,
    perk_kirana: false,
  });

  const fitCoins = 380; // Computed reward balance
  const currentStreakDays = 5;

  const handleUnlockPerk = (perkId: string, title: string, cost: number) => {
    if (unlockedPerks[perkId]) {
      Alert.alert('Unlocked', `${title} is already active on your MealFit account!`);
      return;
    }
    setUnlockedPerks((prev) => ({ ...prev, [perkId]: true }));
    Alert.alert('🎉 Perk Unlocked!', `You have unlocked "${title}"!`);
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
              <View style={[styles.emblemBadge, { backgroundColor: theme.amberLight }]}>
                <Trophy size={20} color={theme.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  MealFit Rewards & FitCoins
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  Daily Discipline Rewards • Streak Badges • VIP Perks
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. FitCoins & Streak Hero Card */}
            <View
              style={[
                styles.heroCard,
                {
                  backgroundColor: theme.primary,
                  shadowColor: theme.primary,
                },
              ]}
            >
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroKicker}>AVAILABLE REWARD BALANCE</Text>
                  <Text style={styles.heroCoinBig}>🪙 {fitCoins} FitCoins</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Flame size={16} color="#F59E0B" />
                  <Text style={styles.streakBadgeText}>{currentStreakDays}-Day Streak</Text>
                </View>
              </View>

              <View style={styles.tierProgressRow}>
                <View style={styles.tierTextBox}>
                  <Text style={styles.tierTitle}>🥈 Silver Indian Warrior Tier</Text>
                  <Text style={styles.tierSub}>120 FitCoins to 🥇 Gold Champion</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '70%' }]} />
                </View>
              </View>
            </View>

            {/* 2. Daily Habits to Earn FitCoins */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                Today's FitCoin Quests
              </Text>

              {[
                {
                  id: 'q_protein',
                  icon: Utensils,
                  title: 'Hit 100% Daily Protein Target',
                  reward: '+50 Coins',
                  done: true,
                },
                {
                  id: 'q_workout',
                  icon: Dumbbell,
                  title: 'Complete 4-Phase Living Room Workout',
                  reward: '+40 Coins',
                  done: true,
                },
                {
                  id: 'q_water',
                  icon: Droplets,
                  title: 'Log 8 Glasses of Water',
                  reward: '+25 Coins',
                  done: false,
                },
                {
                  id: 'q_cheat_bank',
                  icon: Flame,
                  title: 'Bank 150 kcal for Upcoming Cheat Day',
                  reward: '+35 Coins',
                  done: false,
                },
              ].map((quest) => {
                const IconComponent = quest.icon;
                return (
                  <View
                    key={quest.id}
                    style={[
                      styles.questCard,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: quest.done ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.questIconBox,
                        {
                          backgroundColor: quest.done ? theme.primaryLight : theme.card,
                        },
                      ]}
                    >
                      <IconComponent
                        size={18}
                        color={quest.done ? theme.primary : theme.textSecondary}
                      />
                    </View>

                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.questTitle, { color: theme.textPrimary }]}>
                        {quest.title}
                      </Text>
                      <Text style={[styles.questReward, { color: theme.amber }]}>
                        🪙 {quest.reward}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.donePill,
                        {
                          backgroundColor: quest.done ? theme.primary : theme.card,
                          borderColor: quest.done ? theme.primary : theme.cardBorder,
                        },
                      ]}
                    >
                      {quest.done ? (
                        <Check size={13} color="#FFFFFF" />
                      ) : (
                        <Text style={[styles.donePillText, { color: theme.textMuted }]}>In Progress</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* 3. Reward Shop & Unlockable Perks */}
            <View style={styles.section}>
              <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                FitCoin Rewards Shop
              </Text>

              {[
                {
                  id: 'perk_cheat',
                  title: 'Smart Cheat Meal & Calorie Banking Simulator',
                  desc: 'Bank calories and offset party meals with zero fat gain.',
                  cost: 100,
                  action: () => {
                    onClose();
                    if (onOpenCheatPlanner) onOpenCheatPlanner();
                  },
                },
                {
                  id: 'perk_pdf',
                  title: 'AI Body Transformation Projection Report (PDF)',
                  desc: 'Generate exportable clinical progress graphs and timelines.',
                  cost: 200,
                  action: () => handleUnlockPerk('perk_pdf', 'AI Transformation Report', 200),
                },
                {
                  id: 'perk_kirana',
                  title: 'Ultra-Kirana High-Protein Secret Wholesale Guide',
                  desc: 'Buy Sattu, Soya and Peanuts at wholesale Indian mandi prices.',
                  cost: 250,
                  action: () => handleUnlockPerk('perk_kirana', 'Wholesale Kirana Guide', 250),
                },
              ].map((perk) => {
                const isUnlocked = unlockedPerks[perk.id];
                return (
                  <View
                    key={perk.id}
                    style={[
                      styles.perkCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: isUnlocked ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    <View style={styles.perkTopRow}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={[styles.perkTitle, { color: theme.textPrimary }]}>
                          {perk.title}
                        </Text>
                        <Text style={[styles.perkDesc, { color: theme.textSecondary }]}>
                          {perk.desc}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={perk.action}
                        style={[
                          styles.perkActionBtn,
                          {
                            backgroundColor: isUnlocked ? theme.primaryLight : theme.primary,
                          },
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.perkActionText,
                            { color: isUnlocked ? theme.primary : '#FFFFFF' },
                          ]}
                        >
                          {isUnlocked ? 'Open Perk' : `Unlock (🪙 ${perk.cost})`}
                        </Text>
                      </TouchableOpacity>
                    </View>
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
    gap: 18,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroCoinBig: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  streakBadgeText: {
    color: '#0F172A',
    fontSize: 11.5,
    fontWeight: '800',
  },
  tierProgressRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  tierTextBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierTitle: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  tierSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 2,
  },
  section: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  questIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  questReward: {
    fontSize: 11,
    fontWeight: '800',
  },
  donePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  perkCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  perkTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  perkDesc: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  perkActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  perkActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
