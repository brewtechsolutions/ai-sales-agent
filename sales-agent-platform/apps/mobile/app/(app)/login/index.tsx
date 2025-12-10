import React from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { useTRPC } from "../../../utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "../../../utils/toast";
import { OnboardingCarousel } from "../../../components/onboarding/OnboardingCarousel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { signInWithGoogle } from "../../../components/auth/googleSignIn";
import { useThemeColor } from "../../../hooks/useThemeColor";
import auth from "@react-native-firebase/auth";

const ONBOARDING_SLIDES = [
  {
    titleKey: "onboarding.slide1.title",
    descriptionKey: "onboarding.slide1.description",
    icon: "🚀",
  },
  {
    titleKey: "onboarding.slide2.title",
    descriptionKey: "onboarding.slide2.description",
    icon: "✨",
  },
  {
    titleKey: "onboarding.slide3.title",
    descriptionKey: "onboarding.slide3.description",
    icon: "🎯",
  },
];

export default function LoginScreen() {
  const { t } = useTranslation();
  const primaryColor = useThemeColor({}, "primary");
  const trpc = useTRPC();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Check if user has seen onboarding
  React.useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem("has_seen_onboarding");
        setShowOnboarding(hasSeenOnboarding !== "true");
        setHasCheckedOnboarding(true);
      } catch (error) {
        console.warn("Failed to check onboarding status:", error);
        setShowOnboarding(true);
        setHasCheckedOnboarding(true);
      }
    };
    checkOnboarding();
  }, []);

  const loginMutation = useMutation(trpc.auth.firebaseLogin.mutationOptions());
  const googleLoginMutation = useMutation(trpc.auth.googleLogin.mutationOptions());

  const handleGoogleLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;

      if (user) {
        const idToken = await user.getIdToken();
        googleLoginMutation.mutate(
          { idToken },
          {
            onSuccess: async (response) => {
              // Store backend JWT token in AsyncStorage
              await AsyncStorage.setItem("auth_token", response.token);
              // Store expiry (15 minutes - 30 seconds buffer)
              const expiry = Date.now() + 15 * 60 * 1000 - 30000;
              await AsyncStorage.setItem("auth_token_expiry", expiry.toString());
              
              if (response.refreshToken) {
                await AsyncStorage.setItem("refresh_token", response.refreshToken);
              }

              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace("/(app)/(auth)");
            },
            onError: (error) => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              showToast("error", error.message || t("auth.gmailSignInFailed"));
            },
          }
        );
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      showToast("error", t("auth.gmailSignInFailed"));
    }
  };

  const handlePhoneLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(app)/phone");
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("has_seen_onboarding", "true");
      setShowOnboarding(false);
    } catch (error) {
      console.warn("Failed to save onboarding status:", error);
      setShowOnboarding(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(t("errors.required"));
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t("errors.invalidEmail"));
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError(t("errors.required"));
      return false;
    }
    if (password.length < 8) {
      setPasswordError(t("errors.passwordTooShort"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // 1. Sign in with Firebase
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Call backend to verify and get JWT
      loginMutation.mutate(
        { idToken },
        {
          onSuccess: async (response) => {
            // Store backend JWT token in AsyncStorage
            await AsyncStorage.setItem("auth_token", response.token);
            // Store expiry (15 minutes - 30 seconds buffer)
            const expiry = Date.now() + 15 * 60 * 1000 - 30000;
            await AsyncStorage.setItem("auth_token_expiry", expiry.toString());
            
            if (response.refreshToken) {
              await AsyncStorage.setItem("refresh_token", response.refreshToken);
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace("/(app)/(auth)");
          },
          onError: (error) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            showToast("error", error.message || t("auth.loginFailed"));
          },
        }
      );
    } catch (error: any) {
      console.error("Login Error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      let errorMessage = t("auth.loginFailed");
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = t("errors.invalidCredentials");
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = t("errors.tooManyRequests");
      }
      
      showToast("error", errorMessage);
    }
  };

  // Show onboarding if user hasn't seen it
  if (!hasCheckedOnboarding) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-primary dark:text-dark-text-primary">
            {t("common.loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showOnboarding) {
    return (
      <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
        <OnboardingCarousel slides={ONBOARDING_SLIDES} onComplete={handleOnboardingComplete} />
      </SafeAreaView>
    );
  }

  // Beautiful login form
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with Animation */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600).springify()}
            className="items-center pt-12 pb-8 px-6"
          >


              <View
                className="rounded-full items-center justify-center mb-6 bg-primary-500/10 w-20 h-20"
              >
              <MaterialIcons name="lock" size={40} color={primaryColor} />
            </View>




            <Text className="text-4xl font-bold text-text-primary dark:text-dark-text-primary mb-3 text-center">
              {t("auth.welcomeBack")}
            </Text>
            <Text className="text-base text-text-secondary dark:text-dark-text-secondary text-center px-4">
              {t("auth.loginSubtitle")}
            </Text>
          </Animated.View>

          {/* Form Card with Animation */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600).springify()}
            className="flex-1 px-6"
          >
            <View
              className="bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-xl p-6 mb-6 border border-primary-500/10"
            >
              <Input
                label={t("auth.email")}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) validateEmail(text);
                }}
                placeholder={t("auth.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                icon="email"
                errorMessage={emailError}
              />

              <Input
                label={t("auth.password")}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) validatePassword(text);
                }}
                placeholder={t("auth.passwordPlaceholder")}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                icon="lock"
                errorMessage={passwordError}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => {
                  // TODO: Implement forgot password
                  showToast("info", t("auth.forgotPasswordComingSoon"));
                }}
                className="self-end mt-2 mb-6"
                accessibilityLabel={t("auth.forgotPassword")}
                accessibilityRole="button"
              >
                <Text className="text-primary-500 dark:text-primary-400 font-semibold text-sm">
                  {t("auth.forgotPassword")}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
                title={t("auth.login")}
                onPress={handleLogin}
                loading={loginMutation.isPending}
                variant="primary"
                size="lg"
              />

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
                <Text className="mx-4 text-text-tertiary dark:text-dark-text-tertiary text-sm">
                  {t("auth.orContinueWith")}
                </Text>
                <View className="flex-1 h-[1px] bg-border dark:bg-dark-border" />
              </View>

              {/* Social Login Buttons */}
              <View className="gap-4">
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  className="flex-row items-center justify-center p-4 rounded-ios-lg border border-border dark:border-dark-border bg-transparent"
                  accessibilityRole="button"
                  accessibilityLabel={t("auth.continueWithGmail")}
                >
                  <MaterialIcons name="email" size={20} color="#EA4335" className="mr-2.5" />
                  <Text className="text-text-primary dark:text-dark-text-primary font-semibold text-base">
                    {t("auth.continueWithGmail")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePhoneLogin}
                  className="flex-row items-center justify-center p-4 rounded-ios-lg border border-border dark:border-dark-border bg-transparent"
                  accessibilityRole="button"
                  accessibilityLabel={t("auth.continueWithPhone")}
                >
                  <MaterialIcons name="phone" size={20} color={primaryColor} className="mr-2.5" />
                  <Text className="text-text-primary dark:text-dark-text-primary font-semibold text-base">
                    {t("auth.continueWithPhone")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center py-6">
              <Text className="text-text-secondary dark:text-dark-text-secondary text-base">
                {t("auth.dontHaveAccount")}{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(app)/register");
                }}
                accessibilityLabel={t("auth.register")}
                accessibilityRole="button"
              >
                <Text className="text-primary-500 dark:text-primary-400 font-bold text-base">
                  {t("auth.register")}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
