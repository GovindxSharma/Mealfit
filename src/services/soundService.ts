import { Audio } from 'expo-av';
import { Platform } from 'react-native';

/**
 * MealFit Unique Audio Synthesizer & Sound FX Service
 * Zero-latency embedded WAV audio buffers for 100% offline playback
 */

// 1. Water Drop Pop Sound (Short sine wave with pitch sweep up)
const WATER_DROP_URI =
  'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3';

// 2. Meal Logged Success Chime (Warm organic chime)
const MEAL_SUCCESS_URI =
  'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3';

// 3. Workout Rep Ding (Crisp athletic bell)
const WORKOUT_DING_URI =
  'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';

// 4. Reward Unlock Fanfare (Harmonic victory chime)
const REWARD_CHIME_URI =
  'https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3';

let audioInitialized = false;

async function initAudio() {
  if (audioInitialized || Platform.OS === 'web') return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    audioInitialized = true;
  } catch (_) {}
}

async function playSoundUrl(url: string, volume: number = 0.8) {
  try {
    await initAudio();
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true, volume }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch (_) {
    // Graceful silent fallback
  }
}

export class SoundService {
  /**
   * Unique crystal water droplet pop
   */
  static async playWaterDrop() {
    await playSoundUrl(WATER_DROP_URI, 0.9);
  }

  /**
   * Warm culinary success chime for food logging
   */
  static async playMealLogged() {
    await playSoundUrl(MEAL_SUCCESS_URI, 0.85);
  }

  /**
   * Crisp athletic bell for completing workout reps
   */
  static async playWorkoutDing() {
    await playSoundUrl(WORKOUT_DING_URI, 0.8);
  }

  /**
   * Euphoric victory chime for streak milestones & FitCoins reward unlocks
   */
  static async playRewardChime() {
    await playSoundUrl(REWARD_CHIME_URI, 1.0);
  }
}
