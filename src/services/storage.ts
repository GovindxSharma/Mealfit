import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const memoryStore: Record<string, string> = {};

export const SafeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null && val !== undefined) {
        memoryStore[key] = val;
        return val;
      }
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        const webVal = window.localStorage.getItem(key);
        if (webVal !== null) {
          memoryStore[key] = webVal;
          return webVal;
        }
      }
      return memoryStore[key] || null;
    } catch {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        try {
          return window.localStorage.getItem(key);
        } catch {}
      }
      return memoryStore[key] || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    memoryStore[key] = value;
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.warn(`[SafeStorage] Failed to save key "${key}" to AsyncStorage:`, err);
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch {}
    }
  },

  removeItem: async (key: string): Promise<void> => {
    delete memoryStore[key];
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.warn(`[SafeStorage] Failed to remove key "${key}" from AsyncStorage:`, err);
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }
  },

  clear: async (): Promise<void> => {
    for (const k of Object.keys(memoryStore)) {
      delete memoryStore[k];
    }
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.warn('[SafeStorage] Failed to clear AsyncStorage:', err);
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.clear();
      } catch {}
    }
  },
};

