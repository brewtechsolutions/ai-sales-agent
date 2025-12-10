import { ref } from "vue";
import { useTrpc } from "./useTrpc";
import { useCookie } from "#app";

interface User {
  id: string;
  name: string | null;
  email: string;
}

export const useUser = () => {
  const client = useTrpc();
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const userCookie = useCookie<User | null>("user", {
    default: () => null,
    watch: true,
  });

  const loadUser = async () => {
    try {
      isLoading.value = true;
      const data = await client.auth.me.query();
      user.value = data;
      userCookie.value = data;
      return data;
    } catch (error) {
      console.error("Failed to load user:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      isLoading.value = true;
      user.value = null;

      // Clear user cookie with proper options
      const userCookie = useCookie("user", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
      });
      userCookie.value = null;

      // Also clear token cookie
      const tokenCookie = useCookie("token", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
      });
      tokenCookie.value = null;

      await navigateTo("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Load user from cookie on initialization
  if (import.meta.client) {
    const storedUser = userCookie.value;
    if (storedUser) {
      user.value = storedUser;
    }
  }

  return {
    user,
    isLoading,
    loadUser,
    logout,
  };
};
