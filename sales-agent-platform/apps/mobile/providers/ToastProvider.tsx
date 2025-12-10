import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ReactNode } from "react";
import React from "react";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <>
      {children}
      <Toast />
    </>
  );
};
