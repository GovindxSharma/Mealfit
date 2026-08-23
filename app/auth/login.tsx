import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { promptGoogleSignIn, isNativeGooglePlayServicesAvailable } from '../../src/services/googleAuth';
import { GoogleQuickAuthModal } from '../../src/components/GoogleQuickAuthModal';
import { useRouter } from 'expo-router';
import {
  Flame,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Utensils,
  Dumbbell,
  IndianRupee,
} from 'lucide-react-native';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [showGoogleQuickModal, setShowGoogleQuickModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBackToApp = () => {
    router.replace('/(tabs)');
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      if (!isNativeGooglePlayServicesAvailable()) {
        setShowGoogleQuickModal(true);
        setGoogleLoading(false);
        return;
      }
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
      setGoogleLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
            <Text style={[styles.backNavText, { color: theme.textPrimary }]}>Explore as Guest</Text>
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
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Sign In to MealFit</Text>
          <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
            Connect your Google account to unlock your personalized meal plan, kirana budget, and workout logs.
          </Text>

          {errorMsg && (
            <View style={[styles.errorBox, { backgroundColor: theme.roseLight, borderColor: theme.rose }]}>
              <Text style={[styles.errorText, { color: theme.rose }]}>{errorMsg}</Text>
            </View>
          )}

          {/* Primary Google One-Tap Sign In Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            style={[
              styles.googleButton,
              { backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF', borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.85}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <View style={styles.googleBtnRow}>
                <View style={styles.googleIconBox}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={[styles.googleButtonText, { color: theme.textPrimary }]}>
                  Continue with Google
                </Text>
                <ArrowRight size={18} color={theme.primary} />
              </View>
            )}
          </TouchableOpacity>

          {/* Value Propositions */}
          <View style={[styles.featuresList, { backgroundColor: theme.backgroundSecondary }]}>
            <View style={styles.featureItem}>
              <CheckCircle2 size={16} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                1-Tap Instant Secure Sign-In
              </Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle2 size={16} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                MongoDB Atlas Cloud Backup & Streak Sync
              </Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle2 size={16} color={theme.primary} />
              <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                Personalized Indian Kirana Meal Plans
              </Text>
            </View>
          </View>

          {/* Privacy & Cloud Tag */}
          <View style={styles.secureFooterRow}>
            <ShieldCheck size={14} color={theme.primary} />
            <Text style={[styles.secureFooterText, { color: theme.textMuted }]}>
              Your data is encrypted & saved to cloud
            </Text>
          </View>
        </View>

        {/* Guest Access Link */}
        <TouchableOpacity
          onPress={handleBackToApp}
          style={styles.guestLink}
          activeOpacity={0.7}
        >
          <Text style={[styles.guestLinkText, { color: theme.textSecondary }]}>
            Skip for now & browse as Guest ➔
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Google Quick Auth Modal for Expo Go */}
      <GoogleQuickAuthModal
        visible={showGoogleQuickModal}
        onClose={() => setShowGoogleQuickModal(false)}
        onSuccess={() => router.replace('/(tabs)')}
        initialEmail="govindsharma2839@gmail.com"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingBottom: 40,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  backNavText: {
    fontSize: 13,
    fontWeight: '700',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 12,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  indiaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  indiaBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },
  errorBox: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  googleButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  googleBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  googleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EA4335',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleG: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginLeft: 12,
  },
  featuresList: {
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  secureFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureFooterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  guestLink: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  guestLinkText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
