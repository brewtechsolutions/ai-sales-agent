/**
 * Authentication Middleware
 * 
 * Handles:
 * - Redirecting unauthenticated users to login
 * - Redirecting authenticated users away from auth pages
 * - Role-based route protection (if route has requiredRole meta)
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { checkAuth, user } = useAuth();
  const isAuthenticated = await checkAuth();

  // If route requires auth and user is not authenticated, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return navigateTo("/auth/login");
  }

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (isAuthenticated && to.path.startsWith("/auth")) {
    // Route based on user role
    const userRole = user.value?.role;
    if (userRole === 'super_admin') {
      return navigateTo("/admin/dashboard");
    } else if (userRole === 'company_admin') {
      return navigateTo("/company/dashboard");
    } else if (userRole === 'company_user') {
      return navigateTo("/agent/dashboard");
    }
    // Fallback to root (which will route based on role)
    return navigateTo("/");
  }

  // Role-based access control
  if (to.meta.requiredRole && isAuthenticated && user.value) {
    const userRole = user.value.role;
    const requiredRole = to.meta.requiredRole;

    // Check if user has required role
    // super_admin can access everything
    if (userRole !== 'super_admin' && userRole !== requiredRole) {
      // User doesn't have required role - redirect to their dashboard
      if (userRole === 'company_admin') {
        return navigateTo("/company/dashboard");
      } else if (userRole === 'company_user') {
        return navigateTo("/agent/dashboard");
      }
      return navigateTo("/");
    }
  }
});
