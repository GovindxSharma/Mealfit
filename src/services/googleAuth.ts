import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
  '351938721714-v7jmbogjvvnik6utb00ovph4hn5ee9t9.apps.googleusercontent.com';

const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
  '351938721714-op178a4jbmssutp6td8ivmdgr8pdc62e.apps.googleusercontent.com';

export interface GoogleUserProfile {
  email: string;
  fullName: string;
  avatarUrl?: string;
  googleId: string;
  idToken?: string;
}

export const promptGoogleSignIn = async (): Promise<GoogleUserProfile> => {
  // 1. Web Browser: Real Google OAuth 2.0 Popup & userinfo fetch
  if (Platform.OS === 'web') {
    const redirectUri = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      GOOGLE_WEB_CLIENT_ID
    )}&response_type=token&scope=${encodeURIComponent(
      'openid profile email'
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&prompt=select_account`;

    console.log(`[Google Auth Web] Opening real Google OAuth window with redirect: ${redirectUri}`);

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success' && result.url) {
      const tokenMatch = result.url.match(/[#&?]access_token=([^&]+)/);
      const accessToken = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

      if (accessToken) {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (userInfoRes.ok) {
          const googleUser = await userInfoRes.json();
          console.log('[Google Auth Web] Real Google Profile received:', googleUser.name, googleUser.email);
          return {
            email: googleUser.email,
            fullName: googleUser.name || googleUser.given_name || 'Google Member',
            avatarUrl: googleUser.picture,
            googleId: googleUser.sub,
          };
        }
      }
    }

    if (result.type === 'cancel' || result.type === 'dismiss') {
      throw new Error('Google Sign-In was cancelled');
    }

    throw new Error('Google Sign-In failed on Web');
  }

  // 2. Mobile App (Expo Go & Android): Fallback to in-app Google prompt
  throw new Error('Google Sign-In fallback');
};
