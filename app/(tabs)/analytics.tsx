import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { AuthRequiredModal } from '../../src/components/AuthRequiredModal';
import { SmartCheatDayModal } from '../../src/components/SmartCheatDayModal';
import { RewardsHubModal } from '../../src/components/RewardsHubModal';
import { ActiveUsersMetricsModal } from '../../src/components/ActiveUsersMetricsModal';
import {
  TrendingUp,
  Award,
  Download,
  Flame,
  Wallet,
  Sparkles,
  Zap,
  Check,
  Lock,
  Calendar,
  Trophy,
  Scale,
  ChevronRight,
  Utensils,
  Users,
  Radio,
  Activity,
} from 'lucide-react-native';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const { user, isLoggedIn, isSuperAdmin } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const [showCheatModal, setShowCheatModal] = useState<boolean>(false);
  const [showRewardsModal, setShowRewardsModal] = useState<boolean>(false);
  const [showActiveUsersModal, setShowActiveUsersModal] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const topSafeDistance = Math.max(insets.top, Platform.OS === 'android' ? 28 : 20) + 12;

  const weeklyDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const habitStreak = [true, true, true, true, true, false, true];

  const handleExportPdf = () => {
    if (!isLoggedIn) {
      setShowAuthGate(true);
      return;
    }
    Alert.alert(
      'Export Progress Report',
      'Monthly MealFit Report generated: 4.2 kg weight progress, 94g avg protein/day, and ₹3,420 saved on Kirana groceries!'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingTop: topSafeDistance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Unauthenticated Cloud Sync Banner */}
        {!isLoggedIn && (
          <TouchableOpacity
            onPress={() => setShowAuthGate(true)}
            style={[styles.lockedBanner, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
            activeOpacity={0.85}
          >
            <View style={[styles.lockedIconCircle, { backgroundColor: theme.primary }]}>
              <Lock size={15} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.lockedBannerTitle, { color: theme.textPrimary }]}>
                Cloud Progression Sync Locked
              </Text>
              <Text style={[styles.lockedBannerDesc, { color: theme.textSecondary }]}>
                Sign in to your MealFit account to securely backup your weight progression and monthly savings reports.
              </Text>
            </View>
            <View style={[styles.unlockPill, { backgroundColor: theme.primary }]}>
              <Text style={styles.unlockPillText}>Sign In</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 1. Smart Cheat Day Countdown & Calorie Banking Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Flame size={18} color={theme.amber} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Smart Cheat Day Countdown</Text>
            </View>
            <View style={[styles.streakBadgeBox, { backgroundColor: theme.amberLight }]}>
              <Calendar size={12} color={theme.amber} />
              <Text style={[styles.streakBadge, { color: theme.amber }]}>In 3 Days</Text>
            </View>
          </View>

          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            Next Scheduled Cheat Meal: <Text style={{ fontWeight: '800', color: theme.textPrimary }}>Amritsari Chole Bhature (780 kcal)</Text>
          </Text>

          {/* Calorie Banking Meter */}
          <View style={[styles.bankingMeterCard, { backgroundColor: theme.backgroundSecondary }]}>
            <View style={styles.bankingMeterTop}>
              <Text style={[styles.bankingLabel, { color: theme.textSecondary }]}>Calorie Banking Progress</Text>
              <Text style={[styles.bankingValue, { color: theme.primary }]}>300 / 450 kcal Banked</Text>
            </View>
            <View style={styles.bankingBarBg}>
              <View style={[styles.bankingBarFill, { width: '67%', backgroundColor: theme.primary }]} />
            </View>
            <Text style={[styles.bankingSub, { color: theme.textMuted }]}>
              2 Days of clean Kirana eating left ➔ 0g Fat Spillover Target!
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowCheatModal(true)}
            style={[styles.recalibrateBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.recalibrateBtnText, { color: theme.primary }]}>Adjust Cheat Meal or Days Ahead</Text>
            <ChevronRight size={14} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* 2. FitCoins Reward & Streak Milestone Tracker */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Trophy size={18} color={theme.secondary} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Reward Milestones & FitCoins</Text>
            </View>
            <View style={[styles.streakBadgeBox, { backgroundColor: theme.secondaryLight }]}>
              <Text style={[styles.streakBadge, { color: theme.primary }]}>380 FitCoins</Text>
            </View>
          </View>

          <View style={[styles.rewardMilestoneBox, { backgroundColor: theme.backgroundSecondary }]}>
            <View style={styles.milestoneRow}>
              <View style={[styles.milestoneIcon, { backgroundColor: theme.primaryLight }]}>
                <Sparkles size={16} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.milestoneTitle, { color: theme.textPrimary }]}>
                  Next Reward: AI Transformation PDF
                </Text>
                <Text style={[styles.milestoneSub, { color: theme.textSecondary }]}>
                  Only 20 FitCoins away • Earn by logging today's dinner
                </Text>
              </View>
            </View>
            <View style={styles.bankingBarBg}>
              <View style={[styles.bankingBarFill, { width: '80%', backgroundColor: theme.secondary }]} />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowRewardsModal(true)}
            style={[styles.recalibrateBtn, { backgroundColor: theme.secondaryLight, borderColor: theme.primary }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.recalibrateBtnText, { color: theme.primary }]}>Open Rewards Hub & Unlock Perks</Text>
            <ChevronRight size={14} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* 3. Habit Streak & Adherence */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Award size={18} color={theme.amber} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>7-Day Adherence Streak</Text>
            </View>
            <View style={[styles.streakBadgeBox, { backgroundColor: theme.amberLight }]}>
              <Flame size={12} color={theme.amber} />
              <Text style={[styles.streakBadge, { color: theme.amber }]}>6 Days Active</Text>
            </View>
          </View>

          <View style={styles.streakRow}>
            {weeklyDays.map((day, idx) => {
              const isDone = habitStreak[idx];
              return (
                <View key={idx} style={styles.dayCol}>
                  <View
                    style={[
                      styles.dayCircle,
                      {
                        backgroundColor: isDone ? theme.primary : 'rgba(255, 255, 255, 0.04)',
                        borderColor: isDone ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    {isDone ? (
                      <Check size={12} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                    ) : (
                      <View style={[styles.missedDot, { backgroundColor: theme.textMuted }]} />
                    )}
                  </View>
                  <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 4. Kirana Grocery Wallet Savings Tracker */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Wallet size={18} color={theme.primary} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Kirana Wallet Savings</Text>
            </View>
            <View style={[styles.savingsBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.savingsBadgeText, { color: theme.primary }]}>₹3,420 Saved</Text>
            </View>
          </View>

          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            Money saved this month by cooking high-protein Indian meals vs ordering from outside or buying synthetic supplements.
          </Text>

          <View style={styles.savingsBreakdown}>
            <View style={[styles.savingItem, { backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: theme.cardBorder }]}>
              <Text style={[styles.savingLabel, { color: theme.textMuted }]}>Home Cooking vs Swiggy</Text>
              <Text style={[styles.savingAmount, { color: theme.primary }]}>+₹2,280</Text>
            </View>
            <View style={[styles.savingItem, { backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: theme.cardBorder }]}>
              <Text style={[styles.savingLabel, { color: theme.textMuted }]}>Soya & Sattu vs Whey</Text>
              <Text style={[styles.savingAmount, { color: theme.primary }]}>+₹1,140</Text>
            </View>
          </View>
        </View>

        {/* 5. Weight Moving Average Trend & Goal Recalibrator */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Scale size={18} color={theme.cyan} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Weight Target & Speed</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCheatModal(true)}
              style={[styles.smallRecalibratePill, { backgroundColor: theme.primaryLight }]}
            >
              <Text style={[styles.smallRecalibrateText, { color: theme.primary }]}>Change Goal</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            Current: {user.weightKg || 70} kg ➔ Target: {user.targetWeightKg || 65} kg ({user.goalType === 'muscle_gain' ? 'Muscle Hypertrophy' : 'Fat Loss'})
          </Text>

          <View style={styles.projectionGrid}>
            <View style={[styles.projectionBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
              <Text style={[styles.projValue, { color: theme.textPrimary }]}>{user.weightKg || 70} kg</Text>
              <Text style={[styles.projLabel, { color: theme.textMuted }]}>Current Weight</Text>
            </View>
            <View style={[styles.projArrowCol]}>
              <Text style={[styles.projArrowText, { color: theme.primary }]}>➔</Text>
            </View>
            <View style={[styles.projectionBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <Text style={[styles.projValue, { color: theme.primary }]}>{user.targetWeightKg || 65} kg</Text>
              <Text style={[styles.projLabel, { color: theme.primary }]}>Goal Target</Text>
            </View>
          </View>

          <View style={[styles.projectionEstimateBanner, { backgroundColor: theme.isDark ? '#1E293B' : '#F1F5F9' }]}>
            <Zap size={14} color={theme.primary} />
            <Text style={[styles.estimateBannerText, { color: theme.textPrimary }]}>
              Estimated completion in <Text style={{ color: theme.primary, fontWeight: '900' }}>{user.estimatedWeeksToGoal || 8} weeks</Text> with consistent Kirana meal logging!
            </Text>
          </View>
        </View>

        {/* 6. Super Admin & Platform Active Users Telemetry - ONLY visible to Super Admin */}
        {isSuperAdmin && (
          <TouchableOpacity
            onPress={() => setShowActiveUsersModal(true)}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: '#10B981',
                borderWidth: 1.5,
              },
            ]}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <View style={styles.headerTitleRow}>
                <View style={[styles.activeLiveBadge, { backgroundColor: '#ECFDF5' }]}>
                  <View style={styles.activeLiveDot} />
                  <Text style={styles.activeLiveBadgeText}>LIVE TELEMETRY</Text>
                </View>
                <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Total & Active Users</Text>
              </View>
              <ChevronRight size={18} color={theme.textMuted} />
            </View>

            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Real-time telemetry showing total registered accounts, today's active members, retention rate, and live user directory.
            </Text>

            <View style={styles.telemetryQuickRow}>
              <View style={[styles.telemetryQuickBox, { backgroundColor: theme.backgroundSecondary }]}>
                <Users size={14} color={theme.primary} />
                <Text style={[styles.telemetryQuickLabel, { color: theme.textMuted }]}>Registered Users</Text>
                <Text style={[styles.telemetryQuickVal, { color: theme.textPrimary }]}>Live in DB</Text>
              </View>
              <View style={[styles.telemetryQuickBox, { backgroundColor: '#ECFDF5' }]}>
                <Activity size={14} color="#059669" />
                <Text style={[styles.telemetryQuickLabel, { color: '#059669' }]}>Active Today</Text>
                <Text style={[styles.telemetryQuickVal, { color: '#059669' }]}>Tap to Inspect</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* 7. Export Monthly PDF Report */}
        <TouchableOpacity
          onPress={handleExportPdf}
          style={[styles.exportBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          activeOpacity={0.8}
        >
          <Download size={16} color={theme.textPrimary} />
          <Text style={[styles.exportBtnText, { color: theme.textPrimary }]}>Export Monthly Progress PDF</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <AuthRequiredModal
        visible={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Sync Cloud Analytics"
        subtitle="Sign in to your MealFit account to unlock 30-day weight progression curves and PDF export reports."
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

      <ActiveUsersMetricsModal
        visible={showActiveUsersModal}
        onClose={() => setShowActiveUsersModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginBottom: 6,
  },
  lockedIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  lockedBannerDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  unlockPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unlockPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  contentContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 48,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  streakBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  streakBadge: {
    fontSize: 11,
    fontWeight: '800',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savingsBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  savingsBreakdown: {
    gap: 8,
  },
  savingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  savingLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  savingAmount: {
    fontSize: 12,
    fontWeight: '800',
  },
  weightChangeText: {
    fontSize: 14,
    fontWeight: '900',
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
    gap: 8,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barWeightText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  barTrack: {
    width: 14,
    height: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  projectionPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  projectionPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  projectionGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },
  projectionBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  projValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  projLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  projArrowCol: {
    paddingHorizontal: 4,
  },
  projArrowText: {
    fontSize: 18,
    fontWeight: '900',
  },
  projectionEstimateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  estimateBannerText: {
    fontSize: 11.5,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  bankingMeterCard: {
    padding: 12,
    borderRadius: 14,
    gap: 6,
  },
  bankingMeterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankingLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  bankingValue: {
    fontSize: 12,
    fontWeight: '900',
  },
  bankingBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  bankingBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  bankingSub: {
    fontSize: 10,
    marginTop: 2,
  },
  recalibrateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  recalibrateBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  rewardMilestoneBox: {
    padding: 12,
    borderRadius: 14,
    gap: 10,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  milestoneIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  milestoneSub: {
    fontSize: 10.5,
    marginTop: 1,
  },
  smallRecalibratePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  smallRecalibrateText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  activeLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activeLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeLiveBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.4,
  },
  telemetryQuickRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  telemetryQuickBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    gap: 2,
  },
  telemetryQuickLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  telemetryQuickVal: {
    fontSize: 12,
    fontWeight: '800',
  },
});
