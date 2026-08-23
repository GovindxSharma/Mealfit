import { Vibration, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { showInAppNotification } from '../components/NotificationBanner';
import { HapticService } from './hapticService';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  /**
   * Request push/local notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch (e) {
      return false;
    }
  },

  /**
   * Send an instant notification to the device (System Banner + In-App Banner + Haptic)
   */
  async sendInstantNotification(
    title: string = 'MealFit Hydration Alert',
    body: string = 'High temperature detected (+32°C). Drink 1 glass of water (+250mL) now!',
    data: any = { type: 'hydration' }
  ) {
    HapticService.light();

    // 1. Show In-App animated toast
    showInAppNotification({
      id: `notif_${Date.now()}`,
      title,
      body,
      type: data.type || 'default',
    });

    // 2. Trigger native device notification
    if (Platform.OS !== 'web') {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data,
            sound: true,
          },
          trigger: null, // instant
        });
      } catch (err) {
        // Fallback gracefully
      }
    }
  },

  /**
   * Schedule recurring daily meal & water reminders
   */
  async scheduleDailyReminders() {
    if (Platform.OS === 'web') return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Morning Breakfast Reminder (8:30 AM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Morning Fuel & Protein Check',
          body: 'Kickstart your day with Sprouts, Besan Chilla, or Eggs to hit your daily protein goal!',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 8,
          minute: 30,
        },
      });

      // Afternoon Lunch Reminder (1:15 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lunch Nutrition Check',
          body: 'Remember to sequence your meal: Fiber first, Protein second, Phulkas last to avoid sugar crashes!',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 13,
          minute: 15,
        },
      });

      // Evening Dinner & Streak Check (8:30 PM)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Dinner & Streak Saver',
          body: 'Log your final meal of the day to keep your Indian Warrior streak alive and earn FitCoins!',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 20,
          minute: 30,
        },
      });
    } catch (e) {
      // Ignored
    }
  },

  /**
   * Send Post-Meal Katori Nudge
   */
  async sendPostMealNudge() {
    await this.sendInstantNotification(
      'Post-Meal Macro Check',
      'Did you finish lunch? Tap to log your Katori & Phulkas and hit your protein target!',
      { type: 'meal' }
    );
  },

  /**
   * Send Apartment Workout Reminder
   */
  async sendWorkoutReminder() {
    await this.sendInstantNotification(
      'Time for Living Room Workout',
      '15-Min Zero Noise Routine is ready. 3-sec eccentric tempos protect your joints & floor.',
      { type: 'workout' }
    );
  },
};
