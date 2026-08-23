import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { promptGoogleSignIn } from '../services/googleAuth';
import { GoogleQuickAuthModal } from './GoogleQuickAuthModal';
import { useRouter } from 'expo-router';
import { Lock, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react-native';

interface AuthRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  visible,
  onClose,
  title = 'Account Required',
  subtitle = 'Sign in to sync your personalized Indian diet, macro logs & fitness streaks.',
}) => {
  const { theme } = useTheme();
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [showGoogleQuickModal, setShowGoogleQuickModal] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await promptGoogleSignIn();
      await loginWithGoogle(googleUser);
      onClose();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (!msg.includes('cancelled') && !msg.includes('12501')) {
        Alert.alert('Google Sign-In', msg);
      }
    }
  };

  const handleEmailSignIn = () => {
    onClose();
    router.push('/auth/login' as any);
  };

  return (
    <>
      <Modal visible={visible && !showGoogleQuickModal} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card, borderColor: theme.cardBorder },
            ]}
          >
            {/* Close button */}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={[styles.iconBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
            <Lock size={24} color={theme.primary} />
          </View>

          {/* Title & Description */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>

          {/* Google One-Tap Sign In */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            style={[
              styles.googleBtn,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconBox}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={[styles.googleBtnText, { color: theme.textPrimary }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Email Login Button */}
          <TouchableOpacity
            onPress={handleEmailSignIn}
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
          >
            <Text style={[styles.primaryBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
              Sign In with Email
            </Text>
            <ArrowRight size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
          </TouchableOpacity>

          {/* Trust note */}
          <View style={styles.trustRow}>
            <ShieldCheck size={12} color={theme.primary} />
            <Text style={[styles.trustText, { color: theme.textMuted }]}>
              256-Bit Encrypted • Free Forever Plan
            </Text>
          </View>
        </View>
      </View>
    </Modal>

    <GoogleQuickAuthModal
      visible={showGoogleQuickModal}
      onClose={() => {
        setShowGoogleQuickModal(false);
        onClose();
      }}
      onSuccess={() => {
        setShowGoogleQuickModal(false);
        onClose();
      }}
    />
  </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12.5,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 6,
  },
  googleIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#4285F4',
    fontSize: 13,
    fontWeight: '900',
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
  },
  primaryBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
