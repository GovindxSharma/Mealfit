import { NativeModules } from 'react-native';

export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
  '351938721714-op178a4jbmssutp6td8ivmdgr8pdc62e.apps.googleusercontent.com';

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
  '351938721714-v7jmbogjvvnik6utb00ovph4hn5ee9t9.apps.googleusercontent.com';

export interface GoogleUserProfile {
  email: string;
  fullName: string;
  avatarUrl?: string;
  googleId: string;
  idToken?: string;
}

export const isNativeGooglePlayServicesAvailable = (): boolean => {
  return !!(NativeModules && NativeModules.RNGoogleSignin);
};

export const promptGoogleSignIn = async (): Promise<GoogleUserProfile> => {
  // 1. In standalone APK with NativeModules.RNGoogleSignin available
  if (isNativeGooglePlayServicesAvailable()) {
    try {
      const { GoogleSignin } = require('@react-native-google-signin/google-signin');
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const dataObj = (signInResult as any)?.data || signInResult;
      const userObj = dataObj?.user || dataObj;

      const email = userObj?.email || dataObj?.email || '';
      const fullName = userObj?.name || userObj?.givenName || dataObj?.name || 'Google Member';
      const avatarUrl = userObj?.photo || dataObj?.photo || undefined;
      const googleId = userObj?.id || dataObj?.id || `google_${Date.now()}`;
      const idToken = dataObj?.idToken || (signInResult as any)?.idToken || undefined;

      if (email) {
        return {
          email,
          fullName,
          avatarUrl,
          googleId,
          idToken,
        };
      }
    } catch (err: any) {
      console.log('[Google Auth] Native GoogleSignin caught:', err?.message || err);
    }
  }

  // 2. In Expo Go development sandbox
  throw new Error('Google Sign-In prompt');
};
