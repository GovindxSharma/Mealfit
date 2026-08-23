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
import { useTheme } from '../context/ThemeContext';
import { useAuth, MealSlot, SavedCustomMeal } from '../context/AuthContext';
import { estimateIndianFoodNutrients } from '../services/indianFoodDatabase';
import { HapticService } from '../services/hapticService';
import { SoundService } from '../services/soundService';
import {
  X,
  Sparkles,
  Plus,
  Bookmark,
  RotateCcw,
  Trash2,
  Check,
  Utensils,
  Flame,
  IndianRupee,
  Clock,
} from 'lucide-react-native';

interface SavedMealsComposerModalProps {
  visible: boolean;
  onClose: () => void;
  initialSlot?: MealSlot;
}

export const SavedMealsComposerModal: React.FC<SavedMealsComposerModalProps> = ({
  visible,
  onClose,
  initialSlot = 'lunch',
}) => {
  const { theme } = useTheme();
  const {
    savedMeals,
    saveCustomMeal,
    deleteSavedMeal,
    repeatSavedMeal,
    selectedHistoryDate,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'compose' | 'saved'>('compose');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>(initialSlot);

  // Composer Form
  const [customName, setCustomName] = useState<string>('');
  const [dishDescription, setDishDescription] = useState<string>('');
  const [calories, setCalories] = useState<string>('420');
  const [protein, setProtein] = useState<string>('24');
  const [carbs, setCarbs] = useState<string>('48');
  const [fat, setFat] = useState<string>('12');
  const [cost, setCost] = useState<string>('30');
  const [aiNote, setAiNote] = useState<string>('');

  const handleDescriptionChange = (text: string) => {
    setDishDescription(text);
    if (text.trim().length >= 3) {
      const est = estimateIndianFoodNutrients(text);
      setCalories(String(est.calories));
      setProtein(String(est.proteinG));
      setCarbs(String(est.carbsG));
      setFat(String(est.fatG));
      setCost(String(est.costInr));
      setAiNote(est.tip);
      if (!customName.trim()) {
        setCustomName(est.name);
      }
    }
  };

  const handleSaveAndLog = () => {
    if (!dishDescription.trim()) {
      Alert.alert('Missing Description', 'Please type the dish or ingredients.');
      return;
    }

    const nameToSave = customName.trim() || dishDescription.trim();
    const cal = parseFloat(calories) || 300;
    const pro = parseFloat(protein) || 15;
    const carb = parseFloat(carbs) || 35;
    const fatVal = parseFloat(fat) || 10;
    const costVal = parseFloat(cost) || 25;

    // 1. Save to saved meals shelf
    saveCustomMeal({
      name: nameToSave,
      dishDescription: dishDescription.trim(),
      calories: cal,
      proteinG: pro,
      carbsG: carb,
      fatG: fatVal,
      costInr: costVal,
      slot: selectedSlot,
    });

    // 2. Also log to today's ledger
    repeatSavedMeal(`saved_${Date.now()}`); // fallback triggers auto-log
    HapticService.success();
    SoundService.playMealLogged().catch(() => {});
    Alert.alert('Meal Saved & Logged', `"${nameToSave}" has been added to your Saved Meals and logged to your food diary.`);
    setCustomName('');
    setDishDescription('');
    onClose();
  };

  const handleRepeat = (meal: SavedCustomMeal) => {
    repeatSavedMeal(meal.id, selectedHistoryDate);
    HapticService.success();
    SoundService.playMealLogged().catch(() => {});
    Alert.alert('Meal Repeated', `"${meal.name}" (+${meal.proteinG}g Protein) has been logged.`);
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
              <View style={[styles.emblemBadge, { backgroundColor: theme.primaryLight }]}>
                <Bookmark size={18} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Custom Meals & Repeats
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  Compose dishes, auto-distinguish nutrients & repeat in 1 tap
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* SubTab Selector */}
          <View style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('compose')}
              style={[
                styles.tabItem,
                activeTab === 'compose' && { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
            >
              <Plus size={14} color={activeTab === 'compose' ? theme.primary : theme.textMuted} />
              <Text style={[styles.tabText, { color: activeTab === 'compose' ? theme.primary : theme.textSecondary }]}>
                Compose New Meal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('saved')}
              style={[
                styles.tabItem,
                activeTab === 'saved' && { backgroundColor: theme.card, borderColor: theme.primary },
              ]}
            >
              <RotateCcw size={14} color={activeTab === 'saved' ? theme.primary : theme.textMuted} />
              <Text style={[styles.tabText, { color: activeTab === 'saved' ? theme.primary : theme.textSecondary }]}>
                My Saved Meals ({savedMeals.length})
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {activeTab === 'compose' ? (
              /* TAB 1: COMPOSE & DISTINGUISH NUTRIENTS */
              <View style={styles.section}>
                {/* Meal Description Input */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                    DESCRIBE YOUR MEAL / INGREDIENTS
                  </Text>
                  <TextInput
                    value={dishDescription}
                    onChangeText={handleDescriptionChange}
                    placeholder="e.g. 2 Phulkas + 1 Bowl Moong Dal + 100g Dahi + Salad"
                    placeholderTextColor={theme.textMuted}
                    multiline
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>

                {/* Optional Custom Nickname */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                    NAME YOUR MEAL (FOR 1-TAP REPEATS)
                  </Text>
                  <TextInput
                    value={customName}
                    onChangeText={setCustomName}
                    placeholder="e.g. My Power Lunch, Post-Gym Shake, Maa Ki Khichdi"
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

                {/* AI Nutrient Breakdown Card */}
                <View style={[styles.nutrientCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                  <View style={styles.nutrientHeader}>
                    <Sparkles size={15} color={theme.primary} />
                    <Text style={[styles.nutrientTitle, { color: theme.primary }]}>
                      Auto-Calculated Indian Nutrients
                    </Text>
                  </View>

                  <View style={styles.macroRow}>
                    <View style={styles.macroCol}>
                      <Text style={[styles.macroVal, { color: theme.primary }]}>{calories}</Text>
                      <Text style={[styles.macroSub, { color: theme.textSecondary }]}>Calories (kcal)</Text>
                    </View>
                    <View style={styles.macroCol}>
                      <Text style={[styles.macroVal, { color: theme.secondary }]}>{protein}g</Text>
                      <Text style={[styles.macroSub, { color: theme.textSecondary }]}>Protein</Text>
                    </View>
                    <View style={styles.macroCol}>
                      <Text style={[styles.macroVal, { color: theme.amber }]}>{carbs}g</Text>
                      <Text style={[styles.macroSub, { color: theme.textSecondary }]}>Carbs</Text>
                    </View>
                    <View style={styles.macroCol}>
                      <Text style={[styles.macroVal, { color: theme.rose }]}>{fat}g</Text>
                      <Text style={[styles.macroSub, { color: theme.textSecondary }]}>Fat</Text>
                    </View>
                  </View>

                  {aiNote ? (
                    <Text style={[styles.nutrientTip, { color: theme.textSecondary }]}>
                      {aiNote}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={handleSaveAndLog}
                  style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
                  activeOpacity={0.85}
                >
                  <Bookmark size={16} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Save & Log to Food Diary</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* TAB 2: MY SAVED MEALS SHELF (1-TAP REPEAT) */
              <View style={styles.section}>
                {savedMeals.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Utensils size={32} color={theme.textMuted} />
                    <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Saved Meals Yet</Text>
                    <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                      Compose any meal in Tab 1 and save it to repeat anytime in 1 tap!
                    </Text>
                  </View>
                ) : (
                  savedMeals.map((meal) => (
                    <View
                      key={meal.id}
                      style={[
                        styles.savedMealCard,
                        {
                          backgroundColor: theme.backgroundSecondary,
                          borderColor: theme.cardBorder,
                        },
                      ]}
                    >
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text style={[styles.savedMealName, { color: theme.textPrimary }]}>
                          {meal.name}
                        </Text>
                        <Text style={[styles.savedMealDesc, { color: theme.textSecondary }]}>
                          {meal.dishDescription}
                        </Text>
                        <View style={styles.savedMealMacroRow}>
                          <Text style={[styles.savedMacroPill, { color: theme.primary }]}>
                            {meal.calories} kcal
                          </Text>
                          <Text style={[styles.savedMacroPill, { color: theme.secondary, fontWeight: '800' }]}>
                            {meal.proteinG}g Protein
                          </Text>
                          <Text style={[styles.savedMacroPill, { color: theme.textMuted }]}>
                            ₹{meal.costInr}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.savedCardActions}>
                        <TouchableOpacity
                          onPress={() => handleRepeat(meal)}
                          style={[styles.repeatBtn, { backgroundColor: theme.primary }]}
                          activeOpacity={0.8}
                        >
                          <RotateCcw size={13} color="#FFFFFF" />
                          <Text style={styles.repeatBtnText}>Repeat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => deleteSavedMeal(meal.id)}
                          style={styles.deleteBtn}
                        >
                          <Trash2 size={14} color={theme.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
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
    maxHeight: '90%',
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
    gap: 10,
    flex: 1,
  },
  emblemBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
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
  section: {
    gap: 12,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  nutrientCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  nutrientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nutrientTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroCol: {
    alignItems: 'center',
    gap: 2,
  },
  macroVal: {
    fontSize: 16,
    fontWeight: '900',
  },
  macroSub: {
    fontSize: 10,
  },
  nutrientTip: {
    fontSize: 10.5,
    lineHeight: 14,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 4,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  emptySub: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  savedMealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  savedMealName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  savedMealDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  savedMealMacroRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  savedMacroPill: {
    fontSize: 11,
    fontWeight: '700',
  },
  savedCardActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  repeatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  repeatBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 4,
  },
});
