import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { SafeStorage } from './storage';

// Live Render Production URLs (mealfitbackend is primary backup, mealfitserviceapi resumes Sept 1)
export const RENDER_PRODUCTION_API_URL = 'https://mealfitbackend.onrender.com/api';
export const RENDER_FALLBACK_API_URL = 'https://mealfitserviceapi.onrender.com/api';

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
  const fallbackRenderBase = RENDER_FALLBACK_API_URL;

  // Auto-restore token from storage if not in memory
  if (!currentAuthToken) {
    try {
      const storedToken = await SafeStorage.getItem('mealfit_auth_token');
      if (storedToken && !storedToken.startsWith('local_jwt_session_')) {
        currentAuthToken = storedToken;
      }
    } catch {}
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (currentAuthToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }

  // Helper to attempt fetch on a target base URL
  const attemptFetch = async (baseUrl: string, timeoutMs: number = 7000): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeoutId);

      const json = await response.json().catch(() => ({}));

      if (!response.ok && response.status !== 207) {
        if (response.status === 404 && !json.error) {
          throw new Error(`Endpoint not found on ${baseUrl}`);
        }
        throw new Error(json.error || json.message || `API error: ${response.status}`);
      }

      return json.data !== undefined ? json.data : json;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  // 1. Try Primary Base URL
  try {
    return await attemptFetch(primaryBase, 7000);
  } catch (primaryErr: any) {
    // 2. If Primary is the local URL or failed, try backup Render URL
    if (primaryBase !== fallbackRenderBase && primaryBase !== RENDER_PRODUCTION_API_URL) {
      try {
        return await attemptFetch(RENDER_PRODUCTION_API_URL, 6000);
      } catch {}
    }

    // 3. If primary was Render and failed, try secondary fallback Render URL
    if (primaryBase === RENDER_PRODUCTION_API_URL) {
      try {
        return await attemptFetch(fallbackRenderBase, 5000);
      } catch {}
    }

    // 4. Try local dev base URL if not already tried
    if (primaryBase !== localDevBase) {
      try {
        return await attemptFetch(localDevBase, 4000);
      } catch {}
    }

    console.warn(`[Mobile API Warning] Failed to fetch ${endpoint} across all backends:`, primaryErr.message);
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

  // Daily Logs & Macro Tracking in MongoDB Atlas
  getDailyLogs: (date: string) => fetchMobileApi<any>(`/logs?date=${date}`),
  logMeal: (data: any) =>
    fetchMobileApi<any>('/logs/meals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteMeal: (mealId: string, date?: string) =>
    fetchMobileApi<any>(`/logs/meals/${mealId}${date ? `?date=${date}` : ''}`, {
      method: 'DELETE',
    }),
  updateMetrics: (data: any) =>
    fetchMobileApi<any>('/logs/metrics', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
