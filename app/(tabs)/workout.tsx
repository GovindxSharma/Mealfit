import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth, EquipmentType } from '../../src/context/AuthContext';
import { AuthRequiredModal } from '../../src/components/AuthRequiredModal';
import { WorkoutAnimationCard } from '../../src/components/WorkoutAnimationCard';
import {
  Dumbbell,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Flame,
  Zap,
  Lock,
  Heart,
  ChevronRight,
  ShieldAlert,
  Compass,
  Activity,
} from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  hindiCue: string;
  phase: 'warmup' | 'cardio' | 'strength' | 'cooldown';
  equipment: EquipmentType;
  muscle: string;
  sets: number;
  reps: string;
  tempo: string;
  notes: string;
  burnCalories: number;
  durationMins?: number;
}

export default function WorkoutScreen() {
  const { theme } = useTheme();
  const { user, completedExerciseIds, toggleExerciseCompleted, isLoggedIn } = useAuth();
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'warmup' | 'cardio' | 'strength' | 'cooldown'>('all');
  const [selectedSplit, setSelectedSplit] = useState<'full_body' | 'push' | 'pull' | 'legs'>('full_body');
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const topSafeDistance = Math.max(insets.top, Platform.OS === 'android' ? 28 : 20) + 12;

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [initialSeconds, setInitialSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      Alert.alert('⏱️ Rest Complete!', 'Time for your next set. Push hard and maintain proper form!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setInitialSeconds(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(initialSeconds);
  };

  const goal = user.goalType || 'fat_loss';

  // 4-Phase Structured Athletic Indian Workout Database
  const allExercises: Exercise[] = [
    // PHASE 1: DYNAMIC WARMUP (5-8 Mins)
    {
      id: 'wm_1',
      name: 'Dynamic Joint Rotations (Neck, Shoulders, Wrists)',
      hindiCue: 'जोड़ों का वार्मअप • चोट से बचाव',
      phase: 'warmup',
      equipment: 'bodyweight',
      muscle: 'Full Body Joints',
      sets: 1,
      reps: '15 rotations each side',
      tempo: 'Smooth & controlled',
      notes: 'Lubricates synovial fluid in cervical spine and rotator cuffs before loading.',
      burnCalories: 15,
      durationMins: 2,
    },
    {
      id: 'wm_2',
      name: 'Standing Torso Twists & Chest Openers',
      hindiCue: 'छाती और कमर का खिंचाव',
      phase: 'warmup',
      equipment: 'bodyweight',
      muscle: 'Spine & Pectorals',
      sets: 1,
      reps: '20 dynamic reps',
      tempo: 'Fluid breath pace',
      notes: 'Opens thoracic mobility for better lung capacity and posture.',
      burnCalories: 18,
      durationMins: 2,
    },
    {
      id: 'wm_3',
      name: 'Inchworm Walkouts to High Plank',
      hindiCue: 'कोर और हैमस्ट्रिंग एक्टिवेशन',
      phase: 'warmup',
      equipment: 'bodyweight',
      muscle: 'Hamstrings, Shoulders, Core',
      sets: 1,
      reps: '8 walkouts',
      tempo: 'Slow hinge',
      notes: 'Hinge at hips, walk hands out to solid plank, hold for 1s, walk back.',
      burnCalories: 22,
      durationMins: 3,
    },

    // PHASE 2: RUNNING & CARDIO IGNITION (5-10 Mins)
    {
      id: 'rd_1',
      name: 'Paced Jog & High-Knee Light Ignition',
      hindiCue: 'हल्की दौड़ • दिल की धड़कन बढ़ाएं',
      phase: 'cardio',
      equipment: 'bodyweight',
      muscle: 'Cardiovascular & Calves',
      sets: 1,
      reps: '3 Minutes Continuous',
      tempo: 'Paced 130-140 BPM',
      notes: 'Jog in place or light outdoor stride. Land soft on mid-foot.',
      burnCalories: 35,
      durationMins: 3,
    },
    {
      id: 'rd_2',
      name: 'High Knees & Butt Kicks Interval Blast',
      hindiCue: 'तेज़ घुटने उठाना • फैट बर्न',
      phase: 'cardio',
      equipment: 'bodyweight',
      muscle: 'Quads, Hip Flexors, Glutes',
      sets: 3,
      reps: '30s High Knees + 30s Butt Kicks',
      tempo: 'Fast explosive tempo',
      notes: 'Engage core, pump arms in rhythm with knees to maximize calorie burn.',
      burnCalories: 45,
      durationMins: 4,
    },

    // PHASE 3: MAIN STRENGTH & HYPERTROPHY ROUTINE
    {
      id: 'st_1',
      name: 'Controlled Tempo Goblet / Bodyweight Squats',
      hindiCue: '3-Sec धीमा बैठना • घुटने सुरक्षित',
      phase: 'strength',
      equipment: 'bodyweight',
      muscle: 'Quads, Glutes & Adductors',
      sets: goal === 'muscle_gain' ? 4 : 3,
      reps: goal === 'muscle_gain' ? '15 reps (weighted)' : '15 reps',
      tempo: '3-0-1 (3s down, 1s up)',
      notes: 'Keep heels glued to floor, push knees outward in line with toes.',
      burnCalories: 40,
    },
    {
      id: 'st_2',
      name: 'Apartment Push-ups / Elevated Incline Press',
      hindiCue: 'चेस्ट और ट्राइसेप्स मजबूत करें',
      phase: 'strength',
      equipment: 'bodyweight',
      muscle: 'Chest, Triceps & Front Deltoids',
      sets: goal === 'muscle_gain' ? 4 : 3,
      reps: '12-15 reps',
      tempo: '3-1-1 (3s lower, 1s squeeze)',
      notes: 'Brace your core like a plank. Squeeze your pecs tightly at the top.',
      burnCalories: 35,
    },
    {
      id: 'st_3',
      name: 'Dumbbell / Water Bottle Rows (Back & Lats)',
      hindiCue: 'पीठ और कंधों की कसरत',
      phase: 'strength',
      equipment: 'dumbbells',
      muscle: 'Lats, Rhomboids & Biceps',
      sets: 3,
      reps: '12-15 reps per arm',
      tempo: '2-1-2 (1s squeeze at top)',
      notes: 'Hinge hips 45 degrees, pull elbows back toward hips, not upward.',
      burnCalories: 38,
    },
    {
      id: 'st_4',
      name: 'Romanian Deadlifts (Hamstring & Glute Focus)',
      hindiCue: 'हैमस्ट्रिंग और कमर की मजबूती',
      phase: 'strength',
      equipment: 'dumbbells',
      muscle: 'Hamstrings & Glutes',
      sets: 3,
      reps: '12 reps',
      tempo: '3-1-1 (Deep stretch)',
      notes: 'Push hips backward with a soft knee bend until you feel a deep stretch in hamstrings.',
      burnCalories: 42,
    },
    {
      id: 'st_5',
      name: 'Bicycle Crunches & Deadbugs (Core Engine)',
      hindiCue: 'पेट और साइड्स की कसरत',
      phase: 'strength',
      equipment: 'bodyweight',
      muscle: 'Abs & Obliques',
      sets: 3,
      reps: '20 reps (10 each side)',
      tempo: 'Slow controlled twist',
      notes: 'Do not pull neck. Twist from your ribcage and squeeze the opposite oblique.',
      burnCalories: 28,
    },

    // PHASE 4: COOLDOWN & STATIC STRETCHING (5 Mins)
    {
      id: 'cd_1',
      name: 'Standing Quad & Hip Flexor Stretch',
      hindiCue: 'थाई और हिप्स का रिलैक्सेशन',
      phase: 'cooldown',
      equipment: 'bodyweight',
      muscle: 'Quadriceps & Hip Flexors',
      sets: 1,
      reps: '30s hold per leg',
      tempo: 'Static relaxed hold',
      notes: 'Keep knees touching, push hips slightly forward to release quad tension.',
      burnCalories: 10,
      durationMins: 2,
    },
    {
      id: 'cd_2',
      name: 'Cobra Pose to Child\'s Pose (Bhujangasana / Balasana)',
      hindiCue: 'रीढ़ की हड्डी और पीठ की शांति',
      phase: 'cooldown',
      equipment: 'bodyweight',
      muscle: 'Lower Back, Lats & Spine',
      sets: 2,
      reps: '45s hold each pose',
      tempo: 'Deep diaphragmatic breathing',
      notes: 'Inhale into Cobra to stretch abs, exhale into Child\'s Pose to decompress spine.',
      burnCalories: 12,
      durationMins: 3,
    },
  ];

  // Filter exercises based on selected phase and user equipment
  const filteredExercises = allExercises.filter((ex) => {
    if (selectedPhase !== 'all' && ex.phase !== selectedPhase) return false;
    return true;
  });

  const totalExercisesCount = allExercises.length;
  const completedCount = allExercises.filter((e) => completedExerciseIds.includes(e.id)).length;
  const totalBurnEstimated = allExercises
    .filter((e) => completedExerciseIds.includes(e.id))
    .reduce((acc, curr) => acc + curr.burnCalories, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: topSafeDistance, borderBottomColor: theme.cardBorder }]}>
        <View style={styles.headerTitleRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
            <Dumbbell size={22} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Athletic Workout Split</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Warmup • Cardio Ignition • Strength • Cooldown
            </Text>
          </View>
        </View>

        {/* 4-Phase Navigation Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: '⚡ All Phases' },
            { id: 'warmup', label: '🤸 1. Warmup (5m)' },
            { id: 'cardio', label: '🏃 2. Running (5m)' },
            { id: 'strength', label: '🏋️ 3. Strength' },
            { id: 'cooldown', label: '🧘 4. Cooldown (5m)' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setSelectedPhase(tab.id as any)}
              style={[
                styles.phaseTab,
                selectedPhase === tab.id
                  ? { backgroundColor: theme.primary, borderColor: theme.primary }
                  : { backgroundColor: theme.card, borderColor: theme.cardBorder },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.phaseTabText,
                  { color: selectedPhase === tab.id ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Workout Progress Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>WORKOUT PROGRESS</Text>
              <Text style={[styles.summaryValue, { color: theme.primary }]}>
                {completedCount} / {totalExercisesCount} <Text style={{ fontSize: 13, color: theme.textSecondary }}>Done</Text>
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>EST. CALORIES BURNED</Text>
              <Text style={[styles.summaryValue, { color: theme.accent }]}>
                🔥 {totalBurnEstimated} <Text style={{ fontSize: 13, color: theme.textSecondary }}>kcal</Text>
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundSecondary }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${(completedCount / Math.max(totalExercisesCount, 1)) * 100}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* Built-in Interactive Rest Stopwatch Timer */}
        <View style={[styles.timerCard, { backgroundColor: theme.card, borderColor: theme.primaryLight }]}>
          <View style={styles.timerHeader}>
            <View style={styles.timerTitleRow}>
              <Clock size={18} color={theme.primary} />
              <Text style={[styles.timerHeading, { color: theme.textPrimary }]}>Interactive Rest Stopwatch</Text>
            </View>
            <View style={[styles.liveBadge, { backgroundColor: isTimerRunning ? theme.primaryLight : theme.backgroundSecondary }]}>
              <Text style={[styles.liveBadgeText, { color: isTimerRunning ? theme.primary : theme.textMuted }]}>
                {isTimerRunning ? 'ACTIVE' : 'IDLE'}
              </Text>
            </View>
          </View>

          {/* Timer Display */}
          <Text style={[styles.timerClockText, { color: theme.primary }]}>
            {Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </Text>

          {/* Preset Buttons & Controls */}
          <View style={styles.timerControlsRow}>
            {[30, 60, 90].map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => startTimer(s)}
                style={[
                  styles.timerPresetBtn,
                  initialSeconds === s
                    ? { backgroundColor: theme.primary, borderColor: theme.primary }
                    : { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.timerPresetText, { color: initialSeconds === s ? '#FFFFFF' : theme.textPrimary }]}>
                  {s}s Rest
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setIsTimerRunning(!isTimerRunning)}
              style={[styles.timerActionBtn, { backgroundColor: isTimerRunning ? theme.rose : theme.accent }]}
              activeOpacity={0.8}
            >
              {isTimerRunning ? <Pause size={16} color="#FFFFFF" /> : <Play size={16} color="#FFFFFF" />}
              <Text style={styles.timerActionBtnText}>{isTimerRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetTimer}
              style={[styles.timerResetBtn, { borderColor: theme.cardBorder }]}
              activeOpacity={0.7}
            >
              <RotateCcw size={15} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Visual Workout Animation & Rep Tempo Guide */}
        <WorkoutAnimationCard
          exerciseName={
            selectedPhase === 'cardio'
              ? 'Interval Running Cadence'
              : selectedPhase === 'warmup'
              ? 'Dynamic Joint Mobility & Inchworms'
              : selectedPhase === 'cooldown'
              ? 'Deep Diaphragmatic Breath & Stretch'
              : 'Bodyweight Squats & Push-Ups'
          }
          category={
            selectedPhase === 'cardio'
              ? 'running'
              : selectedPhase === 'warmup'
              ? 'warmup'
              : selectedPhase === 'cooldown'
              ? 'cooldown'
              : 'strength'
          }
        />

        {/* Phase Header Banner */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {selectedPhase === 'all' && '⚡ Today\'s Full 4-Phase Routine'}
            {selectedPhase === 'warmup' && '🤸 Phase 1: Joint Mobility & Warmup'}
            {selectedPhase === 'cardio' && '🏃 Phase 2: Running & Cardio Ignition'}
            {selectedPhase === 'strength' && '🏋️ Phase 3: Main Strength Routine'}
            {selectedPhase === 'cooldown' && '🧘 Phase 4: Cooldown & Deep Stretches'}
          </Text>
          <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
            {filteredExercises.length} drills
          </Text>
        </View>

        {/* Exercise Cards */}
        {filteredExercises.map((exercise, index) => {
          const isDone = completedExerciseIds.includes(exercise.id);

          const getPhaseBadge = (p: string) => {
            switch (p) {
              case 'warmup':
                return { label: 'Phase 1: Warmup', bg: '#E0F2FE', text: '#0369A1' };
              case 'cardio':
                return { label: 'Phase 2: Running', bg: '#FEF3C7', text: '#B45309' };
              case 'strength':
                return { label: 'Phase 3: Strength', bg: '#DCFCE7', text: '#15803D' };
              case 'cooldown':
                return { label: 'Phase 4: Cooldown', bg: '#F3E8FF', text: '#7E22CE' };
              default:
                return { label: 'Workout', bg: theme.primaryLight, text: theme.primary };
            }
          };

          const badge = getPhaseBadge(exercise.phase);

          return (
            <View
              key={exercise.id}
              style={[
                styles.exerciseCard,
                {
                  backgroundColor: theme.card,
                  borderColor: isDone ? theme.primary : theme.cardBorder,
                  opacity: isDone ? 0.85 : 1,
                },
              ]}
            >
              {/* Top Row: Phase Tag & Muscle */}
              <View style={styles.cardTopRow}>
                <View style={[styles.phaseBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.phaseBadgeText, { color: badge.text }]}>{badge.label}</Text>
                </View>
                <Text style={[styles.muscleTag, { color: theme.textSecondary }]}>
                  🎯 {exercise.muscle}
                </Text>
              </View>

              {/* Title & Hindi Subtitle */}
              <Text style={[styles.exerciseName, { color: theme.textPrimary }]}>
                {exercise.name}
              </Text>
              <Text style={[styles.exerciseHindi, { color: theme.primary }]}>
                💡 {exercise.hindiCue}
              </Text>

              {/* Specs Grid: Sets, Reps, Tempo */}
              <View style={[styles.specsGrid, { backgroundColor: theme.backgroundSecondary }]}>
                <View style={styles.specItem}>
                  <Text style={[styles.specLabel, { color: theme.textMuted }]}>SETS</Text>
                  <Text style={[styles.specValue, { color: theme.textPrimary }]}>{exercise.sets}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={[styles.specLabel, { color: theme.textMuted }]}>REPS / DURATION</Text>
                  <Text style={[styles.specValue, { color: theme.textPrimary }]}>{exercise.reps}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={[styles.specLabel, { color: theme.textMuted }]}>TEMPO</Text>
                  <Text style={[styles.specValue, { color: theme.textPrimary }]}>{exercise.tempo}</Text>
                </View>
              </View>

              {/* Form Guidance Note */}
              <Text style={[styles.exerciseNotes, { color: theme.textSecondary }]}>
                📌 <Text style={{ fontWeight: '700' }}>Form Tip:</Text> {exercise.notes}
              </Text>

              {/* Action Button: Mark Completed */}
              <TouchableOpacity
                onPress={() => toggleExerciseCompleted(exercise.id, exercise.burnCalories)}
                style={[
                  styles.completeBtn,
                  isDone
                    ? { backgroundColor: theme.primary, borderColor: theme.primary }
                    : { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder },
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.completeBtnContent}>
                  {isDone ? (
                    <Check size={16} color="#FFFFFF" />
                  ) : (
                    <Flame size={16} color={theme.accent} />
                  )}
                  <Text
                    style={[
                      styles.completeBtnText,
                      { color: isDone ? '#FFFFFF' : theme.textPrimary },
                    ]}
                  >
                    {isDone ? 'Exercise Completed (Logged)' : `Log Complete (+${exercise.burnCalories} kcal)`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Auth Gate Modal */}
      <AuthRequiredModal
        visible={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Workout Streaks Locked"
        subtitle="Sign in to your MealFit account to sync your workout history, calorie burn rings & athletic recovery milestones."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  phaseTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  phaseTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCol: {
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 20,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerHeading: {
    fontSize: 14,
    fontWeight: '800',
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timerClockText: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 6,
  },
  timerControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  timerPresetBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  timerPresetText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  timerActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  timerResetBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  muscleTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  exerciseHindi: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 10,
  },
  specsGrid: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  exerciseNotes: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  completeBtn: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  completeBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
