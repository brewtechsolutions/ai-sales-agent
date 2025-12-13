<template>
  <div class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background py-8 px-4 sm:px-6 lg:px-8">
    <!-- Main Container -->
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-8 sm:mb-10 lg:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-ios-xl bg-primary/10 dark:bg-primary/20 shadow-ios">
          <UIcon name="i-heroicons-building-office-2" class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-dark-text-primary tracking-tight mb-2 sm:mb-3">
          Select Portal
        </h1>
        <p class="text-base sm:text-lg text-text-secondary dark:text-dark-text-secondary">
          You have access to multiple portals. Choose which one you'd like to access.
        </p>
      </div>

      <!-- Portal Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <!-- Super Admin Portal -->
        <div
          v-if="availableRoles.includes('super_admin')"
          class="group relative bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-ios-xl border-2 border-transparent hover:border-primary/50 dark:hover:border-primary/50"
        >
          <button
            @click="selectRole('super_admin', false)"
            :disabled="isLoading"
            class="w-full flex flex-col items-center text-center space-y-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-ios-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
              <UIcon name="i-heroicons-shield-check" class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Platform Admin
              </h3>
              <p class="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary">
                Manage all companies and platform settings
              </p>
            </div>
          </button>
          <!-- Set as Default Toggle -->
          <div class="mt-4 pt-4 border-t border-border/50 dark:border-dark-border/50 flex items-center justify-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="preferredRole === 'super_admin'"
                @change="togglePreferredRole('super_admin', $event)"
                :disabled="isLoading"
                class="w-4 h-4 rounded border-border dark:border-dark-border text-primary focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              />
              <span class="text-xs sm:text-sm text-text-secondary dark:text-dark-text-secondary">
                Set as default
              </span>
            </label>
          </div>
        </div>

        <!-- Company Admin Portal -->
        <div
          v-if="availableRoles.includes('company_admin')"
          class="group relative bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-ios-xl border-2 border-transparent hover:border-primary/50 dark:hover:border-primary/50"
        >
          <button
            @click="selectRole('company_admin', false)"
            :disabled="isLoading"
            class="w-full flex flex-col items-center text-center space-y-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-ios-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
              <UIcon name="i-heroicons-building-office" class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Company Admin
              </h3>
              <p class="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary">
                Manage your company, users, and settings
              </p>
            </div>
          </button>
          <!-- Set as Default Toggle -->
          <div class="mt-4 pt-4 border-t border-border/50 dark:border-dark-border/50 flex items-center justify-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="preferredRole === 'company_admin'"
                @change="togglePreferredRole('company_admin', $event)"
                :disabled="isLoading"
                class="w-4 h-4 rounded border-border dark:border-dark-border text-primary focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              />
              <span class="text-xs sm:text-sm text-text-secondary dark:text-dark-text-secondary">
                Set as default
              </span>
            </label>
          </div>
        </div>

        <!-- Company User Portal -->
        <div
          v-if="availableRoles.includes('company_user')"
          class="group relative bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-ios-xl border-2 border-transparent hover:border-primary/50 dark:hover:border-primary/50"
        >
          <button
            @click="selectRole('company_user', false)"
            :disabled="isLoading"
            class="w-full flex flex-col items-center text-center space-y-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-ios-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
              <UIcon name="i-heroicons-user" class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div>
              <h3 class="text-xl sm:text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2">
                Sales Agent
              </h3>
              <p class="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary">
                Handle conversations and manage leads
              </p>
            </div>
          </button>
          <!-- Set as Default Toggle -->
          <div class="mt-4 pt-4 border-t border-border/50 dark:border-dark-border/50 flex items-center justify-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="preferredRole === 'company_user'"
                @change="togglePreferredRole('company_user', $event)"
                :disabled="isLoading"
                class="w-4 h-4 rounded border-border dark:border-dark-border text-primary focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              />
              <span class="text-xs sm:text-sm text-text-secondary dark:text-dark-text-secondary">
                Set as default
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Logout Option -->
      <div class="mt-8 sm:mt-10 text-center">
        <button
          @click="handleLogout"
          class="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary transition-colors duration-200"
        >
          Sign out and use a different account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta - Requires authentication
definePageMeta({
  layout: false,
  middleware: 'auth',
  requiresAuth: true,
})

// Composables
const { user, logout, checkAuth } = useAuth()
const client = useTrpc()
const isLoading = ref(false)
const toast = useToast()

// Get available roles
const availableRoles = computed(() => {
  if (!user.value?.roles) {
    return user.value?.role ? [user.value.role] : []
  }
  return Array.isArray(user.value.roles) ? user.value.roles : []
})

// Get preferred role
const preferredRole = computed(() => {
  return (user.value as any)?.preferredRole || null
})

// Route to dashboard based on role
function routeToDashboard(role: string) {
  if (role === 'super_admin') {
    return navigateTo('/admin/dashboard')
  } else if (role === 'company_admin') {
    return navigateTo('/organization/dashboard')
  } else if (role === 'company_user') {
    return navigateTo('/agent/dashboard')
  }
  return navigateTo('/')
}

// Select role/portal
async function selectRole(role: string, setAsDefault: boolean = false) {
  try {
    isLoading.value = true

    // Update role in backend
    const result = await client.auth.selectPortal.mutate({ role, setAsDefault })

    // Update local user state with fresh data from backend
    if (user.value && result.user) {
      user.value.role = result.user.role
      user.value.roles = result.user.roles
      ;(user.value as any).preferredRole = result.user.preferredRole
    }

    // Refresh auth to get latest user data
    await checkAuth()

    // Route to selected portal
    await routeToDashboard(role)

    toast.add({
      title: 'Portal selected',
      description: setAsDefault 
        ? `You are now accessing the ${role.replace('_', ' ')} portal. This will be your default portal.`
        : `You are now accessing the ${role.replace('_', ' ')} portal.`,
      color: 'success',
      timeout: 3000
    })
  } catch (err: any) {
    console.error('Failed to select portal:', err)
    toast.add({
      title: 'Failed to select portal',
      description: err?.message || 'Something went wrong. Please try again.',
      color: 'error',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}

// Toggle preferred role (set/remove default)
async function togglePreferredRole(role: string, event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  
  try {
    isLoading.value = true

    // Set or remove preferred role
    const result = await client.auth.setPreferredRole.mutate({
      role,
      setAsDefault: checked,
    })

    // Update local user state
    if (user.value && result.user) {
      ;(user.value as any).preferredRole = result.user.preferredRole
    }

    // Refresh auth to get latest user data
    await checkAuth()

    toast.add({
      title: checked ? 'Default portal set' : 'Default portal removed',
      description: checked
        ? `This portal will be your default login interface.`
        : `Default portal preference removed.`,
      color: 'success',
      timeout: 3000
    })
  } catch (err: any) {
    console.error('Failed to set preferred role:', err)
    toast.add({
      title: 'Failed to update preference',
      description: err?.message || 'Something went wrong. Please try again.',
      color: 'error',
      timeout: 5000
    })
    // Revert checkbox
    ;(event.target as HTMLInputElement).checked = !checked
  } finally {
    isLoading.value = false
  }
}

// Logout handler
async function handleLogout() {
  await logout()
  await navigateTo('/auth/login')
}
</script>

