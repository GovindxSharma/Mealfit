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
import { ShieldCheck, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

const LOADING_CUES = [
  'Calibrating Indian nutrition benchmarks...',
  'Preparing today’s living room workout...',
  'Syncing hydration & macro goals...',
  'Welcome to MealFit India',
];

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onFinish }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const [cueIndex, setCueIndex] = useState<number>(0);

  useEffect(() => {
    // 1. Smooth Spring & Fade Entrance
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Smooth Loading Progress across 2.1 seconds
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2100,
      useNativeDriver: false,
    }).start();

    // 3. Dynamic rotating status cues
    const cue1 = setTimeout(() => setCueIndex(1), 700);
    const cue2 = setTimeout(() => setCueIndex(2), 1400);
    const cue3 = setTimeout(() => setCueIndex(3), 1900);

    // 4. Auto transition into app
    const timer = setTimeout(() => {
      handleComplete();
    }, 2300);

    return () => {
      clearTimeout(cue1);
      clearTimeout(cue2);
      clearTimeout(cue3);
      clearTimeout(timer);
    };
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

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: '#0B0F17', opacity: fadeOutAnim },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleComplete}
        style={styles.touchArea}
      >
        <Animated.View
          style={[
            styles.contentBox,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Flat, Normal Clean Brand Icon */}
          <View style={styles.logoBadge}>
            <Image
              source={require('../../assets/mealfit_icon_v2.png')}
              style={styles.splashIconImage}
              resizeMode="contain"
            />
          </View>

          {/* Clean Modern App Title */}
          <Text style={styles.brandTitle}>
            MealFit <Text style={styles.brandAccent}>India</Text>
          </Text>

          {/* Soothing, Balanced Tagline */}
          <Text style={styles.tagline}>
            Smart Indian Nutrition & Living Room Fitness
          </Text>

          {/* Dynamic Real-time Calibrating Cue */}
          <Text style={styles.loadingCueText}>
            {LOADING_CUES[cueIndex]}
          </Text>

          {/* Refined Loading Progress Line */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                  backgroundColor: '#1488A6',
                },
              ]}
            />
          </View>

          {/* Trust & Privacy Badge */}
          <View style={styles.footerNote}>
            <ShieldCheck size={13} color="#1488A6" />
            <Text style={styles.footerText}>
              Personalized • 100% Private • India-First
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
    width: 80,
    height: 80,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  splashIconImage: {
    width: 80,
    height: 80,
    borderRadius: 18,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    marginBottom: 6,
    textAlign: 'center',
    color: '#F8FAFC',
  },
  brandAccent: {
    color: '#1488A6',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
    color: '#94A3B8',
    letterSpacing: -0.1,
  },
  loadingCueText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1488A6',
    marginBottom: 12,
    textAlign: 'center',
    minHeight: 18,
    letterSpacing: 0.2,
  },
  progressTrack: {
    width: 140,
    height: 3.5,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(20, 136, 166, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(20, 136, 166, 0.18)',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: '#94A3B8',
  },
});
