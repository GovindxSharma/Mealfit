import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import {
  Bell,
  X,
  Droplets,
  Utensils,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react-native';

export interface InAppNotification {
  id: string;
  title: string;
  body: string;
  type?: 'hydration' | 'meal' | 'workout' | 'cheat_offset' | 'default';
}

let notifyListeners: ((notif: InAppNotification) => void)[] = [];

export const showInAppNotification = (notif: InAppNotification) => {
  notifyListeners.forEach((listener) => listener(notif));
};

export const NotificationBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [currentNotif, setCurrentNotif] = useState<InAppNotification | null>(null);
  const [slideAnim] = useState(new Animated.Value(-120));

  useEffect(() => {
    const handleNotify = (notif: InAppNotification) => {
      setCurrentNotif(notif);
      Animated.sequence([
        Animated.spring(slideAnim, {
          toValue: insets.top + 8,
          useNativeDriver: true,
          bounciness: 6,
        }),
        Animated.delay(4500),
        Animated.timing(slideAnim, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentNotif(null);
      });
    };

    notifyListeners.push(handleNotify);
    return () => {
      notifyListeners = notifyListeners.filter((l) => l !== handleNotify);
    };
  }, [insets.top]);

  if (!currentNotif) return null;

  const getIcon = () => {
    switch (currentNotif.type) {
      case 'hydration':
        return <Droplets size={16} color={theme.cyan} />;
      case 'meal':
        return <Utensils size={16} color={theme.primary} />;
      case 'workout':
        return <Dumbbell size={16} color={theme.indigo} />;
      case 'cheat_offset':
        return <ShieldAlert size={16} color={theme.amber} />;
      default:
        return <Bell size={16} color={theme.primary} />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: theme.card,
          borderColor: theme.primary,
          shadowColor: theme.primary,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: theme.primaryLight }]}>
        {getIcon()}
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.titleText, { color: theme.textPrimary }]}>
          {currentNotif.title}
        </Text>
        <Text style={[styles.bodyText, { color: theme.textSecondary }]}>
          {currentNotif.body}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          Animated.timing(slideAnim, {
            toValue: -120,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setCurrentNotif(null));
        }}
        style={styles.closeButton}
      >
        <X size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 0,
    zIndex: 9999,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 15,
  },
  closeButton: {
    padding: 4,
  },
});
