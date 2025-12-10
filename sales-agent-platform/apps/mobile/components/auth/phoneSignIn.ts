import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

/**
 * Initiates the phone number sign-in process.
 * Sends an SMS with a verification code to the provided phone number.
 * 
 * @param phoneNumber The phone number to verify (E.164 format, e.g., +16505553434)
 * @returns A confirmation object that can be used to verify the code
 */
export async function signInWithPhoneNumber(phoneNumber: string): Promise<FirebaseAuthTypes.ConfirmationResult> {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

/**
 * Verifies the SMS code and completes the sign-in.
 * 
 * @param confirmation The confirmation object returned by signInWithPhoneNumber
 * @param code The 6-digit verification code entered by the user
 * @returns The UserCredential object upon successful sign-in
 */
export async function confirmCode(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential | null> {
  try {
    const userCredential = await confirmation.confirm(code);
    return userCredential;
  } catch (error) {
    console.error('Error confirming code:', error);
    throw error;
  }
}
