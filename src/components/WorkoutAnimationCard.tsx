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
import { HapticService } from '../services/hapticService';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Dumbbell,
  Activity,
  Heart,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Info,
  Flame,
} from 'lucide-react-native';

interface WorkoutAnimationCardProps {
  exerciseName?: string;
  tempo?: string; // e.g. "3-0-1" (3s Down, 0s Pause, 1s Up)
  category?: 'strength' | 'running' | 'warmup' | 'cooldown';
  targetMuscle?: string;
  formCues?: string[];
}

export const WorkoutAnimationCard: React.FC<WorkoutAnimationCardProps> = ({
  exerciseName = 'Bodyweight Squats',
  tempo = '3-0-1',
  category = 'strength',
  targetMuscle = 'Quadriceps & Glutes',
  formCues = [
    'Keep chest upright and core braced',
    'Lower down for 3 seconds under full control',
    'Drive through mid-foot and exhale at the top',
  ],
}) => {
  const { theme } = useTheme();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [tempoPhase, setTempoPhase] = useState<'eccentric' | 'pause' | 'concentric'>('eccentric');
  const [repCount, setRepCount] = useState<number>(0);
  const [tempoSeconds, setTempoSeconds] = useState<number>(3);
  const [breathingCue, setBreathingCue] = useState<string>('Inhale on lowering phase');

  // Animation values
  const contractionAnim = useRef(new Animated.Value(0)).current;
  const pulseRingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let interval: any;

    if (isActive) {
      // Continuous pulse for kinetic athlete feedback
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseRingAnim, {
            toValue: 1.18,
            duration: category === 'running' ? 380 : 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseRingAnim, {
            toValue: 1,
            duration: category === 'running' ? 380 : 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      let currentStep = 3;
      interval = setInterval(() => {
        if (category === 'running') {
          setRepCount((prev) => prev + 2);
        } else {
          currentStep -= 1;
          if (currentStep > 0) {
            setTempoPhase('eccentric');
            setTempoSeconds(currentStep);
            setBreathingCue('Inhale deeply • Control the descent');
            Animated.timing(contractionAnim, {
              toValue: (4 - currentStep) / 3,
              duration: 900,
              useNativeDriver: false,
            }).start();
          } else if (currentStep === 0) {
            setTempoPhase('concentric');
            setTempoSeconds(1);
            setBreathingCue('Exhale & Drive with power!');
            HapticService.light();
            Animated.timing(contractionAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }).start();
          } else {
            setRepCount((prev) => prev + 1);
            HapticService.success();
            currentStep = 3;
            setTempoPhase('eccentric');
            setTempoSeconds(3);
            setBreathingCue('Inhale deeply • Control the descent');
          }
        }
      }, 1000);
    } else {
      pulseRingAnim.setValue(1);
      contractionAnim.setValue(0);
    }

    return () => {
      clearInterval(interval);
      pulseRingAnim.stopAnimation();
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
    setBreathingCue('Inhale on lowering phase');
    pulseRingAnim.setValue(1);
    contractionAnim.setValue(0);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.cardBorder },
      ]}
    >
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: theme.primaryLight }]}>
              <Activity size={12} color={theme.primary} />
              <Text style={[styles.categoryText, { color: theme.primary }]}>
                {category === 'running' ? 'CADENCE PULSE' : 'VISUAL REP TEMPO GUIDE'}
              </Text>
            </View>
            <View style={[styles.targetBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <Text style={[styles.targetText, { color: theme.textSecondary }]}>
                Target: {targetMuscle}
              </Text>
            </View>
          </View>
          <Text style={[styles.exerciseTitle, { color: theme.textPrimary }]}>
            {exerciseName}
          </Text>
        </View>

        {/* Counter Badge */}
        <View style={[styles.repCounterCard, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.repBigNumber, { color: theme.primary }]}>{repCount}</Text>
          <Text style={[styles.repSmallLabel, { color: theme.primary }]}>
            {category === 'running' ? 'Strides' : 'Reps Completed'}
          </Text>
        </View>
      </View>

      {/* Kinetic Visual Coach Stage */}
      <View
        style={[
          styles.kineticStage,
          { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
        ]}
      >
        {/* Pulsing Concentric Aura */}
        <Animated.View
          style={[
            styles.auraRing,
            {
              borderColor: tempoPhase === 'concentric' ? theme.secondary : theme.primary,
              transform: [{ scale: pulseRingAnim }],
              opacity: isActive ? 0.4 : 0.15,
            },
          ]}
        />

        {/* Dynamic Center Kinetic Core */}
        <View
          style={[
            styles.kineticCore,
            {
              backgroundColor: isActive
                ? tempoPhase === 'concentric'
                  ? theme.secondary
                  : theme.primary
                : theme.cardBorder,
              shadowColor: theme.primary,
            },
          ]}
        >
          {category === 'running' ? (
            <Heart size={32} color="#FFFFFF" />
          ) : (
            <Dumbbell size={32} color="#FFFFFF" />
          )}
        </View>

        {/* Real-Time Phase Instruction Overlay */}
        <View style={styles.tempoInstructionBox}>
          <Text style={[styles.tempoPhaseName, { color: theme.textPrimary }]}>
            {isActive
              ? category === 'running'
                ? '170 SPM Optimal Cadence Pulse'
                : tempoPhase === 'eccentric'
                ? `LOWER CONTROLLED: ${tempoSeconds}s`
                : 'EXPLODE UP & CONTRACT'
              : 'Interactive 3-0-1 Tempo Rhythm Coach'}
          </Text>

          <View style={styles.breathingRow}>
            <Wind size={13} color={theme.textSecondary} />
            <Text style={[styles.breathingText, { color: theme.textSecondary }]}>
              {isActive ? breathingCue : 'Tap Start to begin guided rep cadence'}
            </Text>
          </View>
        </View>
      </View>

      {/* Form Cue Breakdown */}
      <View style={[styles.formCueBox, { backgroundColor: theme.backgroundSecondary }]}>
        <View style={styles.formCueHeader}>
          <Info size={13} color={theme.primary} />
          <Text style={[styles.formCueTitle, { color: theme.textPrimary }]}>
            Biomechanical Form Instructions:
          </Text>
        </View>
        {formCues.map((cue, i) => (
          <View key={i} style={styles.cueItemRow}>
            <CheckCircle2 size={12} color={theme.primary} />
            <Text style={[styles.cueText, { color: theme.textSecondary }]}>{cue}</Text>
          </View>
        ))}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlRow}>
        <TouchableOpacity
          onPress={handleToggle}
          style={[
            styles.mainPlayBtn,
            { backgroundColor: isActive ? theme.amber : theme.primary },
          ]}
          activeOpacity={0.85}
        >
          {isActive ? (
            <Pause size={17} color="#FFFFFF" />
          ) : (
            <Play size={17} color="#FFFFFF" />
          )}
          <Text style={styles.mainPlayBtnText}>
            {isActive ? 'Pause Tempo' : 'Start Guided Reps'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          style={[
            styles.resetBtn,
            { backgroundColor: theme.card, borderColor: theme.cardBorder },
          ]}
          activeOpacity={0.8}
        >
          <RotateCcw size={16} color={theme.textSecondary} />
          <Text style={[styles.resetBtnText, { color: theme.textSecondary }]}>Reset</Text>
        </TouchableOpacity>
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  targetBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  targetText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  repCounterCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 70,
  },
  repBigNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  repSmallLabel: {
    fontSize: 9,
    fontWeight: '800',
  },
  kineticStage: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  auraRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  kineticCore: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  tempoInstructionBox: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    gap: 2,
  },
  tempoPhaseName: {
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  breathingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  breathingText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  formCueBox: {
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  formCueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  formCueTitle: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  cueItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  cueText: {
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mainPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  mainPlayBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
