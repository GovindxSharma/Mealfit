import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import {
  Utensils,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Target,
  Flame,
} from 'lucide-react-native';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { registerWithEmail, login, updateUserProfile } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [goalType, setGoalType] = useState<'fat_loss' | 'muscle_gain' | 'recomp' | 'low_gi_pcod'>('fat_loss');
  const [dietaryPref, setDietaryPref] = useState<'veg' | 'non_veg' | 'eggetarian' | 'jain'>('veg');
  const [loading, setLoading] = useState<boolean>(false);

  const handleBackToApp = () => {
    router.replace('/(tabs)');
  };

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required Field', 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      Alert.alert('Short Password', 'Please enter a password with at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      if (registerWithEmail) {
        await registerWithEmail({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          dietaryPreference: dietaryPref,
        });
      } else {
        login(email.trim(), fullName.trim());
        updateUserProfile({
          fullName: fullName.trim(),
          goalType,
          dietaryPreference: dietaryPref,
        });
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      // Local fallback so user is never blocked
      login(email.trim(), fullName.trim());
      updateUserProfile({
        fullName: fullName.trim(),
        goalType,
        dietaryPreference: dietaryPref,
      });
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Navigation Row */}
          <View style={styles.topNavRow}>
            <TouchableOpacity
              onPress={handleBackToApp}
              style={[styles.backNavBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              activeOpacity={0.7}
            >
              <ArrowLeft size={16} color={theme.textPrimary} />
              <Text style={[styles.backNavText, { color: theme.textPrimary }]}>Explore as Guest</Text>
            </TouchableOpacity>
          </View>

          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Image
                source={require('../../assets/mealfit_icon_v2.png')}
                style={styles.logoImage}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
              Create <Text style={{ color: theme.primary }}>MealFit</Text> Profile
            </Text>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Personalize your Indian grocery budget, macro targets & workout split.
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={[
              styles.formCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Full Name</Text>
              <View
                style={[
                  styles.inputBox,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <User size={18} color={theme.textMuted} />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Govind Sharma"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.textInput, { color: theme.textPrimary }]}
                />
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Email Address</Text>
              <View
                style={[
                  styles.inputBox,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <Mail size={18} color={theme.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={[styles.textInput, { color: theme.textPrimary }]}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Password</Text>
              <View
                style={[
                  styles.inputBox,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <Lock size={18} color={theme.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a secure password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showPassword}
                  style={[styles.textInput, { color: theme.textPrimary }]}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={theme.textMuted} />
                  ) : (
                    <Eye size={18} color={theme.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Goal Type Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Primary Fitness Goal</Text>
              <View style={styles.pickerGrid}>
                {[
                  { id: 'fat_loss', label: 'Fat Loss & Trim', icon: Flame },
                  { id: 'muscle_gain', label: 'Muscle Gain', icon: Target },
                  { id: 'recomp', label: 'Body Recomp', icon: Sparkles },
                  { id: 'low_gi_pcod', label: 'Low GI / PCOD', icon: ShieldCheck },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = goalType === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setGoalType(item.id as any)}
                      style={[
                        styles.pickerOption,
                        {
                          backgroundColor: isSelected ? theme.primaryLight : theme.backgroundSecondary,
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <IconComp size={14} color={isSelected ? theme.primary : theme.textMuted} />
                      <Text
                        style={[
                          styles.pickerOptionText,
                          { color: isSelected ? theme.primary : theme.textSecondary, fontWeight: isSelected ? '800' : '600' },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Dietary Preference Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Dietary Preference</Text>
              <View style={styles.dietRow}>
                {[
                  { id: 'veg', label: 'Vegetarian' },
                  { id: 'non_veg', label: 'Non-Veg' },
                  { id: 'egg', label: 'Eggetarian' },
                  { id: 'vegan', label: 'Vegan' },
                ].map((item) => {
                  const isSelected = dietaryPref === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => setDietaryPref(item.id as any)}
                      style={[
                        styles.dietPill,
                        {
                          backgroundColor: isSelected ? theme.primary : theme.backgroundSecondary,
                          borderColor: isSelected ? theme.primary : theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dietPillText,
                          { color: isSelected ? '#FFFFFF' : theme.textSecondary, fontWeight: isSelected ? '800' : '600' },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              style={[
                styles.submitBtn,
                { backgroundColor: theme.primary },
                loading && { opacity: 0.7 },
              ]}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Create My Free Profile</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Switch to Login */}
            <View style={styles.switchRow}>
              <Text style={[styles.switchText, { color: theme.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
                <Text style={[styles.switchLink, { color: theme.primary }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  backNavText: {
    fontSize: 12,
    fontWeight: '700',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 2,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  eyeBtn: {
    padding: 6,
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    width: '48%',
  },
  pickerOptionText: {
    fontSize: 11.5,
  },
  dietRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  dietPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  dietPillText: {
    fontSize: 11,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    height: 50,
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  switchText: {
    fontSize: 13,
  },
  switchLink: {
    fontSize: 13,
    fontWeight: '800',
  },
});
