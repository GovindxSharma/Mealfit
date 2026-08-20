import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MobileApiService } from '../services/api';
import { Colors } from '../theme/colors';
import { Activity } from 'lucide-react-native';
import { LifeStatusModal } from './LifeStatusModal';

export const LifeStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await MobileApiService.getHealth();
        if (res && (res.status === 'UP' || res.uptimeSeconds !== undefined)) {
          setStatus('UP');
        } else {
          setStatus('DOWN');
        }
      } catch (err) {
        setStatus('DOWN');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const isUp = status === 'UP';

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.badge,
          {
            backgroundColor: isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            borderColor: isUp ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          },
        ]}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: isUp ? Colors.success : Colors.danger },
          ]}
        />
        <Activity size={12} color={isUp ? Colors.success : Colors.danger} />
        <Text
          style={[
            styles.badgeText,
            { color: isUp ? Colors.success : Colors.danger },
          ]}
        >
          {isUp ? 'Backend Live' : 'Offline'}
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
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
