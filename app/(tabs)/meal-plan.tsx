import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth, MealSlot, LoggedMealEntry } from '../../src/context/AuthContext';
import { CustomMealModal } from '../../src/components/CustomMealModal';
import { MasterDietChartModal } from '../../src/components/MasterDietChartModal';
import {
  Utensils,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Share2,
  Check,
  Flame,
  IndianRupee,
  Clock,
  ChevronRight,
  ShoppingBag,
  ChefHat,
  BookmarkCheck,
} from 'lucide-react-native';

export default function MealPlanScreen() {
  const { theme } = useTheme();
  const {
    user,
    loggedMealsHistory,
    selectedHistoryDate,
    setSelectedHistoryDate,
    getMealsForDate,
    getDayTotals,
    deleteLoggedMeal,
    loggedMealIds,
    toggleMealLogged,
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'diary' | 'schedule' | 'kirana' | 'jugaad'>('diary');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [showDietChartModal, setShowDietChartModal] = useState<boolean>(false);
  const [modalSlot, setModalSlot] = useState<MealSlot>('lunch');
  const [budgetPerDay, setBudgetPerDay] = useState<number>(Math.round(user.weeklyBudgetInr / 7) || 90);
  const insets = useSafeAreaInsets();
  const topSafeDistance = Math.max(insets.top, Platform.OS === 'android' ? 28 : 20) + 12;

  // Generate 7-day past date list for calendar selector
  const generateDatesList = () => {
    const dates: { dateStr: string; dayLabel: string; dayNum: string; isToday: boolean }[] = [];
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate().toString();
      dates.push({
        dateStr,
        dayLabel,
        dayNum,
        isToday: i === 0,
      });
    }
    return dates;
  };

  const datesList = generateDatesList();
  const currentDayMeals = getMealsForDate(selectedHistoryDate);
  const dayTotals = getDayTotals(selectedHistoryDate);

  // Preset 4-slot budget schedule based on budget
  const getPresetSchedule = (budget: number) => {
    if (budget <= 65) {
      return [
        { id: 'b_1', slot: 'Breakfast (8:30 AM)', name: 'Chana Sattu Buttermilk (300ml)', hindi: 'चना सत्तू नमकीन छाछ', calories: 220, protein: 22.5, cost: 12 },
        { id: 'l_1', slot: 'Lunch (1:30 PM)', name: 'Soya Chunks Bhurji + 2 Phulkas + Curd', hindi: 'सोया भुर्जी + 2 रोटी + दही', calories: 460, protein: 34.2, cost: 22 },
        { id: 's_1', slot: 'Evening Snack (5:30 PM)', name: 'Roasted Peanuts (30g) + Green Tea', hindi: 'भुनी मूंगफली', calories: 170, protein: 7.5, cost: 7 },
        { id: 'd_1', slot: 'Dinner (8:30 PM)', name: 'Yellow Moong Dal + 2 Phulkas + Salad', hindi: 'मूंग दाल तड़का + 2 रोटी', calories: 380, protein: 18.0, cost: 16 },
      ];
    } else if (budget <= 100) {
      return [
        { id: 'b_1', slot: 'Breakfast (8:30 AM)', name: 'Sprouted Kala Chana Chaat + Lemon', hindi: 'अंकुरित चना चाट', calories: 260, protein: 16.0, cost: 14 },
        { id: 'l_1', slot: 'Lunch (1:30 PM)', name: 'Soya Curry + 2 Multigrain Rotis + Ghar Ka Dahi', hindi: 'सोया करी + 2 रोटी + दही', calories: 480, protein: 36.0, cost: 25 },
        { id: 's_1', slot: 'Evening Snack (5:30 PM)', name: 'Chana Sattu Shake with Roasted Cumin', hindi: 'सत्तू शरबत', calories: 200, protein: 20.0, cost: 12 },
        { id: 'd_1', slot: 'Dinner (8:30 PM)', name: 'Paneer Bhurji (80g) + 2 Phulkas + Kheera', hindi: 'पनीर भुर्जी + 2 रोटी', calories: 420, protein: 24.5, cost: 35 },
      ];
    } else {
      return [
        { id: 'b_1', slot: 'Breakfast (8:30 AM)', name: 'Besan Paneer Chilla + Mint Chutney', hindi: 'बेसन पनीर चीला', calories: 320, protein: 22.0, cost: 28 },
        { id: 'l_1', slot: 'Lunch (1:30 PM)', name: 'Rajma Masala + 1 Bowl Rice + 100g Paneer', hindi: 'राजमा चावल + पनीर', calories: 540, protein: 38.0, cost: 45 },
        { id: 's_1', slot: 'Evening Snack (5:30 PM)', name: 'Boiled Egg Whites (4) / Sattu Glass', hindi: 'उबले अंडे / सत्तू', calories: 140, protein: 16.5, cost: 24 },
        { id: 'd_1', slot: 'Dinner (8:30 PM)', name: 'Soya Pulao + Kheera Raita + Dal Tadka', hindi: 'सोया पुलाव + रायता + दाल', calories: 460, protein: 32.0, cost: 32 },
      ];
    }
  };

  const presetSchedule = getPresetSchedule(budgetPerDay);

  const handleShareKiranaList = async () => {
    const listText = `*MealFit 7-Day Indian Kirana Grocery List* (${user.dietaryPreference.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━
*High-Yield Protein Staples:*
• Soya Chunks (Nutrela): 500g (~₹65, 260g Protein)
• Chana Sattu (Roasted Gram): 1 kg (~₹120, 220g Protein)
• Kala Chana (Black Chickpeas): 1 kg (~₹95, 200g Protein)
• Yellow Moong Dal: 1 kg (~₹130, 240g Protein)
• Ghar Ka Dahi (Set Curd): 1 kg (~₹80, 45g Protein)

*Grains & Carbs:*
• Whole Wheat Atta (Chakki Fresh): 5 kg (~₹210)
• Rolled Oats: 500g (~₹90)

*Veggies & Fat Source:*
• Desi Ghee: 250g (~₹175)
• Cucumber, Tomatoes, Green Chillies: 2 kg (~₹80)
• Lemons: 6 pieces (~₹20)

━━━━━━━━━━━━━━━━━━━━
*Estimated Weekly Spend:* ₹${user.weeklyBudgetInr}
*Avg Daily Protein:* 95g - 130g
Generated via MealFit India App`;

    try {
      await Share.share({
        message: listText,
        title: 'MealFit 7-Day Kirana List',
      });
    } catch (err) {
      console.log('Share error', err);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: topSafeDistance }]}>
      {/* 1. Header Bar with 1-Tap Log Meal Trigger */}
      <View style={[styles.topBar, { borderBottomColor: theme.cardBorder }]}>
        <View>
          <Text style={[styles.pageHeading, { color: theme.textPrimary }]}>Daily Food & Meals</Text>
          <Text style={[styles.pageSub, { color: theme.textSecondary }]}>
            Day-by-day diary & budget Indian meals
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setModalSlot('lunch');
            setShowCustomModal(true);
          }}
          style={[styles.quickLogBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
        >
          <Plus size={15} color={theme.isDark ? '#000000' : '#FFFFFF'} />
          <Text style={[styles.quickLogText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
            Log Any Meal
          </Text>
        </TouchableOpacity>
      </View>

      {/* 2. Sub-Tab Switcher */}
      <View style={[styles.subTabBar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setActiveSubTab('diary')}
          style={[
            styles.subTabItem,
            activeSubTab === 'diary' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <Calendar size={13} color={activeSubTab === 'diary' ? theme.primary : theme.textMuted} />
          <Text
            style={[
              styles.subTabText,
              { color: activeSubTab === 'diary' ? theme.primary : theme.textSecondary },
            ]}
          >
            Diary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('schedule')}
          style={[
            styles.subTabItem,
            activeSubTab === 'schedule' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <Utensils size={13} color={activeSubTab === 'schedule' ? theme.primary : theme.textMuted} />
          <Text
            style={[
              styles.subTabText,
              { color: activeSubTab === 'schedule' ? theme.primary : theme.textSecondary },
            ]}
          >
            Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('kirana')}
          style={[
            styles.subTabItem,
            activeSubTab === 'kirana' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <ShoppingBag size={13} color={activeSubTab === 'kirana' ? theme.primary : theme.textMuted} />
          <Text
            style={[
              styles.subTabText,
              { color: activeSubTab === 'kirana' ? theme.primary : theme.textSecondary },
            ]}
          >
            Kirana
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab('jugaad')}
          style={[
            styles.subTabItem,
            activeSubTab === 'jugaad' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <ChefHat size={13} color={activeSubTab === 'jugaad' ? theme.primary : theme.textMuted} />
          <Text
            style={[
              styles.subTabText,
              { color: activeSubTab === 'jugaad' ? theme.primary : theme.textSecondary },
            ]}
          >
            Jugaad
          </Text>
        </TouchableOpacity>
      </View>

      {/* Glowing Master Diet Blueprint Launcher */}
      <TouchableOpacity
        onPress={() => setShowDietChartModal(true)}
        style={[
          styles.masterDietLauncher,
          {
            backgroundColor: theme.primaryLight,
            borderColor: theme.primary,
          },
        ]}
        activeOpacity={0.85}
      >
        <View style={styles.masterDietLauncherLeft}>
          <Sparkles size={16} color={theme.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.masterDietLauncherTitle, { color: theme.primary }]}>
              Master Indian Diet Blueprint & Swaps
            </Text>
            <Text style={[styles.masterDietLauncherDesc, { color: theme.textSecondary }]}>
              Pre-Workout ➔ Bedtime • Science Rationale • 1-Tap Swaps
            </Text>
          </View>
        </View>
        <View style={[styles.masterDietLauncherBtn, { backgroundColor: theme.primary }]}>
          <Text style={styles.masterDietLauncherBtnText}>Open</Text>
          <ChevronRight size={12} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* Main Content Areas */}
      {activeSubTab === 'diary' ? (
        /* ================= 1. DAY-BY-DAY FOOD DIARY ================= */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Horizontal Calendar Date Picker Strip */}
          <View style={styles.calendarStrip}>
            {datesList.map((item) => {
              const isSelected = selectedHistoryDate === item.dateStr;
              return (
                <TouchableOpacity
                  key={item.dateStr}
                  onPress={() => setSelectedHistoryDate(item.dateStr)}
                  style={[
                    styles.datePill,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dateDayLabel,
                      { color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted },
                    ]}
                  >
                    {item.dayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dateDayNum,
                      { color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textPrimary },
                    ]}
                  >
                    {item.dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Daily Total Summary Card */}
          <View style={[styles.daySummaryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.summaryTopRow}>
              <View>
                <Text style={[styles.summaryDateTitle, { color: theme.textPrimary }]}>
                  {selectedHistoryDate === new Date().toISOString().split('T')[0] ? "Today's Intake" : `Log for ${selectedHistoryDate}`}
                </Text>
                <Text style={[styles.summaryDateSub, { color: theme.textSecondary }]}>
                  {currentDayMeals.length} items logged
                </Text>
              </View>

              <View style={[styles.calBadge, { backgroundColor: theme.amberLight }]}>
                <Flame size={14} color={theme.amber} />
                <Text style={[styles.calBadgeText, { color: theme.amber }]}>
                  {dayTotals.calories} / {user.dailyCalorieTarget} kcal
                </Text>
              </View>
            </View>

            <View style={styles.macroSummaryRow}>
              <View style={styles.macroSummaryCol}>
                <Text style={[styles.macroVal, { color: theme.primary }]}>{dayTotals.protein}g</Text>
                <Text style={[styles.macroLbl, { color: theme.textSecondary }]}>Protein</Text>
              </View>
              <View style={[styles.dividerVertical, { backgroundColor: theme.cardBorder }]} />
              <View style={styles.macroSummaryCol}>
                <Text style={[styles.macroVal, { color: theme.amber }]}>{dayTotals.carbs}g</Text>
                <Text style={[styles.macroLbl, { color: theme.textSecondary }]}>Carbs</Text>
              </View>
              <View style={[styles.dividerVertical, { backgroundColor: theme.cardBorder }]} />
              <View style={styles.macroSummaryCol}>
                <Text style={[styles.macroVal, { color: theme.rose }]}>{dayTotals.fat}g</Text>
                <Text style={[styles.macroLbl, { color: theme.textSecondary }]}>Fats</Text>
              </View>
              <View style={[styles.dividerVertical, { backgroundColor: theme.cardBorder }]} />
              <View style={styles.macroSummaryCol}>
                <Text style={[styles.macroVal, { color: theme.cyan }]}>₹{dayTotals.cost}</Text>
                <Text style={[styles.macroLbl, { color: theme.textSecondary }]}>Cost</Text>
              </View>
            </View>
          </View>

          {/* Meals List for Selected Date */}
          <View style={styles.mealsListSection}>
            <View style={styles.listHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                MEALS RECORDED ({currentDayMeals.length})
              </Text>
              <TouchableOpacity
                onPress={() => setShowCustomModal(true)}
                style={styles.inlineAddBtn}
              >
                <Plus size={13} color={theme.primary} />
                <Text style={[styles.inlineAddText, { color: theme.primary }]}>+ Add Item</Text>
              </TouchableOpacity>
            </View>

            {currentDayMeals.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <Utensils size={28} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No Meals Logged on this Date</Text>
                <Text style={[styles.emptySub, { color: theme.textSecondary }]}>
                  Tap below to log what you ate from our Indian food catalog or enter custom macros.
                </Text>
                <TouchableOpacity
                  onPress={() => setShowCustomModal(true)}
                  style={[styles.emptyActionBtn, { backgroundColor: theme.primary }]}
                >
                  <Plus size={14} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                  <Text style={[styles.emptyActionText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                    Log Meal for this Day
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              currentDayMeals.map((meal) => (
                <View
                  key={meal.id}
                  style={[
                    styles.mealEntryCard,
                    { backgroundColor: theme.card, borderColor: theme.cardBorder },
                  ]}
                >
                  <View style={styles.mealEntryTop}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={styles.mealTitleRow}>
                        <Text style={[styles.mealEntryName, { color: theme.textPrimary }]}>
                          {meal.name}
                        </Text>
                        {meal.hindiName && (
                          <Text style={[styles.mealEntryHindi, { color: theme.textMuted }]}>
                            {meal.hindiName}
                          </Text>
                        )}
                      </View>
                      <View style={styles.mealMetaRow}>
                        <View style={[styles.slotBadge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                          <Text style={[styles.slotBadgeText, { color: theme.textSecondary }]}>
                            {meal.slot.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={[styles.mealMetaText, { color: theme.textSecondary }]}>
                          {meal.quantity} • {meal.time}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert('Remove Meal', `Remove "${meal.name}" from log?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => deleteLoggedMeal(meal.id) },
                        ]);
                      }}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={16} color={theme.rose} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.entryMacroRow}>
                    <View style={[styles.entryPill, { backgroundColor: theme.primaryLight }]}>
                      <Text style={[styles.entryPillText, { color: theme.primary }]}>
                        {meal.proteinG}g Protein
                      </Text>
                    </View>
                    <View style={[styles.entryPill, { backgroundColor: theme.amberLight }]}>
                      <Text style={[styles.entryPillText, { color: theme.amber }]}>
                        {meal.calories} kcal
                      </Text>
                    </View>
                    <View style={[styles.entryPill, { backgroundColor: theme.cyanLight }]}>
                      <Text style={[styles.entryPillText, { color: theme.cyan }]}>
                        ₹{meal.costInr}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : activeSubTab === 'schedule' ? (
        /* ================= 2. ICMR BUDGET 4-SLOT SCHEDULE ================= */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Budget Selector Pills */}
          {/* Interactive Indian Kirana Budget Customizer Card */}
          <View style={[styles.budgetSelectorBox, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.budgetHeaderRow}>
              <View style={styles.budgetTitleIconRow}>
                <IndianRupee size={18} color={theme.primary} />
                <Text style={[styles.budgetCardHeading, { color: theme.textPrimary }]}>
                  Indian Kirana Budget Customizer
                </Text>
              </View>
              <View style={[styles.savingsTag, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.savingsTagText, { color: theme.primary }]}>
                  Saves ~₹{Math.round(budgetPerDay * 30 * 1.8)} / mo
                </Text>
              </View>
            </View>

            {/* Live Rupee Display & Steppers */}
            <View style={styles.budgetCounterRow}>
              <TouchableOpacity
                onPress={() => setBudgetPerDay((prev) => Math.max(50, prev - 15))}
                style={[styles.stepperBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.stepperBtnText, { color: theme.textPrimary }]}>- ₹15</Text>
              </TouchableOpacity>

              <View style={styles.budgetCenterDisplay}>
                <Text style={[styles.budgetMainAmount, { color: theme.primary }]}>
                  ₹{budgetPerDay * 7} <Text style={{ fontSize: 13, color: theme.textSecondary }}>/ week</Text>
                </Text>
                <Text style={[styles.budgetDailySub, { color: theme.textSecondary }]}>
                  (₹{budgetPerDay} / day • ₹{((budgetPerDay / 100)).toFixed(2)} per g protein)
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setBudgetPerDay((prev) => Math.min(600, prev + 15))}
                style={[styles.stepperBtn, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.stepperBtnText, { color: theme.textPrimary }]}>+ ₹15</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Preset Budget Tier Chips */}
            <View style={styles.budgetPillsRow}>
              {[
                { label: '₹60/d (Student)', val: 60 },
                { label: '₹90/d (Balanced)', val: 90 },
                { label: '₹130/d (High Protein)', val: 130 },
                { label: '₹180/d (Athlete)', val: 180 },
              ].map((tier) => (
                <TouchableOpacity
                  key={tier.val}
                  onPress={() => setBudgetPerDay(tier.val)}
                  style={[
                    styles.budgetPill,
                    {
                      backgroundColor: budgetPerDay === tier.val ? theme.primary : 'rgba(255, 255, 255, 0.03)',
                      borderColor: budgetPerDay === tier.val ? theme.primary : theme.cardBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.budgetPillText,
                      { color: budgetPerDay === tier.val ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {tier.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 4 Timed Slots */}
          <View style={styles.scheduleCardsList}>
            {presetSchedule.map((slot) => {
              const isLogged = loggedMealIds.includes(slot.id);
              return (
                <View
                  key={slot.id}
                  style={[
                    styles.scheduleCard,
                    {
                      backgroundColor: isLogged ? theme.primaryLight : theme.card,
                      borderColor: isLogged ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.scheduleCardHeader}>
                    <View style={styles.slotTimeRow}>
                      <Clock size={12} color={theme.textMuted} />
                      <Text style={[styles.slotTimeText, { color: theme.textMuted }]}>{slot.slot}</Text>
                    </View>
                    <View style={[styles.costPill, { backgroundColor: theme.amberLight }]}>
                      <Text style={[styles.costPillText, { color: theme.amber }]}>₹{slot.cost}</Text>
                    </View>
                  </View>

                  <View style={styles.scheduleBody}>
                    <Text style={[styles.scheduleName, { color: theme.textPrimary }]}>{slot.name}</Text>
                    <Text style={[styles.scheduleHindi, { color: theme.textSecondary }]}>{slot.hindi}</Text>
                  </View>

                  <View style={styles.scheduleFooter}>
                    <View style={styles.scheduleMacros}>
                      <Text style={[styles.scheduleMacroText, { color: theme.primary }]}>
                        +{slot.protein}g Protein
                      </Text>
                      <Text style={[styles.scheduleMacroText, { color: theme.amber }]}>
                        {slot.calories} kcal
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleMealLogged(slot.id, slot.calories, slot.protein, 40, 10)}
                      style={[
                        styles.markEatenBtn,
                        {
                          backgroundColor: isLogged ? theme.primary : 'rgba(255, 255, 255, 0.06)',
                          borderColor: isLogged ? theme.primary : theme.cardBorder,
                        },
                      ]}
                    >
                      <Check size={14} color={isLogged ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted} />
                      <Text
                        style={[
                          styles.markEatenText,
                          { color: isLogged ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary },
                        ]}
                      >
                        {isLogged ? 'Eaten' : 'Mark Eaten'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      ) : activeSubTab === 'kirana' ? (
        /* ================= 3. WHATSAPP KIRANA SHOPPING LIST ================= */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.kiranaBanner, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.kiranaTitleRow}>
              <ShoppingBag size={20} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.kiranaTitle, { color: theme.textPrimary }]}>7-Day Kirana Grocery Bag</Text>
                <Text style={[styles.kiranaSub, { color: theme.textSecondary }]}>
                  Optimized for ₹{user.weeklyBudgetInr}/week • 1-Click WhatsApp Share
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleShareKiranaList}
              style={[styles.whatsappBtn, { backgroundColor: theme.primary }]}
            >
              <Share2 size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
              <Text style={[styles.whatsappBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                Share List on WhatsApp
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.groceryListCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.grocerySectionTitle, { color: theme.primary }]}>
              HIGH-YIELD PROTEIN STAPLES
            </Text>
            <View style={styles.groceryItemRow}>
              <Text style={[styles.groceryItemName, { color: theme.textPrimary }]}>Soya Chunks (Nutrela)</Text>
              <Text style={[styles.groceryItemQty, { color: theme.textSecondary }]}>500g • ₹65 (~260g Protein)</Text>
            </View>
            <View style={styles.groceryItemRow}>
              <Text style={[styles.groceryItemName, { color: theme.textPrimary }]}>Chana Sattu (Roasted Gram)</Text>
              <Text style={[styles.groceryItemQty, { color: theme.textSecondary }]}>1 kg • ₹120 (~220g Protein)</Text>
            </View>
            <View style={styles.groceryItemRow}>
              <Text style={[styles.groceryItemName, { color: theme.textPrimary }]}>Kala Chana (Black Chickpeas)</Text>
              <Text style={[styles.groceryItemQty, { color: theme.textSecondary }]}>1 kg • ₹95 (~200g Protein)</Text>
            </View>
            <View style={styles.groceryItemRow}>
              <Text style={[styles.groceryItemName, { color: theme.textPrimary }]}>Yellow Moong Dal (Split)</Text>
              <Text style={[styles.groceryItemQty, { color: theme.textSecondary }]}>1 kg • ₹130 (~240g Protein)</Text>
            </View>
            <View style={styles.groceryItemRow}>
              <Text style={[styles.groceryItemName, { color: theme.textPrimary }]}>Ghar Ka Dahi (Set Curd)</Text>
              <Text style={[styles.groceryItemQty, { color: theme.textSecondary }]}>1 kg • ₹80 (~45g Protein)</Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        /* ================= 4. FRIDGE JUGAAD LEFTOVERS ================= */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.jugaadCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.jugaadHeader}>
              <ChefHat size={20} color={theme.amber} />
              <View>
                <Text style={[styles.jugaadTitle, { color: theme.textPrimary }]}>High-Protein Missi Dal Paratha</Text>
                <Text style={[styles.jugaadMeta, { color: theme.textSecondary }]}>Repurpose Leftover Dal • +22g Protein</Text>
              </View>
            </View>
            <Text style={[styles.jugaadDesc, { color: theme.textSecondary }]}>
              Mix 1 Katori leftover yellow/black dal with 50g Besan (Gram flour), chopped onion, green chillies, and ajwain. Roll dry without extra oil.
            </Text>
          </View>

          <View style={[styles.jugaadCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.jugaadHeader}>
              <ChefHat size={20} color={theme.primary} />
              <View>
                <Text style={[styles.jugaadTitle, { color: theme.textPrimary }]}>Power Soya Pulao</Text>
                <Text style={[styles.jugaadMeta, { color: theme.textSecondary }]}>Repurpose Leftover Cooked Rice • +30g Protein</Text>
              </View>
            </View>
            <Text style={[styles.jugaadDesc, { color: theme.textSecondary }]}>
              Boil and squeeze 50g Soya Chunks. Saute with mustard seeds, curry leaves, and toss leftover rice with a pinch of turmeric and salt.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Custom Meal Logger Modal */}
      <CustomMealModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        initialSlot={modalSlot}
      />

      {/* Master Diet Chart Modal */}
      <MasterDietChartModal
        visible={showDietChartModal}
        onClose={() => setShowDietChartModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pageHeading: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  pageSub: {
    fontSize: 11,
    marginTop: 1,
  },
  quickLogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  quickLogText: {
    fontSize: 12,
    fontWeight: '800',
  },
  subTabBar: {
    flexDirection: 'row',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  subTabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subTabText: {
    fontSize: 11,
    fontWeight: '700',
  },
  masterDietLauncher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  masterDietLauncherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  masterDietLauncherTitle: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  masterDietLauncherDesc: {
    fontSize: 10.5,
    marginTop: 1,
  },
  masterDietLauncherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  masterDietLauncherBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 48,
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  datePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 2,
  },
  dateDayLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateDayNum: {
    fontSize: 15,
    fontWeight: '900',
  },
  daySummaryCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryDateTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  summaryDateSub: {
    fontSize: 11,
    marginTop: 2,
  },
  calBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  calBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  macroSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
  },
  macroSummaryCol: {
    alignItems: 'center',
    gap: 2,
  },
  macroVal: {
    fontSize: 15,
    fontWeight: '900',
  },
  macroLbl: {
    fontSize: 10,
    fontWeight: '600',
  },
  dividerVertical: {
    width: 1,
    height: 24,
  },
  mealsListSection: {
    gap: 10,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  inlineAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inlineAddText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptySub: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyActionText: {
    fontSize: 12,
    fontWeight: '800',
  },
  mealEntryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  mealEntryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mealEntryName: {
    fontSize: 13,
    fontWeight: '700',
  },
  mealEntryHindi: {
    fontSize: 11,
  },
  mealMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  slotBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  slotBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  mealMetaText: {
    fontSize: 10.5,
  },
  deleteBtn: {
    padding: 4,
  },
  entryMacroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  entryPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  budgetSelectorBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetTitleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetCardHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  savingsTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  savingsTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  budgetCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginVertical: 4,
  },
  stepperBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  stepperBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  budgetCenterDisplay: {
    alignItems: 'center',
  },
  budgetMainAmount: {
    fontSize: 20,
    fontWeight: '900',
  },
  budgetDailySub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  budgetPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  budgetPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  budgetPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  scheduleCardsList: {
    gap: 10,
  },
  scheduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  scheduleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  slotTimeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  costPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  costPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  scheduleBody: {
    gap: 2,
  },
  scheduleName: {
    fontSize: 13,
    fontWeight: '700',
  },
  scheduleHindi: {
    fontSize: 11,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  scheduleMacros: {
    flexDirection: 'row',
    gap: 8,
  },
  scheduleMacroText: {
    fontSize: 11,
    fontWeight: '800',
  },
  markEatenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  markEatenText: {
    fontSize: 11,
    fontWeight: '800',
  },
  kiranaBanner: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  kiranaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kiranaTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  kiranaSub: {
    fontSize: 11,
    marginTop: 2,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  whatsappBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  groceryListCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  grocerySectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  groceryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  groceryItemName: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  groceryItemQty: {
    fontSize: 11,
  },
  jugaadCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  jugaadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  jugaadTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  jugaadMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  jugaadDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
});
