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
} from 'lucide-react-native';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
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
                Sign in with Google or Email to securely backup your weight progression and monthly savings reports.
              </Text>
            </View>
            <View style={[styles.unlockPill, { backgroundColor: theme.primary }]}>
              <Text style={styles.unlockPillText}>Sign In</Text>
            </View>
          </TouchableOpacity>
        )}
        {/* 1. Habit Streak & Adherence */}
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

        {/* 2. Kirana Grocery Wallet Savings Tracker */}
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

        {/* 3. Weight Moving Average Trend */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <TrendingUp size={18} color={theme.cyan} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>6-Week Weight Trend</Text>
            </View>
            <Text style={[styles.weightChangeText, { color: theme.primary }]}>-3.8 kg</Text>
          </View>

          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            7-day moving average eliminates sodium & water weight fluctuations.
          </Text>

          {/* Simple Clean Bar Chart Progression */}
          <View style={styles.chartBarsRow}>
            {[
              { week: 'W1', weight: 72.0, height: 70 },
              { week: 'W2', weight: 71.4, height: 65 },
              { week: 'W3', weight: 70.8, height: 58 },
              { week: 'W4', weight: 70.1, height: 50 },
              { week: 'W5', weight: 69.4, height: 42 },
              { week: 'W6', weight: 68.2, height: 32 },
            ].map((item, idx) => (
              <View key={idx} style={styles.barCol}>
                <Text style={[styles.barWeightText, { color: theme.textSecondary }]}>{item.weight}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${item.height}%`,
                        backgroundColor: idx === 5 ? theme.primary : theme.primaryLight,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: idx === 5 ? theme.primary : theme.textMuted }]}>
                  {item.week}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 4. AI Body Transformation Projection Engine */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleRow}>
              <Sparkles size={18} color={theme.amber} />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Target Projection Timeline</Text>
            </View>
            <View style={[styles.projectionPill, { backgroundColor: theme.amberLight }]}>
              <Text style={[styles.projectionPillText, { color: theme.amber }]}>ICMR Safe Pace</Text>
            </View>
          </View>

          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            Based on your {user.goalType === 'muscle_gain' ? 'caloric surplus' : 'daily 300-500 kcal deficit'} & Indian protein split.
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
              Estimated completion in <Text style={{ color: theme.primary, fontWeight: '900' }}>{Math.max(4, Math.round(Math.abs((user.weightKg || 70) - (user.targetWeightKg || 65)) / 0.45))} weeks</Text> with consistent Kirana meal logging!
            </Text>
          </View>
        </View>

        {/* 4. Export Monthly PDF Report */}
        <TouchableOpacity
          onPress={handleExportPdf}
          style={[styles.exportBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          activeOpacity={0.8}
        >
          <Download size={16} color={theme.textPrimary} />
          <Text style={[styles.exportBtnText, { color: theme.textPrimary }]}>Export Monthly Progress PDF</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Auth Gate Modal */}
      <AuthRequiredModal
        visible={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Sync Cloud Analytics"
        subtitle="Sign in with Google or Email to unlock 30-day weight progression curves and PDF export reports."
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
});
