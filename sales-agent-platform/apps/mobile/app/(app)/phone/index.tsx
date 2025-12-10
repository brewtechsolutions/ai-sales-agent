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
import { useColorScheme } from '../../../hooks/useColorScheme';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../../utils/toast';
import { CountryPicker } from '../../../components/auth/CountryPicker';
import { Country, DEFAULT_COUNTRY } from '../../../constants/countries';
import { signInWithPhoneNumber, confirmCode } from '../../../components/auth/phoneSignIn';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useTRPC } from '../../../utils/trpc';
import { useMutation } from '@tanstack/react-query';

export default function PhoneLoginScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const trpc = useTRPC();
  
  // Semantic colors
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

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Phone Input State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneError, setPhoneError] = useState('');
  const [confirmResult, setConfirmResult] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  // OTP State
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpResendTimer, setOtpResendTimer] = useState(60);

  // Name State (for new users)
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  // Phone Login Mutation
  const phoneLoginMutation = useMutation(
    trpc.auth.phoneLogin.mutationOptions({
      onSuccess: async (response: any) => {
        await AsyncStorage.setItem("auth_token", response.token);
        const expiry = Date.now() + 15 * 60 * 1000 - 30000;
        await AsyncStorage.setItem("auth_token_expiry", expiry.toString());
        
        if (response.refreshToken) {
          await AsyncStorage.setItem("refresh_token", response.refreshToken);
        }
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showToast('success', t('auth.loginSuccess'));
        router.replace('/(auth)');
      },
      onError: (error: any) => {
        // If user not found, we need to ask for name
        if (error.message?.includes('User not found') || error.shape?.message?.includes('User not found')) {
            // User not found, proceeding to registration
            setStep(3); // Move to Name input step
        } else {
            showToast('error', error.message || t('auth.phoneSignInFailed'));
        }
      },
    })
  );

  // Timer logic
  useEffect(() => {
    if (step === 2) {
      if (otpResendTimer === 0) setOtpResendTimer(60);
      const timer = setInterval(() => {
        setOtpResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const validatePhone = (phone: string) => {
    if (!phone) {
      setPhoneError(t('errors.required'));
      return false;
    }
    const minDigits = 6;
    const maxDigits = 15;
    if (phone.length < minDigits) {
      setPhoneError(t('auth.phoneNumberTooShort'));
      return false;
    }
    if (phone.length > maxDigits) {
      setPhoneError(t('auth.phoneNumberTooLong'));
      return false;
    }
    if (!/^[0-9]+$/.test(phone)) {
      setPhoneError(t('auth.invalidPhoneNumber'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneNext = async () => {
    if (!validatePhone(phoneNumber)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    setIsLoading(true);
    try {
      const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(fullPhoneNumber);
      setConfirmResult(confirmation);
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStep(2);
    } catch (error) {
      console.error('Phone sign-in failed:', error);
      setPhoneError(t('auth.phoneSignInFailed'));
      showToast('error', t('auth.phoneSignInFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const validateOtp = (code: string) => {
    if (!code) {
      setOtpError(t('errors.required'));
      return false;
    }
    if (code.length !== 6) {
      setOtpError(t('auth.otpMustBe6Digits'));
      return false;
    }
    setOtpError('');
    return true;
  };

  const handleOtpVerify = async () => {
    if (!validateOtp(otp)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!confirmResult) {
      showToast('error', t('auth.sessionExpired'));
      setStep(1);
      return;
    }

    setIsLoading(true);
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const userCredential = await confirmCode(confirmResult, otp);
      
      if (userCredential) {
        const token = await userCredential.user?.getIdToken();
        console.log('Firebase Token (Phone):', token);
        
        // Attempt login
        await phoneLoginMutation.mutateAsync({
            idToken: token!,
        });
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      setOtpError(t('auth.invalidOtp'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement actual resend logic if needed, or just reset timer for UI
    setOtpResendTimer(60);
    showToast('success', t('auth.otpResent'));
  };

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

  const handleNameSubmit = async () => {
    if (!validateName(name)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
    }

    setIsLoading(true);
    try {
        const currentUser = auth().currentUser;
        if (!currentUser) throw new Error("No authenticated user found");
        
        const idToken = await currentUser.getIdToken();
        
        // Retry login with name to create user
        await phoneLoginMutation.mutateAsync({
            idToken,
            name: name.trim(),
        });
    } catch (error: any) {
        console.error('Name submission failed:', error);
        showToast('error', error.message || t('auth.loginFailed'));
    } finally {
        setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Animated.View
      entering={FadeInRight.duration(400).springify()}
      exiting={FadeOutLeft.duration(300)}
      className="flex-1"
    >
      <View className="items-center pt-8 pb-6 px-6">
        <View
          className="rounded-full items-center justify-center mb-6 bg-primary-500/10"
          style={styles.iconContainer}
        >
          <MaterialIcons name="phone" size={40} color={colors.primary} />
        </View>
        <Text className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-3 text-center">
          {t('auth.enterPhoneNumber')}
        </Text>
        <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center px-4">
          {t('auth.phoneNumberDescription')}
        </Text>
      </View>

      <View className="px-6 flex-1">
        <View className="bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-xl p-6 mb-6">
          <View className="flex-row items-start mb-4">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCountryPicker(true);
              }}
              className="w-28 mr-3"
              accessibilityLabel={t('auth.selectCountry')}
              accessibilityRole="button"
            >
              <Text className="text-sm font-semibold text-text-secondary dark:text-dark-text-secondary mb-2 px-1">
                {t('auth.countryCode')}
              </Text>
              <View
                className="flex-row items-center justify-between rounded-ios-lg border p-4 min-h-[56px] bg-background dark:bg-dark-background border-border dark:border-dark-border"
              >
                <View className="flex-row items-center flex-1">
                  <Text style={{ fontSize: 24, marginRight: 8 }}>
                    {selectedCountry.flag}
                  </Text>
                  <Text
                    className="text-base font-medium text-text-primary dark:text-dark-text-primary"
                  >
                    {selectedCountry.dialCode}
                  </Text>
                </View>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
            </TouchableOpacity>
            <View className="flex-1">
              <Input
                label={t('auth.phoneNumber')}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text.replace(/[^0-9]/g, ''));
                  if (phoneError) validatePhone(text);
                }}
                placeholder={t('auth.phoneNumberPlaceholder')}
                keyboardType="phone-pad"
                icon="phone"
                errorMessage={phoneError}
              />
            </View>
          </View>
        </View>

        <CountryPicker
          visible={showCountryPicker}
          selectedCountry={selectedCountry}
          onSelect={(country) => {
            setSelectedCountry(country);
          }}
          onClose={() => setShowCountryPicker(false)}
        />

        <Button
          title={t('common.next')}
          onPress={handlePhoneNext}
          variant="primary"
          size="lg"
          loading={isLoading}
        />
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      entering={FadeInRight.duration(400).springify()}
      exiting={FadeOutLeft.duration(300)}
      className="flex-1"
    >
      <View className="items-center pt-8 pb-6 px-6">
        <View
          className="rounded-full items-center justify-center mb-6 bg-primary-500/10"
          style={styles.iconContainer}
        >
          <MaterialIcons name="verified" size={40} color={colors.primary} />
        </View>
        <Text className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-3 text-center">
          {t('auth.verifyPhoneNumber')}
        </Text>
        <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center px-4 mb-2">
          {t('auth.otpSentTo')} {selectedCountry.dialCode} {phoneNumber}
        </Text>
      </View>

      <View className="px-6 flex-1">
        <View className="bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-xl p-6 mb-6">
          <Input
            label={t('auth.enterOtp')}
            value={otp}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
              setOtp(digits);
              if (otpError) validateOtp(digits);
            }}
            placeholder={t('auth.otpPlaceholder')}
            keyboardType="numeric"
            icon="lock"
            errorMessage={otpError}
          />

          <View className="flex-row justify-center items-center mt-4">
            <Text className="text-text-secondary dark:text-dark-text-secondary text-sm mr-2">
              {t('auth.didntReceiveOtp')}
            </Text>
            {otpResendTimer > 0 ? (
              <Text className="text-text-tertiary dark:text-dark-text-tertiary text-sm">
                {t('auth.resendIn')} {otpResendTimer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text className="text-primary-500 dark:text-primary-400 font-semibold text-sm">
                  {t('auth.resendOtp')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Button
          title={t('auth.verify')}
          onPress={handleOtpVerify}
          variant="primary"
          size="lg"
          loading={isLoading}
        />
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      entering={FadeInRight.duration(400).springify()}
      exiting={FadeOutLeft.duration(300)}
      className="flex-1"
    >
      <View className="items-center pt-8 pb-6 px-6">
        <View
          className="rounded-full items-center justify-center mb-6 bg-primary-500/10"
          style={styles.iconContainer}
        >
          <MaterialIcons name="person" size={40} color={colors.primary} />
        </View>
        <Text className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-3 text-center">
            {t('auth.completeProfile')}
        </Text>
        <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center px-4">
            {t('auth.completeProfileDescription')}
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
        </View>

        <Button
          title={t('auth.completeRegistration')}
          onPress={handleNameSubmit}
          variant="primary"
          size="lg"
          loading={isLoading}
        />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header with back button */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (step > 1) {
                setStep(step - 1);
              } else {
                router.back();
              }
            }}
            accessibilityLabel={t('common.back')}
            accessibilityRole="button"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 80,
    height: 80,
  },
});
