import { Vibration, Platform } from 'react-native';
import { showInAppNotification } from '../components/NotificationBanner';

/**
 * MealFit In-App Notification & Haptic Engine
 * 100% Compatible with Expo Go, iOS & Android without SDK 54 restrictions
 */
export const NotificationService = {
  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    return true;
  },

  /**
   * Send an instant notification to the device (Animated In-App Banner Toast + Haptic Vibration)
   */
  async sendInstantNotification(
    title: string = '💧 MealFit Hydration Alert',
    body: string = 'High temperature detected (+32°C). Drink 1 glass of water (+250mL) now!',
    data: any = { type: 'hydration' }
  ) {
    // 1. Trigger haptic sensory feedback
    try {
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 180, 80, 180]);
      }
    } catch (e) {
      // Ignored
    }

    // 2. Trigger high-visibility In-App Banner Toast across any screen
    showInAppNotification({
      id: `notif_${Date.now()}`,
      title,
      body,
      type: data.type || 'default',
    });
  },

  /**
   * Send Post-Meal Katori Nudge
   */
  async sendPostMealNudge() {
    await this.sendInstantNotification(
      '🍛 Post-Lunch Macro Check',
      'Did you finish lunch? Tap to log your Katori & Phulkas and hit your 130g protein goal!',
      { type: 'meal' }
    );
  },

  /**
   * Send Apartment Workout Reminder
   */
  async sendWorkoutReminder() {
    await this.sendInstantNotification(
      '🏋️ Time for Living Room Workout',
      '15-Min Zero Noise Routine is ready. 3-sec eccentric tempos protect your knees & neighbors.',
      { type: 'workout' }
    );
  },

  /**
   * Send Cheat Food Offset Alert
   */
  async sendCheatOffsetAlert(cheatName: string = 'Samosa') {
    await this.sendInstantNotification(
      `🛡️ ${cheatName} Offset Plan Ready`,
      'Ate street food? We adjusted your dinner to Moong Dal + 1 Phulka to keep you in deficit!',
      { type: 'cheat_offset' }
    );
  },
};
