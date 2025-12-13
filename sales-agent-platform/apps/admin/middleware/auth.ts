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

  // If user is authenticated and tries to access auth pages (except callback and select-portal), redirect to dashboard
  if (isAuthenticated && to.path.startsWith("/auth") && !to.path.includes("/callback") && !to.path.includes("/select-portal")) {
    // Check if user has multiple roles
    const userRoles = user.value?.roles || (user.value?.role ? [user.value.role] : []);
    
    if (userRoles.length > 1) {
      // Multiple roles - redirect to portal selection
      return navigateTo("/auth/select-portal");
    }
    
    // Single role - route based on user role
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
    const userRole = user.value.role; // Primary/current role
    const userRoles = user.value.roles || (userRole ? [userRole] : []); // All roles
    const requiredRole = to.meta.requiredRole;

    // Check if user has required role
    // super_admin can access everything
    const hasRequiredRole = userRoles.includes(requiredRole) || userRole === 'super_admin';
    
    if (!hasRequiredRole) {
      // User doesn't have required role
      // If user has multiple roles, redirect to portal selection
      if (userRoles.length > 1) {
        return navigateTo("/auth/select-portal");
      }
      
      // Otherwise redirect to their dashboard
      if (userRole === 'company_admin') {
        return navigateTo("/company/dashboard");
      } else if (userRole === 'company_user') {
        return navigateTo("/agent/dashboard");
      } else if (userRole === 'super_admin') {
        return navigateTo("/admin/dashboard");
      }
      return navigateTo("/");
    }
  }
  
  // If user has multiple roles and not on portal selection page, redirect to portal selection
  if (isAuthenticated && user.value && to.path !== '/auth/select-portal') {
    const userRoles = user.value.roles || (user.value.role ? [user.value.role] : []);
    if (userRoles.length > 1 && !to.path.startsWith('/auth/')) {
      // Check if current route matches one of the user's roles
      const routeRoleMap: Record<string, string> = {
        '/admin': 'super_admin',
        '/company': 'company_admin',
        '/agent': 'company_user',
      };
      
      const routeRole = Object.entries(routeRoleMap).find(([path]) => 
        to.path.startsWith(path)
      )?.[1];
      
      // If route requires a specific role and user's current role doesn't match, redirect to portal selection
      if (routeRole && user.value.role !== routeRole) {
        return navigateTo("/auth/select-portal");
      }
    }
  }
});
