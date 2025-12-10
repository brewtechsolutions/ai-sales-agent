import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export function initGoogleSignIn(): void {
  const webClientId = process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID;
  console.log('Initializing Google Sign-In with client ID:', webClientId);
  GoogleSignin.configure({
    webClientId: webClientId,
    offlineAccess: false,
    scopes: ['profile', 'email'],
  });
}

/**
 * Sign in with Google via Firebase
 * Returns the Firebase user credential with ID token for backend authentication
 * 
 * The component should handle the backend API call using useTRPC hook
 * @example
 * ```tsx
 * const trpc = useTRPC();
 * const userCredential = await signInWithGoogle();
 * const idToken = await userCredential.user.getIdToken();
 * const response = await trpc.auth.googleLogin.mutate({ idToken });
 * ```
 */
export async function signInWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
  console.log('Starting Google Sign-In...');
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // Force sign out to ensure account picker is shown
    try {
      await GoogleSignin.signOut();
    } catch (e) {
      // Ignore if not signed in
    }

    const response = await GoogleSignin.signIn();
    
    // Revoke access NOW to ensure the NEXT sign-in forces the consent screen.
    // We do this after successful sign-in because we need a valid session to revoke.
    try {
      await GoogleSignin.revokeAccess();
    } catch (revokeError) {
      console.error('Revoke access failed:', revokeError);
    }

    const idToken = response.data?.idToken;
    if (!idToken) {
      throw new Error('Google Sign-In failed: No idToken found');
    }
    
    const credential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(credential);
    
    return userCredential;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function getAuthHeader(): Promise<{ Authorization: string } | null> {
  const user = auth().currentUser;
  if (!user) return null;
  const idToken = await user.getIdToken();
  return { Authorization: `Bearer ${idToken}` };
}
