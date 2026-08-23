import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  Globe,
  CheckCircle2,
  X,
  FileCheck,
  Server,
  Zap,
} from 'lucide-react-native';

interface SecurityVaultModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.shieldIconBox, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
                <ShieldCheck size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Security & Data Encryption
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  256-Bit End-to-End Cryptographic Protection
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Live Security Shield Hero */}
            <View
              style={[
                styles.heroCard,
                { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              ]}
            >
              <View style={styles.heroTop}>
                <Lock size={20} color={theme.primary} />
                <View style={[styles.liveBadge, { backgroundColor: theme.card }]}>
                  <View style={[styles.greenDot, { backgroundColor: theme.primary }]} />
                  <Text style={[styles.liveBadgeText, { color: theme.primary }]}>Active Encryption</Text>
                </View>
              </View>
              <Text style={[styles.heroHeading, { color: theme.textPrimary }]}>
                Your Health & Fitness Data is Encrypted
              </Text>
              <Text style={[styles.heroDesc, { color: theme.textSecondary }]}>
                MealFit employs bank-grade encryption across transport, database storage, and session tokens. No third-party data tracking.
              </Text>
            </View>

            {/* Cryptographic Protocols List */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                ENTERPRISE SECURITY SPECIFICATIONS
              </Text>

              {/* 1. TLS 1.3 */}
              <View
                style={[
                  styles.specItem,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.specIconBox, { backgroundColor: theme.cyanLight }]}>
                  <Globe size={18} color={theme.cyan} />
                </View>
                <View style={styles.specTextCol}>
                  <View style={styles.specTitleRow}>
                    <Text style={[styles.specTitle, { color: theme.textPrimary }]}>
                      TLS 1.3 Transport Security
                    </Text>
                    <CheckCircle2 size={14} color={theme.cyan} />
                  </View>
                  <Text style={[styles.specDesc, { color: theme.textMuted }]}>
                    All communications with our live Render API are encrypted via HTTPS with 2048-bit RSA / SHA-256 certificate handshake.
                  </Text>
                </View>
              </View>

              {/* 2. MongoDB AES-256 */}
              <View
                style={[
                  styles.specItem,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.specIconBox, { backgroundColor: theme.primaryLight }]}>
                  <Database size={18} color={theme.primary} />
                </View>
                <View style={styles.specTextCol}>
                  <View style={styles.specTitleRow}>
                    <Text style={[styles.specTitle, { color: theme.textPrimary }]}>
                      AES-256 Cloud Encryption
                    </Text>
                    <CheckCircle2 size={14} color={theme.primary} />
                  </View>
                  <Text style={[styles.specDesc, { color: theme.textMuted }]}>
                    Your body composition, weight logs, and dietary preferences are encrypted at rest in MongoDB Atlas enterprise clusters.
                  </Text>
                </View>
              </View>

              {/* 3. bcrypt Hashing */}
              <View
                style={[
                  styles.specItem,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.specIconBox, { backgroundColor: theme.amberLight }]}>
                  <Key size={18} color={theme.amber} />
                </View>
                <View style={styles.specTextCol}>
                  <View style={styles.specTitleRow}>
                    <Text style={[styles.specTitle, { color: theme.textPrimary }]}>
                      Zero-Knowledge bcrypt Hash
                    </Text>
                    <CheckCircle2 size={14} color={theme.amber} />
                  </View>
                  <Text style={[styles.specDesc, { color: theme.textMuted }]}>
                    Passwords are irreversibly salted and hashed with 12 rounds of bcrypt. Plaintext passwords are never stored or logged anywhere.
                  </Text>
                </View>
              </View>

              {/* 4. Signed JWT Tokens */}
              <View
                style={[
                  styles.specItem,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.specIconBox, { backgroundColor: theme.indigoLight }]}>
                  <Server size={18} color={theme.indigo} />
                </View>
                <View style={styles.specTextCol}>
                  <View style={styles.specTitleRow}>
                    <Text style={[styles.specTitle, { color: theme.textPrimary }]}>
                      Cryptographic JWT Auth
                    </Text>
                    <CheckCircle2 size={14} color={theme.indigo} />
                  </View>
                  <Text style={[styles.specDesc, { color: theme.textMuted }]}>
                    HMAC-SHA256 authenticated session tokens with strict 30-day expiration, protected against session hijacking.
                  </Text>
                </View>
              </View>

              {/* 5. ICMR-NIN & Privacy Standards */}
              <View
                style={[
                  styles.specItem,
                  { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.specIconBox, { backgroundColor: theme.roseLight }]}>
                  <FileCheck size={18} color={theme.rose} />
                </View>
                <View style={styles.specTextCol}>
                  <View style={styles.specTitleRow}>
                    <Text style={[styles.specTitle, { color: theme.textPrimary }]}>
                      ICMR-NIN & Privacy Standards
                    </Text>
                    <CheckCircle2 size={14} color={theme.rose} />
                  </View>
                  <Text style={[styles.specDesc, { color: theme.textMuted }]}>
                    Caloric benchmarks, safe BMI thresholds, and macro formulas strictly adhere to National Institute of Nutrition guidelines.
                  </Text>
                </View>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeModalBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.closeModalBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                Understood & Protected
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 11,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 36,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  heroHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  specItem: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  specIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specTextCol: {
    flex: 1,
    gap: 3,
  },
  specTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  specDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  closeModalBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  closeModalBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
