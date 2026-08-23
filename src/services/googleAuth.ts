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
      console.log('[Google Auth] Native signInResult received:', JSON.stringify(signInResult));

      const resData = (signInResult as any)?.data || signInResult;
      const googleUser = resData?.user || resData;
      const email = googleUser?.email || resData?.email;
      const fullName = googleUser?.name || googleUser?.givenName || resData?.name;
      const avatarUrl = googleUser?.photo || resData?.photo;
      const googleId = googleUser?.id || resData?.id || `google_${Date.now()}`;
      const idToken = resData?.idToken || (signInResult as any)?.idToken;

      if (email) {
        return {
          email,
          fullName: fullName || 'Google Member',
          avatarUrl,
          googleId,
          idToken,
        };
      }
    }
  } catch (err: any) {
    console.log('[Google Auth] Native GoogleSignin caught error:', err?.message || err);
  }

  // 2. Fallback to in-app Google prompt
  throw new Error('Google Sign-In prompt');
};
