import React from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { RegistrationSteps } from "../../../components/auth/RegistrationSteps";
import * as Haptics from "expo-haptics";



export default function RegisterScreen() {
  const { t } = useTranslation();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <RegistrationSteps
      onComplete={(data) => {
        console.warn("onComplete called unexpectedly", data);
      }}
      onBack={handleBack}
    />
  );
}
