export default defineNuxtRouteMiddleware(async (to) => {
  const { checkAuth } = useAuth();
  const isAuthenticated = await checkAuth();

  // If the route requires auth and user is not authenticated, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return navigateTo("/auth/login");
  }

  // If user is authenticated and tries to access auth pages, redirect to home
  if (isAuthenticated && to.path.startsWith("/auth")) {
    return navigateTo("/");
  }
});
