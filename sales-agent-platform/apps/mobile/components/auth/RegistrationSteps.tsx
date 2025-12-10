import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { showToast } from '../../utils/toast';
import { CountryPicker } from './CountryPicker';
import { Country, DEFAULT_COUNTRY, COUNTRIES } from '../../constants/countries';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useTRPC } from '../../utils/trpc';
import { useMutation } from '@tanstack/react-query';

const REGISTRATION_STATE_KEY = 'registration_state';

interface RegistrationState {
  step: number;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  country?: Country;
  otp?: string;
  name?: string;
  password?: string;
  authMethod?: 'gmail' | 'phone' | 'email';
}

interface RegistrationStepsProps {
  onComplete: (data: RegistrationState) => void;
  onBack?: () => void;
}

export const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const trpc = useTRPC();
  const [currentStep, setCurrentStep] = useState(1);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const primaryColor = useThemeColor({}, 'primary');
  const textPrimaryColor = useThemeColor({}, 'textPrimary');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const iconBgColor = useThemeColor({}, 'iconBg');

  const colors = {
    primary: primaryColor,
    textPrimary: textPrimaryColor,
    textSecondary: textSecondaryColor,
    iconBg: iconBgColor,
  };
  const [state, setState] = useState<RegistrationState>({
    step: 1,
    authMethod: 'email',
  });


  // Firebase register mutation
  const firebaseRegisterMutation = useMutation(
    trpc.auth.firebaseRegister.mutationOptions({
      onSuccess: async (response: { token: string; refreshToken?: string }) => {
        // Store backend JWT token in AsyncStorage
        await AsyncStorage.setItem("auth_token", response.token);
        // Store expiry (15 minutes - 30 seconds buffer)
        const expiry = Date.now() + 15 * 60 * 1000 - 30000;
        await AsyncStorage.setItem("auth_token_expiry", expiry.toString());

        if (response.refreshToken) {
          await AsyncStorage.setItem("refresh_token", response.refreshToken);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast('success', t('auth.registrationSuccess'));
        onComplete(state);
        router.replace('/(auth)');
      },
      onError: (error: { message: string }) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showToast('error', error.message || t('auth.registrationFailed'));
      },
    })
  );

  // Load saved state on mount
  useEffect(() => {
    loadSavedState();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    saveState();
  }, [state]);

  const loadSavedState = async () => {
    try {
      const saved = await AsyncStorage.getItem(REGISTRATION_STATE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Force authMethod to 'email' to migrate old state
        parsed.authMethod = 'email';
        setState(parsed);
        // Only restore step if no initialAuthMethod is provided
        if (!initialAuthMethod) {
          setCurrentStep(parsed.step);
        } else {
          // If initial method is provided, ensure state reflects it
          setState(prev => ({
            ...prev,
            step: 1,
            authMethod: 'email'
          }));
        }

      }
    } catch (error) {
      console.warn('Failed to load registration state:', error);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem(REGISTRATION_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save registration state:', error);
    }
  };

  const clearSavedState = async () => {
    try {
      await AsyncStorage.removeItem(REGISTRATION_STATE_KEY);
    } catch (error) {
      console.warn('Failed to clear registration state:', error);
    }
  };

  const updateState = (updates: Partial<RegistrationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const goToStep = (step: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(step);
    updateState({ step });
  };





  // Email Registration Step
  const [email, setEmail] = useState(state.email || '');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError(t('errors.required'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('errors.invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const renderEmailStep = () => (
    <Animated.View
      key="emailStep"
      entering={FadeInRight.duration(400).springify()}
      exiting={FadeOutLeft.duration(300)}
      className="flex-1"
    >
      <View className="items-center pt-8 pb-6 px-6">
        <View
          className="rounded-full items-center justify-center mb-6 bg-primary-500/10"
          style={styles.iconContainer}
        >
          <MaterialIcons name="email" size={40} color={colors.primary} />
        </View>
        <Text className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-3 text-center">
          {t('auth.createAccount')}
        </Text>
        <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center px-4">
          {t('auth.createAccountDescription')}
        </Text>
      </View>

      <View className="px-6 flex-1">
        <View className="bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-xl p-6 mb-6">
          <Input
            label={t('auth.name')}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (nameError) validateName(text);
            }}
            placeholder={t('auth.namePlaceholder')}
            autoCapitalize="words"
            autoComplete="name"
            icon="person"
            errorMessage={nameError}
          />

          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
            }}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            icon="email"
            errorMessage={emailError}
          />

          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) validatePassword(text);
              if (confirmPassword && confirmPasswordError) {
                validateConfirmPassword(confirmPassword, text);
              }
            }}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            icon="lock"
            errorMessage={passwordError}
          />

          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) validateConfirmPassword(text, password);
            }}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            icon="lock-outline"
            errorMessage={confirmPasswordError}
          />
        </View>

        <Button
          title={t('auth.signUp')}
          onPress={handleComplete}
          variant="primary"
          size="lg"
          loading={isLoading}
        />

      </View>
    </Animated.View>
  );



  // Step 4: Name and Password (if not using Gmail)
  const [name, setName] = useState(state.name || '');
  const [password, setPassword] = useState(state.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError(t('errors.required'));
      return false;
    }
    if (name.trim().length < 2) {
      setNameError(t('auth.nameTooShort'));
      return false;
    }
    setNameError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t('errors.required'));
      return false;
    }
    if (password.length < 8) {
      setPasswordError(t('errors.passwordTooShort'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError(t('errors.required'));
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError(t('errors.passwordsDoNotMatch'));
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleComplete = async () => {
    const isNameValid = state.authMethod === 'gmail' || validateName(name);
    // Skip password validation for phone login as well
    const isPasswordValid = state.authMethod === 'gmail' || state.authMethod === 'phone' || validatePassword(password);
    const isConfirmPasswordValid = state.authMethod === 'gmail' || state.authMethod === 'phone' || validateConfirmPassword(confirmPassword, password);

    if (!isNameValid || !isPasswordValid || !isConfirmPasswordValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (state.authMethod === 'phone') {
      try {
        setIsLoading(true);
        // Get current user to retrieve ID token
        const currentUser = auth().currentUser;

        if (!currentUser) {
          throw new Error("No authenticated user found");
        }

        const idToken = await currentUser.getIdToken();

        await phoneLoginMutation.mutateAsync({
          idToken,
          name: name.trim(),
        });

        showToast('success', t('auth.loginSuccess'));
        router.replace('/(auth)');
      } catch (error) {
        console.error('Phone login completion failed:', error);
        showToast('error', t('auth.loginFailed'));
      } finally {
        setIsLoading(false);
      }
    } else if (state.authMethod === 'email') {
      try {
        setIsLoading(true);
        // 1. Create user in Firebase
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const idToken = await userCredential.user.getIdToken();

        // 2. Register in backend
        await firebaseRegisterMutation.mutateAsync({
          idToken,
          name: name.trim(),
        });

        // Success handled in mutation onSuccess
      } catch (error: unknown) {
        console.error('Email registration failed:', error);
        const err = error as { code?: string };
        let errorMessage = t('auth.registrationFailed');
        if (err.code === 'auth/email-already-in-use') {
          errorMessage = t('errors.emailInUse');
        } else if (err.code === 'auth/invalid-email') {
          errorMessage = t('errors.invalidEmail');
        } else if (err.code === 'auth/weak-password') {
          errorMessage = t('errors.passwordTooWeak');
        }
        showToast('error', errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      const finalState = {
        ...state,
        name: state.authMethod === 'gmail' ? undefined : name.trim(),
        password: state.authMethod === 'gmail' ? undefined : password,
      };

      await clearSavedState();
      onComplete(finalState);
    }
  };

  // Progress indicator
  const renderProgress = () => {
    const totalSteps = 1;
    const progress = (currentStep / totalSteps) * 100;

    return (
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-text-secondary dark:text-dark-text-secondary">
            {t('auth.step')} {currentStep} {t('common.of')} {totalSteps}
          </Text>
          <Text className="text-sm font-semibold text-primary-500 dark:text-primary-400">
            {Math.round(progress)}%
          </Text>
        </View>
        <View className="h-2 bg-surface dark:bg-dark-surface rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-primary-500 dark:bg-primary-400 rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header with back button */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                goToStep(currentStep - 1);
              }}
              accessibilityLabel={t('common.back')}
              accessibilityRole="button"
            >
              <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          {onBack && currentStep === 1 && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onBack();
              }}
              accessibilityLabel={t('common.back')}
              accessibilityRole="button"
            >
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          <View className="flex-1" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {renderProgress()}
          {renderEmailStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 80,
    height: 80,
  },
});


