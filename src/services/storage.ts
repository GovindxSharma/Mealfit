import { Platform } from 'react-native';

const memoryStore: Record<string, string> = {};

export const SafeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return memoryStore[key] || null;
    } catch {
      return memoryStore[key] || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      memoryStore[key] = value;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      memoryStore[key] = value;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      delete memoryStore[key];
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      delete memoryStore[key];
    }
  },
};
