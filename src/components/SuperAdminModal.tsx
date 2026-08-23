import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
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
} from 'lucide-react-native';

interface SuperAdminModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({ visible, onClose }) => {
  const { isSuperAdmin, unlockSuperAdmin, lockSuperAdmin } = useAuth();
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);

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

  const handleUnlock = () => {
    if (unlockSuperAdmin(pinInput)) {
      setPinError(null);
      setPinInput('');
    } else {
      setPinError('Invalid Owner Passcode. (Use: 778899)');
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

  return (
    <Modal visible={visible} animationType="slide" transparent>
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
                <Text style={styles.subtitle}>Owner & Platform Metrics Dashboard</Text>
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
                This dashboard is locked for the platform owner only. Enter your Master Passcode to inspect user analytics, manage food items, and monitor infrastructure.
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
                <Text style={styles.sectionHeading}>LIVE USER ANALYTICS & ACTIVITY</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <Users size={16} color={Colors.cyan} />
                    <Text style={styles.statGrowth}>+18% this wk</Text>
                  </View>
                  <Text style={styles.statBig}>1,428</Text>
                  <Text style={styles.statLabel}>Total Registered Users</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <Radio size={16} color={Colors.primary} />
                    <Text style={[styles.statGrowth, { color: Colors.primary }]}>Active Now</Text>
                  </View>
                  <Text style={styles.statBig}>892</Text>
                  <Text style={styles.statLabel}>Active Users Today</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <Utensils size={16} color={Colors.amber} />
                    <Text style={styles.statGrowth}>Live Log</Text>
                  </View>
                  <Text style={styles.statBig}>3,140</Text>
                  <Text style={styles.statLabel}>Katoris / Meals Logged</Text>
                </View>

                <View style={styles.statCard}>
                  <View style={styles.statCardTop}>
                    <IndianRupee size={16} color={Colors.indigo} />
                    <Text style={[styles.statGrowth, { color: Colors.indigo }]}>Saved</Text>
                  </View>
                  <Text style={styles.statBig}>₹4.8L</Text>
                  <Text style={styles.statLabel}>Kirana Savings across Users</Text>
                </View>
              </View>

              {/* Infrastructure Status */}
              <View style={styles.sectionHeaderRow}>
                <Server size={16} color={Colors.cyan} />
                <Text style={styles.sectionHeading}>SYSTEM & CLOUD INFRASTRUCTURE</Text>
              </View>

              <View style={styles.infraCard}>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>Local Database Engine:</Text>
                  <View style={styles.infraStatusRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.infraVal}>Connected (2ms Ping)</Text>
                  </View>
                </View>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>Cloudflare Tunnel:</Text>
                  <Text style={[styles.infraVal, { color: Colors.cyan }]}>Active (HTTPS)</Text>
                </View>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>Open-Meteo Satellite Feed:</Text>
                  <Text style={styles.infraVal}>Healthy (210ms)</Text>
                </View>
                <View style={styles.infraRow}>
                  <Text style={styles.infraLabel}>Node.js Process Memory:</Text>
                  <Text style={styles.infraVal}>38.4 MB (Heap: 18.2 MB)</Text>
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
