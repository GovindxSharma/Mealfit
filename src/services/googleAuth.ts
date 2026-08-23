import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { NativeModules, Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
  '874250049604-lni6cam19jjfb8gq6s9oq9m4qinco9qq.apps.googleusercontent.com';

export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
  '874250049604-f1dn616ggbc99ub7h6mgatjer72hrju3.apps.googleusercontent.com';

export interface GoogleUserProfile {
  email: string;
  fullName: string;
  avatarUrl?: string;
  googleId: string;
  idToken?: string;
}

export const promptGoogleSignIn = async (): Promise<GoogleUserProfile> => {
  // 1. Standalone APK: Execute native Google Play Services if compiled in binary
  if (NativeModules && NativeModules.RNGoogleSignin) {
    try {
      const { GoogleSignin } = require('@react-native-google-signin/google-signin');
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
        scopes: ['profile', 'email'],
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const dataObj = (signInResult as any)?.data || signInResult;
      const userObj = dataObj?.user || dataObj;

      const email = userObj?.email || dataObj?.email;
      const fullName = userObj?.name || userObj?.givenName || dataObj?.name || 'Google Member';
      const avatarUrl = userObj?.photo || dataObj?.photo;
      const googleId = userObj?.id || dataObj?.id || `google_${Date.now()}`;
      const idToken = dataObj?.idToken || (signInResult as any)?.idToken;

      if (email) {
        return {
          email,
          fullName,
          avatarUrl,
          googleId,
          idToken,
        };
      }
    } catch (nativeErr: any) {
      console.log('[Google Auth] Native GoogleSignin:', nativeErr?.message || nativeErr);
      const msg = nativeErr?.message || '';
      if (msg.includes('12501') || msg.includes('cancel')) {
        throw new Error('Google Sign-In was cancelled');
      }
      throw nativeErr;
    }
  }

  // 2. Development / Browser Flow
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'mealfit',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    GOOGLE_WEB_CLIENT_ID
  )}&response_type=token&scope=${encodeURIComponent(
    'openid profile email'
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&prompt=select_account`;

  console.log(`[Google Auth] Opening official Google OAuth screen: ${redirectUri}`);

  const authResult = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (authResult.type === 'success' && authResult.url) {
    const tokenMatch = authResult.url.match(/[#&?]access_token=([^&]+)/);
    const accessToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (accessToken) {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (userInfoRes.ok) {
        const profile = await userInfoRes.json();
        console.log('[Google Auth] Official Google Profile verified:', profile.email, profile.name);
        return {
          email: profile.email,
          fullName: profile.name || profile.given_name || 'Google Member',
          avatarUrl: profile.picture,
          googleId: profile.sub,
        };
      }
    }
  }

  if (authResult.type === 'cancel' || authResult.type === 'dismiss') {
    throw new Error('Google Sign-In was cancelled');
  }

  throw new Error('Google authentication could not be completed.');
};
