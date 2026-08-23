import { Platform } from 'react-native';
import { setAudioModeAsync, AudioModule } from 'expo-audio';

/**
 * MealFit Calm & Aesthetic Sound Engine (SDK 54 expo-audio)
 * Peaceful, distinct, non-jarring tones for Hydration, Meals, and Workouts
 */

// 1. Water Alert: Calm, refreshing natural water ripple
const CALM_WATER_DROP_URI =
  'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3';

// 2. Meal Alert: Soothing, gentle mindful harp chime
const CALM_MEAL_CHIME_URI =
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

// 3. Workout Alert: Gentle Zen harmonic bell
const CALM_WORKOUT_BELL_URI =
  'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3';

// 4. Reward Milestone: Soft euphoric victory harmony
const CALM_REWARD_FANFARE_URI =
  'https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3';

let audioInitialized = false;

async function initAudio() {
  if (audioInitialized || Platform.OS === 'web') return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    audioInitialized = true;
  } catch (_) {}
}

async function playSoundUrl(url: string) {
  if (Platform.OS === 'web') return;
  try {
    await initAudio();
    if (AudioModule && AudioModule.AudioPlayer) {
      const player = new AudioModule.AudioPlayer({ uri: url } as any, 500, false);
      player.play();
    }
  } catch (_) {
    // Graceful silent fallback
  }
}

export class SoundService {
  /**
   * 1. Hydration: Calm, refreshing spring water ripple
   */
  static async playWaterDrop() {
    await playSoundUrl(CALM_WATER_DROP_URI);
  }

  /**
   * 2. Nutrition: Gentle, mindful harp chime
   */
  static async playMealLogged() {
    await playSoundUrl(CALM_MEAL_CHIME_URI);
  }

  /**
   * 3. Movement: Soothing Zen harmonic bell
   */
  static async playWorkoutDing() {
    await playSoundUrl(CALM_WORKOUT_BELL_URI);
  }

  /**
   * 4. Victory: Soft harmonic reward fanfare
   */
  static async playRewardChime() {
    await playSoundUrl(CALM_REWARD_FANFARE_URI);
  }
}
