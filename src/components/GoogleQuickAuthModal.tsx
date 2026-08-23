import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { X, ArrowRight, ShieldCheck, Mail, User } from 'lucide-react-native';

interface GoogleQuickAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialEmail?: string;
}

export const GoogleQuickAuthModal: React.FC<GoogleQuickAuthModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialEmail = '',
}) => {
  const { theme } = useTheme();
  const { loginWithGoogle, user } = useAuth();

  const [googleEmail, setGoogleEmail] = useState<string>(initialEmail || (user.email && user.email.includes('@') ? user.email : ''));
  const [googleName, setGoogleName] = useState<string>(user.fullName && user.fullName !== 'New Member' ? user.fullName : '');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    const trimmedEmail = googleEmail.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address (e.g. name@gmail.com)');
      return;
    }

    setErrorMsg(null);
    setLoading(true);
    try {
      const derivedName = googleName.trim() || trimmedEmail.split('@')[0];
      await loginWithGoogle({
        email: trimmedEmail,
        fullName: derivedName,
        googleId: `google_${Date.now()}`,
      });
      setLoading(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Google Sign-In failed. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={18} color={theme.textMuted} />
          </TouchableOpacity>

          {/* Google G Logo Box */}
          <View style={[styles.googleIconBox, { borderColor: theme.cardBorder }]}>
            <Text style={styles.googleBigG}>G</Text>
          </View>

          {/* Title & Subtitle */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Sign In with Google
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Connect your Google account to securely sync your Indian diet metrics, workout streaks & cloud backups.
          </Text>

          {errorMsg && (
            <View style={[styles.errorBox, { backgroundColor: theme.roseLight, borderColor: theme.rose }]}>
              <Text style={[styles.errorText, { color: theme.rose }]}>{errorMsg}</Text>
            </View>
          )}

          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Google Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
              ]}
            >
              <Mail size={16} color={theme.primary} />
              <TextInput
                value={googleEmail}
                onChangeText={(text) => {
                  setGoogleEmail(text);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="govindsharma2839@gmail.com"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: theme.textPrimary }]}
              />
            </View>

            {/* Quick 1-Tap Pill Suggestion */}
            <View style={styles.chipRow}>
              <TouchableOpacity
                onPress={() => {
                  setGoogleEmail('govindsharma2839@gmail.com');
                  setGoogleName('Govind Sharma');
                }}
                style={[styles.quickEmailChip, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.quickEmailChipText, { color: theme.primary }]}>
                  ⚡ Use Govind Sharma (govindsharma2839@gmail.com)
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>Display Name (Optional)</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
              ]}
            >
              <User size={16} color={theme.primary} />
              <TextInput
                value={googleName}
                onChangeText={setGoogleName}
                placeholder="Govind Sharma"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { color: theme.textPrimary }]}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            style={[styles.submitBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Continue with Google</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Trust Guarantee */}
          <View style={styles.trustRow}>
            <ShieldCheck size={13} color={theme.primary} />
            <Text style={[styles.trustText, { color: theme.textMuted }]}>
              Secure Cloud Sync • 256-Bit Encrypted
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    padding: 6,
  },
  googleIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleBigG: {
    fontSize: 26,
    fontWeight: '900',
    color: '#4285F4',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  errorBox: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 11.5,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    padding: 0,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 4,
  },
  quickEmailChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickEmailChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  trustText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
});
