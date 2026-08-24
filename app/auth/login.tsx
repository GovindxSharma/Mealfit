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
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react-native';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { loginWithEmail } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ prefillEmail?: string }>();

  const [email, setEmail] = useState<string>(params?.prefillEmail || '');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (params?.prefillEmail) {
      setEmail(params.prefillEmail);
    }
  }, [params?.prefillEmail]);

  const handleBackToApp = () => {
    router.replace('/(tabs)');
  };

  const handleSignIn = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedEmail) {
      Alert.alert('Required Field', 'Please enter your email address.');
      return;
    }
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!trimmedPassword) {
      Alert.alert('Required Field', 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(trimmedEmail, trimmedPassword);
      router.replace('/(tabs)');
    } catch (err: any) {
      const errMsg = err?.message || 'Unable to sign in';
      
      if (
        errMsg.toLowerCase().includes('no account found') ||
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('create a new account') ||
        errMsg.toLowerCase().includes('404')
      ) {
        Alert.alert(
          'Account Not Found',
          `No MealFit account was found for "${trimmedEmail}".\n\nWould you like to create a new free account now?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Create Account',
              onPress: () => {
                router.push({
                  pathname: '/auth/register',
                  params: { prefillEmail: trimmedEmail },
                } as any);
              },
            },
          ]
        );
      } else if (
        errMsg.toLowerCase().includes('incorrect password') ||
        errMsg.toLowerCase().includes('invalid credentials')
      ) {
        Alert.alert(
          'Incorrect Password',
          'The password you entered is incorrect. Please check your password and try again.'
        );
      } else if (
        errMsg.toLowerCase().includes('failed to fetch') ||
        errMsg.toLowerCase().includes('network') ||
        errMsg.toLowerCase().includes('connection')
      ) {
        Alert.alert(
          'Connection Error',
          'Unable to reach MealFit server. Please verify your internet connection and try again.'
        );
      } else {
        Alert.alert('Sign In Failed', errMsg);
      }
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
              Welcome to <Text style={{ color: theme.primary }}>MealFit</Text>
            </Text>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Sign in to sync your high-protein Indian meal plans, macro logs & workouts.
            </Text>
          </View>

          {/* Sign In Form Card */}
          <View
            style={[
              styles.formCard,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
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
                  placeholder="Enter your password"
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

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSignIn}
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
                  <Text style={styles.submitBtnText}>Sign In to MealFit</Text>
                  <ArrowRight size={18} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Switch to Register */}
            <View style={styles.switchRow}>
              <Text style={[styles.switchText, { color: theme.textSecondary }]}>
                New to MealFit?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
                <Text style={[styles.switchLink, { color: theme.primary }]}>
                  Create Free Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Privacy & Trust */}
          <View style={styles.trustRow}>
            <ShieldCheck size={14} color={theme.primary} />
            <Text style={[styles.trustText, { color: theme.textMuted }]}>
              Secure Cloud Sync • 100% Free Forever
            </Text>
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
    marginBottom: 24,
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
    height: 50,
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
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    height: 50,
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  demoSection: {
    gap: 8,
    paddingTop: 4,
  },
  demoSectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  demoPillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '700',
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
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
