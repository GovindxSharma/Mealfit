import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Utensils, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle fade in
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // 1.8-second display interval followed by smooth fade-out
    const timer = setTimeout(() => {
      handleComplete();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.background, opacity: fadeOutAnim },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleComplete}
        style={styles.touchArea}
      >
        <Animated.View style={[styles.contentBox, { opacity: opacityAnim }]}>
          {/* Elegant Logo Icon */}
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: theme.primary,
                shadowColor: theme.primary,
              },
            ]}
          >
            <Utensils size={36} color="#FFFFFF" strokeWidth={2.4} />
          </View>

          {/* Clean App Title */}
          <View style={styles.titleRow}>
            <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
              MealFit <Text style={{ color: theme.primary }}>India</Text>
            </Text>
          </View>

          {/* Soothing Tagline */}
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Smart Indian Nutrition & Athletic Training
          </Text>

          {/* Subtle Indicator */}
          <View style={styles.footerNote}>
            <Sparkles size={13} color={theme.primary} />
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Hyper-Localized • ICMR-NIN Aligned
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBox: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
