import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MobileApiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Activity, Radio } from 'lucide-react-native';
import { LifeStatusModal } from './LifeStatusModal';

export const LifeStatusBadge: React.FC = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      const start = Date.now();
      try {
        const res = await MobileApiService.getHealth();
        if (!isMounted) return;
        const ping = Date.now() - start;
        setLatencyMs(ping);
        if (res && (res.status === 'UP' || res.uptimeSeconds !== undefined)) {
          setStatus('UP');
        } else {
          setStatus('DOWN');
        }
      } catch (err) {
        if (!isMounted) return;
        setStatus('DOWN');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isUp = status === 'UP';

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.badge,
          {
            backgroundColor: isUp ? 'rgba(0, 230, 118, 0.12)' : 'rgba(255, 82, 82, 0.12)',
            borderColor: isUp ? 'rgba(0, 230, 118, 0.3)' : 'rgba(255, 82, 82, 0.3)',
          },
        ]}
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: isUp ? theme.primary : theme.rose },
          ]}
        />
        <Activity size={11} color={isUp ? theme.primary : theme.rose} />
        <Text
          style={[
            styles.badgeText,
            { color: isUp ? theme.primary : theme.rose },
          ]}
        >
          {isUp ? (latencyMs ? `${latencyMs}ms Live` : 'Live API') : 'Offline'}
        </Text>
      </TouchableOpacity>

      <LifeStatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
