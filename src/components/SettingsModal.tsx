import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth, DietaryType, EquipmentType } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
import { promptGoogleSignIn } from '../services/googleAuth';
import { useRouter } from 'expo-router';
import {
  X,
  User,
  Dumbbell,
  Utensils,
  IndianRupee,
  MapPin,
  Bell,
  Sparkles,
  LogOut,
  Check,
  Activity,
  Lock,
  Palette,
  ShieldCheck,
  Key,
  LogIn,
  Leaf,
  Egg,
} from 'lucide-react-native';
import { SecurityVaultModal } from './SecurityVaultModal';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenLifeStatus?: () => void;
  onOpenSuperAdmin?: () => void;
  onOpenThemeModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onOpenLifeStatus,
  onOpenSuperAdmin,
  onOpenThemeModal,
}) => {
  const { theme } = useTheme();
  const { user, isLoggedIn, updateUserProfile, logout, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [diet, setDiet] = useState<DietaryType>(user.dietaryPreference);
  const [budget, setBudget] = useState<number>(user.weeklyBudgetInr);
  const [equipment, setEquipment] = useState<EquipmentType[]>(user.equipment);
  const [city, setCity] = useState<string>(user.city);
  const [waterNotif, setWaterNotif] = useState(user.notifications.water);
  const [mealNotif, setMealNotif] = useState(user.notifications.meals);
  const [workoutNotif, setWorkoutNotif] = useState(user.notifications.workouts);
  const [showSecurityModal, setShowSecurityModal] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  useEffect(() => {
    setName(user.fullName);
    setEmail(user.email);
    setDiet(user.dietaryPreference);
    setBudget(user.weeklyBudgetInr);
    setEquipment(user.equipment);
    setCity(user.city);
    setWaterNotif(user.notifications.water);
    setMealNotif(user.notifications.meals);
    setWorkoutNotif(user.notifications.workouts);
  }, [user]);

  const handleGoogleDirectSignIn = async () => {
    try {
      setGoogleLoading(true);
      const googleUser = await promptGoogleSignIn();
      await loginWithGoogle(googleUser);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (!msg.includes('cancelled') && !msg.includes('12501') && !msg.includes('dismiss')) {
        Alert.alert('Google Sign-In', msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleEquipment = (item: EquipmentType) => {
    if (equipment.includes(item)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter((e) => e !== item));
      }
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleSave = () => {
    updateUserProfile({
      fullName: name,
      email,
      dietaryPreference: diet,
      weeklyBudgetInr: budget,
      equipment,
      city,
      notifications: {
        water: waterNotif,
        meals: mealNotif,
        workouts: workoutNotif,
      },
    });
    onClose();
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your MealFit account? Your data is securely saved in the cloud.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            onClose();
          },
        },
      ]
    );
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
              <View style={[styles.avatarBox, { backgroundColor: theme.primaryLight }]}>
                <User size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings & Profile</Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  {!isLoggedIn ? 'Waiting for Sign In • Local Storage' : `${user.authProvider === 'google' ? 'Google Account' : 'Verified Member'} • Cloud Synced`}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Account Status Card */}
            <View
              style={[
                styles.accountCard,
                {
                  backgroundColor: !isLoggedIn ? theme.amberLight : theme.primaryLight,
                  borderColor: !isLoggedIn ? theme.amber : theme.primary,
                },
              ]}
            >
              <View style={styles.accountCardLeft}>
                <View style={[styles.accountIconCircle, { backgroundColor: theme.card }]}>
                  {user.authProvider === 'google' ? (
                    <Text style={styles.googleMiniG}>G</Text>
                  ) : (
                    <User size={16} color={theme.primary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.accountCardName, { color: theme.textPrimary }]}>
                    {!isLoggedIn ? (user.fullName && user.fullName !== 'New Member' ? user.fullName : 'Guest Seeker') : user.fullName}
                  </Text>
                  <Text style={[styles.accountCardEmail, { color: theme.textSecondary }]}>
                    {!isLoggedIn ? 'Not signed in yet' : user.email}
                  </Text>
                </View>
              </View>
              {!isLoggedIn ? (
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity
                    onPress={handleGoogleDirectSignIn}
                    style={[styles.accountActionBtn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: theme.cardBorder }]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.googleMiniG}>G</Text>
                    <Text style={[styles.accountActionText, { color: theme.textPrimary }]}>
                      Google
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      onClose();
                      router.push('/auth/login' as any);
                    }}
                    style={[styles.accountActionBtn, { backgroundColor: theme.primary }]}
                    activeOpacity={0.8}
                  >
                    <LogIn size={13} color="#FFFFFF" />
                    <Text style={[styles.accountActionText, { color: '#FFFFFF' }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.verifiedPill, { backgroundColor: theme.card }]}>
                  <ShieldCheck size={12} color={theme.primary} />
                  <Text style={[styles.verifiedText, { color: theme.primary }]}>Synced</Text>
                </View>
              )}
            </View>

            {/* 1. Account Details Form */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>ACCOUNT DETAILS</Text>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              </View>
            </View>

            {/* 2. Dietary Preference */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>DIETARY PREFERENCE</Text>
              <View style={styles.pillRowWrap}>
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
                        styles.dietPill,
                        {
                          backgroundColor: diet === d.key ? theme.primaryLight : 'rgba(255, 255, 255, 0.03)',
                          borderColor: diet === d.key ? theme.primary : theme.cardBorder,
                        },
                      ]}
                    >
                      <DietIcon size={13} color={diet === d.key ? theme.primary : theme.textSecondary} />
                      <Text
                        style={[
                          styles.dietText,
                          { color: diet === d.key ? theme.primary : theme.textSecondary },
                        ]}
                      >
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Weekly Kirana Budget */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <IndianRupee size={15} color={theme.amber} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>WEEKLY GROCERY BUDGET</Text>
                <Text style={[styles.budgetLabel, { color: theme.amber }]}>₹{budget}/week</Text>
              </View>
              <View style={styles.pillRowWrap}>
                {[500, 650, 800, 1000, 1500, 2000].map((b) => (
                  <TouchableOpacity
                    key={b}
                    onPress={() => setBudget(b)}
                    style={[
                      styles.budgetPill,
                      {
                        backgroundColor: budget === b ? theme.amberLight : 'rgba(255, 255, 255, 0.03)',
                        borderColor: budget === b ? theme.amber : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.budgetPillText,
                        { color: budget === b ? theme.amber : theme.textSecondary },
                      ]}
                    >
                      ₹{b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 4. Equipment */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Dumbbell size={15} color={theme.indigo} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>HOME EQUIPMENT</Text>
              </View>
              <View style={styles.pillRowWrap}>
                {[
                  { key: 'bodyweight', label: 'Bodyweight Only' },
                  { key: 'dumbbells', label: 'Dumbbells' },
                  { key: 'bands', label: 'Resistance Bands' },
                  { key: 'gym', label: 'Full Gym' },
                ].map((eq) => {
                  const active = equipment.includes(eq.key as EquipmentType);
                  return (
                    <TouchableOpacity
                      key={eq.key}
                      onPress={() => toggleEquipment(eq.key as EquipmentType)}
                      style={[
                        styles.equipPill,
                        {
                          backgroundColor: active ? theme.indigoLight : 'rgba(255, 255, 255, 0.03)',
                          borderColor: active ? theme.indigo : theme.cardBorder,
                        },
                      ]}
                    >
                      {active && <Check size={12} color={theme.indigo} />}
                      <Text
                        style={[
                          styles.equipPillText,
                          { color: active ? theme.indigo : theme.textSecondary },
                        ]}
                      >
                        {eq.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 5. City / Location */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <MapPin size={15} color={theme.cyan} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>YOUR CITY / LOCATION</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Enter your city (e.g. Pune, Jaipur, Lucknow, Indore...)"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              </View>
            </View>

            {/* 6. Notifications */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Bell size={15} color={theme.rose} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>NOTIFICATION REMINDERS</Text>
              </View>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Hydration Reminders</Text>
                  <Text style={[styles.toggleSub, { color: theme.textMuted }]}>Hourly water intake nudges</Text>
                </View>
                <Switch
                  value={waterNotif}
                  onValueChange={setWaterNotif}
                  trackColor={{ false: theme.cardBorder, true: theme.cyan }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Indian Meal Timings</Text>
                  <Text style={[styles.toggleSub, { color: theme.textMuted }]}>Breakfast, Lunch & Dinner reminders</Text>
                </View>
                <Switch
                  value={mealNotif}
                  onValueChange={setMealNotif}
                  trackColor={{ false: theme.cardBorder, true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* 7. Security & Encryption Badge */}
            <TouchableOpacity
              onPress={() => setShowSecurityModal(true)}
              style={[
                styles.securityCard,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.primary },
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.securityTitleRow}>
                <Key size={14} color={theme.primary} />
                <Text style={[styles.securityTitle, { color: theme.textPrimary }]}>
                  256-Bit Data & Privacy Protection
                </Text>
                <View style={[styles.verifiedPill, { backgroundColor: theme.primaryLight, marginLeft: 'auto' }]}>
                  <Text style={[styles.verifiedText, { color: theme.primary }]}>View Vault</Text>
                </View>
              </View>
              <Text style={[styles.securityDesc, { color: theme.textMuted }]}>
                Your biometrics, credentials, and meal logs are protected with TLS 1.3, bcrypt, and JWT encryption. Tap to inspect security vault.
              </Text>
            </TouchableOpacity>

            {/* Diagnostics & Links */}
            <View style={styles.adminLinksRow}>
              {onOpenThemeModal && (
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onOpenThemeModal();
                  }}
                  style={[styles.diagBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                  activeOpacity={0.7}
                >
                  <Palette size={15} color={theme.primary} />
                  <Text style={[styles.diagBtnText, { color: theme.primary }]}>Theme</Text>
                </TouchableOpacity>
              )}

              {onOpenLifeStatus && (
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onOpenLifeStatus();
                  }}
                  style={[styles.diagBtn, { backgroundColor: theme.cyanLight, borderColor: theme.cyan }]}
                  activeOpacity={0.7}
                >
                  <Activity size={15} color={theme.cyan} />
                  <Text style={[styles.diagBtnText, { color: theme.cyan }]}>Backend</Text>
                </TouchableOpacity>
              )}

              {onOpenSuperAdmin && (
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    onOpenSuperAdmin();
                  }}
                  style={[styles.superAdminBtn, { backgroundColor: theme.indigoLight, borderColor: theme.indigo }]}
                  activeOpacity={0.7}
                >
                  <Lock size={15} color={theme.indigo} />
                  <Text style={[styles.superAdminBtnText, { color: theme.indigo }]}>Admin</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.saveBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                Save Preferences
              </Text>
            </TouchableOpacity>

            {/* Logout / Switch Account */}
            <TouchableOpacity
              onPress={() => {
                if (!isLoggedIn) {
                  onClose();
                  router.push('/auth/login' as any);
                } else {
                  handleLogout();
                }
              }}
              style={[styles.logoutBtn, { borderColor: theme.cardBorder }]}
              activeOpacity={0.7}
            >
              <LogOut size={15} color={!isLoggedIn ? theme.primary : theme.rose} />
              <Text style={[styles.logoutBtnText, { color: !isLoggedIn ? theme.primary : theme.rose }]}>
                {!isLoggedIn ? 'Sign In or Create Account' : 'Log Out of Account'}
              </Text>
            </TouchableOpacity>

            {/* Play Store App Info Footer */}
            <View style={styles.footerInfo}>
              <Text style={[styles.footerText, { color: theme.textMuted }]}>
                MealFit India • Version 1.0.0 (Play Store Production Edition)
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
      <SecurityVaultModal
        visible={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
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
  avatarBox: {
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
    gap: 16,
    paddingBottom: 36,
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  accountCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  accountIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleMiniG: {
    fontSize: 14,
    fontWeight: '900',
    color: '#4285F4',
  },
  accountCardName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  accountCardEmail: {
    fontSize: 11,
  },
  accountActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  accountActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '800',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetLabel: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: '800',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13.5,
    fontWeight: '600',
  },
  pillRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dietText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  budgetPill: {
    flex: 1,
    minWidth: '28%',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  budgetPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  equipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  equipPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  toggleTextCol: {
    gap: 2,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSub: {
    fontSize: 11,
  },
  securityCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 4,
  },
  securityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityTitle: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  securityDesc: {
    fontSize: 10.5,
    lineHeight: 14,
  },
  adminLinksRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diagBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  diagBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  superAdminBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  superAdminBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  saveBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
