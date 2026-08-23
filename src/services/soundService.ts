import { Platform } from 'react-native';
import { setAudioModeAsync, AudioModule } from 'expo-audio';

/**
 * MealFit Local Audio Engine (SDK 54 expo-audio)
 * 100% Offline, Zero-Latency local WAV assets (No external network, No 403 errors)
 */

// Local static sound assets bundled directly in the app
const WATER_ASSET = require('../../assets/sounds/water.wav');
const MEAL_ASSET = require('../../assets/sounds/meal.wav');
const WORKOUT_ASSET = require('../../assets/sounds/workout.wav');
const REWARD_ASSET = require('../../assets/sounds/reward.wav');

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

async function playLocalSound(assetSource: any) {
  if (Platform.OS === 'web') return;
  try {
    await initAudio();
    if (AudioModule && AudioModule.AudioPlayer) {
      const player = new AudioModule.AudioPlayer(assetSource, 500, false);
      player.play();
    }
  } catch (_) {
    // Graceful silent fallback
  }
}

export class SoundService {
  /**
   * 1. Water: Calm, gentle local water drop (0ms offline, 100% reliable)
   */
  static async playWaterDrop() {
    await playLocalSound(WATER_ASSET);
  }

  /**
   * 2. Nutrition: Gentle warm marimba acoustic note
   */
  static async playMealLogged() {
    await playLocalSound(MEAL_ASSET);
  }

  /**
   * 3. Movement: Soft calm workout focus tone
   */
  static async playWorkoutDing() {
    await playLocalSound(WORKOUT_ASSET);
  }

  /**
   * 4. Milestone: Calm harmonic reward chime
   */
  static async playRewardChime() {
    await playLocalSound(REWARD_ASSET);
  }
}
