import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTrpc } from "~/composables/useTrpc";
import { useCookie } from "#app";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string; // Primary/current role ('super_admin' | 'company_admin' | 'company_user')
  roles?: string[]; // Array of all roles (for users with multiple roles)
  company_id?: string | null;
  preferredRole?: string | null; // Preferred/default role for login
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
      
      // Store refresh token if provided
      if (response.refreshToken) {
        const refreshTokenCookie = useCookie("refreshToken", {
          maxAge: 60 * 60 * 24 * 400, // 400 days
          sameSite: "lax",
          secure: true,
        });
        refreshTokenCookie.value = response.refreshToken;
      }
      
      // Check if user has multiple roles
      const userRoles = response.user.roles || (response.user.role ? [response.user.role] : []);
      const preferredRole = (response.user as any).preferredRole;
      
      if (userRoles.length > 1) {
        // Multiple roles - check if preferred role is set
        if (preferredRole && userRoles.includes(preferredRole)) {
          // User has preferred role set - route directly to that portal
          const userRole = preferredRole;
          if (userRole === 'super_admin') {
            router.push("/admin/dashboard");
          } else if (userRole === 'company_admin') {
            router.push("/organization/dashboard");
          } else if (userRole === 'company_user') {
            router.push("/agent/dashboard");
          } else {
            router.push("/");
          }
        } else {
          // No preferred role - redirect to portal selection
          router.push("/auth/select-portal");
        }
      } else {
        // Single role - route directly
        const userRole = response.user.role;
        if (userRole === 'super_admin') {
          router.push("/admin/dashboard");
        } else if (userRole === 'company_admin') {
          router.push("/organization/dashboard");
        } else if (userRole === 'company_user') {
          router.push("/agent/dashboard");
        } else {
          router.push("/");
        }
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
      
      // Call backend logout to revoke refresh token (single login enforcement)
      try {
        await client.auth.logout.mutate();
      } catch (e) {
        // Continue with local cleanup even if backend call fails
        console.warn("Backend logout failed, continuing with local cleanup:", e);
      }
      
      // Clear local state
      user.value = null;
      
      // Clear token cookie
      const tokenCookie = useCookie("token", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
      });
      tokenCookie.value = null;

      // Clear refresh token cookie
      const refreshTokenCookie = useCookie("refreshToken", {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
      });
      refreshTokenCookie.value = null;

      // Clear user cookie
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
      
      try {
        const response = await client.auth.me.query();
        // Ensure roles is always an array
        if (response) {
          user.value = {
            ...response,
            roles: response.roles || (response.role ? [response.role] : []),
            preferredRole: (response as any).preferredRole || null,
          };
        } else {
          user.value = null;
        }
        return true;
      } catch (e: any) {
        console.error("Auth check failed:", e);
        // If token expired, try to refresh
        if (e?.data?.code === 'UNAUTHORIZED' || e?.message?.includes('token') || e?.message?.includes('Not authenticated')) {
          const refreshTokenCookie = useCookie("refreshToken");
          if (refreshTokenCookie.value) {
            try {
              const { refreshAccessToken } = useAuth0();
              await refreshAccessToken();
              // Retry getting user info
      const response = await client.auth.me.query();
              if (response) {
                user.value = {
                  ...response,
                  roles: response.roles || (response.role ? [response.role] : []),
                  preferredRole: (response as any).preferredRole || null,
                };
              } else {
                user.value = null;
              }
      return true;
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // Refresh failed - clear tokens and return false
              token.value = null;
              refreshTokenCookie.value = null;
              user.value = null;
              return false;
            }
          } else {
            // No refresh token - clear and return false
            token.value = null;
            user.value = null;
            return false;
          }
        }
        throw e;
      }
    } catch (e) {
      console.error("Auth check error:", e);
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
