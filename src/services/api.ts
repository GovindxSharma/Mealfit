import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Live Render Production URL (Used in standalone APK builds)
export const RENDER_PRODUCTION_API_URL = 'https://mealfitserviceapi.onrender.com/api';

// Optional Cloudflare tunnel URL
export const CLOUDFLARE_TUNNEL_URL = 'https://gcc-mrna-bodies-attached.trycloudflare.com/api';

let customApiHost: string | null = null;
let currentAuthToken: string | null = null;

export const setCustomApiHost = (host: string) => {
  customApiHost = host.trim();
  console.log(`[MealFit] Custom API Host updated to: ${customApiHost}`);
};

export const setAuthToken = (token: string | null) => {
  currentAuthToken = token;
};

export const getAuthToken = () => currentAuthToken;

export const getLocalDevApiUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:5050/api`;
  }
  return 'http://localhost:5050/api';
};

export const getApiBaseUrl = (): string => {
  // 1. User manual override (from in-app "App Life Status" or Settings modal)
  if (customApiHost) {
    return customApiHost.startsWith('http') ? customApiHost : `https://${customApiHost}/api`;
  }

  // 2. In local development / Expo Go, connect directly to local dev backend
  if (__DEV__) {
    return getLocalDevApiUrl();
  }

  // 3. Explicit Environment Variable (passed via EAS build, .env, or CLI)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 4. Default to the Live Render Backend URL across standalone APK builds
  return RENDER_PRODUCTION_API_URL;
};

export async function fetchMobileApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const primaryBase = getApiBaseUrl();
  const localDevBase = getLocalDevApiUrl();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (currentAuthToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }

  // Try primary URL first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${primaryBase}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    const json = await response.json().catch(() => ({}));

    if (!response.ok && response.status !== 207) {
      // If this is a 404 route not found (HTML or empty error) and we have local fallback
      if (response.status === 404 && !json.error && primaryBase !== localDevBase) {
        throw new Error(`Endpoint not found on ${primaryBase}`);
      }
      throw new Error(json.error || json.message || `API error: ${response.status}`);
    }

    return json.data !== undefined ? json.data : json;
  } catch (primaryErr: any) {
    // If primary failed (404 or connection error) and we have a local dev fallback
    if (primaryBase !== localDevBase) {
      try {
        const localController = new AbortController();
        const localTimeoutId = setTimeout(() => localController.abort(), 4000);

        const localRes = await fetch(`${localDevBase}${endpoint}`, {
          ...options,
          signal: localController.signal,
          headers,
        });

        clearTimeout(localTimeoutId);

        const localJson = await localRes.json();
        if (localRes.ok || localRes.status === 207) {
          return localJson.data !== undefined ? localJson.data : localJson;
        }
      } catch (localErr) {
        // Fall through to throw original error
      }
    }

    console.warn(`[Mobile API Warning] Failed to fetch ${primaryBase}${endpoint}:`, primaryErr.message);
    throw primaryErr;
  }
}

export const MobileApiService = {
  getApiBaseUrl,
  setCustomApiHost,
  setAuthToken,
  getAuthToken,

  // Health & App Life Status
  getHealth: () => fetchMobileApi<any>('/health'),
  getHealthDetails: () => fetchMobileApi<any>('/health/details'),

  // Authentication
  registerUser: (data: {
    fullName: string;
    email: string;
    password?: string;
    gender?: string;
    heightCm?: number;
    weightKg?: number;
    targetWeightKg?: number;
    goalType?: string;
    dietaryPreference?: string;
    weeklyBudgetInr?: number;
    city?: string;
    dailyCalorieTarget?: number;
    proteinTargetG?: number;
    carbsTargetG?: number;
    fatTargetG?: number;
  }) =>
    fetchMobileApi<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginUser: (data: { email: string; password?: string }) =>
    fetchMobileApi<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => fetchMobileApi<any>('/auth/me'),
  getProfile: () => fetchMobileApi<any>('/auth/me'),

  updateProfile: (data: any) =>
    fetchMobileApi<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Super Admin
  getAdminUsers: () =>
    fetchMobileApi<{
      totalUsers: number;
      activeToday: number;
      activeNow: number;
      activeThisWeek: number;
      newToday: number;
      activePercentage: number;
      roleCounts: {
        super_admin: number;
        admin: number;
        user: number;
      };
      users: any[];
    }>('/auth/admin/users'),
  updateUserRole: (userId: string, role: string) =>
    fetchMobileApi<any>(`/auth/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  // Weather
  getWeatherStatus: (city: string) => fetchMobileApi<any>(`/weather/status?city=${city}`),

  // Nutrition & Meal Plan
  getMealPlan: (diet: string, budget: number) =>
    fetchMobileApi<any>(`/nutrition/meal-plan?diet=${diet}&budget=${budget}`),

  // Workouts
  getWorkouts: (equipment?: string) =>
    fetchMobileApi<any>(`/workouts${equipment ? `?equipment=${equipment}` : ''}`),

  // Daily Logs
  getDailyLogs: (date: string) => fetchMobileApi<any>(`/logs?date=${date}`),
  logMeal: (data: any) =>
    fetchMobileApi<any>('/logs/meal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
