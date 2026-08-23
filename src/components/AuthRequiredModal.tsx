import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';
import { Lock, ArrowRight, ShieldCheck, X, UserPlus, LogIn } from 'lucide-react-native';

interface AuthRequiredModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  visible,
  onClose,
  title = 'Account Sync Required',
  subtitle = 'Create a free profile or sign in to sync your personalized Indian diet, macro logs & fitness streaks across all devices.',
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  const handleSignIn = () => {
    onClose();
    router.push('/auth/login' as any);
  };

  const handleRegister = () => {
    onClose();
    router.push('/auth/register' as any);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
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

          {/* Primary Action: Sign In */}
          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
          >
            <LogIn size={18} color="#FFFFFF" />
            <Text style={styles.primaryBtnText}>Sign In to MealFit</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Secondary Action: Create Account */}
          <TouchableOpacity
            onPress={handleRegister}
            style={[
              styles.secondaryBtn,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.85}
          >
            <UserPlus size={16} color={theme.textPrimary} />
            <Text style={[styles.secondaryBtnText, { color: theme.textPrimary }]}>
              Create Free Profile
            </Text>
          </TouchableOpacity>

          {/* Trust note */}
          <View style={styles.trustRow}>
            <ShieldCheck size={12} color={theme.primary} />
            <Text style={[styles.trustText, { color: theme.textMuted }]}>
              Secure Cloud Sync • 100% Free Forever
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
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginLeft: 10,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
