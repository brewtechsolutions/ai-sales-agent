/**
 * Authentication Store (Zustand)
 * Manages authentication state and user data
 * Vue-compatible wrapper
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ref, computed } from "vue";

interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "company_admin" | "company_user";
  companyId?: string;
  avatarUrl?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Create Zustand store
const store = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Export store for direct use
export { store as authStore };

// Vue composable wrapper
export const useAuthStore = () => {
  // Use selector pattern for reactive state
  const user = computed(() => store.getState().user);
  const token = computed(() => store.getState().token);
  const isAuthenticated = computed(() => store.getState().isAuthenticated);
  const isLoading = computed(() => store.getState().isLoading);

  // Subscribe to changes for reactivity
  const userRef = ref(store.getState().user);
  const tokenRef = ref(store.getState().token);
  const isAuthenticatedRef = ref(store.getState().isAuthenticated);
  const isLoadingRef = ref(store.getState().isLoading);

  store.subscribe((state) => {
    userRef.value = state.user;
    tokenRef.value = state.token;
    isAuthenticatedRef.value = state.isAuthenticated;
    isLoadingRef.value = state.isLoading;
  });

  return {
    // Reactive state
    user: computed(() => userRef.value),
    token: computed(() => tokenRef.value),
    isAuthenticated: computed(() => isAuthenticatedRef.value),
    isLoading: computed(() => isLoadingRef.value),

    // Actions
    setUser: (user: User | null) => store.getState().setUser(user),
    setToken: (token: string | null) => store.getState().setToken(token),
    login: (user: User, token: string) => store.getState().login(user, token),
    logout: () => store.getState().logout(),
    setLoading: (loading: boolean) => store.getState().setLoading(loading),
  };
};
