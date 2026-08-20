import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth, DietaryType, EquipmentType } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';
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
} from 'lucide-react-native';

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
  const { user, updateUserProfile, logout } = useAuth();

  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [diet, setDiet] = useState<DietaryType>(user.dietaryPreference);
  const [budget, setBudget] = useState<number>(user.weeklyBudgetInr);
  const [equipment, setEquipment] = useState<EquipmentType[]>(user.equipment);
  const [city, setCity] = useState<string>(user.city);
  const [waterNotif, setWaterNotif] = useState(user.notifications.water);
  const [mealNotif, setMealNotif] = useState(user.notifications.meals);
  const [workoutNotif, setWorkoutNotif] = useState(user.notifications.workouts);

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
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>Personalized preferences & account</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. Account Details */}
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
              <View style={styles.sectionHeaderRow}>
                <Utensils size={15} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>DIETARY PREFERENCE</Text>
              </View>
              <View style={styles.pillRow}>
                {[
                  { key: 'veg', label: 'Vegetarian' },
                  { key: 'jain', label: 'Jain (No Root)' },
                  { key: 'eggetarian', label: 'Eggetarian' },
                  { key: 'non_veg', label: 'Non-Veg' },
                ].map((d) => (
                  <TouchableOpacity
                    key={d.key}
                    onPress={() => setDiet(d.key as DietaryType)}
                    style={[
                      styles.dietPill,
                      {
                        backgroundColor: diet === d.key ? theme.primary : 'rgba(255, 255, 255, 0.03)',
                        borderColor: diet === d.key ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dietPillText,
                        { color: diet === d.key ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary },
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 3. Weekly Kirana Budget */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <IndianRupee size={15} color={theme.amber} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>WEEKLY GROCERY BUDGET</Text>
              </View>
              <View style={styles.pillRow}>
                {[
                  { amount: 450, label: '₹450 / wk (~₹65/day)' },
                  { amount: 650, label: '₹650 / wk (~₹90/day)' },
                  { amount: 900, label: '₹900 / wk (~₹130/day)' },
                ].map((b) => (
                  <TouchableOpacity
                    key={b.amount}
                    onPress={() => setBudget(b.amount)}
                    style={[
                      styles.budgetPill,
                      {
                        backgroundColor: budget === b.amount ? theme.primary : 'rgba(255, 255, 255, 0.03)',
                        borderColor: budget === b.amount ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.budgetPillText,
                        { color: budget === b.amount ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary },
                      ]}
                    >
                      {b.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 4. Equipment */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Dumbbell size={15} color={theme.indigo} />
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>AVAILABLE EQUIPMENT</Text>
              </View>
              <View style={styles.pillRowWrap}>
                {[
                  { key: 'bodyweight', label: 'Bodyweight Floor' },
                  { key: 'dumbbells', label: 'Dumbbells / Water Bottles' },
                  { key: 'bands', label: 'Resistance Bands' },
                ].map((eq) => {
                  const isSelected = equipment.includes(eq.key as EquipmentType);
                  return (
                    <TouchableOpacity
                      key={eq.key}
                      onPress={() => toggleEquipment(eq.key as EquipmentType)}
                      style={[
                        styles.equipPill,
                        {
                          backgroundColor: isSelected ? theme.primaryLight : 'rgba(255, 255, 255, 0.03)',
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                        },
                      ]}
                    >
                      {isSelected && <Check size={12} color={theme.primary} />}
                      <Text
                        style={[
                          styles.equipPillText,
                          { color: isSelected ? theme.primary : theme.textSecondary },
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
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>SMART REMINDERS</Text>
              </View>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Hydration Reminders</Text>
                  <Text style={[styles.toggleSub, { color: theme.textSecondary }]}>Dynamic weather scaling</Text>
                </View>
                <Switch
                  value={waterNotif}
                  onValueChange={setWaterNotif}
                  trackColor={{ false: '#262626', true: theme.primary }}
                />
              </View>
              <View style={styles.toggleRow}>
                <View style={styles.toggleTextCol}>
                  <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Meal Logging Prompt</Text>
                  <Text style={[styles.toggleSub, { color: theme.textSecondary }]}>Post-meal Katori nudge</Text>
                </View>
                <Switch
                  value={mealNotif}
                  onValueChange={setMealNotif}
                  trackColor={{ false: '#262626', true: theme.primary }}
                />
              </View>

              {/* Test Notification Action */}
              <TouchableOpacity
                onPress={async () => {
                  await NotificationService.sendInstantNotification(
                    '💧 MealFit Hydration & Macro Check',
                    'Test Notification Successful! Your daily goal is active (130g Protein • 1,618 kcal).'
                  );
                }}
                style={[styles.testNotifBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                activeOpacity={0.75}
              >
                <Bell size={15} color={theme.primary} />
                <Text style={[styles.testNotifText, { color: theme.primary }]}>
                  Send Test Push Notification to My Mobile
                </Text>
              </TouchableOpacity>
            </View>

            {/* Theme, Diagnostics & Super Admin Links */}
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
                  <Text style={[styles.diagBtnText, { color: theme.primary }]}>Theme & Colors</Text>
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
                  <Text style={[styles.diagBtnText, { color: theme.cyan }]}>API Life Status</Text>
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
                  <Text style={[styles.superAdminBtnText, { color: theme.indigo }]}>Super Admin</Text>
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

            {/* Logout */}
            <TouchableOpacity
              onPress={() => {
                logout();
                onClose();
              }}
              style={[styles.logoutBtn, { borderColor: theme.cardBorder }]}
              activeOpacity={0.7}
            >
              <LogOut size={15} color={theme.rose} />
              <Text style={[styles.logoutBtnText, { color: theme.rose }]}>Log Out of Account</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
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
    gap: 18,
    paddingBottom: 40,
  },
  section: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  dietPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  budgetPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  budgetPillText: {
    fontSize: 10.5,
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
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  cityText: {
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
  testNotifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  testNotifText: {
    fontSize: 11.5,
    fontWeight: '700',
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
    marginTop: 6,
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
});
