import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class HapticService {
  /**
   * Subtle tap vibration (navigation, pills, switches)
   */
  static light() {
    if (Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (_) {}
  }

  /**
   * Medium tap vibration (logging a meal, selecting food, adding items)
   */
  static medium() {
    if (Platform.OS === 'web') return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_) {}
  }

  /**
   * Success vibration (rep completed, quest finished, perk unlocked)
   */
  static success() {
    if (Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (_) {}
  }

  /**
   * Warning / Error vibration
   */
  static warning() {
    if (Platform.OS === 'web') return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (_) {}
  }
}
