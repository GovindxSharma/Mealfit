import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { setAudioModeAsync, AudioModule } from 'expo-audio';

/**
 * MealFit Offline Local Audio Engine (SDK 54 expo-audio)
 * Plays simple, calm, local WAV notification sounds on Android & iOS
 */

const SOUND_ASSETS = {
  water: require('../../assets/sounds/water.wav'),
  meal: require('../../assets/sounds/meal.wav'),
  workout: require('../../assets/sounds/workout.wav'),
  reward: require('../../assets/sounds/reward.wav'),
};

const resolvedUriCache: Record<string, string> = {};
let audioConfigured = false;

async function initAudioMode() {
  if (audioConfigured || Platform.OS === 'web') return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    audioConfigured = true;
  } catch (_) {}
}

async function getLocalUri(key: keyof typeof SOUND_ASSETS): Promise<string | null> {
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

async function playSound(key: keyof typeof SOUND_ASSETS) {
  if (Platform.OS === 'web') return;
  try {
    await initAudioMode();
    const uri = await getLocalUri(key);
    if (uri && AudioModule?.AudioPlayer) {
      const player = new AudioModule.AudioPlayer({ uri }, 500, false);
      player.play();
    }
  } catch (err) {
    // Graceful silent fallback
  }
}

export class SoundService {
  /**
   * 1. Water: Simple, calm, soft water droplet pop
   */
  static async playWaterDrop() {
    await playSound('water');
  }

  /**
   * 2. Nutrition: Simple, calm warm marimba note
   */
  static async playMealLogged() {
    await playSound('meal');
  }

  /**
   * 3. Movement: Simple, calm soft focus chime
   */
  static async playWorkoutDing() {
    await playSound('workout');
  }

  /**
   * 4. Milestone: Simple, calm harmonic reward tone
   */
  static async playRewardChime() {
    await playSound('reward');
  }
}
