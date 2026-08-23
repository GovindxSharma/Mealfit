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
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { promptGoogleSignIn } from '../../src/services/googleAuth';
import { GoogleQuickAuthModal } from '../../src/components/GoogleQuickAuthModal';
import { useRouter } from 'expo-router';
import {
  Flame,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [showGoogleQuickModal, setShowGoogleQuickModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToApp = () => {
    router.replace('/(tabs)');
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const googleUser = await promptGoogleSignIn();
      await loginWithGoogle(googleUser);
      router.replace('/(tabs)');
    } catch (err: any) {
      if (Platform.OS !== 'web') {
        setShowGoogleQuickModal(true);
      } else if (err.message && !err.message.includes('cancelled')) {
        setErrorMsg(err.message);
      }
    } finally {
      setGoogleLoading(false);
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

        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.brandTitleRow}>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>MealFit</Text>
            <View style={[styles.indiaBadge, { backgroundColor: theme.amberLight, borderColor: theme.amber }]}>
              <Text style={[styles.indiaBadgeText, { color: theme.amber }]}>INDIA</Text>
            </View>
          </View>
          <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
            High-Protein Indian Diets & Living Room Fitness
          </Text>
        </View>

        {/* Auth Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
            Sign in to sync your meal logs, ₹ budget & fitness goals
          </Text>

          {errorMsg && (
            <View style={[styles.errorBox, { backgroundColor: theme.roseLight, borderColor: theme.rose }]}>
              <Text style={[styles.errorText, { color: theme.rose }]}>{errorMsg}</Text>
            </View>
          )}

          {/* 1. Google One-Tap Sign In */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[
              styles.googleButton,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.85}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <>
                <View style={styles.googleIconBox}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={[styles.googleButtonText, { color: theme.textPrimary }]}>
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>OR WITH EMAIL</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.cardBorder }]} />
          </View>

          {/* Email Input */}
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

          {/* Password Input */}
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
                placeholder="Enter password"
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

          {/* Sign In Primary Button */}
          <TouchableOpacity
            onPress={handleEmailLogin}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={[styles.primaryButtonText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                  Sign In to MealFit
                </Text>
                <ArrowRight size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
              </>
            )}
          </TouchableOpacity>

          {/* Register Switch */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: theme.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register' as any)}>
              <Text style={[styles.switchLink, { color: theme.primary }]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust & Security Badges */}
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
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#00E676',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  indiaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  indiaBadgeText: {
    fontSize: 10,
    fontWeight: '800',
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
    padding: 20,
    gap: 14,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 16,
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
    marginVertical: 4,
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
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
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  guestButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
