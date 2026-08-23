export type MealSlotType =
  | 'pre_workout'
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'evening_snack'
  | 'dinner'
  | 'bedtime';

export type DietType = 'veg' | 'jain' | 'eggetarian' | 'non_veg';

export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'recomp' | 'low_gi_pcod';

export interface MealAlternative {
  id: string;
  name: string;
  hindiName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  costInr: number;
  quickNote: string;
}

export interface MasterDietMeal {
  id: string;
  name: string;
  hindiName: string;
  slot: MealSlotType;
  recommendedTime: string;
  dietTypes: DietType[];
  goals: FitnessGoal[];
  budgetTier: 'kirana_budget' | 'standard' | 'high_protein';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  costInr: number;
  prepTimeMin: number;
  ingredients: string[];
  whyWeAdviseThis: string;
  scientificBenefit: string;
  absorptionTip?: string;
  alternatives: MealAlternative[];
}

export const MASTER_INDIAN_DIET_CHART: MasterDietMeal[] = [
  // ================= PRE-WORKOUT =================
  {
    id: 'pre_sattu_lemon',
    name: 'Chana Sattu Pre-Workout Elixir',
    hindiName: 'चना सत्तू नींबू शरबत',
    slot: 'pre_workout',
    recommendedTime: '06:30 AM (30-45 mins before training)',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'recomp', 'low_gi_pcod'],
    budgetTier: 'kirana_budget',
    calories: 140,
    proteinG: 10.5,
    carbsG: 18.0,
    fatG: 2.0,
    fiberG: 4.5,
    costInr: 8,
    prepTimeMin: 2,
    ingredients: ['30g Roasted Chana Sattu', '250ml Water', '1/2 Lemon juice', 'Pinch of Rock Salt (Sendha Namak)', 'Roasted Cumin (Jeera)'],
    whyWeAdviseThis: 'Sattu provides slow-burning complex carbohydrates and essential amino acids without spiking blood sugar, preventing pre-workout energy crashes.',
    scientificBenefit: 'Rich in potassium and magnesium which prime neuromuscular excitability and prevent muscle cramping during heavy sets.',
    absorptionTip: 'Lemon juice adds Vitamin C, which accelerates non-heme iron absorption by 250% from roasted chana.',
    alternatives: [
      {
        id: 'alt_coffee_banana',
        name: 'Black Coffee + Small Robusta Banana',
        hindiName: 'काली कॉफी + केला',
        calories: 110,
        proteinG: 1.5,
        carbsG: 24,
        fatG: 0.3,
        costInr: 10,
        quickNote: 'Caffeine blocks adenosine receptors for instant central nervous system drive, while fructose and glucose restore liver glycogen.',
      },
      {
        id: 'alt_dates_almonds',
        name: '3 Medjool Dates + 6 Soaked Almonds',
        hindiName: '3 खजूर + 6 भीगे बादाम',
        calories: 155,
        proteinG: 3.2,
        carbsG: 26,
        fatG: 4.5,
        costInr: 18,
        quickNote: 'Immediate glucose release from dates with steady sustained energy from almond monounsaturated fats.',
      },
    ],
  },
  {
    id: 'pre_beetroot_curd',
    name: 'Beetroot & Dahi Nitric Oxide Pre-Run Bowl',
    hindiName: 'चुकंदर और दही का कटोरा',
    slot: 'pre_workout',
    recommendedTime: '06:30 AM (45 mins before cardio/gym)',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['muscle_gain', 'recomp'],
    budgetTier: 'standard',
    calories: 165,
    proteinG: 8.0,
    carbsG: 22.0,
    fatG: 3.5,
    fiberG: 3.2,
    costInr: 16,
    prepTimeMin: 5,
    ingredients: ['100g Fresh Grated Beetroot', '150g Homemade Dahi (Curd)', 'Pinch of Black Pepper', 'Pinch of Rock Salt'],
    whyWeAdviseThis: 'Dietary nitrates in beetroot convert into nitric oxide (NO) in the bloodstream, dilating blood vessels and boosting oxygen delivery to working muscles.',
    scientificBenefit: 'Clinical sports trials prove beetroot nitrate ingestion reduces oxygen cost of exercise and improves time-to-exhaustion by 15%.',
    absorptionTip: 'Avoid antibacterial mouthwash after consuming beetroot, as oral bacteria are required to reduce nitrate (NO3) to nitrite (NO2).',
    alternatives: [
      {
        id: 'alt_oat_milk_shake',
        name: 'Oats & Cinnamon Banana Shake',
        hindiName: 'ओट्स केला शेक',
        calories: 210,
        proteinG: 7.5,
        carbsG: 38,
        fatG: 3.0,
        costInr: 20,
        quickNote: 'Cinnamon mimics insulin activity, shuttling glucose directly into skeletal muscle cells rather than adipose fat stores.',
      },
    ],
  },

  // ================= BREAKFAST =================
  {
    id: 'bf_moong_paneer_chilla',
    name: 'Sprouted Moong & Paneer Protein Chilla (2 Pcs)',
    hindiName: 'अंकुरित मूंग और पनीर चीला',
    slot: 'breakfast',
    recommendedTime: '08:30 AM - 09:15 AM',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'muscle_gain', 'recomp', 'low_gi_pcod'],
    budgetTier: 'standard',
    calories: 360,
    proteinG: 27.5,
    carbsG: 34.0,
    fatG: 12.0,
    fiberG: 8.5,
    costInr: 32,
    prepTimeMin: 12,
    ingredients: ['60g Sprouted Green Moong Batter', '50g Low-Fat Crumbled Paneer', 'Green Chillies', 'Ginger (omit for Jain)', '1 tsp Cold-Pressed Mustard Oil'],
    whyWeAdviseThis: 'Combining sprouted yellow/green moong with dairy casein/whey in paneer completes the amino acid score (PDCAAS = 1.0), maximizing Muscle Protein Synthesis (MPS).',
    scientificBenefit: 'Sprouting legumes deactivates phytic acid and enzyme inhibitors, increasing zinc, magnesium, and protein bioavailability by up to 40%.',
    absorptionTip: 'Pair with raw mint and coriander chutney rather than sugary ketchup to keep glycemic load extremely low.',
    alternatives: [
      {
        id: 'alt_egg_bhurji_toast',
        name: '3 Egg Bhurji (2 Whole + 1 White) + 1 Multigrain Roti',
        hindiName: '3 अंडों की भुर्जी + 1 रोटी',
        calories: 330,
        proteinG: 25.0,
        carbsG: 22,
        fatG: 14.0,
        costInr: 26,
        quickNote: 'Egg albumin provides the highest biological value (BV = 100) with complete choline for cognitive alertness.',
      },
      {
        id: 'alt_soya_poha',
        name: 'High-Protein Soya Granule & Peanut Poha',
        hindiName: 'सोया और मूंगफली पोहा',
        calories: 380,
        proteinG: 26.5,
        carbsG: 45,
        fatG: 8.5,
        costInr: 18,
        quickNote: 'Budget Indian champion: 40g soya granules + 15g peanuts creates a powerhouse breakfast under ₹20.',
      },
      {
        id: 'alt_besan_methi_chilla',
        name: 'Besan & Fresh Methi (Fenugreek) Chilla with Curd',
        hindiName: 'बेसन मेथी चीला और दही',
        calories: 320,
        proteinG: 20.0,
        carbsG: 36,
        fatG: 9.0,
        costInr: 22,
        quickNote: 'Methi leaves contain 4-hydroxyisoleucine, a unique amino acid that stimulates glucose-dependent insulin secretion, ideal for PCOD/diabetic health.',
      },
    ],
  },
  {
    id: 'bf_sattu_buttermilk_mega',
    name: 'Bihari High-Protein Chana Sattu Buttermilk Shake',
    hindiName: 'देसी चना सत्तू और छाछ प्रोटीन शेक',
    slot: 'breakfast',
    recommendedTime: '08:30 AM - 09:00 AM',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'low_gi_pcod', 'recomp'],
    budgetTier: 'kirana_budget',
    calories: 290,
    proteinG: 24.5,
    carbsG: 32.0,
    fatG: 6.0,
    fiberG: 9.2,
    costInr: 15,
    prepTimeMin: 3,
    ingredients: ['60g Pure Roasted Chana Sattu', '250ml Fresh Spiced Buttermilk (Chaas)', 'Green Chili', 'Fresh Coriander', 'Roasted Jeera Powder', 'Kala Namak'],
    whyWeAdviseThis: 'India’s ultimate indigenous superfood: 100% natural, zero processed chemicals, packed with insoluble fiber that eliminates mid-morning cravings.',
    scientificBenefit: 'Contains resistant starch which feeds Akkermansia muciniphila bacteria in the gut, strengthening the intestinal barrier and lowering systemic inflammation.',
    absorptionTip: 'Do not boil or heat sattu; drinking it cold or room temp preserves the delicate B-vitamins and active enzyme profile.',
    alternatives: [
      {
        id: 'alt_paneer_paratha_dahi',
        name: 'Single Thick Palak Paneer Roti + 100g Dahi',
        hindiName: 'पालक पनीर रोटी + दही',
        calories: 370,
        proteinG: 22.0,
        carbsG: 38,
        fatG: 13.0,
        costInr: 34,
        quickNote: 'Incorporating spinach puree into dough adds folate and lutein without bloating.',
      },
    ],
  },

  // ================= MID-MORNING SNACK =================
  {
    id: 'snack_roasted_makhana_peanuts',
    name: 'Turmeric Roasted Foxnuts (Makhana) & Roasted Peanuts',
    hindiName: 'हल्दी भुना मखाना और मूंगफली',
    slot: 'mid_morning',
    recommendedTime: '11:00 AM - 11:30 AM',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'low_gi_pcod', 'recomp'],
    budgetTier: 'standard',
    calories: 175,
    proteinG: 7.2,
    carbsG: 18.0,
    fatG: 8.5,
    fiberG: 3.8,
    costInr: 18,
    prepTimeMin: 4,
    ingredients: ['25g Makhana (Lotus Seeds)', '15g Roasted Peanuts', '1/2 tsp Desi Ghee', 'Turmeric (Haldi)', 'Pink Salt'],
    whyWeAdviseThis: 'Makhana has a glycemic index of ~40 with a satisfying crunch, stopping cortisol-driven hunger spikes between breakfast and lunch.',
    scientificBenefit: 'Contains the flavonoid kaempferol, a potent anti-aging polyphenol that combats cellular oxidative stress and supports vascular elasticity.',
    absorptionTip: 'Roasting in a half teaspoon of pure A2 Desi Ghee allows fat-soluble curcumin in turmeric to be properly absorbed into the lymphatic system.',
    alternatives: [
      {
        id: 'alt_sprouts_chaat',
        name: 'Kala Chana & Moong Sprouts Lime Chaat',
        hindiName: 'चना और मूंग अंकुरित चाट',
        calories: 160,
        proteinG: 9.8,
        carbsG: 24,
        fatG: 1.8,
        costInr: 12,
        quickNote: 'Raw raw fiber + onion + tomato + lemon creates bulk in stomach, triggering CCK (cholecystokinin) satiety hormones.',
      },
      {
        id: 'alt_dahi_chia',
        name: 'Probiotic Dahi with Soaked Chia Seeds',
        hindiName: 'दही और चिया बीज',
        calories: 150,
        proteinG: 8.5,
        carbsG: 12,
        fatG: 6.5,
        costInr: 20,
        quickNote: 'Delivers 2.5g alpha-linolenic acid (Omega-3) along with live Lactobacillus probiotic cultures.',
      },
    ],
  },

  // ================= LUNCH =================
  {
    id: 'lunch_soya_matar_phulka',
    name: 'Nutri Soya Chunk & Matar Curry + 2 Multigrain Phulkas + Cucumber Salad',
    hindiName: 'सोया चंक्स मटर करी + 2 फुल्के + खीरा सलाद',
    slot: 'lunch',
    recommendedTime: '01:15 PM - 02:00 PM',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'muscle_gain', 'recomp'],
    budgetTier: 'kirana_budget',
    calories: 490,
    proteinG: 38.5,
    carbsG: 58.0,
    fatG: 8.5,
    fiberG: 14.5,
    costInr: 24,
    prepTimeMin: 18,
    ingredients: ['60g Dry Soya Chunks (boiled & rinsed)', '30g Green Peas (Matar)', '2 Whole Wheat + Jowar Rotis (60g flour)', 'Tomato Onion Curry Gravy', '1 Large Sliced Cucumber'],
    whyWeAdviseThis: 'Soya chunks are the undisputed Indian protein champion with 52g protein per 100g, delivering high leucine concentrations to trigger muscle building at an unbeatable ₹24 price.',
    scientificBenefit: 'Contains soy isoflavones genistein and daidzein which assist in lipid clearance and LDL reduction without affecting testosterone levels in males (validated by meta-analyses).',
    absorptionTip: 'Rinsing and squeezing boiled soya chunks in cold water removes residual saponins, completely preventing digestive gas or bloating.',
    alternatives: [
      {
        id: 'alt_chicken_curry_roti',
        name: 'Home-Style Chicken Breast Curry (150g) + 2 Phulkas + Salad',
        hindiName: 'घर की चिकन करी (150g) + 2 रोटी',
        calories: 480,
        proteinG: 42.0,
        carbsG: 46,
        fatG: 11.0,
        costInr: 70,
        quickNote: 'Leanest animal protein source with high creatine and carnosine content for athletic power output.',
      },
      {
        id: 'alt_paneer_dal_tadka',
        name: 'Yellow Dal Tadka + 100g Pan-Seared Paneer + 1 Phulka + Salad',
        hindiName: 'दाल तड़का + 100g पनीर + 1 रोटी',
        calories: 510,
        proteinG: 30.0,
        carbsG: 48,
        fatG: 21.0,
        costInr: 50,
        quickNote: 'Traditional comforting combination providing steady leucine and calcium without heavy cream.',
      },
      {
        id: 'alt_egg_curry_rice',
        name: '3 Boiled Egg Curry + 1 Katori Brown Rice / 2 Rotis',
        hindiName: 'अंडा करी + ब्राउन राइस / रोटी',
        calories: 450,
        proteinG: 24.0,
        carbsG: 50,
        fatG: 14.0,
        costInr: 35,
        quickNote: 'Complete amino acid profile with bioavailable zinc, selenium, and lutein for eye health.',
      },
    ],
  },
  {
    id: 'lunch_rajma_paneer_salad',
    name: 'Punjabi Rajma (Kidney Beans) + 80g Paneer + Steamed Rice (1 Katori)',
    hindiName: 'पंजाबी राजमा + पनीर + चावल',
    slot: 'lunch',
    recommendedTime: '01:30 PM - 02:15 PM',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['muscle_gain', 'recomp'],
    budgetTier: 'standard',
    calories: 540,
    proteinG: 31.0,
    carbsG: 68.0,
    fatG: 14.0,
    fiberG: 12.0,
    costInr: 45,
    prepTimeMin: 25,
    ingredients: ['60g Raw Jammu Rajma', '80g Low-Fat Paneer cubes', '50g Raw Basmati Rice (cooked)', 'Ginger Garlic Hing Tadka', 'Onion Rings with Lemon'],
    whyWeAdviseThis: 'The methionine in rice perfectly pairs with the lysine in kidney beans, synthesizing complete proteins while paneer delivers instant dairy BCAAs.',
    scientificBenefit: 'Rajma is one of the highest fiber legumes (15g fiber per cup), stimulating GLP-1 peptide release that stabilizes postprandial glucose for 5 hours.',
    absorptionTip: 'Soak rajma for 10-12 hours with a pinch of baking soda to break down oligosaccharides for zero flatulence.',
    alternatives: [
      {
        id: 'alt_chole_bhurji',
        name: 'Pindi Chana (Chickpeas) + Soya Bhurji + 2 Rotis',
        hindiName: 'पिंडी चना + सोया भुर्जी + 2 रोटी',
        calories: 520,
        proteinG: 34.0,
        carbsG: 62,
        fatG: 10.0,
        costInr: 32,
        quickNote: 'Combining kabuli chana and soya provides over 30g plant protein and 16g dietary fiber.',
      },
    ],
  },

  // ================= EVENING SNACK =================
  {
    id: 'snack_roasted_chana_chaat',
    name: 'Bhuna Kala Chana (Roasted Bengal Gram) + Curd Dip',
    hindiName: 'भुना चना और पुदीना दही',
    slot: 'evening_snack',
    recommendedTime: '05:30 PM - 06:00 PM',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'low_gi_pcod', 'recomp'],
    budgetTier: 'kirana_budget',
    calories: 210,
    proteinG: 14.5,
    carbsG: 28.0,
    fatG: 3.5,
    fiberG: 8.0,
    costInr: 12,
    prepTimeMin: 3,
    ingredients: ['45g Roasted Kala Chana (with skin/chilka)', '100g Hung Curd / Dahi', 'Mint (Pudina)', 'Black Salt', 'Lemon Juice'],
    whyWeAdviseThis: 'Roasted chana retains its fibrous husk, offering a low glycemic load of 8, making it impossible for excess calories to be deposited as abdominal visceral fat.',
    scientificBenefit: 'Packed with molybdenum, an essential trace element that activates sulfite oxidase, aiding the liver in endogenous detoxification.',
    absorptionTip: 'Always eat chana with its brown skin (chilka); discarding the skin removes 60% of the polyphenol content.',
    alternatives: [
      {
        id: 'alt_paneer_tikka_pan',
        name: 'Pan-Tossed Masala Paneer Cubes (80g)',
        hindiName: 'मसाला पनीर टिक्का (80g)',
        calories: 210,
        proteinG: 15.0,
        carbsG: 4.0,
        fatG: 14.0,
        costInr: 32,
        quickNote: 'Pure high-fat, low-carb satiety bomb that crushes evening sugar and junk cravings instantly.',
      },
      {
        id: 'alt_egg_white_chaat',
        name: '3 Boiled Egg Whites with Chaat Masala & Lime',
        hindiName: '3 उबले अंडे की सफेदी चाट',
        calories: 60,
        proteinG: 12.0,
        carbsG: 1.0,
        fatG: 0.2,
        costInr: 18,
        quickNote: 'Virtually 100% pure protein with near-zero carbs or fat, ideal for strict fat-loss deficits.',
      },
    ],
  },

  // ================= DINNER =================
  {
    id: 'din_yellow_dal_palak_paneer',
    name: 'Yellow Moong Dal + Palak Paneer Stir-Fry + 1 Jowar/Wheat Roti',
    hindiName: 'पीली मूंग दाल + पालक पनीर + 1 ज्वार/गेहूं रोटी',
    slot: 'dinner',
    recommendedTime: '08:00 PM - 08:45 PM (At least 2h before bed)',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'recomp', 'low_gi_pcod'],
    budgetTier: 'standard',
    calories: 420,
    proteinG: 26.5,
    carbsG: 44.0,
    fatG: 13.5,
    fiberG: 10.5,
    costInr: 38,
    prepTimeMin: 20,
    ingredients: ['40g Yellow Split Moong Dal (cooked thick)', '80g Low-Fat Paneer', '150g Fresh Spinach (Palak)', '1 Jowar / Multigrain Roti', 'Hing & Jeera Tadka'],
    whyWeAdviseThis: 'Yellow moong is the easiest legume to digest at night, preventing nocturnal acid reflux or sleep disruption while spinach magnesium induces parasympathetic relaxation.',
    scientificBenefit: 'Jowar (sorghum) contains complex tannins that slow gastric emptying, preventing nighttime hypoglycemia and waking up fatigued.',
    absorptionTip: 'Cook palak lightly for 3 minutes rather than over-boiling to preserve heat-sensitive folates and chlorophyll.',
    alternatives: [
      {
        id: 'alt_grilled_fish_tikka',
        name: 'Grilled Rohu / Basa Fish Tikka (150g) + Steamed Veggies',
        hindiName: 'ग्रिल्ड फिश टिक्का (150g) + सब्जियां',
        calories: 360,
        proteinG: 34.0,
        carbsG: 12,
        fatG: 16.0,
        costInr: 85,
        quickNote: 'Direct source of EPA/DHA Omega-3 fatty acids that optimize brain serotonin and nocturnal recovery.',
      },
      {
        id: 'alt_soya_vegetable_khichdi',
        name: 'Soya Granule & Quinoa / Brown Rice Khichdi + Dahi',
        hindiName: 'सोया और क्विनोआ खिचड़ी + दही',
        calories: 410,
        proteinG: 28.0,
        carbsG: 48,
        fatG: 8.0,
        costInr: 28,
        quickNote: 'Single-pot gut comforting dinner loaded with prebiotics and 28g complete plant protein.',
      },
      {
        id: 'alt_tofu_stir_fry',
        name: 'Sesame Garlic Soya Tofu (150g) + Sauteed Capsicum & Carrots',
        hindiName: 'तिल और लहसुन टोफू (150g) + शिमला मिर्च',
        calories: 320,
        proteinG: 22.0,
        carbsG: 16,
        fatG: 18.0,
        costInr: 40,
        quickNote: '100% dairy-free, low-calorie dinner packed with isoflavones and bioavailable calcium.',
      },
    ],
  },

  // ================= BEDTIME =================
  {
    id: 'bed_haldi_ashwagandha_milk',
    name: 'Desi Golden Turmeric Milk with Ashwagandha & Nutmeg',
    hindiName: 'हल्दी और अश्वगंधा वाला दूध',
    slot: 'bedtime',
    recommendedTime: '10:00 PM - 10:30 PM (30 mins before sleep)',
    dietTypes: ['veg', 'jain', 'eggetarian', 'non_veg'],
    goals: ['fat_loss', 'muscle_gain', 'recomp', 'low_gi_pcod'],
    budgetTier: 'standard',
    calories: 140,
    proteinG: 7.5,
    carbsG: 10.0,
    fatG: 6.5,
    fiberG: 0.5,
    costInr: 16,
    prepTimeMin: 4,
    ingredients: ['200ml Cow Milk (or Almond Milk for vegan)', '1/2 tsp Pure Turmeric (Haldi)', '1/4 tsp Organic Ashwagandha Powder', 'Pinch of Black Pepper (Kali Mirch)', 'Pinch of Jaiphal (Nutmeg)'],
    whyWeAdviseThis: 'Casein protein in milk digests slowly over 7 hours during sleep, feeding muscles with an anti-catabolic amino acid drip all night long.',
    scientificBenefit: 'Withanolides in Ashwagandha reduce evening salivary cortisol by up to 28%, significantly increasing Deep Non-REM Stage 3 restorative sleep.',
    absorptionTip: 'Piperine in black pepper increases curcumin bioavailability from turmeric by 2000% (20-fold).',
    alternatives: [
      {
        id: 'alt_chamomile_cinnamon',
        name: 'Warm Cinnamon & Chamomile Infusion (Zero Dairy)',
        hindiName: 'दालचीनी और कैमोमाइल हर्बल चाय',
        calories: 15,
        proteinG: 0.2,
        carbsG: 3.0,
        fatG: 0.1,
        costInr: 12,
        quickNote: 'Apigenin in chamomile binds to GABA-A receptors in the brain, inducing natural muscle relaxation with 0 calories.',
      },
    ],
  },
];

export const getDietChartForUser = (
  goal: FitnessGoal = 'fat_loss',
  diet: DietType = 'veg',
  budget: 'all' | 'kirana_budget' | 'standard' | 'high_protein' = 'all'
): MasterDietMeal[] => {
  return MASTER_INDIAN_DIET_CHART.filter((meal) => {
    // Diet filter
    const matchesDiet = meal.dietTypes.includes(diet);
    // Goal filter
    const matchesGoal = meal.goals.includes(goal) || meal.goals.length === 4;
    // Budget filter
    const matchesBudget = budget === 'all' || meal.budgetTier === budget;

    return matchesDiet && matchesGoal && matchesBudget;
  });
};

export const getSlotTitle = (slot: MealSlotType): { en: string; hi: string; icon: string } => {
  switch (slot) {
    case 'pre_workout':
      return { en: 'Pre-Workout Energizer', hi: 'व्यायाम से पहले', icon: '' };
    case 'breakfast':
      return { en: 'High-Protein Breakfast', hi: 'नाश्ता', icon: '' };
    case 'mid_morning':
      return { en: 'Mid-Morning Focus Snack', hi: 'सुबह का स्नैक', icon: '' };
    case 'lunch':
      return { en: 'Power Athletic Lunch', hi: 'दोपहर का भोजन', icon: '' };
    case 'evening_snack':
      return { en: 'Evening Recovery Snack', hi: 'शाम का नाश्ता', icon: '' };
    case 'dinner':
      return { en: 'Light Restorative Dinner', hi: 'रात का खाना', icon: '' };
    case 'bedtime':
      return { en: 'Nocturnal Recovery Elixir', hi: 'सोने से पहले', icon: '' };
  }
};
