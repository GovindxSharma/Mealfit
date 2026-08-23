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

export const promptGoogleSignIn = async (): Promise<GoogleUserProfile> => {
  // 1. In Standalone APK: Execute native Google Play Services bottom-sheet
  try {
    const GoogleSigninModule = require('@react-native-google-signin/google-signin');
    if (GoogleSigninModule && GoogleSigninModule.GoogleSignin) {
      const { GoogleSignin } = GoogleSigninModule;
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      });

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const googleUser = signInResult?.data?.user || signInResult?.user;
      if (googleUser && googleUser.email) {
        return {
          email: googleUser.email,
          fullName: googleUser.name || googleUser.givenName || 'Google Member',
          avatarUrl: googleUser.photo,
          googleId: googleUser.id,
          idToken: signInResult?.data?.idToken || signInResult?.idToken,
        };
      }
    }
  } catch (err: any) {
    console.log('[Google Auth] Native GoogleSignin caught:', err?.message || err);
  }

  // 2. Fallback to in-app Google prompt
  throw new Error('Google Sign-In prompt');
};
