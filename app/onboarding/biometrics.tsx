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
import { Calculator, ArrowRight, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BiometricsScreen() {
  const router = useRouter();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<string>('72');
  const [height, setHeight] = useState<string>('175');
  const [age, setAge] = useState<string>('26');

  const handleNext = () => {
    router.push('/onboarding/goal-budget');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Body Composition</Text>
        <Text style={styles.subtitle}>
          MealFit uses Asian-Indian standard BMI and Mifflin-St Jeor formulas for precise TDEE calculations.
        </Text>
      </View>

      {/* Gender Selection */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Biological Gender</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            onPress={() => setGender('male')}
            style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
          >
            <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
              👨 Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGender('female')}
            style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
          >
            <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
              👩 Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Attributes Form */}
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Body Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="e.g. 72"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="e.g. 175"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="e.g. 26"
            placeholderTextColor={Colors.textMuted}
          />
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity onPress={handleNext} style={styles.nextBtn} activeOpacity={0.8}>
        <Text style={styles.nextBtnText}>Continue to Goal & Budget</Text>
        <ArrowRight size={18} color="#FFFFFF" />
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
    gap: 14,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  genderBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  genderText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  genderTextActive: {
    color: Colors.primary,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
