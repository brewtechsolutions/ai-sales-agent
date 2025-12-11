import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTrpc } from "~/composables/useTrpc";
import { useCookie } from "#app";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'super_admin' | 'company_admin' | 'company_user';
  company_id?: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const client = useTrpc();
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const token = useCookie("token");

  const login = async (email: string, password: string) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await client.auth.login.mutate({ email, password });
      user.value = response.user;
      token.value = response.token;
      
      // Route based on user role after login
      const userRole = response.user.role;
      if (userRole === 'super_admin') {
        router.push("/admin/dashboard");
      } else if (userRole === 'company_admin') {
        router.push("/company/dashboard");
      } else if (userRole === 'company_user') {
        router.push("/agent/dashboard");
      } else {
        // Fallback to root (which will route based on role)
        router.push("/");
      }
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "An error occurred during login";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      loading.value = true;
      // Since logout endpoint might not exist, we'll just clear local state
      user.value = null;
      // Clear token cookie with proper options
      const tokenCookie = useCookie("token", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
      });
      tokenCookie.value = null;

      // Also clear user cookie
      const userCookie = useCookie("user", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
      });
      userCookie.value = null;

      router.push("/auth/login");
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "An error occurred during logout";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const checkAuth = async () => {
    try {
      loading.value = true;
      if (!token.value) {
        user.value = null;
        return false;
      }
      const response = await client.auth.me.query();
      user.value = response;
      return true;
    } catch (e) {
      user.value = null;
      token.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };
};
