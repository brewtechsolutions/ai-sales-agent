import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function FirebaseAuthLink() {
  const router = useRouter();

  useEffect(() => {
    // This component is just a placeholder for the deep link to land on.
    // The Firebase SDK intercepts the link and handles the verification in the background.
    // We just need to dismiss this screen so the user can continue.
    const timer = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback if we can't go back (e.g. deep link opened cold)
        router.replace('/(auth)/login'); 
      }
    }, 1000); // Give it a second to be sure

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20 }}>Verifying...</Text>
    </View>
  );
}
