import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth, EquipmentType } from '../../src/context/AuthContext';
import { AuthRequiredModal } from '../../src/components/AuthRequiredModal';
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
} from 'lucide-react-native';

interface Exercise {
  id: string;
  name: string;
  hindiCue: string;
  equipment: EquipmentType;
  muscle: string;
  sets: number;
  reps: string;
  tempo: string;
  notes: string;
  burnCalories: number;
}

export default function WorkoutScreen() {
  const { theme } = useTheme();
  const { user, completedExerciseIds, toggleExerciseCompleted, isLoggedIn } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const topSafeDistance = Math.max(insets.top, Platform.OS === 'android' ? 28 : 20) + 12;

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const goal = user.goalType || 'fat_loss';

  const allExercises: Exercise[] = [
    {
      id: 'ex_1',
      name: 'Slow Tempo Living Room Squats',
      hindiCue: '3-Sec slow descent • Floor safe',
      equipment: 'bodyweight',
      muscle: 'Quads & Glutes',
      sets: goal === 'muscle_gain' ? 4 : 3,
      reps: goal === 'muscle_gain' ? '15 reps (weighted)' : '15 reps',
      tempo: '3-0-1 (3s down, 1s up)',
      notes: 'Keep heels grounded. Zero jump noise for neighbors.',
      burnCalories: 35,
    },
    {
      id: 'ex_2',
      name: 'Apartment Push-ups / Knee Push-ups',
      hindiCue: 'Slow eccentric chest press',
      equipment: 'bodyweight',
      muscle: 'Chest & Triceps',
      sets: goal === 'muscle_gain' ? 4 : 3,
      reps: '12 reps',
      tempo: '3-1-1 (3s lower, 1s hold)',
      notes: 'Tighten core, engage chest at top.',
      burnCalories: 30,
    },
    {
      id: 'ex_3',
      name: 'Dumbbell / Water Bottle Rows',
      hindiCue: 'Back & lat retraction',
      equipment: 'dumbbells',
      muscle: 'Upper Back & Lats',
      sets: 3,
      reps: '12-15 reps per arm',
      tempo: '2-1-2 (Squeeze lats)',
      notes: 'Hinge hips 45 degrees, pull elbows straight back.',
      burnCalories: 32,
    },
    {
      id: 'ex_4',
      name: 'Overhead Dumbbell Shoulder Press',
      hindiCue: 'Controlled deltoid press',
      equipment: 'dumbbells',
      muscle: 'Shoulders',
      sets: 3,
      reps: '12 reps',
      tempo: '3-0-1',
      notes: 'Press straight up without arching lower back.',
      burnCalories: 28,
    },
    {
      id: 'ex_5',
      name: 'Living Room Glute Bridges',
      hindiCue: 'Posterior chain squeeze',
      equipment: 'bodyweight',
      muscle: 'Glutes & Hamstrings',
      sets: 3,
      reps: '20 reps (2s top squeeze)',
      tempo: '1-2-1',
      notes: 'Drive through heels, squeeze glutes at the peak.',
      burnCalories: 25,
    },
    {
      id: 'ex_6',
      name: 'Isometric Deadbug Core Hold',
      hindiCue: 'Deep transverse abdominal brace',
      equipment: 'bodyweight',
      muscle: 'Core & Lower Back',
      sets: 3,
      reps: '45 seconds',
      tempo: 'Slow & controlled',
      notes: 'Lower back flat against the floor at all times.',
      burnCalories: 22,
    },
  ];

  const filteredExercises = allExercises.filter((ex) => {
    if (selectedFilter === 'all') return true;
    return ex.equipment === selectedFilter;
  });

  const totalCaloriesBurned = allExercises
    .filter((ex) => completedExerciseIds.includes(ex.id))
    .reduce((sum, ex) => sum + ex.burnCalories, 0);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const resetTimer = (seconds: number) => {
    setIsTimerRunning(false);
    setTimerSeconds(seconds);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.contentContainer, { paddingTop: topSafeDistance }]}>
        {/* 1. Header Bar */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.heading, { color: theme.textPrimary }]}>Living Room Workout</Text>
            <Text style={[styles.subheading, { color: theme.textSecondary }]}>
              Apartment safe • 3-sec eccentric tempo
            </Text>
          </View>

          <View style={[styles.calBurnBadge, { backgroundColor: theme.amberLight }]}>
            <Flame size={14} color={theme.amber} />
            <Text style={[styles.calBurnText, { color: theme.amber }]}>
              {totalCaloriesBurned} kcal burned
            </Text>
          </View>
        </View>

        {/* 2. Rest Timer Card */}
        <View style={[styles.timerCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.timerTop}>
            <View style={styles.timerTitleRow}>
              <Clock size={16} color={theme.primary} />
              <Text style={[styles.timerTitle, { color: theme.textPrimary }]}>Rest Interval Timer</Text>
            </View>
            <Text style={[styles.timerBigDigits, { color: theme.primary }]}>
              00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
            </Text>
          </View>

          <View style={styles.timerControlsRow}>
            <View style={styles.presetButtonsRow}>
              {[45, 60, 90].map((sec) => (
                <TouchableOpacity
                  key={sec}
                  onPress={() => resetTimer(sec)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: timerSeconds === sec ? theme.primaryLight : 'rgba(255, 255, 255, 0.04)',
                      borderColor: timerSeconds === sec ? theme.primary : theme.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      { color: timerSeconds === sec ? theme.primary : theme.textSecondary },
                    ]}
                  >
                    {sec}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timerActionButtons}>
              <TouchableOpacity
                onPress={() => setIsTimerRunning(!isTimerRunning)}
                style={[styles.playBtn, { backgroundColor: theme.primary }]}
              >
                {isTimerRunning ? (
                  <Pause size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                ) : (
                  <Play size={16} color={theme.isDark ? '#000000' : '#FFFFFF'} />
                )}
                <Text style={[styles.playBtnText, { color: theme.isDark ? '#000000' : '#FFFFFF' }]}>
                  {isTimerRunning ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => resetTimer(60)}
                style={[styles.resetBtn, { borderColor: theme.cardBorder }]}
              >
                <RotateCcw size={14} color={theme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Filter Pills */}
        <View style={styles.filterRow}>
          {[
            { key: 'all', label: 'All Moves' },
            { key: 'bodyweight', label: 'Zero Equipment' },
            { key: 'dumbbells', label: 'Dumbbells / Bottles' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setSelectedFilter(f.key)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: selectedFilter === f.key ? theme.primary : theme.card,
                  borderColor: selectedFilter === f.key ? theme.primary : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  {
                    color: selectedFilter === f.key ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary,
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 4. Exercise Cards List */}
        <View style={styles.exercisesList}>
          {!isLoggedIn && (
            <TouchableOpacity
              onPress={() => setShowAuthGate(true)}
              style={[styles.lockedBanner, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <View style={[styles.lockedIconCircle, { backgroundColor: theme.primary }]}>
                <Lock size={15} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.lockedBannerTitle, { color: theme.textPrimary }]}>
                  Workout Logging Locked
                </Text>
                <Text style={[styles.lockedBannerDesc, { color: theme.textSecondary }]}>
                  Sign in with Google or Email to record exercise completion, track streaks, and sync calories burned.
                </Text>
              </View>
              <View style={[styles.unlockPill, { backgroundColor: theme.primary }]}>
                <Text style={styles.unlockPillText}>Sign In</Text>
              </View>
            </TouchableOpacity>
          )}

          {filteredExercises.map((ex) => {
            const isDone = completedExerciseIds.includes(ex.id);
            return (
              <View
                key={ex.id}
                style={[
                  styles.exerciseCard,
                  {
                    backgroundColor: isDone ? theme.primaryLight : theme.card,
                    borderColor: isDone ? theme.primary : theme.cardBorder,
                  },
                ]}
              >
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.exerciseName, { color: theme.textPrimary }]}>{ex.name}</Text>
                    <Text style={[styles.hindiCue, { color: theme.textSecondary }]}>{ex.hindiCue}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (!isLoggedIn) {
                        setShowAuthGate(true);
                        return;
                      }
                      toggleExerciseCompleted(ex.id, ex.burnCalories);
                    }}
                    style={[
                      styles.doneCheckBtn,
                      {
                        backgroundColor: isDone ? theme.primary : 'rgba(255, 255, 255, 0.06)',
                        borderColor: isDone ? theme.primary : theme.cardBorder,
                      },
                    ]}
                  >
                    <Check size={14} color={isDone ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textMuted} />
                    <Text
                      style={[
                        styles.doneCheckText,
                        { color: isDone ? (theme.isDark ? '#000000' : '#FFFFFF') : theme.textSecondary },
                      ]}
                    >
                      {isDone ? 'Completed' : 'Mark Done'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Sets, Reps, Tempo Chips */}
                <View style={styles.chipsRow}>
                  <View style={[styles.chip, { backgroundColor: 'rgba(255, 255, 255, 0.04)' }]}>
                    <Text style={[styles.chipText, { color: theme.textPrimary }]}>{ex.sets} Sets</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: 'rgba(255, 255, 255, 0.04)' }]}>
                    <Text style={[styles.chipText, { color: theme.textPrimary }]}>{ex.reps}</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: theme.amberLight }]}>
                    <Text style={[styles.chipText, { color: theme.amber }]}>{ex.tempo}</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: theme.cyanLight }]}>
                    <Text style={[styles.chipText, { color: theme.cyan }]}>+{ex.burnCalories} kcal</Text>
                  </View>
                </View>

                <Text style={[styles.notesText, { color: theme.textMuted }]}>{ex.notes}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Auth Gate Modal */}
      <AuthRequiredModal
        visible={showAuthGate}
        onClose={() => setShowAuthGate(false)}
        title="Sign In to Track Workouts"
        subtitle="Sign in with Google or Email to log completed workout sets, track calorie burn streaks & progressive overload."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  lockedIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  lockedBannerDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  unlockPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  unlockPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  contentContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 48,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 11,
    marginTop: 2,
  },
  calBurnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  calBurnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  timerCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  timerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  timerBigDigits: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timerControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  presetButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  playBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  resetBtn: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  exercisesList: {
    gap: 10,
  },
  exerciseCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '800',
  },
  hindiCue: {
    fontSize: 11,
    marginTop: 1,
  },
  doneCheckBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  doneCheckText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  notesText: {
    fontSize: 11,
    lineHeight: 15,
  },
});
