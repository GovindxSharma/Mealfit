import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { MobileApiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Activity, Move } from 'lucide-react-native';
import { LifeStatusModal } from './LifeStatusModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DraggableLivePill: React.FC = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Position animated value (default bottom right)
  const pan = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH - 120, y: SCREEN_HEIGHT - 160 })).current;

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

  // PanResponder to handle dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          // @ts-ignore
          x: pan.x._value,
          // @ts-ignore
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const isUp = status === 'UP';

  return (
    <>
      <Animated.View
        style={[
          styles.draggableContainer,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[
            styles.floatingPill,
            {
              backgroundColor: isUp ? '#FFFFFF' : '#FEF2F2',
              borderColor: isUp ? theme.primary : theme.danger,
            },
          ]}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: isUp ? theme.primary : theme.danger },
            ]}
          />
          <Activity size={12} color={isUp ? theme.primary : theme.danger} />
          <Text
            style={[
              styles.pillText,
              { color: isUp ? theme.textPrimary : theme.danger },
            ]}
          >
            {isUp ? (latencyMs ? `${latencyMs}ms` : 'Live') : 'Offline'}
          </Text>
          <Move size={10} color={theme.textMuted} style={styles.dragIcon} />
        </TouchableOpacity>
      </Animated.View>

      <LifeStatusModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  draggableContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9998,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  floatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  dragIcon: {
    marginLeft: 2,
    opacity: 0.7,
  },
});
