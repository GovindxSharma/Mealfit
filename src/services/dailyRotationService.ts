import { DietaryType, GoalType, EquipmentType } from '../context/AuthContext';

export interface DailyWorkoutPlan {
  dayName: string;
  focusTitle: string;
  focusHindi: string;
  intensity: 'High' | 'Moderate' | 'Decompression & Recovery';
  targetMuscles: string;
  burnEstimateKcal: number;
  durationMins: number;
  exercises: {
    id: string;
    name: string;
    hindiCue: string;
    sets: number;
    reps: string;
    tempo: string;
    burnCalories: number;
    phase: 'warmup' | 'strength' | 'cardio' | 'cooldown';
  }[];
}

export interface DailyMealSlotItem {
  name: string;
  hindi: string;
  calories: number;
  proteinG: number;
  costInr: number;
  note: string;
}

export interface DailyMealPlanDay {
  dayName: string;
  dayHindi: string;
  breakfast: DailyMealSlotItem;
  lunch: DailyMealSlotItem;
  eveningSnack: DailyMealSlotItem;
  dinner: DailyMealSlotItem;
  totalCalories: number;
  totalProteinG: number;
  totalCostInr: number;
}

export interface DailySmartSwap {
  dayName: string;
  category: string;
  title: string;
  original: { name: string; protein: string; cost: string; calories: string };
  swapped: { name: string; protein: string; cost: string; calories: string };
  benefit: string;
  badge: string;
}

export interface DailyCoachInsight {
  dayName: string;
  quote: string;
  quoteHindi: string;
  scienceTip: string;
  actionItem: string;
}

export const DailyRotationService = {
  getDayIndex: (date: Date = new Date()): number => {
    return date.getDay();
  },

  getDayName: (date: Date = new Date()): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  },

  getDailyWorkout: (date: Date = new Date(), equipment: EquipmentType[] = ['bodyweight']): DailyWorkoutPlan => {
    const dayIdx = date.getDay();

    const weeklyWorkouts: DailyWorkoutPlan[] = [
      // 0: SUNDAY - Active Recovery & Joint Decompression
      {
        dayName: 'Sunday',
        focusTitle: 'Active Recovery & Spine Decompression',
        focusHindi: 'आराम, लचीलापन और गहरी स्ट्रेचिंग',
        intensity: 'Decompression & Recovery',
        targetMuscles: 'Full Body Mobility & Posture',
        burnEstimateKcal: 160,
        durationMins: 25,
        exercises: [
          { id: 'sun_1', name: 'Cat-Cow & Spine Twists', hindiCue: 'रीढ़ की हड्डी को लचीला बनाएं', sets: 3, reps: '10 Breaths', tempo: 'Slow Flow', burnCalories: 30, phase: 'warmup' },
          { id: 'sun_2', name: 'Deep Squat Hold (Malasana)', hindiCue: 'हिप्स और एड़ी को खोलें', sets: 3, reps: '45s Hold', tempo: 'Static', burnCalories: 45, phase: 'strength' },
          { id: 'sun_3', name: 'Floor Cobra & Child Pose', hindiCue: 'लोअर बैक को आराम दें', sets: 3, reps: '60s Flow', tempo: 'Slow Flow', burnCalories: 40, phase: 'cooldown' },
          { id: 'sun_4', name: 'Diaphragmatic Deep Breathing', hindiCue: 'ऑक्सीजन का प्रवाह बढ़ाएं', sets: 1, reps: '5 Mins', tempo: 'Calm', burnCalories: 45, phase: 'cooldown' },
        ],
      },
      // 1: MONDAY - Upper Body Push & Core Power
      {
        dayName: 'Monday',
        focusTitle: 'Push Strength: Chest, Shoulders & Triceps',
        focusHindi: 'छाती, कंधे और ट्राइसेप्स की मजबूती',
        intensity: 'High',
        targetMuscles: 'Chest, Front Delts, Triceps, Core',
        burnEstimateKcal: 320,
        durationMins: 35,
        exercises: [
          { id: 'mon_1', name: 'Arm Circles & Shoulder Dislocates', hindiCue: 'कंधों का वार्मअप', sets: 2, reps: '15 Reps', tempo: 'Fluid', burnCalories: 35, phase: 'warmup' },
          { id: 'mon_2', name: '3-Sec Eccentric Floor Push-ups', hindiCue: '3 सेकंड धीरे नीचे जाएं', sets: 4, reps: '10-12 Reps', tempo: '3-0-1-0', burnCalories: 110, phase: 'strength' },
          { id: 'mon_3', name: 'Pike Push-ups (Shoulder Press Focus)', hindiCue: 'कंधों पर जोर दें', sets: 3, reps: '8-10 Reps', tempo: '2-1-1-0', burnCalories: 85, phase: 'strength' },
          { id: 'mon_4', name: 'Chair/Sofa Tricep Dips', hindiCue: 'हाथों को सीधा पीछे रखें', sets: 3, reps: '12-15 Reps', tempo: '2-0-1-0', burnCalories: 90, phase: 'strength' },
        ],
      },
      // 2: TUESDAY - Lower Body Leg Power & Glutes
      {
        dayName: 'Tuesday',
        focusTitle: 'Lower Body: Quads, Hamstrings & Glutes',
        focusHindi: 'पैरों और जांघों का फैट बर्निंग वर्कआउट',
        intensity: 'High',
        targetMuscles: 'Quads, Glutes, Calves, Hamstrings',
        burnEstimateKcal: 360,
        durationMins: 35,
        exercises: [
          { id: 'tue_1', name: 'Hip Openers & Leg Swings', hindiCue: 'जोड़ों को एक्टिव करें', sets: 2, reps: '12 Each', tempo: 'Fluid', burnCalories: 40, phase: 'warmup' },
          { id: 'tue_2', name: 'Tempo Air Squats (3s Descent)', hindiCue: 'घुटनों को पंजों की सीध में रखें', sets: 4, reps: '15 Reps', tempo: '3-1-1-0', burnCalories: 130, phase: 'strength' },
          { id: 'tue_3', name: 'Bulgarian Split Squats (Bed/Chair)', hindiCue: 'एक पैर पर फोकस करें', sets: 3, reps: '10 Each', tempo: '2-0-1-0', burnCalories: 110, phase: 'strength' },
          { id: 'tue_4', name: 'Glute Bridge Holds (Squeeze at Top)', hindiCue: 'हिप्स को ऊपर खींचें', sets: 3, reps: '15 Reps + 10s Hold', tempo: '2-2-1-0', burnCalories: 80, phase: 'strength' },
        ],
      },
      // 3: WEDNESDAY - Pull, Upper Back & Posture Alignment
      {
        dayName: 'Wednesday',
        focusTitle: 'Pull & Posture: Back, Rear Delts & Biceps',
        focusHindi: 'पीठ, बाइसेप्स और पोस्चर सीधा करने वाला वर्कआउट',
        intensity: 'Moderate',
        targetMuscles: 'Lats, Rhomboids, Biceps, Forearms',
        burnEstimateKcal: 290,
        durationMins: 30,
        exercises: [
          { id: 'wed_1', name: 'Wall Slides & Scapular Squeezes', hindiCue: 'पीठ की मांसपेशियों को जगाएं', sets: 2, reps: '12 Reps', tempo: 'Slow', burnCalories: 30, phase: 'warmup' },
          { id: 'wed_2', name: 'Doorframe / Towel Isometric Rows', hindiCue: 'कोहनियों को पीछे खींचें', sets: 4, reps: '12 Reps', tempo: '2-1-1-0', burnCalories: 100, phase: 'strength' },
          { id: 'wed_3', name: 'Floor Superman Arch Pulses', hindiCue: 'छाती और जांघें जमीन से उठाएं', sets: 3, reps: '15 Reps', tempo: '2-1-1-0', burnCalories: 85, phase: 'strength' },
          { id: 'wed_4', name: 'Bicep Tension Curls (Bodyweight or Dumbbell)', hindiCue: 'मसल्स को पूरा सिकोड़ें', sets: 3, reps: '12 Reps', tempo: '2-0-2-0', burnCalories: 75, phase: 'strength' },
        ],
      },
      // 4: THURSDAY - Core, Abs & Metabolic Cardio
      {
        dayName: 'Thursday',
        focusTitle: 'Metabolic HIIT & Core Ignition (Zero-Noise)',
        focusHindi: 'बिना आवाज के कोर और बेली फैट बर्निंग',
        intensity: 'High',
        targetMuscles: 'Abs, Obliques, Cardiovascular System',
        burnEstimateKcal: 340,
        durationMins: 30,
        exercises: [
          { id: 'thu_1', name: 'Shadow Boxing with Fast Hands', hindiCue: 'लाइट पैरों पर तेजी से पंच', sets: 3, reps: '60 Seconds', tempo: 'Fast', burnCalories: 60, phase: 'cardio' },
          { id: 'thu_2', name: 'Slow-Tempo Mountain Climbers (Zero Noise)', hindiCue: 'बिना कूदे घुटने छाती तक लाएं', sets: 4, reps: '20 Reps', tempo: '2-0-1-0', burnCalories: 100, phase: 'cardio' },
          { id: 'thu_3', name: 'Hollow Body Hold & Deadbug', hindiCue: 'लोअर बैक को जमीन पर दबाएं', sets: 3, reps: '40s Hold', tempo: 'Static', burnCalories: 90, phase: 'strength' },
          { id: 'thu_4', name: 'Plank Shoulder Taps', hindiCue: 'हिप्स को स्थिर रखें', sets: 3, reps: '16 Taps', tempo: 'Controlled', burnCalories: 90, phase: 'strength' },
        ],
      },
      // 5: FRIDAY - Athletic Full Body Tone & Power
      {
        dayName: 'Friday',
        focusTitle: 'Full Body Athletic Tone & Calorie Incinerator',
        focusHindi: 'पूरे शरीर की टोनिंग और स्टैमिना बूस्ट',
        intensity: 'High',
        targetMuscles: 'Total Body Kinetic Chain',
        burnEstimateKcal: 380,
        durationMins: 35,
        exercises: [
          { id: 'fri_1', name: 'Desi Surya Namaskar Fluid Sequence', hindiCue: 'पूरे शरीर को गर्म करें', sets: 3, reps: '5 Cycles', tempo: 'Flow', burnCalories: 60, phase: 'warmup' },
          { id: 'fri_2', name: 'Squat to Calf Raise & Reach', hindiCue: 'पंजों पर पूरा खड़े हों', sets: 4, reps: '15 Reps', tempo: '2-1-1-0', burnCalories: 110, phase: 'strength' },
          { id: 'fri_3', name: 'Archer Pushups / Knee Pushup Drops', hindiCue: 'छाती की गहराई बढ़ाएं', sets: 3, reps: '8 Each', tempo: '3-0-1-0', burnCalories: 105, phase: 'strength' },
          { id: 'fri_4', name: 'Skater Lunges (Low Impact, Floor Safe)', hindiCue: 'बिना कूदे साइड स्टेप लें', sets: 3, reps: '16 Reps', tempo: 'Rhythmic', burnCalories: 105, phase: 'cardio' },
        ],
      },
      // 6: SATURDAY - Functional Strength & Living Room Conditioning
      {
        dayName: 'Saturday',
        focusTitle: 'Functional Strength & Stamina Builder',
        focusHindi: 'ताकत, संतुलन और वीकेंड फैट बर्निंग',
        intensity: 'High',
        targetMuscles: 'Legs, Core, Shoulders',
        burnEstimateKcal: 350,
        durationMins: 35,
        exercises: [
          { id: 'sat_1', name: 'Torso Twists & Ankle Circles', hindiCue: 'जोड़ों को तैयार करें', sets: 2, reps: '15 Reps', tempo: 'Smooth', burnCalories: 35, phase: 'warmup' },
          { id: 'sat_2', name: '1.5-Rep Deep Squats (Double Pulse)', hindiCue: 'नीचे जाकर आधा उठें फिर नीचे', sets: 4, reps: '10 Reps', tempo: '3-1-1-0', burnCalories: 125, phase: 'strength' },
          { id: 'sat_3', name: 'Pike to Dolphin Floor Press', hindiCue: 'कंधों और बाइसेप्स पर लोड', sets: 3, reps: '10 Reps', tempo: '2-0-1-0', burnCalories: 95, phase: 'strength' },
          { id: 'sat_4', name: 'Side Plank Hip Dips', hindiCue: 'साइड पेट की चर्बी पर अटैक', sets: 3, reps: '10 Each Side', tempo: 'Controlled', burnCalories: 95, phase: 'strength' },
        ],
      },
    ];

    return weeklyWorkouts[dayIdx] || weeklyWorkouts[1];
  },

  getDailyMealSchedule: (
    date: Date = new Date(),
    diet: DietaryType = 'veg',
    budgetWeekly: number = 1000
  ): DailyMealPlanDay => {
    const dayIdx = date.getDay();
    const isNonVeg = diet === 'non_veg';
    const isEgg = diet === 'eggetarian' || isNonVeg;

    const schedules: DailyMealPlanDay[] = [
      // 0: SUNDAY
      {
        dayName: 'Sunday',
        dayHindi: 'रविवार स्पेशल: हल्का, सुपाच्य व संतुलित मील',
        breakfast: { name: 'Chana Sattu Buttermilk + Roasted Almonds', hindi: 'सत्तू नमकीन छाछ + बादाम', calories: 230, proteinG: 23.0, costInr: 16, note: 'Cooling, 23g natural protein' },
        lunch: { name: isNonVeg ? 'Grilled Chicken Breast (120g) + 2 Phulkas + Cucumber Raita' : 'Paneer Bhurji (90g) + 2 Phulkas + Kheera Raita', hindi: isNonVeg ? 'ग्रिल्ड चिकन + 2 रोटी + रायता' : 'पनीर भुर्जी + 2 रोटी + रायता', calories: 480, proteinG: 34.0, costInr: 38, note: 'High protein, satiating meal' },
        eveningSnack: { name: 'Roasted Spiced Makhana (Fox Nuts) + Green Tea', hindi: 'मखाना + ग्रीन टी', calories: 120, proteinG: 4.5, costInr: 12, note: 'Low GI antioxidant crunch' },
        dinner: { name: 'Yellow Moong Dal Khichdi + Curd (150g) + Salad', hindi: 'मूंग दाल खिचड़ी + दही', calories: 390, proteinG: 20.0, costInr: 22, note: 'Gut-friendly recovery dinner' },
        totalCalories: 1220,
        totalProteinG: 81.5,
        totalCostInr: 88,
      },
      // 1: MONDAY
      {
        dayName: 'Monday',
        dayHindi: 'सोमवार: हाई-प्रोटीन एनर्जी स्टार्ट',
        breakfast: { name: isEgg ? '3 Boiled Eggs (2 Whites + 1 Whole) + 1 Multigrain Toast' : 'Sprouted Kala Chana Chaat (100g) + Lemon', hindi: isEgg ? 'उबले अंडे + टोस्ट' : 'अंकुरित चना चाट', calories: 260, proteinG: 18.0, costInr: 18, note: 'Sustained morning fuel' },
        lunch: { name: 'Nutrela Soya Chunks Curry (50g dry) + 2 Phulkas + Curd', hindi: 'सोया करी + 2 रोटी + दही', calories: 470, proteinG: 36.0, costInr: 22, note: 'Massive 36g protein under ₹25' },
        eveningSnack: { name: 'Chana Sattu Spiced Drink (40g) with Roasted Jeera', hindi: 'सत्तू नमकीन शरबत', calories: 175, proteinG: 18.0, costInr: 10, note: 'Post-work energy surge' },
        dinner: { name: 'Arhar / Toor Dal Tadka + 2 Phulkas + Boiled Veggies', hindi: 'तूर दाल तड़का + 2 रोटी + सलाद', calories: 410, proteinG: 19.5, costInr: 20, note: 'Clean evening recovery' },
        totalCalories: 1315,
        totalProteinG: 91.5,
        totalCostInr: 70,
      },
      // 2: TUESDAY
      {
        dayName: 'Tuesday',
        dayHindi: 'मंगलवार: लेग डे व मसल रिकवरी डाइट',
        breakfast: { name: 'Besan & Paneer Cheela + Mint Chutney', hindi: 'बेसन पनीर चीला + चटनी', calories: 310, proteinG: 21.0, costInr: 24, note: 'Complex carbs + high bio-value protein' },
        lunch: { name: 'Rajma Masala (Red Kidney Beans) + 1 Bowl Rice + Salad', hindi: 'राजमा चावल + सलाद', calories: 510, proteinG: 26.0, costInr: 28, note: 'Complete amino acid profile' },
        eveningSnack: { name: 'Roasted Peanuts (30g) + Lemon Chaat Masala', hindi: 'भुनी मूंगफली चाट', calories: 180, proteinG: 8.0, costInr: 8, note: 'Healthy fats & zinc' },
        dinner: { name: 'Soya Bhurji (40g Soya + Onions) + 2 Phulkas + Dahi', hindi: 'सोया भुर्जी + 2 रोटी + दही', calories: 430, proteinG: 32.0, costInr: 22, note: 'Lean nighttime protein' },
        totalCalories: 1430,
        totalProteinG: 87.0,
        totalCostInr: 82,
      },
      // 3: WEDNESDAY
      {
        dayName: 'Wednesday',
        dayHindi: 'बुधवार: सुपर बजट ₹-टू-प्रोटीन डाइट',
        breakfast: { name: 'Chana Sattu with Buttermilk (50g Sattu + 200ml Chaach)', hindi: 'सत्तू छाछ शेक', calories: 240, proteinG: 24.0, costInr: 14, note: 'Best rupee-to-protein breakfast in India' },
        lunch: { name: isNonVeg ? 'Egg Curry (3 Eggs) + 2 Phulkas + Onion Salad' : 'Black Chana Masala + 2 Phulkas + Curd', hindi: isNonVeg ? 'अंडा करी + 2 रोटी' : 'काला चना करी + 2 रोटी + दही', calories: 460, proteinG: 28.0, costInr: 26, note: 'High iron & fiber' },
        eveningSnack: { name: 'Sprouted Moong Chaat with Tomato & Lemon', hindi: 'अंकुरित मूंग चाट', calories: 140, proteinG: 9.0, costInr: 10, note: 'Live digestive enzymes' },
        dinner: { name: 'Yellow Moong Dal + 50g Paneer/Tofu + 2 Phulkas', hindi: 'मूंग दाल + पनीर + 2 रोटी', calories: 440, proteinG: 27.0, costInr: 32, note: 'Double protein dinner punch' },
        totalCalories: 1280,
        totalProteinG: 88.0,
        totalCostInr: 82,
      },
      // 4: THURSDAY
      {
        dayName: 'Thursday',
        dayHindi: 'गुरुवार: लो-जीआई व डिटॉक्स प्रोटीन मील',
        breakfast: { name: 'Vegetable Oats with 20g Soya Powder / Sattu stirred', hindi: 'वेजी ओट्स + सत्तू', calories: 280, proteinG: 17.5, costInr: 16, note: 'Beta-glucan heart health fiber' },
        lunch: { name: 'Soya Pulao (40g Soya) + Kheera Raita (150g)', hindi: 'सोया पुलाव + खीरा रायता', calories: 460, proteinG: 31.0, costInr: 24, note: 'Delicious, low oil prep' },
        eveningSnack: { name: 'Roasted Chana (Phutana) + 5 Walnuts', hindi: 'भुना चना + अखरोट', calories: 190, proteinG: 9.0, costInr: 14, note: 'Omega-3 brain fuel' },
        dinner: { name: 'Lauki (Bottle Gourd) Sabzi + 1 Bowl Chana Dal + 2 Phulkas', hindi: 'लौकी चना दाल + 2 रोटी', calories: 380, proteinG: 21.0, costInr: 20, note: 'Ultra-light for deep sleep' },
        totalCalories: 1310,
        totalProteinG: 78.5,
        totalCostInr: 74,
      },
      // 5: FRIDAY
      {
        dayName: 'Friday',
        dayHindi: 'शुक्रवार: हाई-फाइबर व स्टैमिना डाइट',
        breakfast: { name: isEgg ? '2 Egg Omelette with Spinach & Onion + 1 Toast' : 'Paneer & Coriander Paratha (Dry / Light Ghee)', hindi: isEgg ? 'अंडा ऑमलेट + टोस्ट' : 'पनीर परांठा (कम घी)', calories: 320, proteinG: 20.0, costInr: 24, note: 'High choline for focus' },
        lunch: { name: 'Chole (Chickpea Curry) + 2 Missi Rotis (Besan Blend)', hindi: 'काबुली चना + 2 मिस्सी रोटी', calories: 510, proteinG: 28.0, costInr: 30, note: 'Triple protein flour swap' },
        eveningSnack: { name: 'Sattu Drink + 1 Spoon Jaggery / Rock Salt', hindi: 'सत्तू ड्रिंक', calories: 180, proteinG: 18.0, costInr: 12, note: 'Natural workout booster' },
        dinner: { name: 'Soya Chunks Bhurji + 2 Phulkas + Green Salad', hindi: 'सोया भुर्जी + 2 रोटी + सलाद', calories: 430, proteinG: 33.0, costInr: 20, note: 'Clean 33g protein finish' },
        totalCalories: 1440,
        totalProteinG: 99.0,
        totalCostInr: 86,
      },
      // 6: SATURDAY
      {
        dayName: 'Saturday',
        dayHindi: 'शनिवार: हाई-एनर्जी व मसल बिल्डिंग मील',
        breakfast: { name: 'Moong Dal Cheela with Grated Paneer stuffing', hindi: 'मूंग दाल पनीर चीला', calories: 330, proteinG: 23.0, costInr: 26, note: 'Pure vegetarian power breakfast' },
        lunch: { name: isNonVeg ? 'Chicken Biryani (Home Made, 150g Chicken) + Raita' : 'Paneer & Soya Pulao + Mix Veg Raita', hindi: isNonVeg ? 'होममेड चिकन बिरयानी + रायता' : 'पनीर सोया पुलाव + रायता', calories: 530, proteinG: 38.0, costInr: 45, note: 'Weekend power lunch' },
        eveningSnack: { name: 'Roasted Makhana with Rock Salt & Black Pepper', hindi: 'रोस्टेड मखाना', calories: 130, proteinG: 5.0, costInr: 12, note: 'Light & crunchy' },
        dinner: { name: 'Dal Makhani (Low Cream) + 2 Phulkas + Kheera', hindi: 'दाल मखनी (बिना क्रीम) + 2 रोटी', calories: 450, proteinG: 22.0, costInr: 28, note: 'Satisfying weekend dinner' },
        totalCalories: 1440,
        totalProteinG: 88.0,
        totalCostInr: 111,
      },
    ];

    return schedules[dayIdx] || schedules[1];
  },

  getDailySmartSwap: (date: Date = new Date()): DailySmartSwap => {
    const dayIdx = date.getDay();

    const swaps: DailySmartSwap[] = [
      {
        dayName: 'Sunday',
        category: 'SWEET & DESSERT SWAP',
        title: 'Gulab Jamun ➔ Roasted Makhana Kheer / Mango Shrikhand',
        original: { name: '2 Gulab Jamuns (Sugar Syrup)', protein: '3g Protein', cost: '₹50', calories: '380 kcal' },
        swapped: { name: '1 Cup Saffron Curd Shrikhand', protein: '14g Protein', cost: '₹22', calories: '160 kcal' },
        benefit: 'Cut 220 kcal & 30g refined sugar while gaining +11g protein',
        badge: 'Cut 220 kcal',
      },
      {
        dayName: 'Monday',
        category: 'HIGH-PROTEIN BUDGET SWAP',
        title: 'Paneer ➔ Soya Chunks (Nutrela)',
        original: { name: '100g Fresh Malai Paneer', protein: '18g Protein', cost: '₹45', calories: '290 kcal' },
        swapped: { name: '50g Nutrela Soya Chunks', protein: '26g Protein', cost: '₹7.5', calories: '175 kcal' },
        benefit: 'Save ₹37.5 per meal & Gain +8g Protein at 5x lower cost',
        badge: '5x Cheaper',
      },
      {
        dayName: 'Tuesday',
        category: 'DAILY PROTEIN DRINK SWAP',
        title: 'Imported Whey ➔ Chana Sattu + Chaach',
        original: { name: '1 Scoop Imported Whey', protein: '24g Protein', cost: '₹130', calories: '120 kcal' },
        swapped: { name: '50g Sattu + 200ml Chaach', protein: '22g Protein', cost: '₹16', calories: '230 kcal' },
        benefit: 'Save ₹114/day (~₹3,400/month) with natural satiety',
        badge: 'Save ₹3.4k/mo',
      },
      {
        dayName: 'Wednesday',
        category: 'ROTI & FLOUR SWAP',
        title: 'Maida Paratha ➔ Missi Roti (Besan + Atta)',
        original: { name: '2 Maida Parathas', protein: '4g Protein', cost: '₹20', calories: '380 kcal' },
        swapped: { name: '2 Missi Rotis (50% Besan)', protein: '14g Protein', cost: '₹12', calories: '240 kcal' },
        benefit: 'Cut 140 kcal & Triple your protein (+10g)',
        badge: 'Triple Protein',
      },
      {
        dayName: 'Thursday',
        category: 'TEA & BEVERAGE SWAP',
        title: 'High-Sugar Chai ➔ Spiced Kadha Tea / Elaichi Tea with Jaggery',
        original: { name: '3 Cups Full-Sugar Chai', protein: '2g Protein', cost: '₹30', calories: '240 kcal' },
        swapped: { name: '3 Cups Spiced Ginger Elaichi', protein: '2g Protein', cost: '₹12', calories: '60 kcal' },
        benefit: 'Eliminate 45g hidden refined sugar daily & boost immunity',
        badge: 'Zero Sugar Spike',
      },
      {
        dayName: 'Friday',
        category: 'EVENING SNACK SWAP',
        title: 'Deep-Fried Samosa ➔ Crispy Roasted Kala Chana',
        original: { name: '1 Aloo Samosa (Fried)', protein: '3.5g Protein', cost: '₹20', calories: '290 kcal' },
        swapped: { name: '50g Roasted Chana + Onion Chaat', protein: '11g Protein', cost: '₹10', calories: '170 kcal' },
        benefit: 'Save 120 kcal, cut trans-fats to zero & triple dietary fiber',
        badge: 'Zero Trans-Fat',
      },
      {
        dayName: 'Saturday',
        category: 'GRAIN & RICE SWAP',
        title: 'Polished White Rice ➔ Brown Dalia / Foxtail Millet Pulao',
        original: { name: '1 Big Plate White Rice', protein: '4g Protein', cost: '₹25', calories: '340 kcal' },
        swapped: { name: '1 Bowl Roasted Dalia Pulao', protein: '12g Protein', cost: '₹14', calories: '220 kcal' },
        benefit: 'Lowers glycemic index by 35% & prevents afternoon energy crash',
        badge: 'Sustained Energy',
      },
    ];

    return swaps[dayIdx] || swaps[1];
  },

  getDailyCoachInsight: (date: Date = new Date()): DailyCoachInsight => {
    const dayIdx = date.getDay();

    const insights: DailyCoachInsight[] = [
      {
        dayName: 'Sunday',
        quote: 'Consistency is built in quiet moments. Rest deeply today to attack the week ahead with explosive energy.',
        quoteHindi: 'सच्ची ताकत निरंतरता में है। आज शरीर को रीसेट करें और कल नई ऊर्जा के साथ शुरुआत करें।',
        scienceTip: 'Did you know? 80% of muscle protein synthesis and hormonal recovery happens during deep sleep on rest days.',
        actionItem: 'Aim for 7.5+ hours of sleep and drink 3 Liters of water today.',
      },
      {
        dayName: 'Monday',
        quote: 'Never skip a Monday. Your momentum for the entire week is decided by the first meal and workout you complete today.',
        quoteHindi: 'सोमवार कभी मिस न करें। आज का दिन आपके पूरे हफ्ते की दिशा तय करता है।',
        scienceTip: 'A high-protein breakfast (20g+) suppresses the hunger hormone ghrelin for up to 6 hours after waking.',
        actionItem: 'Log your breakfast before 10 AM to stay ahead of your daily calorie target.',
      },
      {
        dayName: 'Tuesday',
        quote: 'Legs carry the weight of your goals. Slow down the eccentric lowering phase for twice the muscle activation with zero joint pain.',
        quoteHindi: 'पैरों की एक्सरसाइज से शरीर का मेटाबॉलिज्म सबसे तेज बढ़ता है।',
        scienceTip: '3-second eccentric tempo squats trigger 40% higher metabolic calorie burn over 24 hours than fast, uncontrolled reps.',
        actionItem: 'Focus on 3-second slow descent during today’s squats.',
      },
      {
        dayName: 'Wednesday',
        quote: 'You do not need expensive whey to build a legendary physique. Sattu, Soya, and Dals were the ancient warriors’ secrets.',
        quoteHindi: 'देसी डाइट में वो ताकत है जो किसी महंगे सप्लीमेंट में नहीं।',
        scienceTip: 'Soya chunks contain 52g protein per 100g — more than double the protein density of chicken breast or eggs.',
        actionItem: 'Add 40g Soya or Sattu to your lunch or snack today.',
      },
      {
        dayName: 'Thursday',
        quote: 'Water is the cheapest fat-loss supplement on Earth. Keep your cells hydrated, especially in high AQI and heat.',
        quoteHindi: 'भरपूर पानी पीने से शरीर की चर्बी तेजी से बर्न होती है।',
        scienceTip: 'Drinking 500ml of water boosts metabolic rate by 30% for 40 minutes through thermogenesis.',
        actionItem: 'Reach 8 glasses (2000mL) before 4 PM today.',
      },
      {
        dayName: 'Friday',
        quote: 'Finish the work week strong. The workout you least feel like doing is always the one that transforms you the most.',
        quoteHindi: 'हफ्ते का अंत पूरी ताकत से करें। अनुशासन ही सफलता की कुंजी है।',
        scienceTip: 'Apartment zero-noise bodyweight workouts burn equivalent calories to gym machines when rest intervals are kept under 60 seconds.',
        actionItem: 'Use the built-in rest timer during today’s session.',
      },
      {
        dayName: 'Saturday',
        quote: 'Smart fitness is sustainable fitness. Bank your calories intentionally so you can enjoy your weekend meals with zero guilt.',
        quoteHindi: 'स्मार्ट डाइट वो है जो आप जिंदगी भर अपना सकें। संतुलन ही सब कुछ है।',
        scienceTip: 'Calorie banking allows you to create a 200 kcal daily deficit during weekdays, leaving a 1000 kcal buffer for weekend family meals.',
        actionItem: 'Check the Smart Cheat Day tab before your weekend dinner.',
      },
    ];

    return insights[dayIdx] || insights[1];
  },
};
