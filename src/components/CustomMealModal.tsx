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
import {
  Utensils,
  X,
  Search,
  Plus,
  Flame,
  Check,
  Sparkles,
  IndianRupee,
} from 'lucide-react-native';

interface CustomMealModalProps {
  visible: boolean;
  onClose: () => void;
  initialSlot?: MealSlot;
}

interface PresetFood {
  name: string;
  hindiName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  quantity: string;
  costInr: number;
  category: 'staple' | 'protein' | 'snack' | 'carb';
}

const INDIAN_FOOD_DATABASE: PresetFood[] = [
  { name: 'Soya Chunks Curry', hindiName: 'सोया चंक्स करी', calories: 240, proteinG: 26.0, carbsG: 16, fatG: 4.0, quantity: '50g Chunks (1 Bowl)', costInr: 12, category: 'protein' },
  { name: 'Chana Sattu Buttermilk', hindiName: 'चना सत्तू नमकीन छाछ', calories: 220, proteinG: 22.5, carbsG: 26, fatG: 3.5, quantity: '1 Big Glass (300ml)', costInr: 12, category: 'protein' },
  { name: 'Boiled Whole Eggs (3 Eggs)', hindiName: 'उबले अंडे', calories: 210, proteinG: 18.0, carbsG: 1.5, fatG: 14.0, quantity: '3 Large Eggs', costInr: 21, category: 'protein' },
  { name: 'Egg White Bhurji (4 Whites)', hindiName: 'अंडा भुर्जी (4 सफेदी)', calories: 95, proteinG: 16.5, carbsG: 2.0, fatG: 1.5, quantity: '4 Egg Whites', costInr: 28, category: 'protein' },
  { name: 'Low Fat Paneer Bhurji', hindiName: 'पनीर भुर्जी', calories: 260, proteinG: 20.0, carbsG: 6.0, fatG: 16.0, quantity: '100g Low Fat Paneer', costInr: 40, category: 'protein' },
  { name: 'Yellow Moong Dal Tadka', hindiName: 'मूंग दाल तड़का', calories: 150, proteinG: 9.5, carbsG: 22, fatG: 3.0, quantity: '1 Katori (150ml)', costInr: 10, category: 'staple' },
  { name: 'Whole Wheat Phulka / Roti', hindiName: 'गेहूं की रोटी (सूखी)', calories: 80, proteinG: 2.6, carbsG: 16, fatG: 0.5, quantity: '1 Medium Roti', costInr: 3, category: 'carb' },
  { name: 'Ghar Ka Dahi (Curd)', hindiName: 'घर का ताजा दही', calories: 100, proteinG: 4.5, carbsG: 6.0, fatG: 5.5, quantity: '1 Medium Katori (120g)', costInr: 8, category: 'staple' },
  { name: 'Sprouted Kala Chana Chaat', hindiName: 'अंकुरित काला चना', calories: 210, proteinG: 13.0, carbsG: 32, fatG: 2.5, quantity: '1 Bowl (150g)', costInr: 10, category: 'protein' },
  { name: 'Roasted Peanuts (Moongfali)', hindiName: 'भुनी मूंगफली', calories: 170, proteinG: 7.5, carbsG: 6.0, fatG: 14.0, quantity: '1 Handful (30g)', costInr: 7, category: 'snack' },
  { name: 'Besan Chilla with Paneer', hindiName: 'बेसन चीला + पनीर', calories: 280, proteinG: 16.0, carbsG: 24, fatG: 12.0, quantity: '1 Large Chilla', costInr: 25, category: 'protein' },
  { name: 'Rajma Masala Curry', hindiName: 'राजमा मसाला', calories: 230, proteinG: 12.0, carbsG: 38, fatG: 4.5, quantity: '1 Big Bowl (200ml)', costInr: 18, category: 'staple' },
  { name: 'Chole (Kabuli Chana)', hindiName: 'चना मसाला', calories: 250, proteinG: 11.5, carbsG: 40, fatG: 5.5, quantity: '1 Big Bowl (200ml)', costInr: 20, category: 'staple' },
  { name: 'Chicken Breast Curry / Roast', hindiName: 'चिकन ब्रेस्ट करी', calories: 240, proteinG: 31.0, carbsG: 2.0, fatG: 11.0, quantity: '120g Boneless Chicken', costInr: 45, category: 'protein' },
  { name: 'Masala Oats with Veggies', hindiName: 'मसाला ओट्स', calories: 220, proteinG: 8.5, carbsG: 36, fatG: 4.5, quantity: '1 Bowl (50g Oats)', costInr: 18, category: 'carb' },
  { name: 'Desi Chai (1 Cup, 1 tsp Sugar)', hindiName: 'दूध वाली चाय', calories: 75, proteinG: 2.0, carbsG: 9.0, fatG: 3.5, quantity: '1 Cup (120ml)', costInr: 6, category: 'snack' },
];

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
  const [customCalories, setCustomCalories] = useState<string>('350');
  const [customProtein, setCustomProtein] = useState<string>('20');
  const [customCarbs, setCustomCarbs] = useState<string>('40');
  const [customFat, setCustomFat] = useState<string>('10');
  const [customQuantity, setCustomQuantity] = useState<string>('1 Serving');
  const [customCost, setCustomCost] = useState<string>('25');

  const filteredFoods = INDIAN_FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.hindiName.includes(searchQuery)
  );

  const handleAddPreset = (food: PresetFood) => {
    addCustomMeal({
      name: food.name,
      hindiName: food.hindiName,
      calories: food.calories,
      proteinG: food.proteinG,
      carbsG: food.carbsG,
      fatG: food.fatG,
      slot: selectedSlot,
      quantity: food.quantity,
      costInr: food.costInr,
      date: selectedHistoryDate,
    });
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
                        {food.quantity} • ₹{food.costInr}
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
                  MEAL / DISH NAME
                </Text>
                <TextInput
                  value={customName}
                  onChangeText={setCustomName}
                  placeholder="e.g. Maa ke hath ki Kadhi Chawal + Salad"
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

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.textSecondary }]}>
                  PORTION / SERVING SIZE
                </Text>
                <TextInput
                  value={customQuantity}
                  onChangeText={setCustomQuantity}
                  placeholder="e.g. 1 Bowl (200g) or 2 Rotis"
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
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
