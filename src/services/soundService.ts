import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { setAudioModeAsync, AudioModule } from 'expo-audio';

/**
 * MealFit Audio Engine (Strictly powered by SDK 54 expo-audio)
 * Zero expo-av dependencies, zero deprecation warnings
 */

const SOUND_ASSETS = {
  water: require('../../assets/sounds/water.wav'),
  meal: require('../../assets/sounds/meal.wav'),
  workout: require('../../assets/sounds/workout.wav'),
  reward: require('../../assets/sounds/reward.wav'),
};

const resolvedUriCache: Record<string, string> = {};
let audioConfigured = false;

async function configureAudio() {
  if (audioConfigured || Platform.OS === 'web') return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    audioConfigured = true;
  } catch (_) {}
}

async function resolveAssetUri(key: keyof typeof SOUND_ASSETS): Promise<string | null> {
  if (resolvedUriCache[key]) {
    return resolvedUriCache[key];
  }
  try {
    const asset = Asset.fromModule(SOUND_ASSETS[key]);
    if (!asset.localUri) {
      await asset.downloadAsync();
    }
    const uri = asset.localUri || asset.uri;
    if (uri) {
      resolvedUriCache[key] = uri;
      return uri;
    }
  } catch (_) {}
  return null;
}

async function playSoundKey(key: keyof typeof SOUND_ASSETS) {
  if (Platform.OS === 'web') return;
  try {
    await configureAudio();
    const uri = await resolveAssetUri(key);
    if (uri && AudioModule?.AudioPlayer) {
      const player = new AudioModule.AudioPlayer({ uri }, 500, false);
      player.volume = 1.0;
      player.play();
    }
  } catch (_) {
    // Graceful fallback
  }
}

export class SoundService {
  /**
   * 1. Water: Fresh natural water droplet pop (via expo-audio)
   */
  static async playWaterDrop() {
    await playSoundKey('water');
  }

  /**
   * 2. Nutrition: Warm marimba acoustic note (via expo-audio)
   */
  static async playMealLogged() {
    await playSoundKey('meal');
  }

  /**
   * 3. Movement: Gentle focus chime (via expo-audio)
   */
  static async playWorkoutDing() {
    await playSoundKey('workout');
  }

  /**
   * 4. Milestone: Harmonic reward chord (via expo-audio)
   */
  static async playRewardChime() {
    await playSoundKey('reward');
  }
}
