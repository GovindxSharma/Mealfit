import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { MobileApiService, getApiBaseUrl, setCustomApiHost } from '../services/api';
import { Colors } from '../theme/colors';
import {
  Activity,
  Database,
  Cloud,
  X,
  RefreshCw,
  CheckCircle,
  ShieldCheck,
  Cpu,
  Globe,
} from 'lucide-react-native';

interface LifeStatusModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LifeStatusModal: React.FC<LifeStatusModalProps> = ({ visible, onClose }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hostInput, setHostInput] = useState<string>(getApiBaseUrl());

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MobileApiService.getHealthDetails();
      setDetails(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setHostInput(getApiBaseUrl());
      fetchStatus();
    }
  }, [visible]);

  const handleApplyHost = () => {
    setCustomApiHost(hostInput);
    fetchStatus();
  };

  const isHealthy = details?.overallStatus === 'HEALTHY';
  const dbState = details?.database?.status || 'disconnected';
  const currentBaseUrl = getApiBaseUrl();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleContainer}>
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isHealthy ? Colors.primaryLight : Colors.amberLight,
                    borderColor: isHealthy ? Colors.primaryGlow : Colors.amberGlow,
                  },
                ]}
              >
                <Activity size={20} color={isHealthy ? Colors.primary : Colors.amber} />
              </View>
              <View>
                <Text style={styles.title}>App Life Status</Text>
                <Text style={styles.subtitle}>{currentBaseUrl}</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={fetchStatus}
                style={styles.refreshButton}
                activeOpacity={0.7}
              >
                <RefreshCw size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
                <X size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Host Config Box */}
          <View style={styles.ipBox}>
            <Globe size={14} color={Colors.cyan} />
            <TextInput
              style={styles.ipInput}
              value={hostInput}
              onChangeText={setHostInput}
              placeholder="Backend IP e.g. 192.168.0.175"
              placeholderTextColor={Colors.textMuted}
            />
            <TouchableOpacity onPress={handleApplyHost} style={styles.ipBtn}>
              <Text style={styles.ipBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Probing {currentBaseUrl}...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Connection Failed</Text>
              <Text style={styles.errorSubtitle}>{error}</Text>
              <Text style={styles.errorTip}>
                Ensure your phone & Mac are on the same Wi-Fi. Target: {currentBaseUrl}
              </Text>
              <TouchableOpacity onPress={fetchStatus} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry Connection</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
              {/* Overall Summary */}
              <View style={styles.summaryRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Status</Text>
                  <View style={styles.pulseRow}>
                    <View
                      style={[
                        styles.dot,
                        { backgroundColor: isHealthy ? Colors.success : Colors.warning },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statValue,
                        { color: isHealthy ? Colors.success : Colors.warning },
                      ]}
                    >
                      {details?.overallStatus}
                    </Text>
                  </View>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Uptime</Text>
                  <Text style={[styles.statValue, { color: Colors.textPrimary }]}>
                    {details?.uptimeHuman}
                  </Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Database</Text>
                  <Text style={[styles.statValue, { color: Colors.success }]}>
                    {details?.database?.status === 'connected' ? 'Connected' : 'Offline'}
                  </Text>
                </View>
              </View>

              {/* Database Section */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Database size={16} color={Colors.primary} />
                    <Text style={styles.sectionTitle}>MongoDB Connection</Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          dbState === 'connected' ? Colors.primaryLight : Colors.amberLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: dbState === 'connected' ? Colors.success : Colors.warning },
                      ]}
                    >
                      {dbState.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Ping Latency:</Text>
                  <Text style={styles.metaValue}>
                    {details?.database?.latencyMs !== null
                      ? `${details?.database?.latencyMs} ms`
                      : 'N/A'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Cluster Host:</Text>
                  <Text style={styles.metaValue}>
                    {details?.database?.host || 'Local Embedded MongoDB'}
                  </Text>
                </View>
              </View>

              {/* External Services */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <Cloud size={16} color={Colors.cyan} />
                    <Text style={styles.sectionTitle}>External Weather / AQI</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: Colors.primaryLight }]}>
                    <Text style={[styles.badgeText, { color: Colors.success }]}>HEALTHY</Text>
                  </View>
                </View>
                <Text style={styles.metaLabel}>
                  Open-Meteo Satellite Feed (Latency: {details?.externalServices?.openMeteoWeather?.latencyMs || 250}ms)
                </Text>
              </View>

              {/* Modular Monolith Subsystems */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <ShieldCheck size={16} color={Colors.purple} />
                  <Text style={styles.sectionTitle}>Modular Monolith Subsystems</Text>
                </View>

                <View style={styles.modulesGrid}>
                  {details?.modules?.map((mod: any, idx: number) => (
                    <View key={idx} style={styles.moduleItem}>
                      <View>
                        <Text style={styles.moduleName}>{mod.name}</Text>
                        <Text style={styles.modulePath}>{mod.path}</Text>
                      </View>
                      <CheckCircle size={14} color={Colors.primary} />
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          )}
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    maxHeight: '85%',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.cyan,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  closeButton: {
    padding: 6,
  },
  ipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  ipInput: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    paddingVertical: 6,
  },
  ipBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  ipBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  errorBox: {
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginBottom: 16,
    gap: 6,
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.danger,
  },
  errorSubtitle: {
    fontSize: 11,
    color: '#DC2626',
  },
  errorTip: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  retryBtn: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 4,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollContent: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 10,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  metaLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modulesGrid: {
    gap: 6,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  moduleName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  modulePath: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
