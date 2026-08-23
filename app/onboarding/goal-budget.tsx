import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Colors } from '../../src/theme/colors';
import { Target, IndianRupee, Check, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function GoalBudgetScreen() {
  const router = useRouter();
  const [targetWeight, setTargetWeight] = useState<string>('68');
  const [weeklyBudget, setWeeklyBudget] = useState<number>(1000);
  const [diet, setDiet] = useState<'veg' | 'jain' | 'eggetarian' | 'non_veg'>('veg');

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Goal & Kirana Budget</Text>
        <Text style={styles.subtitle}>
          Set your target weight and weekly grocery spend constraint so our linear optimizer builds your meal plans automatically.
        </Text>
      </View>

      {/* Dietary Preference */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Dietary Preference</Text>
        <View style={styles.dietGrid}>
          {[
            { key: 'veg', label: 'Pure Veg' },
            { key: 'jain', label: 'Jain' },
            { key: 'eggetarian', label: 'Eggetarian' },
            { key: 'non_veg', label: 'Non-Veg' },
          ].map((d) => (
            <TouchableOpacity
              key={d.key}
              onPress={() => setDiet(d.key as any)}
              style={[styles.dietOption, diet === d.key && styles.dietOptionActive]}
            >
              <Text style={[styles.dietText, diet === d.key && styles.dietTextActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Target Weight */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Target Weight (kg)</Text>
        <TextInput
          style={styles.input}
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
          placeholder="e.g. 68"
          placeholderTextColor={Colors.textMuted}
        />
        <Text style={styles.helperText}>
          Safe weekly weight loss bounds: 0.25 kg to 1.0 kg per week.
        </Text>
      </View>

      {/* Weekly Kirana Budget */}
      <View style={styles.card}>
        <View style={styles.budgetHeader}>
          <Text style={styles.cardLabel}>Weekly Kirana Budget</Text>
          <Text style={styles.budgetValue}>₹{weeklyBudget} / wk</Text>
        </View>
        <View style={styles.budgetPillRow}>
          {[300, 450, 700, 1000, 1500].map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => setWeeklyBudget(b)}
              style={[styles.budgetBtn, weeklyBudget === b && styles.budgetBtnActive]}
            >
              <Text style={[styles.budgetBtnText, weeklyBudget === b && styles.budgetBtnTextActive]}>
                ₹{b}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.helperText}>
          Equivalent to ~₹{Math.round(weeklyBudget / 7)} per day for your complete high-protein meals.
        </Text>
      </View>

      {/* Complete Setup Button */}
      <TouchableOpacity onPress={handleFinish} style={styles.finishBtn} activeOpacity={0.8}>
        <Text style={styles.finishBtnText}>Launch MealFit Dashboard</Text>
        <Check size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    gap: 18,
    paddingBottom: 36,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 16,
    gap: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dietGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dietOptionActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  dietText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dietTextActive: {
    color: Colors.primary,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.amber,
  },
  budgetPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  budgetBtnActive: {
    backgroundColor: Colors.amberLight,
    borderColor: Colors.amber,
  },
  budgetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  budgetBtnTextActive: {
    color: Colors.amber,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  finishBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  finishBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
