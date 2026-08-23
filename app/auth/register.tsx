import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth, DietaryType } from '../../src/context/AuthContext';
import { promptGoogleSignIn } from '../../src/services/googleAuth';
import { GoogleQuickAuthModal } from '../../src/components/GoogleQuickAuthModal';
import { useRouter } from 'expo-router';
import {
  Flame,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  IndianRupee,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Leaf,
  Egg,
  Sparkles,
  Utensils,
} from 'lucide-react-native';

const DIETARY_OPTIONS: { key: DietaryType; label: string; icon: typeof Leaf }[] = [
  { key: 'veg', label: 'Pure Veg', icon: Leaf },
  { key: 'jain', label: 'Jain', icon: Sparkles },
  { key: 'eggetarian', label: 'Eggetarian', icon: Egg },
  { key: 'non_veg', label: 'Non-Veg', icon: Utensils },
];

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [diet, setDiet] = useState<DietaryType>('veg');
  const [budget, setBudget] = useState<number>(1000);
  const [city, setCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showGoogleQuickModal, setShowGoogleQuickModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await registerWithEmail({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password || '123456',
        dietaryPreference: diet,
        weeklyBudgetInr: budget,
        city: city.trim() || 'delhi',
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToApp = () => {
    router.replace('/(tabs)');
  };

  const handleGoogleRegister = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const googleUser = await promptGoogleSignIn();
      await loginWithGoogle(googleUser);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (!msg.includes('cancelled') && !msg.includes('12501')) {
        Alert.alert('Google Sign-In', msg);
        setErrorMsg(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Navigation Row: Back to App */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            onPress={handleBackToApp}
            style={[styles.backNavBtn, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <ArrowLeft size={18} color={theme.textPrimary} />
            <Text style={[styles.backNavText, { color: theme.textPrimary }]}>Back to App</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>Create MealFit Account</Text>
          <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
            Start your personalized Indian fitness & macro journey
          </Text>
        </View>

        {/* Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {errorMsg && (
            <View style={[styles.errorBox, { backgroundColor: theme.roseLight, borderColor: theme.rose }]}>
              <Text style={[styles.errorText, { color: theme.rose }]}>{errorMsg}</Text>
            </View>
          )}

          {/* Google One-Tap */}
          <TouchableOpacity
            onPress={handleGoogleRegister}
            style={[
              styles.googleButton,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconBox}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={[styles.googleButtonText, { color: theme.textPrimary }]}>
              Sign Up with Google
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>OR ENTER DETAILS</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Your Full Name</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
              ]}
            >
              <User size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="e.g. Govind Sharma"
                placeholderTextColor={theme.textMuted}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
              ]}
            >
              <Mail size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="name@gmail.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
              ]}
            >
              <Lock size={16} color={theme.textMuted} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="Create a secure password"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? (
                  <EyeOff size={16} color={theme.textMuted} />
                ) : (
                  <Eye size={16} color={theme.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Dietary Preference */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Dietary Preference</Text>
            <View style={styles.dietRow}>
              {DIETARY_OPTIONS.map((item) => {
                const DietIcon = item.icon;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setDiet(item.key)}
                    style={[
                      styles.dietChip,
                      {
                        backgroundColor: diet === item.key ? theme.primaryLight : theme.backgroundSecondary,
                        borderColor: diet === item.key ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    activeOpacity={0.8}
                  >
                    <DietIcon size={14} color={diet === item.key ? theme.primary : theme.textSecondary} />
                    <Text
                      style={[
                        styles.dietChipText,
                        { color: diet === item.key ? theme.primary : theme.textSecondary },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Weekly Kirana Budget */}
          <View style={styles.inputGroup}>
            <View style={styles.budgetHeaderRow}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Weekly Kirana Budget</Text>
              <Text style={[styles.budgetValText, { color: theme.primary }]}>₹{budget}/week</Text>
            </View>
            <View style={styles.budgetRow}>
              {[600, 1000, 1500, 2000].map((b) => (
                <TouchableOpacity
                  key={b}
                  onPress={() => setBudget(b)}
                  style={[
                    styles.budgetChip,
                    {
                      backgroundColor: budget === b ? theme.primaryLight : theme.backgroundSecondary,
                      borderColor: budget === b ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.budgetChipText,
                      { color: budget === b ? theme.primary : theme.textSecondary },
                    ]}
                  >
                    ₹{b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* City / Location */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>City / Location</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
              ]}
            >
              <MapPin size={16} color={theme.cyan} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                placeholder="e.g. Pune, Delhi, Mumbai, Jaipur..."
                placeholderTextColor={theme.textMuted}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleRegister}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.primaryButtonText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                  Create Free Account
                </Text>
                <ArrowRight size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
              </>
            )}
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: theme.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
              <Text style={[styles.switchLink, { color: theme.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security & Data Vault Trust Badges */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <ShieldCheck size={13} color={theme.primary} />
            <Text style={[styles.trustText, { color: theme.textSecondary }]}>
              256-Bit TLS 1.3 & Zero-Knowledge Encrypted
            </Text>
          </View>
          <View style={styles.trustItem}>
            <Lock size={13} color={theme.cyan} />
            <Text style={[styles.trustText, { color: theme.textMuted }]}>
              Zero Data Selling • ICMR-NIN Compliant
            </Text>
          </View>
        </View>
      </ScrollView>

      <GoogleQuickAuthModal
        visible={showGoogleQuickModal}
        onClose={() => setShowGoogleQuickModal(false)}
        onSuccess={() => {
          setShowGoogleQuickModal(false);
          router.replace('/(tabs)');
        }}
        initialEmail={email}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 48,
    gap: 16,
    alignItems: 'center',
  },
  topNavRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 4,
  },
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  backNavText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  brandContainer: {
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#00E676',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  errorBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  googleIconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: '900',
  },
  googleButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '600',
    padding: 0,
  },
  eyeBtn: {
    padding: 4,
  },
  dietRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dietChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  budgetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetValText: {
    fontSize: 12,
    fontWeight: '800',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  budgetChipText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  switchText: {
    fontSize: 12,
  },
  switchLink: {
    fontSize: 12,
    fontWeight: '800',
  },
  trustRow: {
    gap: 6,
    alignItems: 'center',
    marginTop: 4,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
