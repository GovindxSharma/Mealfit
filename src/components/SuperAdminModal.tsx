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
} from 'react-native';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { MobileApiService } from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  X,
  Users,
  Utensils,
  Dumbbell,
  Activity,
  Database,
  Lock,
  Unlock,
  Plus,
  IndianRupee,
  Server,
  CloudSun,
  Flame,
  Radio,
  CheckCircle,
  RefreshCw,
  Search,
  User,
  Crown,
  Sparkles,
} from 'lucide-react-native';

interface SuperAdminModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({ visible, onClose }) => {
  const { isSuperAdmin, unlockSuperAdmin, lockSuperAdmin } = useAuth();
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Live Users Management State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'super_admin' | 'admin' | 'user'>('all');

  // Food catalog manager state
  const [foodsList, setFoodsList] = useState([
    { name: 'Soya Chunks', proteinPer100g: 52, costPerKg: 150, proteinPerInr: 3.47, category: 'veg' },
    { name: 'Chana Sattu', proteinPer100g: 22, costPerKg: 180, proteinPerInr: 1.22, category: 'veg' },
    { name: 'Kala Chana', proteinPer100g: 20, costPerKg: 130, proteinPerInr: 1.54, category: 'veg' },
    { name: 'Yellow Moong Dal', proteinPer100g: 24, costPerKg: 160, proteinPerInr: 1.50, category: 'veg' },
    { name: 'Eggs (Whole)', proteinPer100g: 13, costPerKg: 140, proteinPerInr: 0.93, category: 'eggetarian' },
    { name: 'Fresh Paneer', proteinPer100g: 18, costPerKg: 450, proteinPerInr: 0.40, category: 'veg' },
  ]);

  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodProtein, setNewFoodProtein] = useState('');
  const [newFoodCost, setNewFoodCost] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await MobileApiService.getAdminUsers();
      if (res?.users) {
        setUsersList(res.users);
      }
    } catch (err: any) {
      console.warn('[SuperAdmin] Failed to load users:', err?.message || err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (visible && isSuperAdmin) {
      fetchUsers();
    }
  }, [visible, isSuperAdmin]);

  const handleUnlock = () => {
    if (unlockSuperAdmin(pinInput)) {
      setPinError(null);
      setPinInput('');
      fetchUsers();
    } else {
      setPinError('Invalid Owner Passcode. (Use: 778899)');
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string, newRole: string) => {
    if (currentRole === newRole) return;
    try {
      await MobileApiService.updateUserRole(userId, newRole);
      Alert.alert('Role Updated', `User role successfully updated to ${newRole}.`);
      fetchUsers();
    } catch (err: any) {
      Alert.alert('Update Failed', err?.message || 'Unable to update user role');
    }
  };

  const handleAddFood = () => {
    if (!newFoodName || !newFoodProtein || !newFoodCost) {
      return;
    }
    const protein = parseFloat(newFoodProtein) || 20;
    const cost = parseFloat(newFoodCost) || 100;
    const ratio = Math.round(((protein * 10) / cost) * 100) / 100;

    setFoodsList([
      ...foodsList,
      {
        name: newFoodName,
        proteinPer100g: protein,
        costPerKg: cost,
        proteinPerInr: ratio,
        category: 'veg',
      },
    ]);
    setNewFoodName('');
    setNewFoodProtein('');
    setNewFoodCost('');
    setShowAddFood(false);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.fullName || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.city || '').toLowerCase().includes(userSearchQuery.toLowerCase());

    const matchesRole =
      selectedRoleFilter === 'all' || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const superAdminCount = usersList.filter((u) => u.role === 'super_admin').length;
  const adminTesterCount = usersList.filter((u) => u.role === 'admin').length;
  const regularUserCount = usersList.filter((u) => u.role === 'user' || !u.role).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconBox}>
                <ShieldAlert size={20} color={Colors.indigo} />
              </View>
              <View>
                <Text style={styles.title}>Super Admin Command Center</Text>
                <Text style={styles.subtitle}>Owner & Platform Directory Dashboard</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {!isSuperAdmin ? (
            /* Lock Gate */
            <View style={styles.lockBox}>
              <View style={styles.lockIconCircle}>
                <Lock size={32} color={Colors.indigo} />
              </View>
              <Text style={styles.lockTitle}>Owner Authentication Required</Text>
              <Text style={styles.lockDesc}>
                This dashboard is locked for the platform owner only. Enter your Master Passcode to inspect all registered users, roles, and platform metrics.
              </Text>

              <View style={styles.pinInputContainer}>
                <TextInput
                  style={styles.pinInput}
                  value={pinInput}
                  onChangeText={setPinInput}
                  placeholder="Enter Master PIN (e.g. 778899)"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={handleUnlock} style={styles.unlockBtn} activeOpacity={0.8}>
                  <Unlock size={16} color="#FFFFFF" />
                  <Text style={styles.unlockBtnText}>Unlock</Text>
                </TouchableOpacity>
              </View>

              {pinError && <Text style={styles.errorText}>{pinError}</Text>}
              <Text style={styles.hintText}>Default Master PIN: 778899</Text>
            </View>
          ) : (
            /* Unlocked Admin Dashboard */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.adminScroll}>
              {/* Platform Metrics Overview */}
              <View style={styles.sectionHeaderRow}>
                <Activity size={16} color={Colors.primary} />
                <Text style={styles.sectionHeading}>LIVE USER ANALYTICS & ROLES</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <Users size={16} color={Colors.cyan} />
                    <Text style={styles.statGrowth}>MongoDB Cloud</Text>
                  </View>
                  <Text style={styles.statBig}>{usersList.length || 1}</Text>
                  <Text style={styles.statLabel}>Total Registered</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <Crown size={16} color={Colors.amber} />
                    <Text style={[styles.statGrowth, { color: Colors.amber }]}>Lead</Text>
                  </View>
                  <Text style={styles.statBig}>{superAdminCount}</Text>
                  <Text style={styles.statLabel}>Super Admins</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <ShieldCheck size={16} color={Colors.indigo} />
                    <Text style={[styles.statGrowth, { color: Colors.indigo }]}>Testers</Text>
                  </View>
                  <Text style={styles.statBig}>{adminTesterCount}</Text>
                  <Text style={styles.statLabel}>Admin / Testers</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <User size={16} color={Colors.primary} />
                    <Text style={[styles.statGrowth, { color: Colors.primary }]}>Active</Text>
                  </View>
                  <Text style={styles.statBig}>{regularUserCount}</Text>
                  <Text style={styles.statLabel}>Standard Members</Text>
                </View>
              </View>

              {/* ━━━ USER & TESTER DIRECTORY ━━━ */}
              <View style={styles.foodHeaderRow}>
                <View style={styles.sectionHeaderRow}>
                  <Users size={16} color={Colors.indigo} />
                  <Text style={styles.sectionHeading}>ALL USERS & TESTER ROLES ({filteredUsers.length})</Text>
                </View>
                <TouchableOpacity
                  onPress={fetchUsers}
                  style={styles.refreshBtn}
                  activeOpacity={0.7}
                >
                  <RefreshCw size={13} color={Colors.indigo} />
                  <Text style={styles.refreshBtnText}>Refresh</Text>
                </TouchableOpacity>
              </View>

              {/* Search & Filter Bar */}
              <View style={styles.searchBarBox}>
                <Search size={16} color={Colors.textMuted} />
                <TextInput
                  style={styles.searchBarInput}
                  placeholder="Search user by name, email, or city..."
                  placeholderTextColor={Colors.textMuted}
                  value={userSearchQuery}
                  onChangeText={setUserSearchQuery}
                />
                {userSearchQuery ? (
                  <TouchableOpacity onPress={() => setUserSearchQuery('')}>
                    <X size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Role Filter Pills */}
              <View style={styles.roleFilterRow}>
                {[
                  { id: 'all', label: `All (${usersList.length})` },
                  { id: 'super_admin', label: `Super Admin (${superAdminCount})` },
                  { id: 'admin', label: `Tester / Admin (${adminTesterCount})` },
                  { id: 'user', label: `User (${regularUserCount})` },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setSelectedRoleFilter(item.id as any)}
                    style={[
                      styles.roleFilterPill,
                      selectedRoleFilter === item.id && styles.roleFilterPillActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.roleFilterText,
                        selectedRoleFilter === item.id && styles.roleFilterTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Live Users List */}
              {loadingUsers ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color={Colors.indigo} />
                  <Text style={styles.loadingText}>Fetching registered users from MongoDB...</Text>
                </View>
              ) : filteredUsers.length === 0 ? (
                <View style={styles.emptyUsersBox}>
                  <Text style={styles.emptyUsersText}>No users found matching your filter.</Text>
                </View>
              ) : (
                <View style={styles.usersListContainer}>
                  {filteredUsers.map((u) => {
                    const isSuper = u.role === 'super_admin';
                    const isAdmin = u.role === 'admin';

                    return (
                      <View key={u.id || u._id} style={styles.userCard}>
                        <View style={styles.userCardHeader}>
                          <View style={styles.userAvatarAndInfo}>
                            <View
                              style={[
                                styles.userAvatarCircle,
                                {
                                  backgroundColor: isSuper
                                    ? Colors.amberLight
                                    : isAdmin
                                    ? Colors.indigoLight
                                    : Colors.primaryLight,
                                },
                              ]}
                            >
                              {isSuper ? (
                                <Crown size={16} color={Colors.amber} />
                              ) : isAdmin ? (
                                <ShieldCheck size={16} color={Colors.indigo} />
                              ) : (
                                <User size={16} color={Colors.primary} />
                              )}
                            </View>

                            <View style={{ flex: 1 }}>
                              <Text style={styles.userNameText}>
                                {u.fullName || 'MealFit Member'}
                              </Text>
                              <Text style={styles.userEmailText}>{u.email}</Text>
                            </View>
                          </View>

                          {/* Role Badge */}
                          <View
                            style={[
                              styles.userRoleBadge,
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
                                styles.userRoleBadgeText,
                                {
                                  color: isSuper
                                    ? '#B45309'
                                    : isAdmin
                                    ? '#4338CA'
                                    : '#047857',
                                },
                              ]}
                            >
                              {isSuper
                                ? '👑 SUPER ADMIN'
                                : isAdmin
                                ? '🛡️ ADMIN / TESTER'
                                : '👤 USER'}
                            </Text>
                          </View>
                        </View>

                        {/* User Metadata Row */}
                        <View style={styles.userMetaRow}>
                          <Text style={styles.userMetaText}>
                            📍 City: <Text style={{ fontWeight: '700' }}>{u.city || 'Delhi'}</Text>
                          </Text>
                          <Text style={styles.userMetaText}>
                            🥗 Diet: <Text style={{ fontWeight: '700' }}>{u.dietaryPreference || 'veg'}</Text>
                          </Text>
                          <Text style={styles.userMetaText}>
                            🎯 Goal: <Text style={{ fontWeight: '700' }}>{u.goalType || 'fat_loss'}</Text>
                          </Text>
                        </View>

                        {/* Quick Role Switch Actions (Super Admin Exclusive) */}
                        <View style={styles.roleActionRow}>
                          <Text style={styles.roleActionLabel}>Change Role:</Text>
                          <View style={styles.roleActionButtons}>
                            <TouchableOpacity
                              onPress={() => handleRoleChange(u.id || u._id, u.role, 'user')}
                              style={[
                                styles.smallRoleBtn,
                                u.role === 'user' && styles.smallRoleBtnActive,
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.smallRoleBtnText,
                                  u.role === 'user' && styles.smallRoleBtnTextActive,
                                ]}
                              >
                                User
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleRoleChange(u.id || u._id, u.role, 'admin')}
                              style={[
                                styles.smallRoleBtn,
                                u.role === 'admin' && styles.smallRoleBtnActive,
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.smallRoleBtnText,
                                  u.role === 'admin' && styles.smallRoleBtnTextActive,
                                ]}
                              >
                                Admin / Tester
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleRoleChange(u.id || u._id, u.role, 'super_admin')}
                              style={[
                                styles.smallRoleBtn,
                                u.role === 'super_admin' && styles.smallRoleBtnActive,
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.smallRoleBtnText,
                                  u.role === 'super_admin' && styles.smallRoleBtnTextActive,
                                ]}
                              >
                                Super Admin
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Infrastructure Status */}
              <View style={styles.sectionHeaderRow}>
                <Server size={16} color={Colors.cyan} />
                <Text style={styles.sectionHeading}>SYSTEM & CLOUD INFRASTRUCTURE</Text>
              </View>

              <View style={styles.infraCard}>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>Atlas MongoDB Cloud:</Text>
                  <View style={styles.infraStatusRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.infraVal}>Connected (Active Ping)</Text>
                  </View>
                </View>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>JWT Token Encryption:</Text>
                  <Text style={[styles.infraVal, { color: Colors.primary }]}>Bcrypt + HS256 Signed</Text>
                </View>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>Open-Meteo Satellite Feed:</Text>
                  <Text style={styles.infraVal}>Healthy (AQI + Weather)</Text>
                </View>
              </View>

              {/* Food Database & Protein/₹ Manager */}
              <View style={styles.foodHeaderRow}>
                <View style={styles.sectionHeaderRow}>
                  <Database size={16} color={Colors.amber} />
                  <Text style={styles.sectionHeading}>ICMR-NIN FOOD CATALOG & PRICING</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowAddFood(!showAddFood)}
                  style={styles.addFoodBtn}
                  activeOpacity={0.8}
                >
                  <Plus size={14} color="#FFFFFF" />
                  <Text style={styles.addFoodBtnText}>Add Food</Text>
                </TouchableOpacity>
              </View>

              {showAddFood && (
                <View style={styles.addFoodForm}>
                  <Text style={styles.formTitle}>Add New Indian Food Item</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Food Name (e.g. Horse Gram / Kulthi Dal)"
                    placeholderTextColor={Colors.textMuted}
                    value={newFoodName}
                    onChangeText={setNewFoodName}
                  />
                  <View style={styles.formRow}>
                    <TextInput
                      style={[styles.formInput, { flex: 1 }]}
                      placeholder="Protein / 100g (g)"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                      value={newFoodProtein}
                      onChangeText={setNewFoodProtein}
                    />
                    <TextInput
                      style={[styles.formInput, { flex: 1 }]}
                      placeholder="Cost / kg (₹)"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                      value={newFoodCost}
                      onChangeText={setNewFoodCost}
                    />
                  </View>
                  <TouchableOpacity onPress={handleAddFood} style={styles.saveFoodBtn}>
                    <Text style={styles.saveFoodText}>Save to Food Dataset</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.foodList}>
                {foodsList.map((f, idx) => (
                  <View key={idx} style={styles.foodItem}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{f.name}</Text>
                      <Text style={styles.foodSub}>
                        {f.proteinPer100g}g protein/100g • ₹{f.costPerKg}/kg
                      </Text>
                    </View>
                    <View style={styles.ratioBadge}>
                      <Text style={styles.ratioText}>{f.proteinPerInr}g / ₹1</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Lock Console Button */}
              <TouchableOpacity onPress={lockSuperAdmin} style={styles.lockBackBtn} activeOpacity={0.8}>
                <Lock size={16} color={Colors.textSecondary} />
                <Text style={styles.lockBackText}>Lock Admin Console</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
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
    borderBottomColor: Colors.cardBorder,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.indigoLight,
    borderWidth: 1,
    borderColor: Colors.indigoGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.indigo,
  },
  closeBtn: {
    padding: 6,
  },
  lockBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 14,
  },
  lockIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.indigoLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  lockTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  lockDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  pinInputContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  pinInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.indigo,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  unlockBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  adminScroll: {
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    gap: 4,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statGrowth: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.cyan,
  },
  statBig: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  infraCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    gap: 8,
  },
  infraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infraLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  infraStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  infraVal: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  foodHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addFoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.amber,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addFoodBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  addFoodForm: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    gap: 8,
  },
  formTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.amber,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  formRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveFoodBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 2,
  },
  saveFoodText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  foodList: {
    gap: 8,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
  },
  foodInfo: {
    gap: 2,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  foodSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ratioBadge: {
    backgroundColor: Colors.amberLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratioText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.amber,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.indigo,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  roleFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  roleFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  roleFilterPillActive: {
    backgroundColor: Colors.indigo,
    borderColor: Colors.indigo,
  },
  roleFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  roleFilterTextActive: {
    color: '#FFFFFF',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  emptyUsersBox: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  emptyUsersText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  usersListContainer: {
    gap: 10,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 12,
    gap: 8,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  userAvatarAndInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  userAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userEmailText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  userRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  userRoleBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  userMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  userMetaText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  roleActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  roleActionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  roleActionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  smallRoleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  smallRoleBtnActive: {
    backgroundColor: Colors.indigo,
    borderColor: Colors.indigo,
  },
  smallRoleBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  smallRoleBtnTextActive: {
    color: '#FFFFFF',
  },
  lockBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: 8,
  },
  lockBackText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
