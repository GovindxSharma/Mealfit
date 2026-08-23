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
  try {
    const GoogleSigninModule = require('@react-native-google-signin/google-signin');
    if (!GoogleSigninModule || !GoogleSigninModule.GoogleSignin) {
      throw new Error('Google Play Services module is not available in this environment');
    }

    const { GoogleSignin, statusCodes } = GoogleSigninModule;

    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ['profile', 'email'],
    });

    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    console.log('[Google Auth] Native result received:', JSON.stringify(signInResult));

    // Handle v12+ and legacy response shapes
    let email = '';
    let fullName = '';
    let avatarUrl: string | undefined;
    let googleId = '';
    let idToken: string | undefined;

    const dataObj = (signInResult as any)?.data || signInResult;
    const userObj = dataObj?.user || dataObj;

    email = userObj?.email || dataObj?.email || '';
    fullName = userObj?.name || userObj?.givenName || dataObj?.name || 'Google Member';
    avatarUrl = userObj?.photo || dataObj?.photo || undefined;
    googleId = userObj?.id || dataObj?.id || `google_${Date.now()}`;
    idToken = dataObj?.idToken || (signInResult as any)?.idToken || undefined;

    if (email) {
      return {
        email,
        fullName,
        avatarUrl,
        googleId,
        idToken,
      };
    }

    throw new Error('No email returned from Google Account');
  } catch (err: any) {
    console.error('[Google Auth] Native GoogleSignin error:', err);
    throw err;
  }
};
