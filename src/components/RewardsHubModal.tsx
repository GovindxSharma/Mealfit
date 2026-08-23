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
  Medal,
  Users,
  MapPin,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface RewardsHubModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenCheatPlanner?: () => void;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  city: string;
  fitCoins: number;
  streakDays: number;
  tier: string;
  isCurrentUser?: boolean;
}

import { UnlockedPerkViewerModal, PerkType } from './UnlockedPerkViewerModal';

export const RewardsHubModal: React.FC<RewardsHubModalProps> = ({
  visible,
  onClose,
  onOpenCheatPlanner,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard'>('rewards');
  const [leaderboardScope, setLeaderboardScope] = useState<'all_india' | 'city'>('all_india');
  const [selectedPerkViewer, setSelectedPerkViewer] = useState<PerkType | null>(null);

  const [unlockedPerks, setUnlockedPerks] = useState<{ [key: string]: boolean }>({
    perk_cheat: true,
    perk_metabolic_dexa: true,
    perk_glucose_guard: false,
    perk_kirana_mandi: false,
    perk_micronutrient_boost: false,
    perk_clinical_pdf: false,
  });

  const fitCoins = 380;
  const currentStreakDays = 5;
  const userCity = user.city ? user.city.toUpperCase() : 'DELHI';

  const handleUnlockOrOpen = (perkId: string, title: string, cost: number, perkTypeKey?: PerkType) => {
    if (unlockedPerks[perkId]) {
      if (perkTypeKey) {
        setSelectedPerkViewer(perkTypeKey);
      }
      return;
    }

    if (fitCoins < cost) {
      Alert.alert('More FitCoins Needed', `You need ${cost} FitCoins to unlock "${title}". Keep logging your meals, water, and workouts to earn more!`);
      return;
    }

    setUnlockedPerks((prev) => ({ ...prev, [perkId]: true }));
    Alert.alert('Perk Unlocked!', `You have unlocked "${title}". Tap "Open Feature" anytime to access it.`, [
      {
        text: 'Open Now',
        onPress: () => {
          if (perkTypeKey) setSelectedPerkViewer(perkTypeKey);
        },
      },
      { text: 'Later', style: 'cancel' },
    ]);
  };

  const LEADERBOARD_USERS: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'Aarav Sharma',
      city: 'DELHI',
      fitCoins: 1420,
      streakDays: 28,
      tier: 'Diamond Warrior',
    },
    {
      rank: 2,
      name: 'Priya Patel',
      city: 'MUMBAI',
      fitCoins: 1280,
      streakDays: 21,
      tier: 'Gold Champion',
    },
    {
      rank: 3,
      name: 'Rohan Mehta',
      city: 'BENGALURU',
      fitCoins: 1150,
      streakDays: 18,
      tier: 'Gold Champion',
    },
    {
      rank: 4,
      name: 'Ananya Roy',
      city: 'KOLKATA',
      fitCoins: 980,
      streakDays: 14,
      tier: 'Silver Warrior',
    },
    {
      rank: 5,
      name: 'Vikram Singhania',
      city: 'JAIPUR',
      fitCoins: 840,
      streakDays: 12,
      tier: 'Silver Warrior',
    },
    {
      rank: 6,
      name: 'Sneha Kulkarni',
      city: 'PUNE',
      fitCoins: 760,
      streakDays: 10,
      tier: 'Silver Warrior',
    },
    {
      rank: 7,
      name: 'Manish Verma',
      city: 'LUCKNOW',
      fitCoins: 650,
      streakDays: 8,
      tier: 'Bronze Seeker',
    },
    {
      rank: 14,
      name: user.fullName || 'You (Govind Sharma)',
      city: userCity,
      fitCoins: fitCoins,
      streakDays: currentStreakDays,
      tier: 'Silver Warrior',
      isCurrentUser: true,
    },
  ];

  const filteredLeaderboard =
    leaderboardScope === 'city'
      ? LEADERBOARD_USERS.filter(
          (u) => u.city.toLowerCase() === userCity.toLowerCase() || u.isCurrentUser
        )
      : LEADERBOARD_USERS;

  const handleUnlockPerk = (perkId: string, title: string, cost: number) => {
    if (unlockedPerks[perkId]) {
      Alert.alert('Unlocked', `${title} is already active on your MealFit account.`);
      return;
    }
    setUnlockedPerks((prev) => ({ ...prev, [perkId]: true }));
    Alert.alert('Perk Unlocked', `You have unlocked "${title}".`);
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
              <View style={[styles.emblemBadge, { backgroundColor: theme.amberLight }]}>
                <Trophy size={20} color={theme.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  MealFit Rewards & Leaderboard
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  Discipline Points • All-India Rankings • VIP Perks
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Sub-tab bar */}
          <View style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('rewards')}
              style={[
                styles.tabItem,
                activeTab === 'rewards' && { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
            >
              <Award size={14} color={activeTab === 'rewards' ? theme.primary : theme.textMuted} />
              <Text style={[styles.tabText, { color: activeTab === 'rewards' ? theme.primary : theme.textSecondary }]}>
                Quests & Perks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('leaderboard')}
              style={[
                styles.tabItem,
                activeTab === 'leaderboard' && { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
            >
              <Users size={14} color={activeTab === 'leaderboard' ? theme.primary : theme.textMuted} />
              <Text style={[styles.tabText, { color: activeTab === 'leaderboard' ? theme.primary : theme.textSecondary }]}>
                Live Rankings (Top Warriors)
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {activeTab === 'rewards' ? (
              /* ================= 1. REWARDS & QUESTS TAB ================= */
              <>
                {/* FitCoins & Streak Hero Card */}
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
                      <Text style={styles.heroCoinBig}>{fitCoins} FitCoins</Text>
                    </View>
                    <View style={styles.streakBadge}>
                      <Flame size={16} color="#F59E0B" />
                      <Text style={styles.streakBadgeText}>{currentStreakDays}-Day Streak</Text>
                    </View>
                  </View>

                  <View style={styles.tierProgressRow}>
                    <View style={styles.tierTextBox}>
                      <Text style={styles.tierTitle}>Silver Indian Warrior Tier</Text>
                      <Text style={styles.tierSub}>120 FitCoins to Gold Champion</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '70%' }]} />
                    </View>
                  </View>
                </View>

                {/* Daily Habits to Earn FitCoins */}
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
                            {quest.reward}
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

                {/* Reward Shop & Unlockable Perks */}
                <View style={styles.section}>
                  <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
                    FitCoin Smart Rewards & Clinical Tools
                  </Text>

                  {[
                    {
                      id: 'perk_metabolic_dexa',
                      title: 'AI DEXA & Metabolic Adaptation Predictor',
                      desc: 'Estimates weekly visceral vs adipose fat loss & BMR retention.',
                      cost: 150,
                      perkType: 'perk_metabolic_dexa' as PerkType,
                    },
                    {
                      id: 'perk_glucose_guard',
                      title: 'Glycemic Load & Insulin Spike Sequencer',
                      desc: '3-step Indian food order that flattens post-meal glucose spikes by 42%.',
                      cost: 180,
                      perkType: 'perk_glucose_guard' as PerkType,
                    },
                    {
                      id: 'perk_kirana_mandi',
                      title: 'Wholesale Mandi Protein Arbitrage Guide',
                      desc: 'High-protein staples (Sattu, Soya, Peanuts) sourced under ₹45/day.',
                      cost: 220,
                      perkType: 'perk_kirana_mandi' as PerkType,
                    },
                    {
                      id: 'perk_micronutrient_boost',
                      title: 'Anti-Nutrient & Micronutrient Bioavailability Hacks',
                      desc: 'Triple iron absorption from Dal and amplify post-workout recovery.',
                      cost: 120,
                      perkType: 'perk_micronutrient_boost' as PerkType,
                    },
                    {
                      id: 'perk_cheat',
                      title: 'Smart Cheat Meal & Calorie Banking Simulator',
                      desc: 'Bank calories and offset party meals with zero fat spillover.',
                      cost: 100,
                      action: () => {
                        onClose();
                        if (onOpenCheatPlanner) onOpenCheatPlanner();
                      },
                    },
                    {
                      id: 'perk_clinical_pdf',
                      title: 'Clinical Transformation Report (Doctor / Dietitian PDF)',
                      desc: 'Exportable medical/dietetic progress report with ICMR RDA metrics.',
                      cost: 250,
                      perkType: 'perk_clinical_pdf' as PerkType,
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
                            onPress={() => {
                              if (perk.action) {
                                perk.action();
                              } else {
                                handleUnlockOrOpen(perk.id, perk.title, perk.cost, perk.perkType);
                              }
                            }}
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
                              {isUnlocked ? 'Open Feature' : `Unlock (${perk.cost} pts)`}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              /* ================= 2. LIVE LEADERBOARD & RANKINGS TAB ================= */
              <View style={styles.section}>
                {/* User Current Live Rank Card */}
                <View
                  style={[
                    styles.userRankCard,
                    {
                      backgroundColor: theme.primaryLight,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <View style={styles.userRankLeft}>
                    <View style={[styles.rankNumberBadge, { backgroundColor: theme.primary }]}>
                      <Text style={styles.rankNumberText}>#14</Text>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text style={[styles.userRankTitle, { color: theme.primary }]}>
                        Your National Standing
                      </Text>
                      <Text style={[styles.userRankSub, { color: theme.textSecondary }]}>
                        Top 3% of 2,420 Indian Discipline Warriors
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userRankRight}>
                    <Text style={[styles.userRankCoins, { color: theme.primary }]}>
                      {fitCoins} Coins
                    </Text>
                    <Text style={[styles.userRankStreak, { color: theme.amber }]}>
                      {currentStreakDays}-Day Streak
                    </Text>
                  </View>
                </View>

                {/* Scope Filter Switcher */}
                <View style={styles.scopeRow}>
                  <TouchableOpacity
                    onPress={() => setLeaderboardScope('all_india')}
                    style={[
                      styles.scopeBtn,
                      leaderboardScope === 'all_india'
                        ? { backgroundColor: theme.primary, borderColor: theme.primary }
                        : { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                    ]}
                  >
                    <Text
                      style={[
                        styles.scopeBtnText,
                        { color: leaderboardScope === 'all_india' ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      All-India Champions
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setLeaderboardScope('city')}
                    style={[
                      styles.scopeBtn,
                      leaderboardScope === 'city'
                        ? { backgroundColor: theme.primary, borderColor: theme.primary }
                        : { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                    ]}
                  >
                    <MapPin size={12} color={leaderboardScope === 'city' ? '#FFFFFF' : theme.textSecondary} />
                    <Text
                      style={[
                        styles.scopeBtnText,
                        { color: leaderboardScope === 'city' ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {userCity} Regional
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Leaderboard Table List */}
                <View style={styles.leaderboardList}>
                  {filteredLeaderboard.map((item) => (
                    <View
                      key={item.rank}
                      style={[
                        styles.leaderboardRow,
                        {
                          backgroundColor: item.isCurrentUser
                            ? theme.primaryLight
                            : theme.backgroundSecondary,
                          borderColor: item.isCurrentUser ? theme.primary : theme.cardBorder,
                        },
                      ]}
                    >
                      <View style={styles.rankCol}>
                        <View
                          style={[
                            styles.rankPill,
                            item.rank === 1
                              ? { backgroundColor: '#F59E0B' }
                              : item.rank === 2
                              ? { backgroundColor: '#94A3B8' }
                              : item.rank === 3
                              ? { backgroundColor: '#B45309' }
                              : { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.rankPillText,
                              { color: item.rank <= 3 ? '#FFFFFF' : theme.textSecondary },
                            ]}
                          >
                            #{item.rank}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flex: 1, gap: 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text
                            style={[
                              styles.leaderName,
                              {
                                color: item.isCurrentUser ? theme.primary : theme.textPrimary,
                                fontWeight: item.isCurrentUser ? '900' : '700',
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                          {item.rank <= 3 && (
                            <Medal size={13} color={item.rank === 1 ? '#F59E0B' : '#94A3B8'} />
                          )}
                        </View>
                        <Text style={[styles.leaderMeta, { color: theme.textMuted }]}>
                          {item.city} • {item.tier}
                        </Text>
                      </View>

                      <View style={styles.leaderScoreCol}>
                        <Text style={[styles.leaderCoins, { color: theme.primary }]}>
                          {item.fitCoins} pts
                        </Text>
                        <Text style={[styles.leaderStreak, { color: theme.amber }]}>
                          {item.streakDays}d streak
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Unlocked Smart Feature Viewer */}
      {selectedPerkViewer && (
        <UnlockedPerkViewerModal
          visible={!!selectedPerkViewer}
          onClose={() => setSelectedPerkViewer(null)}
          perkType={selectedPerkViewer}
        />
      )}
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
    fontSize: 16,
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
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginTop: 12,
    gap: 6,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  scrollContent: {
    paddingVertical: 14,
    gap: 14,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroKicker: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
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
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  streakBadgeText: {
    color: '#F59E0B',
    fontSize: 11.5,
    fontWeight: '800',
  },
  tierProgressRow: {
    gap: 6,
  },
  tierTextBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  tierSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10.5,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  section: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
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
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  questReward: {
    fontSize: 11,
    fontWeight: '800',
  },
  donePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  donePillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  perkCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  perkTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  perkDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  perkActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  perkActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  userRankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  userRankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rankNumberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rankNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  userRankTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  userRankSub: {
    fontSize: 10.5,
  },
  userRankRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  userRankCoins: {
    fontSize: 13,
    fontWeight: '900',
  },
  userRankStreak: {
    fontSize: 10,
    fontWeight: '800',
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scopeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  scopeBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  rankCol: {
    width: 32,
    alignItems: 'center',
  },
  rankPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rankPillText: {
    fontSize: 10.5,
    fontWeight: '900',
  },
  leaderName: {
    fontSize: 13,
  },
  leaderMeta: {
    fontSize: 10.5,
  },
  leaderScoreCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  leaderCoins: {
    fontSize: 12,
    fontWeight: '900',
  },
  leaderStreak: {
    fontSize: 10,
    fontWeight: '700',
  },
});
