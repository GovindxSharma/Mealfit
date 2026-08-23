import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Dumbbell,
  Activity,
  Heart,
} from 'lucide-react-native';

interface WorkoutAnimationCardProps {
  exerciseName?: string;
  tempo?: string; // e.g. "3-0-1" (3s Down, 0s Pause, 1s Up)
  category?: 'strength' | 'running' | 'warmup' | 'cooldown';
}

export const WorkoutAnimationCard: React.FC<WorkoutAnimationCardProps> = ({
  exerciseName = 'Bodyweight Squats',
  tempo = '3-0-1',
  category = 'strength',
}) => {
  const { theme } = useTheme();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tempoPhase, setTempoPhase] = useState<'eccentric' | 'pause' | 'concentric'>('eccentric');
  const [repCount, setRepCount] = useState<number>(0);
  const [tempoSeconds, setTempoSeconds] = useState<number>(3);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    let interval: any;

    if (isActive) {
      // Animated visual pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: category === 'running' ? 350 : 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: category === 'running' ? 350 : 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Cadence / Rep counter logic
      let phaseStep = 3;
      interval = setInterval(() => {
        if (category === 'running') {
          setRepCount((prev) => prev + 2); // Running strides
        } else {
          // 3s Lowering ➔ 1s Explode
          phaseStep -= 1;
          if (phaseStep > 0) {
            setTempoPhase('eccentric');
            setTempoSeconds(phaseStep);
          } else if (phaseStep === 0) {
            setTempoPhase('concentric');
            setTempoSeconds(1);
          } else {
            setRepCount((prev) => prev + 1);
            phaseStep = 3;
            setTempoPhase('eccentric');
            setTempoSeconds(3);
          }
        }
      }, 1000);
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      clearInterval(interval);
      pulseAnim.stopAnimation();
    };
  }, [isActive, category]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setRepCount(0);
    setTempoSeconds(3);
    setTempoPhase('eccentric');
    pulseAnim.setValue(1);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleInfo}>
          <View style={styles.categoryBadge}>
            <Activity size={12} color={theme.primary} />
            <Text style={[styles.categoryText, { color: theme.primary }]}>
              {category === 'running' ? 'RUNNING CADENCE' : 'VISUAL REP TEMPO GUIDE'}
            </Text>
          </View>
          <Text style={[styles.exerciseTitle, { color: theme.textPrimary }]}>
            {exerciseName}
          </Text>
        </View>

        <View style={[styles.repCountBox, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.repNumber, { color: theme.primary }]}>{repCount}</Text>
          <Text style={[styles.repLabel, { color: theme.primary }]}>
            {category === 'running' ? 'Strides' : 'Reps'}
          </Text>
        </View>
      </View>

      {/* Interactive Visual Animation Area */}
      <View
        style={[
          styles.animationStage,
          { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
        ]}
      >
        {/* Pulsing Outer Rings */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              borderColor: theme.primary,
              transform: [{ scale: pulseAnim }],
              opacity: isActive ? 0.35 : 0.15,
            },
          ]}
        />

        {/* Central Kinetic Core */}
        <View
          style={[
            styles.coreCircle,
            {
              backgroundColor: isActive ? theme.primary : theme.cardBorder,
              shadowColor: theme.primary,
            },
          ]}
        >
          {category === 'running' ? (
            <Heart size={28} color="#FFFFFF" />
          ) : (
            <Dumbbell size={28} color="#FFFFFF" />
          )}
        </View>

        {/* Dynamic Tempo Text */}
        <View style={styles.tempoInfoOverlay}>
          {category === 'running' ? (
            <Text style={[styles.tempoPhaseText, { color: theme.textPrimary }]}>
              {isActive ? '170 SPM Cadence Pulse' : 'Tap Start for Paced Rhythm'}
            </Text>
          ) : (
            <Text style={[styles.tempoPhaseText, { color: theme.textPrimary }]}>
              {isActive
                ? tempoPhase === 'eccentric'
                  ? `Lower Slowly: ${tempoSeconds}s`
                  : 'Explode Up!'
                : 'Controlled 3s Tempo • Hypertrophy Focus'}
            </Text>
          )}
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity
          onPress={handleToggle}
          style={[
            styles.playBtn,
            { backgroundColor: isActive ? theme.amber : theme.primary },
          ]}
          activeOpacity={0.85}
        >
          {isActive ? (
            <>
              <Pause size={16} color="#FFFFFF" />
              <Text style={styles.btnText}>Pause Tempo</Text>
            </>
          ) : (
            <>
              <Play size={16} color="#FFFFFF" />
              <Text style={styles.btnText}>Start Rep Tempo Guide</Text>
            </>
          )}
        </TouchableOpacity>

        {repCount > 0 && (
          <TouchableOpacity
            onPress={handleReset}
            style={[
              styles.resetBtn,
              { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
            ]}
          >
            <RotateCcw size={16} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleInfo: {
    flex: 1,
    gap: 2,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  exerciseTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  repCountBox: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  repNumber: {
    fontSize: 18,
    fontWeight: '900',
  },
  repLabel: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  animationStage: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
  },
  coreCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
  },
  tempoInfoOverlay: {
    alignItems: 'center',
    marginTop: 4,
  },
  tempoPhaseText: {
    fontSize: 12,
    fontWeight: '800',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 8,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
