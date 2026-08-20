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
} from 'lucide-react-native';

interface ThemeSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themesList: {
    key: ThemeMode;
    name: string;
    description: string;
    primaryHex: string;
    bgHex: string;
    cardHex: string;
    icon: typeof Moon;
    tag: string;
  }[] = [
    {
      key: 'matte_black',
      name: 'Matte Dark Black',
      description: 'Pure matte black (#000000) canvas with crisp charcoal cards & electric ice blue.',
      primaryHex: '#38BDF8',
      bgHex: '#000000',
      cardHex: '#121212',
      icon: Moon,
      tag: 'FLAGSHIP MATTE DARK',
    },
    {
      key: 'light_clean',
      name: 'Clean Pearl Light Mode',
      description: 'Crisp, daylight white surface with deep royal indigo and high readability.',
      primaryHex: '#4F46E5',
      bgHex: '#F8FAFC',
      cardHex: '#FFFFFF',
      icon: Sun,
      tag: 'DAYLIGHT CLEAN',
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Palette size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Choose App Theme</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Matte Dark Black & Clean Pearl Light
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.sectionHeading, { color: theme.textMuted }]}>
              SELECT YOUR THEME
            </Text>

            <View style={styles.themeGrid}>
              {themesList.map((t) => {
                const isSelected = themeMode === t.key;
                const IconComponent = t.icon;
                return (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setThemeMode(t.key)}
                    style={[
                      styles.themeCard,
                      {
                        backgroundColor: isSelected ? theme.primaryLight : 'rgba(255, 255, 255, 0.02)',
                        borderColor: isSelected ? theme.primary : theme.cardBorder,
                      },
                    ]}
                    activeOpacity={0.85}
                  >
                    <View style={styles.swatchRow}>
                      <View style={styles.iconAndSwatches}>
                        <View style={[styles.modeIconBox, { backgroundColor: isSelected ? theme.primary : 'rgba(255, 255, 255, 0.06)' }]}>
                          <IconComponent size={16} color={isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary} />
                        </View>
                        <View style={styles.swatchCircles}>
                          <View style={[styles.circle, { backgroundColor: t.bgHex, borderColor: '#475569' }]} />
                          <View style={[styles.circle, { backgroundColor: t.cardHex, marginLeft: -8, borderColor: '#475569' }]} />
                          <View style={[styles.circle, { backgroundColor: t.primaryHex, marginLeft: -8, borderColor: '#FFFFFF' }]} />
                        </View>
                      </View>

                      <View style={[styles.tagPill, { backgroundColor: isSelected ? theme.primary : 'rgba(255, 255, 255, 0.08)' }]}>
                        <Text style={[styles.tagText, { color: isSelected ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted }]}>
                          {t.tag}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.themeInfo}>
                      <Text style={[styles.themeName, { color: theme.textPrimary }]}>{t.name}</Text>
                      <Text style={[styles.themeDesc, { color: theme.textSecondary }]}>{t.description}</Text>
                    </View>

                    {isSelected && (
                      <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]}>
                        <Check size={12} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                        <Text style={[styles.activeText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>Active Theme</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.doneBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <Text style={[styles.doneBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                Apply Theme
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
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
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingVertical: 16,
    gap: 14,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  themeGrid: {
    gap: 12,
  },
  themeCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconAndSwatches: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchCircles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  themeInfo: {
    gap: 2,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '800',
  },
  themeDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  doneBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
