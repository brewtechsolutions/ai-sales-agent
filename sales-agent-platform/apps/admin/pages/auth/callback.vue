<template>
  <div class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 dark:bg-primary/20">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
      </div>
      <p class="text-text-primary dark:text-dark-text-primary">Completing sign in...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta - Auth callback page
definePageMeta({
  layout: false,
  requiresAuth: false,
})

// Composables
const route = useRoute()
const { handleCallback } = useAuth0()
const { user, checkAuth } = useAuth()
const toast = useToast()
const token = useCookie('token')

// Route to dashboard based on role
function routeToDashboard(role: string) {
  if (role === 'super_admin') {
    return navigateTo('/admin/dashboard')
  } else if (role === 'company_admin') {
    return navigateTo('/company/dashboard')
  } else if (role === 'company_user') {
    return navigateTo('/agent/dashboard')
  }
  return navigateTo('/')
}

// Handle Auth0 callback
onMounted(async () => {
  try {
    const code = route.query.code as string
    const state = route.query.state as string
    const error = route.query.error as string

    if (error) {
      throw new Error(route.query.error_description as string || 'Authentication failed')
    }

    if (!code || !state) {
      throw new Error('Missing authorization code or state')
    }

    // Handle callback - this will exchange code for token and sync user
    const loggedInUser = await handleCallback(code, state)

    if (!loggedInUser) {
      throw new Error('Failed to get user information')
    }

    console.log('✅ Logged in user from backend:', loggedInUser)

    // Wait a bit for token cookie to be set (handleCallback sets it, but cookie reactivity might be delayed)
    await new Promise(resolve => setTimeout(resolve, 500))

    // Call checkAuth to get full user data including company_id
    // The googleLogin response doesn't include company_id, but getMe does
    // Note: checkAuth will handle missing token gracefully
    let authCheckResult = await checkAuth()
    
    // Retry once if it fails (might be a timing issue)
    if (!authCheckResult) {
      console.warn('⚠️ First checkAuth attempt failed, retrying...')
      await new Promise(resolve => setTimeout(resolve, 500))
      authCheckResult = await checkAuth()
    }
    
    let currentUser = user.value
    
    // If checkAuth failed but we have data from handleCallback, use that
    if (!currentUser && loggedInUser) {
      console.warn('⚠️ checkAuth failed, using data from handleCallback (company_id will be checked on dashboard)')
      // Manually set user data from handleCallback response
      const userRole = loggedInUser.role || 'company_user'
      const userRoles = loggedInUser.roles || (loggedInUser.role ? [loggedInUser.role] : ['company_user'])
      
      user.value = {
        ...loggedInUser,
        role: userRole,
        roles: userRoles,
        company_id: undefined, // Will be null if not set - will be checked on dashboard
      }
      currentUser = user.value
    }
    
    if (!currentUser) {
      throw new Error('Failed to load user data')
    }

    console.log('✅ Current user after checkAuth:', currentUser)
    console.log('✅ User role:', currentUser.role)
    console.log('✅ User roles array:', currentUser.roles)
    console.log('✅ User company_id:', currentUser.company_id)

    // Small delay to ensure state is fully set
    await new Promise(resolve => setTimeout(resolve, 200))

    // Check if user has a company (required for company_user and company_admin)
    const needsCompany = (currentUser.role === 'company_user' || currentUser.role === 'company_admin')
    const hasCompany = currentUser.company_id
    
    console.log('🏢 Company check:', { needsCompany, hasCompany, companyId: currentUser.company_id })

    // If user needs a company but doesn't have one, redirect to onboarding
    if (needsCompany && !hasCompany) {
      console.log('📝 User needs company setup, redirecting to onboarding')
      await navigateTo('/onboarding', { replace: true })
      return
    }

    // Check if user has multiple roles
    if (currentUser.roles && currentUser.roles.length > 1) {
      // User has multiple roles - redirect to portal selection
      console.log('🔄 User has multiple roles, redirecting to portal selection')
      await navigateTo('/auth/select-portal', { replace: true })
    } else {
      // Single role - route directly
      const roleToUse = currentUser.role || 'company_user'
      console.log('🚀 Routing to dashboard with role:', roleToUse)
      
      // Use replace: true to avoid adding callback page to history
      const dashboardPath = roleToUse === 'super_admin' 
        ? '/admin/dashboard'
        : roleToUse === 'company_admin'
        ? '/company/dashboard'
        : '/agent/dashboard'
      
      console.log('📍 Navigating to:', dashboardPath)
      await navigateTo(dashboardPath, { replace: true })
    }

    // Show success toast
    toast.add({
      title: 'Welcome!',
      description: 'You have been successfully logged in.',
      color: 'success',
      timeout: 3000
    })
  } catch (err: any) {
    console.error('Callback handling failed:', err)
    
    toast.add({
      title: 'Authentication failed',
      description: err?.message || 'Something went wrong. Please try again.',
      color: 'error',
      timeout: 5000
    })

    // Redirect to login after error
    await navigateTo('/auth/login')
  }
})
</script>

