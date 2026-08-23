import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth, MealSlot } from '../context/AuthContext';
import { HapticService } from '../services/hapticService';
import {
  Utensils,
  X,
  Search,
  Plus,
  Flame,
  Check,
  Sparkles,
  IndianRupee,
  Info,
} from 'lucide-react-native';
import {
  INDIAN_FOOD_DATABASE,
  searchIndianFoodDatabase,
  estimateIndianFoodNutrients,
  IndianFoodItem,
} from '../services/indianFoodDatabase';

interface CustomMealModalProps {
  visible: boolean;
  onClose: () => void;
  initialSlot?: MealSlot;
}

export const CustomMealModal: React.FC<CustomMealModalProps> = ({
  visible,
  onClose,
  initialSlot = 'lunch',
}) => {
  const { theme } = useTheme();
  const { addCustomMeal, selectedHistoryDate } = useAuth();

  const [activeTab, setActiveTab] = useState<'search' | 'custom'>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>(initialSlot);

  // Custom Form State
  const [customName, setCustomName] = useState<string>('');
  const [customCalories, setCustomCalories] = useState<string>('310');
  const [customProtein, setCustomProtein] = useState<string>('12');
  const [customCarbs, setCustomCarbs] = useState<string>('40');
  const [customFat, setCustomFat] = useState<string>('10');
  const [customQuantity, setCustomQuantity] = useState<string>('1 Serving');
  const [customCost, setCustomCost] = useState<string>('25');
  const [detectedInsight, setDetectedInsight] = useState<string>('');
  const [hasAutoFilled, setHasAutoFilled] = useState<boolean>(false);

  const filteredFoods = searchIndianFoodDatabase(searchQuery);

  const handleCustomNameChange = (text: string) => {
    setCustomName(text);
    if (text.trim().length >= 2) {
      const est = estimateIndianFoodNutrients(text);
      setCustomCalories(String(est.calories));
      setCustomProtein(String(est.proteinG));
      setCustomCarbs(String(est.carbsG));
      setCustomFat(String(est.fatG));
      setCustomQuantity(est.servingSize);
      setCustomCost(String(est.costInr));
      setDetectedInsight(`${est.name}: ${est.tip}`);
      setHasAutoFilled(true);
    } else {
      setHasAutoFilled(false);
      setDetectedInsight('');
    }
  };

  const handleAddPreset = (food: IndianFoodItem) => {
    addCustomMeal({
      name: food.name,
      hindiName: food.hindiName,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      slot: selectedSlot,
      quantity: food.servingSize,
      costInr: food.costInr,
      date: selectedHistoryDate,
    });
    HapticService.success();
    onClose();
  };

  const handleAddCustom = () => {
    if (!customName.trim()) {
      Alert.alert('Missing Name', 'Please enter a meal or dish name.');
      return;
    }
    const cal = parseFloat(customCalories) || 0;
    const pro = parseFloat(customProtein) || 0;
    const carb = parseFloat(customCarbs) || 0;
    const fat = parseFloat(customFat) || 0;
    const cost = parseFloat(customCost) || 20;

    addCustomMeal({
      name: customName.trim(),
      calories: cal,
      proteinG: pro,
      carbsG: carb,
      fatG: fat,
      slot: selectedSlot,
      quantity: customQuantity || '1 Portion',
      costInr: cost,
      date: selectedHistoryDate,
    });
    HapticService.success();

    setCustomName('');
    onClose();
  };

  const slotsList: { key: MealSlot; label: string }[] = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'evening_snack', label: 'Evening Snack' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Any Snack' },
  ];

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
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Utensils size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Log Any Meal</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Search Indian food or enter custom macros
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Slot Selector */}
          <View style={styles.slotPickerRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsScroll}>
              {slotsList.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setSelectedSlot(s.key)}
                  style={[
                    styles.slotPill,
                    {
                      backgroundColor: selectedSlot === s.key ? theme.primary : 'rgba(255, 255, 255, 0.04)',
                      borderColor: selectedSlot === s.key ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.slotText,
                      { color: selectedSlot === s.key ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary },
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={[styles.tabBar, { backgroundColor: theme.backgroundSecondary }]}>
            <TouchableOpacity
              onPress={() => setActiveTab('search')}
              style={[
                styles.tabItem,
                activeTab === 'search' && { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
            >
              <Search size={14} color={activeTab === 'search' ? theme.primary : theme.textMuted} />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'search' ? theme.textPrimary : theme.textMuted },
                ]}
              >
                Search Indian Foods (30+)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('custom')}
              style={[
                styles.tabItem,
                activeTab === 'custom' && { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
            >
              <Plus size={14} color={activeTab === 'custom' ? theme.primary : theme.textMuted} />
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'custom' ? theme.textPrimary : theme.textMuted },
                ]}
              >
                Enter Custom Dish
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab 1: Search Indian Foods */}
          {activeTab === 'search' ? (
            <View style={styles.searchContainer}>
              <View
                style={[
                  styles.searchBar,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <Search size={16} color={theme.textMuted} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search Soya, Sattu, Paneer, Dal, Egg, Roti..."
                  placeholderTextColor={theme.textMuted}
                  style={[styles.searchInput, { color: theme.textPrimary }]}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <X size={14} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.foodListContent}
              >
                {/* Instant 1-Tap Auto-Calculated Dish Card */}
                {searchQuery.trim().length >= 2 ? (() => {
                  const est = estimateIndianFoodNutrients(searchQuery);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        addCustomMeal({
                          name: est.name,
                          calories: est.calories,
                          proteinG: est.proteinG,
                          carbsG: est.carbsG,
                          fatG: est.fatG,
                          slot: selectedSlot,
                          quantity: est.servingSize,
                          costInr: est.costInr,
                          date: selectedHistoryDate,
                        });
                        onClose();
                      }}
                      style={[
                        styles.instantLiveLogCard,
                        {
                          backgroundColor: theme.primaryLight,
                          borderColor: theme.primary,
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <View style={styles.instantLiveLeft}>
                        <Sparkles size={18} color={theme.primary} />
                        <View style={{ flex: 1, gap: 2 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={[styles.instantLiveTitle, { color: theme.primary }]}>
                              1-Tap Log "{est.name}"
                            </Text>
                            <View style={[styles.autoDetectedBadge, { backgroundColor: theme.primary }]}>
                              <Text style={styles.autoDetectedText}>AUTO-CALCULATED</Text>
                            </View>
                          </View>
                          <Text style={[styles.instantLiveSub, { color: theme.textSecondary }]}>
                            {est.calories} kcal • {est.proteinG}g Protein • {est.carbsG}g Carbs • {est.servingSize}
                          </Text>
                          <Text style={[styles.instantLiveTip, { color: theme.textMuted }]}>
                            {est.tip}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.instantLiveBtn, { backgroundColor: theme.primary }]}>
                        <Plus size={14} color="#FFFFFF" />
                        <Text style={styles.instantLiveBtnText}>Log Now</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })() : null}

                {filteredFoods.map((food, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleAddPreset(food)}
                    style={[
                      styles.foodCard,
                      {
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    activeOpacity={0.75}
                  >
                    <View style={{ flex: 1, gap: 3 }}>
                      <View style={styles.foodNameRow}>
                        <Text style={[styles.foodName, { color: theme.textPrimary }]}>
                          {food.name}
                        </Text>
                        <Text style={[styles.foodHindi, { color: theme.textMuted }]}>
                          {food.hindiName}
                        </Text>
                      </View>
                      <Text style={[styles.foodMeta, { color: theme.textSecondary }]}>
                        {food.servingSize} • ₹{food.costInr}
                      </Text>
                    </View>

                    <View style={styles.foodMacroPills}>
                      <View style={[styles.macroPill, { backgroundColor: theme.primaryLight }]}>
                        <Text style={[styles.macroPillText, { color: theme.primary }]}>
                          {food.proteinG}g Pro
                        </Text>
                      </View>
                      <View style={[styles.macroPill, { backgroundColor: theme.amberLight }]}>
                        <Text style={[styles.macroPillText, { color: theme.amber }]}>
                          {food.calories} kcal
                        </Text>
                      </View>
                      <View style={[styles.addCircle, { backgroundColor: theme.primary }]}>
                        <Plus size={14} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            /* Tab 2: Free-form Custom Entry */
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.customFormContent}
            >
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  MEAL / DISH NAME (ANY INDIAN FOOD)
                </Text>
                <TextInput
                  value={customName}
                  onChangeText={handleCustomNameChange}
                  placeholder="e.g. Sooji Halwa, Gajar Halwa, Aloo Paratha, Biryani..."
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              </View>

              {/* AI Auto-Fill Intelligence Banner */}
              {hasAutoFilled && detectedInsight ? (
                <View
                  style={[
                    styles.aiInsightBadge,
                    {
                      backgroundColor: theme.primaryLight,
                      borderColor: theme.primary,
                    },
                  ]}
                >
                  <Sparkles size={15} color={theme.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.aiInsightTitle, { color: theme.primary }]}>
                      Auto-Calculated Indian Nutrients
                    </Text>
                    <Text style={[styles.aiInsightText, { color: theme.textSecondary }]}>
                      {detectedInsight}
                    </Text>
                  </View>
                </View>
              ) : null}

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  PORTION / SERVING SIZE
                </Text>
                <TextInput
                  value={customQuantity}
                  onChangeText={setCustomQuantity}
                  placeholder="e.g. 1 Bowl (150g) or 2 Rotis"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              </View>

              {/* Macro Inputs 4-Column Grid */}
              <View style={styles.macroInputRow}>
                <View style={styles.macroInputCol}>
                  <Text style={[styles.macroLabel, { color: theme.amber }]}>Calories (kcal)</Text>
                  <TextInput
                    value={customCalories}
                    onChangeText={setCustomCalories}
                    keyboardType="numeric"
                    style={[
                      styles.macroInput,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View style={styles.macroInputCol}>
                  <Text style={[styles.macroLabel, { color: theme.primary }]}>Protein (g)</Text>
                  <TextInput
                    value={customProtein}
                    onChangeText={setCustomProtein}
                    keyboardType="numeric"
                    style={[
                      styles.macroInput,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View style={styles.macroInputCol}>
                  <Text style={[styles.macroLabel, { color: theme.cyan }]}>Carbs (g)</Text>
                  <TextInput
                    value={customCarbs}
                    onChangeText={setCustomCarbs}
                    keyboardType="numeric"
                    style={[
                      styles.macroInput,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>

                <View style={styles.macroInputCol}>
                  <Text style={[styles.macroLabel, { color: theme.rose }]}>Fat (g)</Text>
                  <TextInput
                    value={customFat}
                    onChangeText={setCustomFat}
                    keyboardType="numeric"
                    style={[
                      styles.macroInput,
                      {
                        backgroundColor: theme.backgroundSecondary,
                        borderColor: theme.cardBorder,
                        color: theme.textPrimary,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  ESTIMATED COST (₹)
                </Text>
                <TextInput
                  value={customCost}
                  onChangeText={setCustomCost}
                  keyboardType="numeric"
                  placeholder="25"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                      color: theme.textPrimary,
                    },
                  ]}
                />
              </View>

              <TouchableOpacity
                onPress={handleAddCustom}
                style={[styles.saveCustomBtn, { backgroundColor: theme.primary }]}
                activeOpacity={0.85}
              >
                <Plus size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                <Text style={[styles.saveCustomText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                  Log This Custom Meal
                </Text>
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
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    height: '88%',
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
  },
  closeBtn: {
    padding: 6,
  },
  slotPickerRow: {
    paddingVertical: 10,
  },
  slotsScroll: {
    gap: 8,
  },
  slotPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  slotText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
    marginBottom: 10,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    flex: 1,
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  foodListContent: {
    gap: 8,
    paddingBottom: 40,
  },
  instantLiveLogCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  instantLiveLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  instantLiveTitle: {
    fontSize: 13,
    fontWeight: '900',
  },
  autoDetectedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoDetectedText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  instantLiveSub: {
    fontSize: 11,
    fontWeight: '700',
  },
  instantLiveTip: {
    fontSize: 10,
    marginTop: 1,
  },
  instantLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  instantLiveBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  foodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '700',
  },
  foodHindi: {
    fontSize: 11,
  },
  foodMeta: {
    fontSize: 10.5,
  },
  foodMacroPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  macroPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  macroPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  addCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customFormContent: {
    gap: 12,
    paddingBottom: 40,
    paddingTop: 4,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  formInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  aiInsightBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  aiInsightTitle: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  aiInsightText: {
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 2,
  },
  macroInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroInputCol: {
    flex: 1,
    gap: 4,
  },
  macroLabel: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  macroInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  saveCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  saveCustomText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
