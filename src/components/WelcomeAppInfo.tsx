import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Utensils,
  CloudSun,
  Camera,
  Dumbbell,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  IndianRupee,
} from 'lucide-react-native';

export const WelcomeAppInfo: React.FC = () => {
  const { login, continueAsGuest } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailInput, setEmailInput] = useState('govind@mealfit.in');
  const [nameInput, setNameInput] = useState('Govind Sharma');

  const handleStartOnboarding = () => {
    router.push('/onboarding/biometrics');
  };

  const handleQuickLogin = () => {
    router.push('/auth/login' as any);
  };

  const handleGuest = () => {
    continueAsGuest();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header */}
      <View style={styles.heroSection}>
        <View style={styles.heroBadge}>
          <Sparkles size={13} color={Colors.primary} />
          <Text style={styles.heroBadgeText}>INDIA-FIRST HYPER-LOCALIZED NUTRITION</Text>
        </View>

        <Text style={styles.heroTitle}>
          High Protein.{'\n'}
          <Text style={{ color: Colors.primary }}>Indian Budget.</Text>{'\n'}
          Zero Fluff.
        </Text>

        <Text style={styles.heroSubtitle}>
          Built specifically for Indian bodies, local Kirana budgets, home-cooked Katoris & Phulkas, and apartment living.
        </Text>
      </View>

      {/* Feature Pillar Cards */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionHeading}>WHAT MAKES MEALFIT DIFFERENT</Text>

        {/* 1. Rupee to Protein */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: Colors.primaryLight }]}>
            <IndianRupee size={20} color={Colors.primary} />
          </View>
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>₹-to-Protein Linear Optimizer</Text>
            <Text style={styles.featureDesc}>
              ICMR-NIN verified staples. Soya Chunks (3.47g/₹1), Chana Sattu (1.22g/₹1), and Kala Chana for ₹40–₹90/day.
            </Text>
          </View>
        </View>

        {/* 2. Weather & AQI */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: Colors.cyanLight }]}>
            <CloudSun size={20} color={Colors.cyan} />
          </View>
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>Weather & AQI Dynamic Engine</Text>
            <Text style={styles.featureDesc}>
              Live temperature and smog calibration. Automatically adds +400mL–800mL water in heatwaves and triggers indoor safety cues.
            </Text>
          </View>
        </View>

        {/* 3. AI Camera Scanner */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: Colors.amberLight }]}>
            <Camera size={20} color={Colors.amber} />
          </View>
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>AI Multi-Curry Vision Scanner</Text>
            <Text style={styles.featureDesc}>
              Real-time camera lens for Indian Thalis with Hidden Desi Ghee & Tadka calibrator (+45 kcal per tsp).
            </Text>
          </View>
        </View>

        {/* 4. Apartment Workouts */}
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: Colors.purpleLight }]}>
            <Dumbbell size={20} color={Colors.purple} />
          </View>
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>Apartment Zero-Noise Routines</Text>
            <Text style={styles.featureDesc}>
              3-second slow eccentric tempos with interactive rest interval countdowns — zero floor-jumping noise for neighbors.
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          onPress={handleStartOnboarding}
          style={styles.primaryBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Personalize My Biometrics</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.secondaryBtnRow}>
          <TouchableOpacity
            onPress={handleQuickLogin}
            style={styles.secondaryBtn}
            activeOpacity={0.7}
          >
            <UserCheck size={16} color={Colors.primary} />
            <Text style={styles.secondaryBtnText}>Quick Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGuest}
            style={styles.guestBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.guestBtnText}>Explore as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: 20,
    gap: 22,
    paddingBottom: 48,
  },
  heroSection: {
    gap: 12,
    marginTop: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 38,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  featuresSection: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  featureCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  featureIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextBox: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  actionsSection: {
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 16,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 13,
    borderRadius: 14,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  guestBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 13,
    borderRadius: 14,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
