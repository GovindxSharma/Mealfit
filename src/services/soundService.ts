import { Platform } from 'react-native';
import { Audio } from 'expo-av';

/**
 * MealFit Universal Audio Engine
 * 100% Reliable Offline Sound FX for Expo Go, Standalone APK, and iOS
 */

const SOUND_MAP = {
  water: require('../../assets/sounds/water.wav'),
  meal: require('../../assets/sounds/meal.wav'),
  workout: require('../../assets/sounds/workout.wav'),
  reward: require('../../assets/sounds/reward.wav'),
};

let audioModeConfigured = false;

async function configureAudioMode() {
  if (audioModeConfigured || Platform.OS === 'web') return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioModeConfigured = true;
  } catch (_) {}
}

async function playAssetSound(key: keyof typeof SOUND_MAP) {
  if (Platform.OS === 'web') return;
  try {
    await configureAudioMode();
    const asset = SOUND_MAP[key];
    const { sound } = await Audio.Sound.createAsync(
      asset,
      { shouldPlay: true, volume: 1.0 }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
      }
    });
  } catch (err) {
    // Graceful fallback
  }
}

export class SoundService {
  /**
   * 1. Water: Crisp, calm water droplet pop
   */
  static async playWaterDrop() {
    await playAssetSound('water');
  }

  /**
   * 2. Nutrition: Warm marimba acoustic note
   */
  static async playMealLogged() {
    await playAssetSound('meal');
  }

  /**
   * 3. Movement: Soft calm focus chime
   */
  static async playWorkoutDing() {
    await playAssetSound('workout');
  }

  /**
   * 4. Milestone: Harmonic reward chord
   */
  static async playRewardChime() {
    await playAssetSound('reward');
  }
}
