import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Gentle, soothing fade in (800ms)
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 2. Calm, smooth loading progress bar across 2.4 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2400,
      useNativeDriver: false,
    }).start();

    // 3. Calm transition to app
    const timer = setTimeout(() => {
      handleComplete();
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: '#0A0E17', opacity: fadeOutAnim },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleComplete}
        style={styles.touchArea}
      >
        <Animated.View style={[styles.contentBox, { opacity: opacityAnim }]}>
          {/* Dynamic Sweeping Vitality Arc Emblem */}
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.splashIconImage}
              resizeMode="contain"
            />
          </View>

          {/* Clean App Title */}
          <Text style={[styles.brandTitle, { color: '#FFFFFF' }]}>
            MealFit <Text style={{ color: '#00E599' }}>India</Text>
          </Text>

          {/* Soothing Tagline */}
          <Text style={[styles.tagline, { color: '#94A3B8' }]}>
            Smart Indian Nutrition & Living Room Fitness
          </Text>

          {/* Calm Loading Progress Line */}
          <View style={[styles.progressTrack, { backgroundColor: theme.cardBorder }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>

          {/* Subtle ICMR Note */}
          <View style={styles.footerNote}>
            <Sparkles size={12} color={theme.primary} />
            <Text style={[styles.footerText, { color: theme.textMuted }]}>
              Personalized • 100% Private • Free
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
    paddingHorizontal: 36,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#00E599',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  splashIconImage: {
    width: 96,
    height: 96,
    borderRadius: 24,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13.5,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  progressTrack: {
    width: 160,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
