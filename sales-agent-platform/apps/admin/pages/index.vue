<template>
  <div class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 dark:bg-primary/20">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
      </div>
      <p class="text-text-primary dark:text-dark-text-primary">Redirecting...</p>
      </div>
    </div>
</template>

<script setup lang="ts">
// Meta - This page requires authentication
definePageMeta({
  middleware: 'auth',
  requiresAuth: true,
})

// Composables
const { user, checkAuth } = useAuth()
const router = useRouter()

// Check authentication and route based on user role
onMounted(async () => {
  // Check if user is authenticated
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    // Not authenticated - redirect to login
    await navigateTo('/auth/login')
    return
  }

  // User is authenticated - route based on role
  if (!user.value) {
    // User data not loaded yet, wait a bit
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const userRole = user.value?.role
  const userRoles = user.value?.roles || (userRole ? [userRole] : [])

  // If user has multiple roles, redirect to portal selection
  if (userRoles.length > 1) {
    await navigateTo('/auth/select-portal')
    return
  }

  // Route based on user role
  switch (userRole) {
    case 'super_admin':
      await navigateTo('/admin/dashboard')
      break
    case 'company_admin':
      await navigateTo('/company/dashboard')
      break
    case 'company_user':
      await navigateTo('/agent/dashboard')
      break
    default:
      // Unknown role or no role - redirect to login
      console.warn('Unknown user role:', userRole)
      await navigateTo('/auth/login')
  }
})
</script> 