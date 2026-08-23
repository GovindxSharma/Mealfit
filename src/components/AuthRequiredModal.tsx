import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { promptGoogleSignIn } from '../services/googleAuth';
import { useRouter } from 'expo-router';
import { Lock, ArrowRight, ShieldCheck, X } from 'lucide-react-native';

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
  subtitle = 'Sign in with Google to sync your personalized Indian diet, macro logs & fitness streaks.',
}) => {
  const { theme } = useTheme();
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await promptGoogleSignIn();
      await loginWithGoogle(googleUser);
      onClose();
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (!msg.includes('cancelled') && !msg.includes('12501') && !msg.includes('dismiss')) {
        Alert.alert('Google Sign-In', msg);
      }
    }
  };

  const handleGoToAuth = () => {
    onClose();
    router.push('/auth/login' as any);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
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
              { backgroundColor: theme.isDark ? '#1E293B' : '#FFFFFF', borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.85}
          >
            <View style={styles.googleIconBox}>
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={[styles.googleBtnText, { color: theme.textPrimary }]}>
              Continue with Google
            </Text>
            <ArrowRight size={16} color={theme.primary} />
          </TouchableOpacity>

          {/* Trust note */}
          <View style={styles.trustRow}>
            <ShieldCheck size={12} color={theme.primary} />
            <Text style={[styles.trustText, { color: theme.textMuted }]}>
              Official Google OAuth 2.0 • 100% Free Forever
            </Text>
          </View>
        </View>
      </View>
    </Modal>
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
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  googleBtnText: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginLeft: 12,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
