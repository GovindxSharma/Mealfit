import { Platform } from 'react-native';
import { setAudioModeAsync, AudioModule } from 'expo-audio';

/**
 * MealFit Minimalist & Simple Sound Engine (SDK 54 expo-audio)
 * Ultra-simple, peaceful, minimal, and non-intrusive tones
 */

// 1. Water: Ultra-soft, subtle bubble tap
const SIMPLE_WATER_URI =
  'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

// 2. Meal: Gentle single marimba acoustic note
const SIMPLE_MEAL_URI =
  'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3';

// 3. Workout: Subtle, soft warm chime
const SIMPLE_WORKOUT_URI =
  'https://assets.mixkit.co/active_storage/sfx/1069/1069-preview.mp3';

// 4. Reward: Calm, gentle milestone chord
const SIMPLE_REWARD_URI =
  'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3';

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
   * 1. Water: Ultra-soft, gentle bubble tap
   */
  static async playWaterDrop() {
    await playSoundUrl(SIMPLE_WATER_URI);
  }

  /**
   * 2. Nutrition: Gentle single acoustic marimba note
   */
  static async playMealLogged() {
    await playSoundUrl(SIMPLE_MEAL_URI);
  }

  /**
   * 3. Movement: Subtle, calm warm focus chime
   */
  static async playWorkoutDing() {
    await playSoundUrl(SIMPLE_WORKOUT_URI);
  }

  /**
   * 4. Milestone: Soft, peaceful reward tone
   */
  static async playRewardChime() {
    await playSoundUrl(SIMPLE_REWARD_URI);
  }
}
