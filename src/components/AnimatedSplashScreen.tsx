import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Flame, Sparkles, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const { theme } = useTheme();

  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation (scale + opacity)
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(textSlideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.12,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Auto-finish after 2.2s
    const timer = setTimeout(() => {
      handleComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 450,
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
        {/* Glowing Circle Background */}
        <Animated.View
          style={[
            styles.glowAura,
            {
              backgroundColor: theme.primaryLight,
              borderColor: theme.primary,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              backgroundColor: theme.card,
              borderColor: theme.primary,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={styles.splashLogoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Typography */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: textSlideAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>MealFit</Text>
            <View style={[styles.indiaBadge, { backgroundColor: theme.amberLight, borderColor: theme.amber }]}>
              <Text style={[styles.indiaText, { color: theme.amber }]}>INDIA</Text>
            </View>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            High-Protein Indian Diets & Living Room Fitness
          </Text>

          {/* Micro badges */}
          <View style={styles.badgeRow}>
            <View style={[styles.microBadge, { backgroundColor: theme.primaryLight }]}>
              <Sparkles size={11} color={theme.primary} />
              <Text style={[styles.microText, { color: theme.primary }]}>ICMR-NIN Optimized</Text>
            </View>
            <View style={[styles.microBadge, { backgroundColor: theme.cyanLight }]}>
              <ShieldCheck size={11} color={theme.cyan} />
              <Text style={[styles.microText, { color: theme.cyan }]}>256-Bit Encrypted</Text>
            </View>
          </View>
        </Animated.View>

        {/* Skip note */}
        <Text style={[styles.skipText, { color: theme.textMuted }]}>
          Tap anywhere to continue
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  glowAura: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1.5,
    opacity: 0.7,
  },
  logoWrapper: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#1488A6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },
  splashLogoImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  textContainer: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  indiaBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  indiaText: {
    fontSize: 10.5,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  microBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  microText: {
    fontSize: 10,
    fontWeight: '700',
  },
  skipText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    fontWeight: '600',
  },
});
