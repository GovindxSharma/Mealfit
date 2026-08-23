import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { showInAppNotification } from '../components/NotificationBanner';
import { HapticService } from './hapticService';

// Detect if running inside Expo Go (which restricts native push in SDK 53/54)
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  (Constants as any).appOwnership === 'expo';

let expoNotificationsModule: typeof import('expo-notifications') | null = null;

// Lazy load expo-notifications only in standalone builds / web-safe environments
const getNotificationsModule = async () => {
  if (Platform.OS === 'web' || isExpoGo) {
    return null;
  }
  if (!expoNotificationsModule) {
    try {
      expoNotificationsModule = await import('expo-notifications');
      expoNotificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (_) {
      expoNotificationsModule = null;
    }
  }
  return expoNotificationsModule;
};

export const NotificationService = {
  /**
   * Request push/local notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    const Notifications = await getNotificationsModule();
    if (!Notifications) return true; // Graceful fallback in Expo Go

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
   * Send an instant notification (Animated In-App Banner + Haptic + Native in APK)
   */
  async sendInstantNotification(
    title: string = 'MealFit Hydration Alert',
    body: string = 'High temperature detected (+32°C). Drink 1 glass of water (+250mL) now!',
    data: any = { type: 'hydration' }
  ) {
    HapticService.light();

    // 1. Show In-App animated toast banner (100% works everywhere across Expo Go & APK)
    showInAppNotification({
      id: `notif_${Date.now()}`,
      title,
      body,
      type: data.type || 'default',
    });

    // 2. Trigger native device notification in standalone builds
    const Notifications = await getNotificationsModule();
    if (Notifications) {
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
        // Ignored
      }
    }
  },

  /**
   * Schedule recurring daily meal & water reminders
   */
  async scheduleDailyReminders() {
    const Notifications = await getNotificationsModule();
    if (!Notifications) return;

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

      // ================= 6x DAYTIME WATER HYDRATION SCHEDULE =================
      const waterSlots = [
        { hour: 10, minute: 0, title: 'Morning Hydration Kickoff', body: 'Drink 1 full glass (250mL) of water to boost morning metabolic rate and rehydrate.' },
        { hour: 12, minute: 0, title: 'Pre-Lunch Hydration Check', body: 'Drink 1 glass of water 30 minutes before lunch to prime digestion and prevent overeating.' },
        { hour: 15, minute: 0, title: 'Midday Hydration Boost', body: 'Beat the 3:00 PM afternoon lethargy with 1 fresh glass of water (+250mL).' },
        { hour: 17, minute: 30, title: 'Pre-Workout Movement Hydration', body: 'Hydrate before your evening living room workout to optimize muscular contraction.' },
        { hour: 19, minute: 30, title: 'Evening Hydration Check', body: 'Drink 1 glass of water before dinner to support gastrointestinal motility.' },
        { hour: 21, minute: 30, title: 'Bedtime Hydration Finish', body: 'Final small glass (150mL) of water to stay hydrated and hit your daily 8-glass goal.' },
      ];

      for (const slot of waterSlots) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: slot.title,
            body: slot.body,
            data: { type: 'hydration' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: slot.hour,
            minute: slot.minute,
          },
        });
      }

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
