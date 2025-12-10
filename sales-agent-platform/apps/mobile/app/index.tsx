import "../global.css";

import { Redirect, SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  SplashScreen.hideAsync();

  return <Redirect href="/login" />;
}
