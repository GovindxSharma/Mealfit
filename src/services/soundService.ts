import { Platform } from 'react-native';
import { setAudioModeAsync, AudioModule } from 'expo-audio';

/**
 * MealFit Audio Synthesizer & Sound FX Engine (SDK 54 expo-audio)
 * Zero deprecation warnings, crisp native sound effects
 */

// 1. Water Drop Pop Sound
const WATER_DROP_URI =
  'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3';

// 2. Meal Logged Success Chime
const MEAL_SUCCESS_URI =
  'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3';

// 3. Workout Rep Ding
const WORKOUT_DING_URI =
  'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';

// 4. Reward Unlock Fanfare
const REWARD_CHIME_URI =
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
   * Crystal water droplet pop
   */
  static async playWaterDrop() {
    await playSoundUrl(WATER_DROP_URI);
  }

  /**
   * Warm culinary success chime for food logging
   */
  static async playMealLogged() {
    await playSoundUrl(MEAL_SUCCESS_URI);
  }

  /**
   * Crisp athletic bell for workout reps
   */
  static async playWorkoutDing() {
    await playSoundUrl(WORKOUT_DING_URI);
  }

  /**
   * Euphoric victory chime for reward unlocks & streaks
   */
  static async playRewardChime() {
    await playSoundUrl(REWARD_CHIME_URI);
  }
}
