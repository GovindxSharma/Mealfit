import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage, AppLanguage } from '../context/LanguageContext';
import { X, Check, Globe, Sparkles } from 'lucide-react-native';

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const { language, setLanguage, availableLanguages, t } = useLanguage();

  const handleSelect = async (langCode: AppLanguage) => {
    await setLanguage(langCode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.cardBorder }]}>
            <View style={styles.headerTitleRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
                <Globe size={18} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>
                  {t('app_language', 'App Language')}
                </Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {t('select_language_desc', 'Select your preferred display language')}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Languages List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {availableLanguages.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.75}
                  style={[
                    styles.langCard,
                    {
                      backgroundColor: isSelected
                        ? theme.primaryLight
                        : theme.backgroundSecondary,
                      borderColor: isSelected ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.langLeft}>
                    <Text style={styles.flagText}>{lang.flag}</Text>
                    <View>
                      <View style={styles.nameRow}>
                        <Text
                          style={[
                            styles.nativeName,
                            {
                              color: isSelected ? theme.primary : theme.textPrimary,
                              fontWeight: isSelected ? '800' : '700',
                            },
                          ]}
                        >
                          {lang.nativeLabel}
                        </Text>
                        {lang.nativeLabel !== lang.label && (
                          <Text style={[styles.englishName, { color: theme.textMuted }]}>
                            ({lang.label})
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.regionText, { color: theme.textMuted }]}>
                        {lang.region}
                      </Text>
                    </View>
                  </View>

                  {isSelected ? (
                    <View
                      style={[
                        styles.checkBadge,
                        { backgroundColor: theme.primary },
                      ]}
                    >
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.uncheckCircle,
                        { borderColor: theme.cardBorder },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Note */}
          <View style={[styles.footer, { borderTopColor: theme.cardBorder }]}>
            <Sparkles size={13} color={theme.primary} />
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Instant Live Translation • 100% Offline Compatible
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
    backgroundColor: 'rgba(10, 14, 23, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    maxHeight: '82%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
  },
  scrollList: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  flagText: {
    fontSize: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nativeName: {
    fontSize: 15,
  },
  englishName: {
    fontSize: 13,
    fontWeight: '500',
  },
  regionText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
