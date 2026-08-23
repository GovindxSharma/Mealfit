import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import {
  Palette,
  X,
  Check,
  Moon,
  Sun,
  Smartphone,
} from 'lucide-react-native';

interface ThemeSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();

  const paletteSwatches = [
    { label: 'Primary Teal', hex: '#1488A6', textHex: '#FFFFFF' },
    { label: 'Secondary Mint', hex: '#20D4BF', textHex: '#0F172A' },
    { label: 'Accent Soft Green', hex: '#CCF8F1', textHex: '#0F172A' },
    { label: 'Light Background', hex: '#FFFFFF', textHex: '#0F172A', border: true },
    { label: 'Surface Card', hex: '#F7FBF8', textHex: '#0F172A', border: true },
    { label: 'Text Dark', hex: '#0F172A', textHex: '#FFFFFF' },
    { label: 'Text Muted', hex: '#64748B', textHex: '#FFFFFF' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: '#FFFFFF', borderColor: theme.cardBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Palette size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>5. Teal Balance</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Calm • Balanced • Holistic
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Active Theme Badge Card */}
            <View style={[styles.activeThemeCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
              <View style={styles.themeCardHeader}>
                <View style={styles.titleWithBadge}>
                  <Text style={[styles.themeMainTitle, { color: theme.textPrimary }]}>Teal Balance System</Text>
                  <View style={[styles.activeBadge, { backgroundColor: theme.primary }]}>
                    <Check size={11} color="#FFFFFF" />
                    <Text style={styles.activeBadgeText}>ACTIVE THEME</Text>
                  </View>
                </View>
                <Text style={[styles.themeDescription, { color: theme.textSecondary }]}>
                  A soothing, fresh and clean theme that promotes balance between fitness, nutrition and well-being.
                </Text>
              </View>

              {/* Color Swatches Grid */}
              <View style={styles.swatchSection}>
                <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>COLOR PALETTE</Text>
                <View style={styles.swatchesGrid}>
                  {paletteSwatches.map((s) => (
                    <View key={s.label} style={styles.swatchItem}>
                      <View
                        style={[
                          styles.swatchBlock,
                          {
                            backgroundColor: s.hex,
                            borderColor: s.border ? theme.cardBorder : s.hex,
                          },
                        ]}
                      />
                      <Text style={[styles.swatchLabel, { color: theme.textPrimary }]}>{s.label}</Text>
                      <Text style={[styles.swatchHex, { color: theme.textMuted }]}>{s.hex}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Typography info */}
              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={[styles.metaTitle, { color: theme.textMuted }]}>TYPOGRAPHY</Text>
                  <Text style={[styles.metaValue, { color: theme.textPrimary }]}>Nunito Sans</Text>
                  <Text style={[styles.metaSub, { color: theme.textSecondary }]}>Modern, rounded & highly readable</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.doneBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>
                Done
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
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 14,
  },
  activeThemeCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    gap: 14,
  },
  themeCardHeader: {
    gap: 6,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeMainTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  themeDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  swatchSection: {
    gap: 8,
    paddingTop: 6,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  swatchesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatchItem: {
    width: '30%',
    alignItems: 'center',
    gap: 4,
  },
  swatchBlock: {
    width: '100%',
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
  },
  swatchLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  swatchHex: {
    fontSize: 9,
    fontWeight: '600',
  },
  metaRow: {
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  metaCol: {
    gap: 2,
  },
  metaTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  metaSub: {
    fontSize: 11,
  },
  doneBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
