import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { AuthRequiredModal } from '../../src/components/AuthRequiredModal';
import {
  ArrowLeftRight,
  Sparkles,
  Flame,
  Zap,
  Coffee,
  ShieldAlert,
  ChevronRight,
  Dumbbell,
  Droplets,
  Plus,
  Minus,
  Lock,
  ArrowRight,
} from 'lucide-react-native';

export default function SmartSwapsScreen() {
  const { theme } = useTheme();
  const { isLoggedIn } = useAuth();
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'swaps' | 'cheat_decoder' | 'chai_calc'>('swaps');
  const insets = useSafeAreaInsets();
  const topSafeDistance = Math.max(insets.top, Platform.OS === 'android' ? 28 : 20) + 12;

  // Cheat decoder state
  const [selectedCheat, setSelectedCheat] = useState<string>('samosa');

  // Chai calculator state
  const [chaiCups, setChaiCups] = useState<number>(3);
  const [sugarTspPerCup, setSugarTspPerCup] = useState<number>(2);

  const smartSwapsList = [
    {
      title: 'Paneer ➔ Soya Chunks',
      category: 'HIGH-PROTEIN BUDGET SWAP',
      original: { name: '100g Fresh Malai Paneer', protein: '18g Protein', cost: '₹45', calories: '290 kcal' },
      swapped: { name: '50g Nutrela Soya Chunks', protein: '26g Protein', cost: '₹7.5', calories: '175 kcal' },
      benefit: 'Save ₹37.5 per meal & Gain +8g Protein',
      tag: '5x Cheaper',
    },
    {
      title: 'Whey Protein ➔ Chana Sattu + Curd',
      category: 'DAILY PROTEIN DRINK SWAP',
      original: { name: '1 Scoop Imported Whey', protein: '24g Protein', cost: '₹130', calories: '120 kcal' },
      swapped: { name: '50g Sattu + 200ml Chaach', protein: '22g Protein', cost: '₹16', calories: '230 kcal' },
      benefit: 'Save ₹114/day (~₹3,400/month) with natural satiety',
      tag: 'Save ₹3.4k/mo',
    },
    {
      title: 'Maida Paratha ➔ Missi Roti (Besan + Atta)',
      category: 'ROTI & FLOUR SWAP',
      original: { name: '2 Maida Parathas', protein: '4g Protein', cost: '₹20', calories: '380 kcal' },
      swapped: { name: '2 Missi Rotis (50% Besan)', protein: '14g Protein', cost: '₹12', calories: '240 kcal' },
      benefit: 'Cut 140 kcal & Triple your protein (+10g)',
      tag: 'Triple Protein',
    },
  ];

  const cheatItems: Record<string, {
    name: string;
    calories: number;
    fatG: number;
    carbsG: number;
    damageText: string;
    recoveryPlan: string[];
    workoutOffset: string;
  }> = {
    samosa: {
      name: '1 Aloo Samosa (Deep Fried)',
      calories: 290,
      fatG: 18,
      carbsG: 32,
      damageText: 'High trans-fat & refined maida oil load',
      recoveryPlan: [
        'Reduce 1 Phulka at dinner to balance calories.',
        'Add 1 glass warm lemon water post-meal.',
        'Keep evening dinner strictly boiled or grilled.',
      ],
      workoutOffset: '20 mins brisk walk or 3 sets of slow-tempo bodyweight squats.',
    },
    chole_bhature: {
      name: '2 Bhature + Chole',
      calories: 780,
      fatG: 42,
      carbsG: 88,
      damageText: 'Massive sodium & oil spike (~50% of daily calories)',
      recoveryPlan: [
        'Skip evening snack & keep dinner to 1 bowl Moong Dal + Salad.',
        'Drink 1.5L extra water today to clear sodium water retention.',
        'Do not fast tomorrow — keep regular high-protein meals.',
      ],
      workoutOffset: '35 mins living room workout (Push-ups + Glute bridges + Squats).',
    },
    gulab_jamun: {
      name: '2 Gulab Jamun (in Chashni)',
      calories: 320,
      fatG: 14,
      carbsG: 48,
      damageText: 'High sucrose sugar spike (40g liquid sugar)',
      recoveryPlan: [
        'Take a 15-minute post-meal walk to blunt insulin spike.',
        'Switch all subsequent tea/coffee to unsweetened.',
      ],
      workoutOffset: '15 mins core & squat isometric circuit.',
    },
    momos: {
      name: '6 Pcs Fried Paneer Momos',
      calories: 420,
      fatG: 22,
      carbsG: 45,
      damageText: 'Fried maida shell + refined oil dipping chutney',
      recoveryPlan: [
        'Swap to Steamed Soya/Veg momos next time (cuts 180 kcal).',
        'Drink 500ml water to offset spicy sodium chutney.',
      ],
      workoutOffset: '20 mins apartment circuit.',
    },
  };

  const currentCheat = cheatItems[selectedCheat] || cheatItems.samosa;

  // Chai Math
  const totalDailySugarTsp = chaiCups * sugarTspPerCup;
  const totalDailySugarG = totalDailySugarTsp * 4;
  const totalDailyChaiCal = chaiCups * 45 + totalDailySugarG * 4;
  const yearlySugarKg = ((totalDailySugarG * 365) / 1000).toFixed(1);
  const yearlySugarCalories = Math.round(totalDailySugarG * 4 * 365);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: topSafeDistance }]}>
      {/* 1. Header Bar */}
      <View style={[styles.topBar, { borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>Smart Swaps & Intelligence</Text>
        <Text style={[styles.pageSub, { color: theme.textSecondary }]}>
          Desi protein swaps, street food offset & chai decoder
        </Text>
      </View>

      {/* 2. Sub-Tab Switcher */}
      <View style={[styles.subTabBar, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('swaps')}
          style={[
            styles.subTabItem,
            activeTab === 'swaps' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <ArrowLeftRight size={13} color={activeTab === 'swaps' ? theme.primary : theme.textMuted} />
          <Text style={[styles.subTabText, { color: activeTab === 'swaps' ? theme.primary : theme.textSecondary }]}>
            Protein Swaps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('cheat_decoder')}
          style={[
            styles.subTabItem,
            activeTab === 'cheat_decoder' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <ShieldAlert size={13} color={activeTab === 'cheat_decoder' ? theme.primary : theme.textMuted} />
          <Text style={[styles.subTabText, { color: activeTab === 'cheat_decoder' ? theme.primary : theme.textSecondary }]}>
            Cheat Offset
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('chai_calc')}
          style={[
            styles.subTabItem,
            activeTab === 'chai_calc' && { backgroundColor: theme.primaryLight, borderColor: theme.primary },
          ]}
        >
          <Coffee size={13} color={activeTab === 'chai_calc' ? theme.primary : theme.textMuted} />
          <Text style={[styles.subTabText, { color: activeTab === 'chai_calc' ? theme.primary : theme.textSecondary }]}>
            Chai Decoder
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Unauthenticated Feature Lock Banner */}
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
                Member Intelligence Locked
              </Text>
              <Text style={[styles.lockedBannerDesc, { color: theme.textSecondary }]}>
                Sign In with Google or Email to unlock the AI Food Scanner, Protein Linear Optimizer & Cheat Offsets.
              </Text>
            </View>
            <View style={[styles.unlockPill, { backgroundColor: theme.primary }]}>
              <Text style={styles.unlockPillText}>Unlock</Text>
            </View>
          </TouchableOpacity>
        )}

        {activeTab === 'swaps' ? (
          /* ================= 1. PROTEIN SWAPS ================= */
          <View style={styles.swapsList}>
            {smartSwapsList.map((item, idx) => (
              <View
                key={idx}
                style={[styles.swapCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              >
                <View style={styles.swapCardHeader}>
                  <Text style={[styles.swapCategory, { color: theme.textMuted }]}>{item.category}</Text>
                  <View style={[styles.tagBadge, { backgroundColor: theme.amberLight }]}>
                    <Text style={[styles.tagBadgeText, { color: theme.amber }]}>{item.tag}</Text>
                  </View>
                </View>

                <Text style={[styles.swapTitle, { color: theme.textPrimary }]}>{item.title}</Text>

                {/* Before vs After Grid */}
                <View style={styles.compareGrid}>
                  {/* Before */}
                  <View style={[styles.compareBox, { backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: theme.cardBorder }]}>
                    <Text style={[styles.compareKicker, { color: theme.rose }]}>CONVENTIONAL</Text>
                    <Text style={[styles.foodTitle, { color: theme.textPrimary }]}>{item.original.name}</Text>
                    <Text style={[styles.foodDetail, { color: theme.textSecondary }]}>
                      {item.original.protein} • {item.original.calories}
                    </Text>
                    <Text style={[styles.foodCost, { color: theme.textMuted }]}>{item.original.cost} / meal</Text>
                  </View>

                  {/* After */}
                  <View style={[styles.compareBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                    <Text style={[styles.compareKicker, { color: theme.primary }]}>SMART DESI SWAP</Text>
                    <Text style={[styles.foodTitle, { color: theme.textPrimary }]}>{item.swapped.name}</Text>
                    <Text style={[styles.foodDetail, { color: theme.textPrimary }]}>
                      {item.swapped.protein} • {item.swapped.calories}
                    </Text>
                    <Text style={[styles.foodCost, { color: theme.primary }]}>{item.swapped.cost} / meal</Text>
                  </View>
                </View>

                <View style={[styles.benefitBox, { backgroundColor: 'rgba(255, 255, 255, 0.02)' }]}>
                  <Zap size={13} color={theme.amber} />
                  <Text style={[styles.benefitText, { color: theme.amber }]}>{item.benefit}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : activeTab === 'cheat_decoder' ? (
          /* ================= 2. STREET FOOD CHEAT OFFSET ================= */
          <View style={styles.cheatContainer}>
            {/* Street Food Selector */}
            <View style={styles.cheatSelectorRow}>
              {[
                { key: 'samosa', label: 'Samosa' },
                { key: 'chole_bhature', label: 'Bhature' },
                { key: 'gulab_jamun', label: 'Gulab Jamun' },
                { key: 'momos', label: 'Fried Momos' },
              ].map((c) => (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setSelectedCheat(c.key)}
                  style={[
                    styles.cheatPill,
                    {
                      backgroundColor: selectedCheat === c.key ? theme.primary : theme.card,
                      borderColor: selectedCheat === c.key ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cheatPillText,
                      { color: selectedCheat === c.key ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary },
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Selected Cheat Card */}
            <View style={[styles.cheatCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <View style={styles.cheatTop}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.cheatName, { color: theme.textPrimary }]}>{currentCheat.name}</Text>
                  <Text style={[styles.cheatDamage, { color: theme.rose }]}>{currentCheat.damageText}</Text>
                </View>
                <View style={[styles.calBadge, { backgroundColor: theme.amberLight }]}>
                  <Flame size={14} color={theme.amber} />
                  <Text style={[styles.calBadgeText, { color: theme.amber }]}>+{currentCheat.calories} kcal</Text>
                </View>
              </View>

              {/* Recovery Action Steps */}
              <View style={styles.recoverySection}>
                <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>
                  SAME-DAY MEAL RECOVERY PLAN
                </Text>
                {currentCheat.recoveryPlan.map((step, sIdx) => (
                  <View key={sIdx} style={styles.stepRow}>
                    <View style={[styles.dot, { backgroundColor: theme.primary }]} />
                    <Text style={[styles.stepText, { color: theme.textPrimary }]}>{step}</Text>
                  </View>
                ))}
              </View>

              {/* Workout Offset */}
              <View style={[styles.workoutOffsetBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                <Dumbbell size={16} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.offsetTitle, { color: theme.primary }]}>Burn-Off Exercise Prescription</Text>
                  <Text style={[styles.offsetDesc, { color: theme.textSecondary }]}>{currentCheat.workoutOffset}</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          /* ================= 3. CHAI & SUGAR DECODER ================= */
          <View style={[styles.chaiCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.chaiHeader}>
              <Coffee size={22} color={theme.amber} />
              <View>
                <Text style={[styles.chaiTitle, { color: theme.textPrimary }]}>Desi Chai & Sugar Decoder</Text>
                <Text style={[styles.chaiSub, { color: theme.textSecondary }]}>
                  Live liquid sugar audit for Indian tea drinkers
                </Text>
              </View>
            </View>

            {/* Steppers */}
            <View style={styles.stepperContainer}>
              {/* Cups per day */}
              <View style={[styles.stepperBox, { backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: theme.cardBorder }]}>
                <View>
                  <Text style={[styles.stepperLabel, { color: theme.textPrimary }]}>Cups of Chai / Day</Text>
                  <Text style={[styles.stepperSub, { color: theme.textMuted }]}>Standard 120ml cup</Text>
                </View>
                <View style={[styles.counterBox, { backgroundColor: theme.cardElevated }]}>
                  <TouchableOpacity onPress={() => setChaiCups(Math.max(1, chaiCups - 1))} style={styles.counterBtn}>
                    <Minus size={14} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterVal, { color: theme.textPrimary }]}>{chaiCups}</Text>
                  <TouchableOpacity onPress={() => setChaiCups(chaiCups + 1)} style={styles.counterBtn}>
                    <Plus size={14} color={theme.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sugar spoons per cup */}
              <View style={[styles.stepperBox, { backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: theme.cardBorder }]}>
                <View>
                  <Text style={[styles.stepperLabel, { color: theme.textPrimary }]}>Sugar Teaspoons / Cup</Text>
                  <Text style={[styles.stepperSub, { color: theme.textMuted }]}>~4g sugar per tsp</Text>
                </View>
                <View style={[styles.counterBox, { backgroundColor: theme.cardElevated }]}>
                  <TouchableOpacity onPress={() => setSugarTspPerCup(Math.max(0, sugarTspPerCup - 1))} style={styles.counterBtn}>
                    <Minus size={14} color={theme.textPrimary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterVal, { color: theme.textPrimary }]}>{sugarTspPerCup}</Text>
                  <TouchableOpacity onPress={() => setSugarTspPerCup(sugarTspPerCup + 1)} style={styles.counterBtn}>
                    <Plus size={14} color={theme.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Results Grid */}
            <View style={styles.chaiResultsGrid}>
              <View style={[styles.resultBox, { backgroundColor: theme.amberLight }]}>
                <Text style={[styles.resultBig, { color: theme.amber }]}>{totalDailySugarG}g</Text>
                <Text style={[styles.resultLbl, { color: theme.amber }]}>Daily Sugar</Text>
              </View>
              <View style={[styles.resultBox, { backgroundColor: theme.roseLight }]}>
                <Text style={[styles.resultBig, { color: theme.rose }]}>{yearlySugarKg} kg</Text>
                <Text style={[styles.resultLbl, { color: theme.rose }]}>Yearly Sugar</Text>
              </View>
              <View style={[styles.resultBox, { backgroundColor: theme.cyanLight }]}>
                <Text style={[styles.resultBig, { color: theme.cyan }]}>{totalDailyChaiCal} kcal</Text>
                <Text style={[styles.resultLbl, { color: theme.cyan }]}>Daily Calories</Text>
              </View>
            </View>

            <View style={[styles.steviaNudge, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
              <Zap size={14} color={theme.primary} />
              <Text style={[styles.steviaText, { color: theme.primary }]}>
                Swap to natural Stevia / Jaggery to cut {yearlySugarCalories.toLocaleString()} liquid calories/year!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sign In Required Modal */}
      <AuthRequiredModal
        visible={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Unlock Smart Swaps & AI Scanner"
        subtitle="Sign in with Google or Email to unlock AI Multi-Curry Vision Scanner, full Indian protein swap database & cheat offsets."
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
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  pageSub: {
    fontSize: 11,
    marginTop: 1,
  },
  subTabBar: {
    flexDirection: 'row',
    padding: 6,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  subTabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  subTabText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 48,
  },
  swapsList: {
    gap: 12,
  },
  swapCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  swapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  swapCategory: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  swapTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  compareGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  compareBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 3,
  },
  compareKicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  foodTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  foodDetail: {
    fontSize: 11,
    fontWeight: '600',
  },
  foodCost: {
    fontSize: 10.5,
    marginTop: 2,
  },
  benefitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cheatContainer: {
    gap: 14,
  },
  cheatSelectorRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cheatPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  cheatPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cheatCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  cheatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cheatName: {
    fontSize: 14,
    fontWeight: '800',
  },
  cheatDamage: {
    fontSize: 11,
    marginTop: 2,
  },
  calBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  calBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  recoverySection: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 5,
  },
  stepText: {
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
  workoutOffsetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  offsetTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  offsetDesc: {
    fontSize: 11,
    marginTop: 1,
  },
  chaiCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  chaiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chaiTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  chaiSub: {
    fontSize: 11,
    marginTop: 1,
  },
  stepperContainer: {
    gap: 10,
  },
  stepperBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  stepperSub: {
    fontSize: 10.5,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  counterBtn: {
    padding: 4,
  },
  counterVal: {
    fontSize: 14,
    fontWeight: '800',
    minWidth: 18,
    textAlign: 'center',
  },
  chaiResultsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  resultBox: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 2,
  },
  resultBig: {
    fontSize: 16,
    fontWeight: '900',
  },
  resultLbl: {
    fontSize: 10,
    fontWeight: '700',
  },
  steviaNudge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  steviaText: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
});
