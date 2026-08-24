import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MobileApiService } from '../services/api';
import {
  Users,
  Radio,
  Activity,
  Crown,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Search,
  X,
  Sparkles,
  User,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  Flame,
  CheckCircle,
} from 'lucide-react-native';

interface ActiveUsersMetricsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ActiveUsersMetricsModal: React.FC<ActiveUsersMetricsModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { isSuperAdmin } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<{
    totalUsers: number;
    activeToday: number;
    activeNow: number;
    activeThisWeek: number;
    newToday: number;
    activePercentage: number;
    roleCounts: {
      super_admin: number;
      admin: number;
      user: number;
    };
    users: any[];
  }>({
    totalUsers: 0,
    activeToday: 0,
    activeNow: 0,
    activeThisWeek: 0,
    newToday: 0,
    activePercentage: 0,
    roleCounts: { super_admin: 0, admin: 0, user: 0 },
    users: [],
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active_today' | 'admin' | 'super_admin'>('all');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await MobileApiService.getAdminUsers();
      if (res) {
        setMetrics({
          totalUsers: res.totalUsers || 0,
          activeToday: res.activeToday || 0,
          activeNow: res.activeNow || 0,
          activeThisWeek: res.activeThisWeek || 0,
          newToday: res.newToday || 0,
          activePercentage: res.activePercentage || 0,
          roleCounts: res.roleCounts || { super_admin: 0, admin: 0, user: 0 },
          users: res.users || [],
        });
      }
    } catch (err: any) {
      console.warn('[ActiveUsersModal] Failed to load metrics:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchMetrics();
    }
  }, [visible]);

  const handleRoleChange = async (userId: string, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return;
    try {
      await MobileApiService.updateUserRole(userId, newRole);
      Alert.alert('Role Updated', `User role successfully changed to ${newRole}.`);
      fetchMetrics();
    } catch (err: any) {
      Alert.alert('Role Update Failed', err?.message || 'Unable to update user role');
    }
  };

  const filteredUsers = (metrics.users || []).filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (u.fullName || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.city || '').toLowerCase().includes(query);

    let matchesFilter = true;
    if (activeFilter === 'active_today') {
      matchesFilter = u.isActiveToday || u.activityStatus === 'active_now' || u.activityStatus === 'active_today';
    } else if (activeFilter === 'admin') {
      matchesFilter = u.role === 'admin';
    } else if (activeFilter === 'super_admin') {
      matchesFilter = u.role === 'super_admin';
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Radio size={20} color={theme.primary} />
              </View>
              <View>
                <View style={styles.livePulseRow}>
                  <View style={styles.livePulseDot} />
                  <Text style={[styles.livePulseText, { color: theme.primary }]}>LIVE TELEMETRY</Text>
                </View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Total & Active Users</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                onPress={fetchMetrics}
                style={[styles.refreshBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}
                activeOpacity={0.7}
              >
                <RefreshCw size={14} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <X size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* ━━━ PRIMARY KPI STATS GRID ━━━ */}
            <View style={styles.kpiGrid}>
              {/* 1. Total Registered */}
              <View style={[styles.kpiCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
                <View style={styles.kpiTopRow}>
                  <Users size={16} color={theme.primary} />
                  <View style={[styles.kpiBadge, { backgroundColor: theme.primaryLight }]}>
                    <Text style={[styles.kpiBadgeText, { color: theme.primary }]}>MongoDB Cloud</Text>
                  </View>
                </View>
                <Text style={[styles.kpiNumber, { color: theme.textPrimary }]}>{metrics.totalUsers}</Text>
                <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>Total Registered Users</Text>
              </View>

              {/* 2. Active Today */}
              <View style={[styles.kpiCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
                <View style={styles.kpiTopRow}>
                  <Activity size={16} color="#10B981" />
                  <View style={[styles.kpiBadge, { backgroundColor: '#ECFDF5' }]}>
                    <Text style={[styles.kpiBadgeText, { color: '#059669' }]}>Last 24h</Text>
                  </View>
                </View>
                <Text style={[styles.kpiNumber, { color: '#10B981' }]}>{metrics.activeToday}</Text>
                <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>Active Today ({metrics.activePercentage}%)</Text>
              </View>

              {/* 3. Active Right Now */}
              <View style={[styles.kpiCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
                <View style={styles.kpiTopRow}>
                  <Zap size={16} color="#F59E0B" />
                  <View style={[styles.kpiBadge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.kpiBadgeText, { color: '#D97706' }]}>Live Pulse</Text>
                  </View>
                </View>
                <Text style={[styles.kpiNumber, { color: '#F59E0B' }]}>{metrics.activeNow || metrics.activeToday}</Text>
                <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>Active in Last 30m</Text>
              </View>

              {/* 4. Active This Week */}
              <View style={[styles.kpiCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
                <View style={styles.kpiTopRow}>
                  <TrendingUp size={16} color="#6366F1" />
                  <View style={[styles.kpiBadge, { backgroundColor: '#EEF2FF' }]}>
                    <Text style={[styles.kpiBadgeText, { color: '#4F46E5' }]}>7-Day Retention</Text>
                  </View>
                </View>
                <Text style={[styles.kpiNumber, { color: '#6366F1' }]}>{metrics.activeThisWeek || metrics.totalUsers}</Text>
                <Text style={[styles.kpiLabel, { color: theme.textSecondary }]}>Active This Week</Text>
              </View>
            </View>

            {/* ━━━ ENGAGEMENT PROGRESS BAR ━━━ */}
            <View style={[styles.engagementCard, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
              <View style={styles.engagementHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Flame size={16} color={theme.amber} />
                  <Text style={[styles.engagementTitle, { color: theme.textPrimary }]}>Platform Activity Rate</Text>
                </View>
                <Text style={[styles.engagementPercent, { color: theme.primary }]}>
                  {metrics.activePercentage}% Active
                </Text>
              </View>

              <View style={[styles.progressBarTrack, { backgroundColor: theme.cardBorder }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.max(8, Math.min(100, metrics.activePercentage || 65))}%`,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.roleSummaryRow}>
                <View style={styles.roleSummaryItem}>
                  <Text style={[styles.roleSummaryCount, { color: '#D97706' }]}>
                    👑 {metrics.roleCounts?.super_admin || 1}
                  </Text>
                  <Text style={[styles.roleSummaryLabel, { color: theme.textMuted }]}>Super Admins</Text>
                </View>
                <View style={styles.roleSummaryItem}>
                  <Text style={[styles.roleSummaryCount, { color: '#6366F1' }]}>
                    🛡️ {metrics.roleCounts?.admin || 0}
                  </Text>
                  <Text style={[styles.roleSummaryLabel, { color: theme.textMuted }]}>Testers / Admins</Text>
                </View>
                <View style={styles.roleSummaryItem}>
                  <Text style={[styles.roleSummaryCount, { color: theme.primary }]}>
                    👤 {metrics.roleCounts?.user || metrics.totalUsers}
                  </Text>
                  <Text style={[styles.roleSummaryLabel, { color: theme.textMuted }]}>Standard Users</Text>
                </View>
              </View>
            </View>

            {/* ━━━ SEARCH & FILTER STRIP ━━━ */}
            <View style={[styles.searchBox, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
              <Search size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: theme.textPrimary }]}
                placeholder="Search by name, email, or city..."
                placeholderTextColor={theme.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={theme.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter Pills */}
            <View style={styles.filterPillRow}>
              {[
                { id: 'all', label: `All Users (${metrics.totalUsers})` },
                { id: 'active_today', label: `Active Today (${metrics.activeToday})` },
                { id: 'admin', label: `Testers & Admins (${metrics.roleCounts?.admin || 0})` },
                { id: 'super_admin', label: `Super Admins (${metrics.roleCounts?.super_admin || 0})` },
              ].map((item) => {
                const isActive = activeFilter === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setActiveFilter(item.id as any)}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: isActive ? theme.primary : theme.backgroundSecondary,
                        borderColor: isActive ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        {
                          color: isActive ? '#FFFFFF' : theme.textSecondary,
                          fontWeight: isActive ? '800' : '600',
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ━━━ USER DIRECTORY & LIVE ACTIVITY LIST ━━━ */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading live users from Atlas MongoDB...</Text>
              </View>
            ) : filteredUsers.length === 0 ? (
              <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundSecondary }]}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>No users found for this filter.</Text>
              </View>
            ) : (
              <View style={styles.usersList}>
                {filteredUsers.map((u) => {
                  const isSuper = u.role === 'super_admin';
                  const isAdmin = u.role === 'admin';
                  const isLiveNow = u.activityStatus === 'active_now';
                  const isLiveToday = u.activityStatus === 'active_today' || u.isActiveToday;

                  return (
                    <View
                      key={u.id || u._id}
                      style={[
                        styles.userItemCard,
                        {
                          backgroundColor: theme.card,
                          borderColor: isLiveNow ? '#10B981' : theme.cardBorder,
                        },
                      ]}
                    >
                      <View style={styles.userTopRow}>
                        <View style={styles.userAvatarRow}>
                          <View
                            style={[
                              styles.userAvatar,
                              {
                                backgroundColor: isSuper
                                  ? '#FEF3C7'
                                  : isAdmin
                                  ? '#EEF2FF'
                                  : theme.primaryLight,
                              },
                            ]}
                          >
                            {isSuper ? (
                              <Crown size={16} color="#D97706" />
                            ) : isAdmin ? (
                              <ShieldCheck size={16} color="#4F46E5" />
                            ) : (
                              <User size={16} color={theme.primary} />
                            )}
                          </View>

                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={[styles.userName, { color: theme.textPrimary }]}>
                                {u.fullName || 'MealFit Member'}
                              </Text>
                              {isLiveNow && (
                                <View style={styles.activeNowBadge}>
                                  <View style={styles.greenDotSmall} />
                                  <Text style={styles.activeNowText}>Live</Text>
                                </View>
                              )}
                            </View>
                            <Text style={[styles.userEmail, { color: theme.textMuted }]}>{u.email}</Text>
                          </View>
                        </View>

                        {/* Role Badge */}
                        <View
                          style={[
                            styles.roleBadge,
                            {
                              backgroundColor: isSuper
                                ? '#FEF3C7'
                                : isAdmin
                                ? '#EEF2FF'
                                : '#ECFDF5',
                              borderColor: isSuper
                                ? '#F59E0B'
                                : isAdmin
                                ? '#6366F1'
                                : '#10B981',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.roleBadgeText,
                              {
                                color: isSuper
                                  ? '#B45309'
                                  : isAdmin
                                  ? '#4338CA'
                                  : '#047857',
                              },
                            ]}
                          >
                            {isSuper ? '👑 SUPER ADMIN' : isAdmin ? '🛡️ TESTER / ADMIN' : '👤 USER'}
                          </Text>
                        </View>
                      </View>

                      {/* Metadata Details */}
                      <View style={styles.metaDetailsRow}>
                        <Text style={[styles.metaDetailItem, { color: theme.textSecondary }]}>
                          📍 {u.city || 'Delhi'}
                        </Text>
                        <Text style={[styles.metaDetailItem, { color: theme.textSecondary }]}>
                          🥗 {u.dietaryPreference || 'veg'}
                        </Text>
                        <Text style={[styles.metaDetailItem, { color: theme.textSecondary }]}>
                          🎯 {u.goalType || 'fat_loss'}
                        </Text>
                        <Text
                          style={[
                            styles.metaDetailItem,
                            {
                              color: isLiveNow ? '#10B981' : isLiveToday ? '#059669' : theme.textMuted,
                              fontWeight: isLiveNow || isLiveToday ? '700' : '500',
                            },
                          ]}
                        >
                          🕒 {isLiveNow ? 'Active Now' : isLiveToday ? 'Active Today' : 'Idle'}
                        </Text>
                      </View>

                      {/* Super Admin Quick Role Prompts */}
                      {isSuperAdmin && (
                        <View style={styles.roleModifierRow}>
                          <Text style={[styles.roleModifierLabel, { color: theme.textMuted }]}>Manage Role:</Text>
                          <View style={styles.roleBtnGroup}>
                            <TouchableOpacity
                              onPress={() => handleRoleChange(u.id || u._id, u.role, 'user')}
                              style={[
                                styles.roleSmallBtn,
                                u.role === 'user' && { backgroundColor: theme.primary, borderColor: theme.primary },
                              ]}
                            >
                              <Text style={[styles.roleSmallBtnText, u.role === 'user' && { color: '#FFFFFF' }]}>
                                User
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleRoleChange(u.id || u._id, u.role, 'admin')}
                              style={[
                                styles.roleSmallBtn,
                                u.role === 'admin' && { backgroundColor: '#6366F1', borderColor: '#6366F1' },
                              ]}
                            >
                              <Text style={[styles.roleSmallBtnText, u.role === 'admin' && { color: '#FFFFFF' }]}>
                                Tester / Admin
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleRoleChange(u.id || u._id, u.role, 'super_admin')}
                              style={[
                                styles.roleSmallBtn,
                                u.role === 'super_admin' && { backgroundColor: '#D97706', borderColor: '#D97706' },
                              ]}
                            >
                              <Text style={[styles.roleSmallBtnText, u.role === 'super_admin' && { color: '#FFFFFF' }]}>
                                Super Admin
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
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
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  livePulseText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 14,
    paddingBottom: 40,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  kpiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  kpiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  kpiLabel: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  engagementCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  engagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  engagementTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  engagementPercent: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  roleSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  roleSummaryItem: {
    alignItems: 'center',
    gap: 2,
  },
  roleSummaryCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  roleSummaryLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    paddingVertical: 0,
  },
  filterPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 11,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  usersList: {
    gap: 10,
  },
  userItemCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  userTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 13,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 11,
  },
  activeNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  greenDotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  activeNowText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  metaDetailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  metaDetailItem: {
    fontSize: 11,
  },
  roleModifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  roleModifierLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  roleBtnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  roleSmallBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  roleSmallBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
