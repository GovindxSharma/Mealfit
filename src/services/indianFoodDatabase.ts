export interface IndianFoodItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'staple' | 'curry' | 'south_indian' | 'snack' | 'protein' | 'dessert' | 'beverage';
  diet: 'veg' | 'jain' | 'eggetarian' | 'non_veg';
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  costInr: number;
  glycemicIndex: 'Low' | 'Medium' | 'High';
  nutritionTip: string;
}

export const INDIAN_FOOD_DATABASE: IndianFoodItem[] = [
  // ================= DESSERTS & HALWAS =================
  {
    id: 'halwa_sooji',
    name: 'Sooji Halwa / Rava Sheera (Desi Ghee)',
    hindiName: 'सूजी का हलवा / शीरा',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Medium Bowl (120g)',
    calories: 310,
    proteinG: 4.8,
    carbsG: 44.0,
    fatG: 13.5,
    fiberG: 1.2,
    costInr: 20,
    glycemicIndex: 'High',
    nutritionTip: 'Semolina cooked in A2 Desi Ghee & cardamom; high energy density, best post-workout or during refeeds.',
  },
  {
    id: 'halwa_gajar',
    name: 'Gajar Ka Halwa (Carrot Halwa with Mawa & Dry Fruits)',
    hindiName: 'गाजर का हलवा',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Medium Bowl (150g)',
    calories: 285,
    proteinG: 6.5,
    carbsG: 38.0,
    fatG: 12.5,
    fiberG: 3.8,
    costInr: 35,
    glycemicIndex: 'Medium',
    nutritionTip: 'Carrots provide beta-carotene and dietary fiber; milk solids (khoya) add bioavailable dairy calcium and protein.',
  },
  {
    id: 'halwa_moong_dal',
    name: 'Moong Dal Halwa (Rich Desi Ghee & Almonds)',
    hindiName: 'मूंग दाल का हलवा',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Medium Bowl (120g)',
    calories: 380,
    proteinG: 9.8,
    carbsG: 39.0,
    fatG: 21.0,
    fiberG: 2.8,
    costInr: 45,
    glycemicIndex: 'Medium',
    nutritionTip: 'Highest protein Indian sweet due to yellow split moong dal; slow roasting develops easily digestible starches.',
  },
  {
    id: 'halwa_atta',
    name: 'Kada Prasad / Atta Halwa (Wheat Halwa with Ghee)',
    hindiName: 'आटे का हलवा / कड़ा प्रसाद',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Medium Bowl (120g)',
    calories: 345,
    proteinG: 4.9,
    carbsG: 46.0,
    fatG: 16.0,
    fiberG: 2.5,
    costInr: 18,
    glycemicIndex: 'High',
    nutritionTip: 'Traditional whole wheat preparation rich in energy, best consumed after intense athletic training.',
  },
  {
    id: 'halwa_besan',
    name: 'Besan Halwa / Sheera (Gram Flour)',
    hindiName: 'बेसन का हलवा / शीरा',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Medium Bowl (120g)',
    calories: 330,
    proteinG: 7.4,
    carbsG: 38.0,
    fatG: 16.5,
    fiberG: 3.2,
    costInr: 22,
    glycemicIndex: 'Medium',
    nutritionTip: 'Gram flour provides zinc and complex carbohydrates; popular traditional soothing remedy for sore throats.',
  },
  {
    id: 'halwa_lauki',
    name: 'Lauki Halwa / Doodhi Halwa (Bottle Gourd)',
    hindiName: 'लौकी का हलवा / दूधी हलवा',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Big Bowl (150g)',
    calories: 215,
    proteinG: 5.2,
    carbsG: 29.0,
    fatG: 9.0,
    fiberG: 2.8,
    costInr: 25,
    glycemicIndex: 'Low',
    nutritionTip: 'Lowest calorie Indian halwa option made from nutrient-dense bottle gourd and toned milk.',
  },

  // ================= PARATHAS & STUFFED ROTIS =================
  {
    id: 'paratha_aloo',
    name: 'Aloo Paratha (with 1/2 tsp Butter/Ghee)',
    hindiName: 'आलू पराठा (मक्खन/घी सहित)',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Large Paratha (120g)',
    calories: 280,
    proteinG: 5.5,
    carbsG: 43.0,
    fatG: 9.8,
    fiberG: 3.8,
    costInr: 15,
    glycemicIndex: 'Medium',
    nutritionTip: 'Pair with 1 bowl of low-fat Dahi to lower the glycemic response and add 6g of protein.',
  },
  {
    id: 'paratha_paneer',
    name: 'High-Protein Paneer Paratha (Home Style)',
    hindiName: 'पनीर पराठा (घर का बना)',
    category: 'protein',
    diet: 'veg',
    servingSize: '1 Large Paratha (70g paneer filling)',
    calories: 340,
    proteinG: 17.5,
    carbsG: 32.0,
    fatG: 16.5,
    fiberG: 3.5,
    costInr: 35,
    glycemicIndex: 'Low',
    nutritionTip: 'Delivers 17.5g of slow-digesting casein protein, ideal for breakfast or post-gym recovery.',
  },
  {
    id: 'paratha_gobi',
    name: 'Gobi Paratha (Spiced Cauliflower)',
    hindiName: 'गोभी पराठा',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Large Paratha (110g)',
    calories: 235,
    proteinG: 6.0,
    carbsG: 35.0,
    fatG: 8.5,
    fiberG: 4.5,
    costInr: 16,
    glycemicIndex: 'Low',
    nutritionTip: 'Cauliflower adds sulforaphane and indole-3-carbinol, supporting liver detoxification pathways.',
  },
  {
    id: 'paratha_sattu',
    name: 'Bihari Sattu Paratha / Makuni',
    hindiName: 'सत्तू का पराठा / मकुनी',
    category: 'protein',
    diet: 'veg',
    servingSize: '1 Large Paratha (40g sattu filling)',
    calories: 310,
    proteinG: 14.8,
    carbsG: 44.0,
    fatG: 8.5,
    fiberG: 6.5,
    costInr: 15,
    glycemicIndex: 'Low',
    nutritionTip: 'Roasted chana sattu stuffing provides high insoluble fiber and sustained satiety for 4+ hours.',
  },
  {
    id: 'paratha_methi_thepla',
    name: 'Gujarati Methi Thepla (2 Pcs)',
    hindiName: 'मेथी थेपला (2 पीस)',
    category: 'staple',
    diet: 'veg',
    servingSize: '2 Medium Theplas (70g total)',
    calories: 240,
    proteinG: 6.8,
    carbsG: 36.0,
    fatG: 8.0,
    fiberG: 4.2,
    costInr: 12,
    glycemicIndex: 'Low',
    nutritionTip: 'Fresh fenugreek leaves improve insulin sensitivity and glycemic clearance.',
  },

  // ================= POPULAR CURRIES, DALS & BIRYANIS =================
  {
    id: 'biryani_chicken_dum',
    name: 'Hyderabadi Chicken Dum Biryani',
    hindiName: 'चिकन दम बिरयानी',
    category: 'curry',
    diet: 'non_veg',
    servingSize: '1 Full Plate (350g)',
    calories: 540,
    proteinG: 34.0,
    carbsG: 68.0,
    fatG: 14.5,
    fiberG: 3.5,
    costInr: 120,
    glycemicIndex: 'Medium',
    nutritionTip: 'High protein athletic meal; pairing with cucumber/onion raita aids digestion and reduces glycemic spike.',
  },
  {
    id: 'biryani_veg_dum',
    name: 'Hyderabadi Veg Dum Biryani with Paneer & Veggies',
    hindiName: 'वेज दम बिरयानी',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Full Plate (350g)',
    calories: 440,
    proteinG: 13.5,
    carbsG: 72.0,
    fatG: 12.0,
    fiberG: 6.0,
    costInr: 70,
    glycemicIndex: 'Medium',
    nutritionTip: 'Aromatic spices like star anise, cloves, and cinnamon enhance glucose uptake into skeletal muscle.',
  },
  {
    id: 'kadhi_pakora_home',
    name: 'Punjabi Kadhi Pakora (Besan & Curd Gravy)',
    hindiName: 'कढ़ी पकोड़ा',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (200ml)',
    calories: 260,
    proteinG: 8.8,
    carbsG: 24.0,
    fatG: 14.5,
    fiberG: 3.2,
    costInr: 20,
    glycemicIndex: 'Low',
    nutritionTip: 'Fermented sour dahi base provides lactic acid and gut-friendly probiotics.',
  },
  {
    id: 'bhindi_masala_sabzi',
    name: 'Home Bhindi Masala (Okra Sabzi)',
    hindiName: 'भिंडी मसाला',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (150g)',
    calories: 140,
    proteinG: 3.8,
    carbsG: 14.0,
    fatG: 8.0,
    fiberG: 5.5,
    costInr: 22,
    glycemicIndex: 'Low',
    nutritionTip: 'Mucilaginous soluble fiber in okra coats the stomach lining and slows carbohydrate absorption.',
  },
  {
    id: 'aloo_gobi_matar_curry',
    name: 'Home Aloo Gobi Matar Curry',
    hindiName: 'आलू गोभी मटर',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (180g)',
    calories: 185,
    proteinG: 5.2,
    carbsG: 27.0,
    fatG: 6.8,
    fiberG: 5.4,
    costInr: 18,
    glycemicIndex: 'Medium',
    nutritionTip: 'Comforting staple; pair with high-protein yellow dal or paneer to balance the macro ratio.',
  },
  {
    id: 'baingan_bharta_roasted',
    name: 'Punjabi Baingan Bharta (Char-Roasted Eggplant)',
    hindiName: 'बैंगन का भरता',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (180g)',
    calories: 135,
    proteinG: 3.4,
    carbsG: 12.5,
    fatG: 7.8,
    fiberG: 5.0,
    costInr: 16,
    glycemicIndex: 'Low',
    nutritionTip: 'Extremely low in calories; nasunin in eggplant skin protects brain cell membranes from oxidation.',
  },
  {
    id: 'kheer_rice_dryfruits',
    name: 'Rice Kheer (Basmati Rice, Milk & Nuts)',
    hindiName: 'चावल की खीर',
    category: 'dessert',
    diet: 'veg',
    servingSize: '1 Medium Bowl (150g)',
    calories: 240,
    proteinG: 6.8,
    carbsG: 36.0,
    fatG: 8.2,
    fiberG: 0.8,
    costInr: 25,
    glycemicIndex: 'Medium',
    nutritionTip: 'Milk provides complete whey/casein protein with calcium; cardamom stimulates digestive enzymes.',
  },
  {
    id: 'litti_chokha_bihar',
    name: 'Bihari Litti Chokha (2 Littis + Baingan Tamatar Chokha)',
    hindiName: 'लिट्टी चोखा (2 लिट्टी + चोखा)',
    category: 'staple',
    diet: 'veg',
    servingSize: '2 Littis with Chokha & 1 tsp Ghee',
    calories: 460,
    proteinG: 18.5,
    carbsG: 74.0,
    fatG: 11.0,
    fiberG: 9.5,
    costInr: 30,
    glycemicIndex: 'Low',
    nutritionTip: 'Traditional roasted staple with zero deep frying; high sattu protein and fiber.',
  },
  {
    id: 'khaman_dhokla_gujarat',
    name: 'Gujarati Khaman Dhokla (4 Pcs)',
    hindiName: 'खमन ढोकला (4 पीस)',
    category: 'snack',
    diet: 'veg',
    servingSize: '4 Steamed Pieces (120g)',
    calories: 190,
    proteinG: 6.8,
    carbsG: 32.0,
    fatG: 4.5,
    fiberG: 2.8,
    costInr: 20,
    glycemicIndex: 'Medium',
    nutritionTip: '100% steamed snack made from fermented gram flour (besan), extremely light on digestion.',
  },
  {
    id: 'vada_pav_mumbai',
    name: 'Mumbai Vada Pav with Garlic Chutney (1 Pc)',
    hindiName: 'मुंबई वड़ा पाव',
    category: 'snack',
    diet: 'veg',
    servingSize: '1 Vada Pav (110g)',
    calories: 290,
    proteinG: 5.2,
    carbsG: 38.0,
    fatG: 13.0,
    fiberG: 2.2,
    costInr: 15,
    glycemicIndex: 'High',
    nutritionTip: 'Fried spiced potato patty in pav bread; enjoy during designated cheat meals.',
  },
  {
    id: 'mutton_curry_home',
    name: 'Home-Style Mutton Curry (150g Mutton)',
    hindiName: 'मटन करी',
    category: 'curry',
    diet: 'non_veg',
    servingSize: '1 Big Bowl (150g Mutton with Gravy)',
    calories: 380,
    proteinG: 32.0,
    carbsG: 5.0,
    fatG: 26.0,
    fiberG: 1.0,
    costInr: 140,
    glycemicIndex: 'Low',
    nutritionTip: 'Rich in vitamin B12, zinc, and bioavailable heme iron; high in natural dietary creatine.',
  },

  // ================= STAPLES & ROTIS =================
  {
    id: 'roti_plain',
    name: 'Plain Phulka / Whole Wheat Roti',
    hindiName: 'सादा फुल्का / गेहूं की रोटी',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Medium Roti (30g flour)',
    calories: 85,
    proteinG: 3.1,
    carbsG: 17.5,
    fatG: 0.5,
    fiberG: 2.3,
    costInr: 2,
    glycemicIndex: 'Medium',
    nutritionTip: 'Complex whole wheat grain provides sustained release beta-glucans and B vitamins.',
  },
  {
    id: 'roti_ghee',
    name: 'Phulka with 1/2 tsp Desi Ghee',
    hindiName: 'देसी घी लगी रोटी',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Medium Roti + 2.5g Ghee',
    calories: 110,
    proteinG: 3.1,
    carbsG: 17.5,
    fatG: 3.2,
    fiberG: 2.3,
    costInr: 5,
    glycemicIndex: 'Low',
    nutritionTip: 'Desi ghee slows carbohydrate gastric clearance, reducing the postprandial insulin spike by 22%.',
  },
  {
    id: 'jowar_roti',
    name: 'Jowar (Sorghum) Bhakri Roti',
    hindiName: 'ज्वार की रोटी',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Medium Bhakri (40g flour)',
    calories: 120,
    proteinG: 4.2,
    carbsG: 26.0,
    fatG: 1.0,
    fiberG: 4.8,
    costInr: 6,
    glycemicIndex: 'Low',
    nutritionTip: '100% Gluten-free millet powerhouse rich in resistant starch and polyphenols.',
  },
  {
    id: 'bajra_roti',
    name: 'Bajra (Pearl Millet) Roti',
    hindiName: 'बाजरे की रोटी',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Medium Roti (40g flour)',
    calories: 135,
    proteinG: 4.6,
    carbsG: 27.0,
    fatG: 1.8,
    fiberG: 5.2,
    costInr: 6,
    glycemicIndex: 'Low',
    nutritionTip: 'Exceptional source of non-heme iron and magnesium, ideal for winter thermogenesis.',
  },
  {
    id: 'steamed_rice_white',
    name: 'Steamed White Basmati Rice',
    hindiName: 'उबले सफेद चावल',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Standard Katori (150g cooked)',
    calories: 195,
    proteinG: 4.1,
    carbsG: 43.0,
    fatG: 0.4,
    fiberG: 0.8,
    costInr: 8,
    glycemicIndex: 'High',
    nutritionTip: 'Pair with high-protein Dal or Rajma to create a complete amino acid profile.',
  },
  {
    id: 'steamed_rice_brown',
    name: 'Steamed Brown Rice',
    hindiName: 'ब्राउन राइस (उबले)',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Standard Katori (150g cooked)',
    calories: 165,
    proteinG: 4.5,
    carbsG: 34.0,
    fatG: 1.2,
    fiberG: 3.5,
    costInr: 14,
    glycemicIndex: 'Medium',
    nutritionTip: 'Retains the fiber-rich bran and germ layer containing manganese and magnesium.',
  },
  {
    id: 'dal_khichdi',
    name: 'Moong Dal Khichdi with Ghee',
    hindiName: 'मूंग दाल खिचड़ी',
    category: 'staple',
    diet: 'veg',
    servingSize: '1 Big Bowl (250g)',
    calories: 280,
    proteinG: 11.5,
    carbsG: 46.0,
    fatG: 6.0,
    fiberG: 5.5,
    costInr: 18,
    glycemicIndex: 'Medium',
    nutritionTip: 'The ultimate Ayurvedic restorative meal, extremely gentle on gut microflora.',
  },

  // ================= DALS & CURRIES =================
  {
    id: 'yellow_moong_dal',
    name: 'Yellow Moong Dal Tadka (Home Style)',
    hindiName: 'पीली मूंग दाल तड़का',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Standard Katori (150ml)',
    calories: 145,
    proteinG: 9.2,
    carbsG: 19.5,
    fatG: 3.5,
    fiberG: 4.5,
    costInr: 12,
    glycemicIndex: 'Low',
    nutritionTip: 'Lightest legume on the digestive system with high folate and potassium content.',
  },
  {
    id: 'dal_makhani_dhaba',
    name: 'Dhaba Style Dal Makhani (Butter & Cream)',
    hindiName: 'दाल मखनी (मक्खन और क्रीम)',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Standard Katori (180ml)',
    calories: 340,
    proteinG: 11.0,
    carbsG: 28.0,
    fatG: 21.0,
    fiberG: 6.5,
    costInr: 45,
    glycemicIndex: 'Medium',
    nutritionTip: 'High caloric density due to butter/cream; enjoy in moderation during refeed days.',
  },
  {
    id: 'rajma_masala',
    name: 'Punjabi Rajma Masala (Red Kidney Beans)',
    hindiName: 'पंजाबी राजमा मसाला',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (200ml)',
    calories: 220,
    proteinG: 13.5,
    carbsG: 34.0,
    fatG: 4.5,
    fiberG: 9.5,
    costInr: 22,
    glycemicIndex: 'Low',
    nutritionTip: 'Loaded with soluble fiber that binds to bile salts and naturally lowers serum cholesterol.',
  },
  {
    id: 'chole_masala',
    name: 'Amritsari Chole (Kabuli Chickpeas)',
    hindiName: 'अमृतसरी छोले',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (200ml)',
    calories: 260,
    proteinG: 14.2,
    carbsG: 38.0,
    fatG: 6.5,
    fiberG: 10.5,
    costInr: 25,
    glycemicIndex: 'Low',
    nutritionTip: 'Contains choline and prebiotic oligosaccharides that boost brain neurotransmitter synthesis.',
  },
  {
    id: 'paneer_butter_masala',
    name: 'Paneer Butter Masala (Restaurant Gravy)',
    hindiName: 'पनीर बटर मसाला',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Standard Bowl (180g)',
    calories: 390,
    proteinG: 16.5,
    carbsG: 14.0,
    fatG: 31.0,
    fiberG: 2.5,
    costInr: 75,
    glycemicIndex: 'Medium',
    nutritionTip: 'Rich in dairy calcium, but high in saturated fats from cashew paste and butter.',
  },
  {
    id: 'palak_paneer_home',
    name: 'Healthy Home Palak Paneer',
    hindiName: 'घर का पालक पनीर',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (200g)',
    calories: 240,
    proteinG: 17.5,
    carbsG: 9.0,
    fatG: 15.5,
    fiberG: 5.5,
    costInr: 42,
    glycemicIndex: 'Low',
    nutritionTip: 'Synergistic combination: calcium from paneer + magnesium, lutein & iron from spinach.',
  },
  {
    id: 'soya_chunk_curry',
    name: 'High-Protein Soya Chunk Curry',
    hindiName: 'सोया चंक्स करी',
    category: 'curry',
    diet: 'veg',
    servingSize: '1 Big Bowl (50g dry soya)',
    calories: 220,
    proteinG: 26.5,
    carbsG: 16.0,
    fatG: 4.5,
    fiberG: 7.5,
    costInr: 16,
    glycemicIndex: 'Low',
    nutritionTip: 'The #1 cost-to-protein ratio in Indian nutrition: 52g protein per 100g dry weight.',
  },
  {
    id: 'chicken_curry_home',
    name: 'Home-Style Chicken Breast Curry',
    hindiName: 'घर की चिकन करी',
    category: 'curry',
    diet: 'non_veg',
    servingSize: '1 Big Bowl (150g chicken)',
    calories: 275,
    proteinG: 38.0,
    carbsG: 6.0,
    fatG: 11.0,
    fiberG: 1.5,
    costInr: 65,
    glycemicIndex: 'Low',
    nutritionTip: 'Zero carbohydrate lean protein source packed with creatine and bioavailable heme-iron.',
  },
  {
    id: 'egg_curry_2eggs',
    name: 'Dhaba Egg Curry (2 Whole Eggs)',
    hindiName: 'अंडा करी (2 अंडे)',
    category: 'curry',
    diet: 'eggetarian',
    servingSize: '2 Eggs + Gravy',
    calories: 230,
    proteinG: 14.5,
    carbsG: 7.0,
    fatG: 16.0,
    fiberG: 1.5,
    costInr: 25,
    glycemicIndex: 'Low',
    nutritionTip: 'Complete amino acid score with active lutein, zeaxanthin and choline for brain cognition.',
  },

  // ================= SOUTH INDIAN STAPLES =================
  {
    id: 'idli_sambar_2pcs',
    name: 'Steamed Rice & Urad Dal Idli (2 Pcs) + Sambar',
    hindiName: 'इडली और सांभर (2 पीस)',
    category: 'south_indian',
    diet: 'veg',
    servingSize: '2 Medium Idlis + 150ml Sambar',
    calories: 210,
    proteinG: 7.8,
    carbsG: 41.0,
    fatG: 2.1,
    fiberG: 4.5,
    costInr: 25,
    glycemicIndex: 'Medium',
    nutritionTip: 'Naturally fermented with live wild lactobacilli, boosting B-complex vitamin synthesis.',
  },
  {
    id: 'plain_dosa_sambar',
    name: 'Crispy Plain Dosa + Sambar (No Chutney)',
    hindiName: 'प्लेन डोसा और सांभर',
    category: 'south_indian',
    diet: 'veg',
    servingSize: '1 Large Dosa + 150ml Sambar',
    calories: 260,
    proteinG: 6.5,
    carbsG: 48.0,
    fatG: 5.5,
    fiberG: 3.5,
    costInr: 30,
    glycemicIndex: 'Medium',
    nutritionTip: 'Fermented batter improves mineral bioaccessibility while retaining a light crisp texture.',
  },
  {
    id: 'masala_dosa_aloo',
    name: 'Masala Dosa with Potato Filling + Coconut Chutney',
    hindiName: 'मसाला डोसा और नारियल चटनी',
    category: 'south_indian',
    diet: 'veg',
    servingSize: '1 Large Masala Dosa + Chutneys',
    calories: 420,
    proteinG: 8.5,
    carbsG: 64.0,
    fatG: 15.0,
    fiberG: 5.0,
    costInr: 50,
    glycemicIndex: 'High',
    nutritionTip: 'High carb energy meal; coconut chutney provides medium chain triglycerides (MCTs).',
  },
  {
    id: 'poha_roasted_peanuts',
    name: 'Indori Kanda Poha with Peanuts & Lemon',
    hindiName: 'कांदा पोहा और मूंगफली',
    category: 'south_indian',
    diet: 'veg',
    servingSize: '1 Medium Plate (180g)',
    calories: 290,
    proteinG: 7.5,
    carbsG: 48.0,
    fatG: 8.5,
    fiberG: 3.8,
    costInr: 16,
    glycemicIndex: 'Medium',
    nutritionTip: 'Flattened rice absorbs iron from iron rollers during traditional manufacturing processing.',
  },

  // ================= INDIAN HIGH-PROTEIN SNACKS =================
  {
    id: 'chana_sattu_drink',
    name: 'Bihari Chana Sattu Drink (Water + Lemon + Jeera)',
    hindiName: 'चना सत्तू शरबत',
    category: 'protein',
    diet: 'veg',
    servingSize: '1 Glass (45g Sattu + 250ml Water)',
    calories: 180,
    proteinG: 15.5,
    carbsG: 24.0,
    fatG: 2.8,
    fiberG: 6.8,
    costInr: 11,
    glycemicIndex: 'Low',
    nutritionTip: 'Indigenous super-protein: 0 cholesterol, cooling electrolyte balance, long-lasting fullness.',
  },
  {
    id: 'roasted_kala_chana',
    name: 'Roasted Bengal Gram (Bhuna Chana with Skin)',
    hindiName: 'भुना चना (छिलके सहित)',
    category: 'protein',
    diet: 'veg',
    servingSize: '1 Handful (50g)',
    calories: 190,
    proteinG: 12.5,
    carbsG: 28.0,
    fatG: 2.9,
    fiberG: 8.5,
    costInr: 10,
    glycemicIndex: 'Low',
    nutritionTip: 'Lowest glycemic index snack in the world (GI = 28); perfect for fat loss deskside snacking.',
  },
  {
    id: 'boiled_eggs_3whole',
    name: '3 Hard-Boiled Whole Eggs with Black Pepper',
    hindiName: '3 उबले अंडे (काली मिर्च)',
    category: 'protein',
    diet: 'eggetarian',
    servingSize: '3 Large Eggs',
    calories: 215,
    proteinG: 18.5,
    carbsG: 1.2,
    fatG: 15.0,
    fiberG: 0,
    costInr: 21,
    glycemicIndex: 'Low',
    nutritionTip: 'Golden standard of biological value (BV=100); lutein and choline reside in yolk.',
  },
  {
    id: 'egg_whites_4boiled',
    name: '4 Boiled Egg Whites (Zero Yolk)',
    hindiName: '4 उबले अंडे की सफेदी',
    category: 'protein',
    diet: 'eggetarian',
    servingSize: '4 Egg Whites (130g)',
    calories: 70,
    proteinG: 14.8,
    carbsG: 0.9,
    fatG: 0.2,
    fiberG: 0,
    costInr: 24,
    glycemicIndex: 'Low',
    nutritionTip: 'Pure protein with 0 fat and 0 carbs, the most calorie-efficient muscle recovery fuel.',
  },
  {
    id: 'paneer_raw_cubes',
    name: 'Fresh Cow Milk Paneer (Raw Cubes)',
    hindiName: 'ताजा पनीर (कच्चा)',
    category: 'protein',
    diet: 'veg',
    servingSize: '100g Cubes',
    calories: 265,
    proteinG: 18.3,
    carbsG: 3.2,
    fatG: 20.8,
    fiberG: 0,
    costInr: 40,
    glycemicIndex: 'Low',
    nutritionTip: 'Rich in slow-digesting micellar casein and bioavailable conjugated linoleic acid (CLA).',
  },
  {
    id: 'soya_bhurji_stir',
    name: 'High-Protein Soya Granule Bhurji',
    hindiName: 'सोया भुर्जी',
    category: 'protein',
    diet: 'veg',
    servingSize: '1 Plate (60g dry granules)',
    calories: 225,
    proteinG: 32.5,
    carbsG: 14.0,
    fatG: 3.8,
    fiberG: 8.2,
    costInr: 18,
    glycemicIndex: 'Low',
    nutritionTip: 'Delivers 32g complete plant protein for only ₹18; vegetarian hypertrophy gold standard.',
  },

  // ================= INDIAN STREET FOOD & CHEAT MEALS =================
  {
    id: 'samosa_fried',
    name: 'Fried Potato Samosa (1 Pc)',
    hindiName: 'समोसा (1 पीस)',
    category: 'snack',
    diet: 'veg',
    servingSize: '1 Standard Samosa (90g)',
    calories: 260,
    proteinG: 4.2,
    carbsG: 32.0,
    fatG: 14.5,
    fiberG: 2.1,
    costInr: 15,
    glycemicIndex: 'High',
    nutritionTip: 'Deep fried refined flour (maida) + spiced potato; enjoy during scheduled cheat meals.',
  },
  {
    id: 'pani_puri_6pcs',
    name: 'Golgappa / Pani Puri (6 Pcs with Teekha Paani)',
    hindiName: 'पानी पूरी / गोलगप्पे (6 पीस)',
    category: 'snack',
    diet: 'veg',
    servingSize: '6 Puris with Spiced Water',
    calories: 190,
    proteinG: 3.8,
    carbsG: 34.0,
    fatG: 4.5,
    fiberG: 2.5,
    costInr: 30,
    glycemicIndex: 'Medium',
    nutritionTip: 'Hing, mint, cumin and black salt in teekha pani act as carminative digestive stimulants.',
  },
  {
    id: 'pav_bhaji_butter',
    name: 'Mumbai Pav Bhaji (2 Buttered Pavs + Bhaji)',
    hindiName: 'पाव भाजी (2 पाव)',
    category: 'snack',
    diet: 'veg',
    servingSize: '2 Butter Pavs + 1 Bowl Bhaji',
    calories: 540,
    proteinG: 10.5,
    carbsG: 68.0,
    fatG: 26.0,
    fiberG: 6.5,
    costInr: 80,
    glycemicIndex: 'High',
    nutritionTip: 'High glycemic load from white pav and butter; offset with 25 minutes brisk walking.',
  },
  {
    id: 'chole_bhature_2pcs',
    name: 'Amritsari Chole Bhature (2 Fried Bhature + Chole)',
    hindiName: 'छोले भटूरे (2 भटूरे)',
    category: 'snack',
    diet: 'veg',
    servingSize: '2 Bhature + 1 Big Bowl Chole',
    calories: 780,
    proteinG: 22.0,
    carbsG: 96.0,
    fatG: 36.0,
    fiberG: 12.0,
    costInr: 90,
    glycemicIndex: 'High',
    nutritionTip: 'Heavy cheat meal; plan a 200 kcal pre-bank calorie buffer before indulging.',
  },

  // ================= INDIAN DESSERTS & SWEETS =================
  {
    id: 'gulab_jamun_2pcs',
    name: 'Khowa Gulab Jamun in Sugar Syrup (2 Pcs)',
    hindiName: 'गुलाब जामुन (2 पीस)',
    category: 'dessert',
    diet: 'veg',
    servingSize: '2 Standard Pieces (80g)',
    calories: 320,
    proteinG: 5.5,
    carbsG: 52.0,
    fatG: 11.5,
    fiberG: 0.4,
    costInr: 35,
    glycemicIndex: 'High',
    nutritionTip: 'Pure sucrose and concentrated milk solids; spike insulin rapidly.',
  },
  {
    id: 'kaju_katli_2pcs',
    name: 'Silver Vark Kaju Katli (2 Diamonds)',
    hindiName: 'काजू कतली (2 पीस)',
    category: 'dessert',
    diet: 'veg',
    servingSize: '2 Pieces (30g)',
    calories: 145,
    proteinG: 3.2,
    carbsG: 18.0,
    fatG: 7.2,
    fiberG: 0.6,
    costInr: 40,
    glycemicIndex: 'Medium',
    nutritionTip: 'Cashew base provides monounsaturated fatty acids and copper alongside sweetness.',
  },

  // ================= BEVERAGES & DAIRY =================
  {
    id: 'masala_chai_sugar',
    name: 'Indian Masala Cutting Chai (with 1.5 tsp sugar)',
    hindiName: 'मसाला चाय (चीनी सहित)',
    category: 'beverage',
    diet: 'veg',
    servingSize: '1 Cup (150ml)',
    calories: 95,
    proteinG: 2.8,
    carbsG: 14.5,
    fatG: 3.1,
    fiberG: 0,
    costInr: 10,
    glycemicIndex: 'Medium',
    nutritionTip: 'Ginger and cardamom provide thermogenic gingerols and cineole; switch to stevia for 0 kcal.',
  },
  {
    id: 'desi_chaas_jeera',
    name: 'Masala Buttermilk (Chaas with Roasted Jeera)',
    hindiName: 'मसाला छाछ (जीरा)',
    category: 'beverage',
    diet: 'veg',
    servingSize: '1 Big Glass (300ml)',
    calories: 55,
    proteinG: 3.8,
    carbsG: 5.2,
    fatG: 1.8,
    fiberG: 0.5,
    costInr: 8,
    glycemicIndex: 'Low',
    nutritionTip: 'The king of Indian hydration: sodium, potassium, and active live probiotic strains.',
  },
  {
    id: 'coconut_water_fresh',
    name: 'Fresh Green Coconut Water (Nariyal Paani)',
    hindiName: 'ताजा नारियल पानी',
    category: 'beverage',
    diet: 'veg',
    servingSize: '1 Whole Coconut (250ml)',
    calories: 48,
    proteinG: 1.8,
    carbsG: 9.8,
    fatG: 0.5,
    fiberG: 1.2,
    costInr: 50,
    glycemicIndex: 'Low',
    nutritionTip: 'Identical electrolyte osmolarity to human blood plasma with zero artificial sweeteners.',
  },
];

export const searchIndianFoodDatabase = (query: string): IndianFoodItem[] => {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return INDIAN_FOOD_DATABASE.slice(0, 15);

  return INDIAN_FOOD_DATABASE.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(cleanQuery);
    const hindiMatch = item.hindiName.toLowerCase().includes(cleanQuery);
    const categoryMatch = item.category.toLowerCase().includes(cleanQuery);
    return nameMatch || hindiMatch || categoryMatch;
  });
};

/**
 * Intelligent Indian Macro NLP Estimator
 * Dynamically predicts authentic Indian calories, protein, carbs, and fat
 * when a user types ANY custom Indian food name!
 */
export const estimateIndianFoodNutrients = (dishName: string): {
  matched: boolean;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: string;
  costInr: number;
  tip: string;
} => {
  const q = dishName.toLowerCase().trim();
  if (!q) {
    return {
      matched: false,
      name: 'Custom Meal',
      calories: 300,
      proteinG: 15,
      carbsG: 35,
      fatG: 10,
      servingSize: '1 Standard Portion',
      costInr: 25,
      tip: 'Balanced Indian meal estimate',
    };
  }

  // 1. Direct match in database
  const direct = INDIAN_FOOD_DATABASE.find(
    (item) => item.name.toLowerCase().includes(q) || item.hindiName.toLowerCase().includes(q)
  );
  if (direct) {
    return {
      matched: true,
      name: direct.name,
      calories: direct.calories,
      proteinG: direct.proteinG,
      carbsG: direct.carbsG,
      fatG: direct.fatG,
      servingSize: direct.servingSize,
      costInr: direct.costInr,
      tip: direct.nutritionTip,
    };
  }

  // 2. Intelligent Category Heuristics
  // Halwa / Sheera
  if (q.includes('halwa') || q.includes('sheera') || q.includes('हलवा')) {
    if (q.includes('moong') || q.includes('मूंग')) {
      return { matched: true, name: 'Moong Dal Halwa', calories: 380, proteinG: 9.5, carbsG: 39, fatG: 21, servingSize: '1 Bowl (120g)', costInr: 40, tip: 'Rich in moong dal protein and A2 desi ghee' };
    }
    if (q.includes('gajar') || q.includes('carrot') || q.includes('गाजर')) {
      return { matched: true, name: 'Gajar Ka Halwa', calories: 285, proteinG: 6.5, carbsG: 38, fatG: 12.5, servingSize: '1 Bowl (150g)', costInr: 35, tip: 'Loaded with carrot beta-carotene and milk solids' };
    }
    if (q.includes('atta') || q.includes('kada') || q.includes('गेहूं')) {
      return { matched: true, name: 'Atta Halwa / Kada Prasad', calories: 345, proteinG: 4.8, carbsG: 46, fatG: 16, servingSize: '1 Bowl (120g)', costInr: 18, tip: 'Whole wheat energy fuel' };
    }
    if (q.includes('besan') || q.includes('बेसन')) {
      return { matched: true, name: 'Besan Halwa', calories: 330, proteinG: 7.2, carbsG: 38, fatG: 16.5, servingSize: '1 Bowl (120g)', costInr: 22, tip: 'Gram flour with zinc and iron' };
    }
    if (q.includes('lauki') || q.includes('doodhi') || q.includes('लौकी')) {
      return { matched: true, name: 'Lauki Halwa', calories: 215, proteinG: 5.2, carbsG: 29, fatG: 9, servingSize: '1 Bowl (150g)', costInr: 25, tip: 'Low-calorie bottle gourd sweet' };
    }
    // Generic Halwa
    return { matched: true, name: 'Desi Sooji Halwa', calories: 310, proteinG: 4.8, carbsG: 44, fatG: 13.5, servingSize: '1 Bowl (120g)', costInr: 20, tip: 'Semolina cooked in pure desi ghee and dry fruits' };
  }

  // Paratha
  if (q.includes('paratha') || q.includes('पराठा')) {
    if (q.includes('paneer') || q.includes('पनीर')) {
      return { matched: true, name: 'Paneer Paratha', calories: 340, proteinG: 17.5, carbsG: 32, fatG: 16.5, servingSize: '1 Large Paratha', costInr: 35, tip: 'Packed with 17.5g dairy casein protein' };
    }
    if (q.includes('aloo') || q.includes('आलू')) {
      return { matched: true, name: 'Aloo Paratha', calories: 280, proteinG: 5.5, carbsG: 43, fatG: 9.8, servingSize: '1 Large Paratha', costInr: 15, tip: 'Complex carbs with spiced potato filling' };
    }
    if (q.includes('sattu') || q.includes('सत्तू')) {
      return { matched: true, name: 'Sattu Paratha', calories: 310, proteinG: 14.8, carbsG: 44, fatG: 8.5, servingSize: '1 Large Paratha', costInr: 15, tip: 'High fiber roasted chana protein' };
    }
    return { matched: true, name: 'Stuffed Paratha', calories: 290, proteinG: 7.0, carbsG: 40, fatG: 11.0, servingSize: '1 Large Paratha', costInr: 20, tip: 'Whole wheat paratha estimate' };
  }

  // Biryani / Pulao
  if (q.includes('biryani') || q.includes('pulao') || q.includes('बिरयानी')) {
    if (q.includes('chicken') || q.includes('चिकन')) {
      return { matched: true, name: 'Chicken Biryani', calories: 540, proteinG: 34.0, carbsG: 68, fatG: 14.5, servingSize: '1 Plate (350g)', costInr: 120, tip: 'High protein lean athletic meal' };
    }
    if (q.includes('mutton') || q.includes('मटन')) {
      return { matched: true, name: 'Mutton Biryani', calories: 620, proteinG: 32.0, carbsG: 66, fatG: 24.0, servingSize: '1 Plate (350g)', costInr: 180, tip: 'Rich in zinc, iron and creatine' };
    }
    return { matched: true, name: 'Veg Dum Biryani', calories: 440, proteinG: 13.5, carbsG: 72, fatG: 12.0, servingSize: '1 Plate (350g)', costInr: 70, tip: 'Basmati rice with paneer and spiced vegetables' };
  }

  // Chicken
  if (q.includes('chicken') || q.includes('चिकन') || q.includes('murgh')) {
    return { matched: true, name: 'Chicken Curry / Tikka', calories: 275, proteinG: 38.0, carbsG: 6, fatG: 11, servingSize: '1 Bowl (150g)', costInr: 65, tip: 'High biological value lean protein' };
  }

  // Paneer
  if (q.includes('paneer') || q.includes('पनीर')) {
    return { matched: true, name: 'Paneer Dish', calories: 265, proteinG: 18.0, carbsG: 6, fatG: 19, servingSize: '1 Bowl (150g)', costInr: 45, tip: 'Casein protein rich dairy staple' };
  }

  // Egg
  if (q.includes('egg') || q.includes('anda') || q.includes('अंडा') || q.includes('omelette')) {
    return { matched: true, name: 'Egg Dish (2-3 Eggs)', calories: 215, proteinG: 18.0, carbsG: 2, fatG: 15, servingSize: '1 Serving', costInr: 22, tip: 'Gold standard complete amino acids' };
  }

  // Soya
  if (q.includes('soya') || q.includes('सोया')) {
    return { matched: true, name: 'Soya Chunks / Bhurji', calories: 225, proteinG: 32.0, carbsG: 15, fatG: 3.5, servingSize: '1 Plate (60g dry)', costInr: 16, tip: '#1 Plant protein champion with 52g pro/100g' };
  }

  // Dal / Lentils
  if (q.includes('dal') || q.includes('दाल') || q.includes('sambhar') || q.includes('sambar')) {
    return { matched: true, name: 'Indian Dal / Sambar', calories: 150, proteinG: 9.5, carbsG: 21, fatG: 3.5, servingSize: '1 Standard Katori (150ml)', costInr: 12, tip: 'Rich in dietary fiber and folate' };
  }

  // Sattu
  if (q.includes('sattu') || q.includes('सत्तू')) {
    return { matched: true, name: 'Chana Sattu Drink', calories: 180, proteinG: 15.5, carbsG: 24, fatG: 2.8, servingSize: '1 Glass (300ml)', costInr: 11, tip: 'Pure roasted Bengal gram protein' };
  }

  // Default intelligent Indian home food estimation
  return {
    matched: false,
    name: dishName,
    calories: 250,
    proteinG: 8.0,
    carbsG: 34.0,
    fatG: 9.0,
    servingSize: '1 Standard Plate',
    costInr: 25,
    tip: 'Estimated Indian home-cooked meal balance',
  };
};
