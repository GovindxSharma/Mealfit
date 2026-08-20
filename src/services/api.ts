import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 🌐 Live Render Production URL (Used in standalone APK builds)
export const RENDER_PRODUCTION_API_URL = 'https://mealfitserviceapi.onrender.com/api';

// Optional Cloudflare tunnel URL
export const CLOUDFLARE_TUNNEL_URL = 'https://gcc-mrna-bodies-attached.trycloudflare.com/api';

let customApiHost: string | null = null;

export const setCustomApiHost = (host: string) => {
  customApiHost = host.trim();
  console.log(`🌐 [MealFit] Custom API Host updated to: ${customApiHost}`);
};

export const getApiBaseUrl = (): string => {
  // 1. User manual override (from in-app "App Life Status" or Settings modal)
  if (customApiHost) {
    return customApiHost.startsWith('http') ? customApiHost : `https://${customApiHost}/api`;
  }

  // 2. Explicit Environment Variable (passed via EAS build, .env, or CLI)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 3. Default to the Live Render Backend URL across mobile, web, Expo Go & APK builds!
  return RENDER_PRODUCTION_API_URL;
};

export async function fetchMobileApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const base = getApiBaseUrl();
  const url = `${base}${endpoint}`;

  // 8-second timeout via AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const json = await response.json();
    if (!response.ok && response.status !== 207) {
      throw new Error(json.error || json.message || `API error: ${response.status}`);
    }

    return json.data !== undefined ? json.data : json;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Connection timed out reaching ${url}.`);
    }
    console.warn(`[Mobile API Warning] Failed to fetch ${url}:`, error.message);
    throw error;
  }
}

export const MobileApiService = {
  getApiBaseUrl,
  setCustomApiHost,

  // Health & App Life Status
  getHealth: () => fetchMobileApi<any>('/health'),
  getHealthDetails: () => fetchMobileApi<any>('/health/details'),

  // Biometrics & Goals
  calculateBiometrics: (data: any) =>
    fetchMobileApi<any>('/goals/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Nutrition & Kirana Optimizer
  optimizeMealPlan: (params: {
    dailyBudgetInr: number;
    targetProteinG: number;
    dietCategory: string;
    targetCalories?: number;
  }) =>
    fetchMobileApi<any>('/nutrition/optimize', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  getKiranaList: (weeklyBudgetInr: number, dietCategory: string) =>
    fetchMobileApi<any>('/nutrition/kirana-list', {
      method: 'POST',
      body: JSON.stringify({ weeklyBudgetInr, dietCategory }),
    }),

  getFridgeJugaad: (leftovers: string[]) =>
    fetchMobileApi<any>('/nutrition/fridge-jugaad', {
      method: 'POST',
      body: JSON.stringify({ leftovers }),
    }),

  getFoods: (search?: string) =>
    fetchMobileApi<any[]>(search ? `/nutrition/foods?search=${encodeURIComponent(search)}` : '/nutrition/foods'),

  // Weather & AQI Dynamic Engine (supports any Indian city or GPS coordinates)
  getWeatherStatus: (
    params: string | { city?: string; latitude?: number; longitude?: number; baseHydrationMl?: number } = 'delhi',
    baseHydrationMl: number = 2500
  ) => {
    if (typeof params === 'string') {
      return fetchMobileApi<any>(`/weather/status?city=${encodeURIComponent(params)}&baseHydrationMl=${baseHydrationMl}`);
    }
    const queryParts: string[] = [];
    if (params.city) queryParts.push(`city=${encodeURIComponent(params.city)}`);
    if (params.latitude !== undefined) queryParts.push(`latitude=${params.latitude}`);
    if (params.longitude !== undefined) queryParts.push(`longitude=${params.longitude}`);
    queryParts.push(`baseHydrationMl=${params.baseHydrationMl || baseHydrationMl}`);
    return fetchMobileApi<any>(`/weather/status?${queryParts.join('&')}`);
  },

  getCities: () => fetchMobileApi<{ key: string; name: string; state: string }[]>('/weather/cities'),

  // Workouts
  getWorkouts: (noiseFreeOnly: boolean = false) =>
    fetchMobileApi<any[]>(`/workouts?noiseFreeOnly=${noiseFreeOnly}`),
};
