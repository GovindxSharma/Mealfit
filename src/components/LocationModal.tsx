import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  X,
  Search,
  CloudSun,
  Wind,
  Droplets,
  ShieldAlert,
  Check,
  Zap,
} from 'lucide-react-native';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  currentWeather: any;
  onSelectCity: (city: string) => void;
}

const POPULAR_CITIES = [
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Indore',
  'Ahmedabad',
  'Kolkata',
  'Chandigarh',
  'Chennai',
];

export const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
  currentWeather,
  onSelectCity,
}) => {
  const { theme } = useTheme();
  const { user, updateUserProfile } = useAuth();
  const [cityInput, setCityInput] = useState<string>(user.city || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleApply = (selectedCityName: string) => {
    const cleanCity = selectedCityName.trim();
    if (!cleanCity) return;
    setLoading(true);
    updateUserProfile({ city: cleanCity });
    onSelectCity(cleanCity);
    setLoading(false);
    onClose();
  };

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
              <View style={[styles.iconBox, { backgroundColor: theme.cyanLight }]}>
                <MapPin size={18} color={theme.cyan} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
                  Live Weather & Location
                </Text>
                <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
                  Dynamic AQI & Heat Hydration Scaling
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Current Weather Card */}
            {currentWeather && (
              <View
                style={[
                  styles.weatherOverviewCard,
                  { backgroundColor: 'rgba(0, 210, 255, 0.05)', borderColor: theme.cyan },
                ]}
              >
                <View style={styles.weatherTopRow}>
                  <View>
                    <Text style={[styles.cityName, { color: theme.textPrimary }]}>
                      {currentWeather.city}
                    </Text>
                    <Text style={[styles.stateName, { color: theme.textSecondary }]}>
                      {currentWeather.state || 'India'}
                    </Text>
                  </View>
                  <View style={styles.tempBadge}>
                    <CloudSun size={20} color={theme.cyan} />
                    <Text style={[styles.tempText, { color: theme.cyan }]}>
                      {currentWeather.temperatureC}°C
                    </Text>
                  </View>
                </View>

                {/* Weather Metrics Grid */}
                <View style={styles.metricsGrid}>
                  <View style={[styles.metricItem, { backgroundColor: theme.backgroundSecondary }]}>
                    <Droplets size={14} color={theme.cyan} />
                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>Humidity</Text>
                    <Text style={[styles.metricVal, { color: theme.textPrimary }]}>
                      {currentWeather.humidityPercent}%
                    </Text>
                  </View>

                  <View style={[styles.metricItem, { backgroundColor: theme.backgroundSecondary }]}>
                    <Wind size={14} color={theme.indigo} />
                    <Text style={[styles.metricLabel, { color: theme.textMuted }]}>AQI Index</Text>
                    <Text
                      style={[
                        styles.metricVal,
                        {
                          color:
                            currentWeather.aqi > 200
                              ? theme.rose
                              : currentWeather.aqi > 100
                              ? theme.amber
                              : theme.primary,
                        },
                      ]}
                    >
                      {currentWeather.aqi} ({currentWeather.aqiCategory})
                    </Text>
                  </View>
                </View>

                {currentWeather.hydrationAdjustmentMl > 0 && (
                  <View style={[styles.heatBonusRow, { backgroundColor: theme.cyanLight }]}>
                    <Zap size={13} color={theme.cyan} />
                    <Text style={[styles.heatBonusText, { color: theme.cyan }]}>
                      +{currentWeather.hydrationAdjustmentMl}mL climate hydration bonus active
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Custom Location Search */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                ENTER YOUR CUSTOM CITY OR DISTRICT
              </Text>
              <View style={styles.searchRow}>
                <View
                  style={[
                    styles.searchInputContainer,
                    {
                      backgroundColor: theme.backgroundSecondary,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <Search size={16} color={theme.textMuted} />
                  <TextInput
                    value={cityInput}
                    onChangeText={setCityInput}
                    placeholder="Type city e.g. Pune, Jaipur, Indore..."
                    placeholderTextColor={theme.textMuted}
                    style={[styles.searchInput, { color: theme.textPrimary }]}
                    onSubmitEditing={() => handleApply(cityInput)}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleApply(cityInput)}
                  style={[styles.applyBtn, { backgroundColor: theme.primary }]}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={[styles.applyBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                      Set
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Suggestions */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                POPULAR REGIONS
              </Text>
              <View style={styles.chipsContainer}>
                {POPULAR_CITIES.map((cName) => {
                  const isCurrent =
                    (user.city || '').toLowerCase() === cName.toLowerCase() ||
                    (currentWeather?.city || '').toLowerCase() === cName.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={cName}
                      onPress={() => {
                        setCityInput(cName);
                        handleApply(cName);
                      }}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isCurrent ? theme.cyanLight : 'rgba(255, 255, 255, 0.03)',
                          borderColor: isCurrent ? theme.cyan : theme.cardBorder,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      {isCurrent && <Check size={12} color={theme.cyan} />}
                      <Text
                        style={[
                          styles.chipText,
                          { color: isCurrent ? theme.cyan : theme.textSecondary },
                        ]}
                      >
                        {cName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
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
    maxHeight: '85%',
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
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
    gap: 18,
    paddingBottom: 36,
  },
  weatherOverviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  weatherTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 18,
    fontWeight: '800',
  },
  stateName: {
    fontSize: 12,
  },
  tempBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tempText: {
    fontSize: 20,
    fontWeight: '900',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricItem: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  heatBonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 8,
  },
  heatBonusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    padding: 0,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
});
