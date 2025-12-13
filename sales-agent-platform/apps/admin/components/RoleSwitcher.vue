<template>
  <div v-if="hasMultipleRoles" class="relative">
    <!-- Role Switcher Button -->
    <button
      @click="showDropdown = !showDropdown"
      class="
        w-full
        flex items-center justify-between
        px-3 py-2
        bg-surface dark:bg-dark-surface
        border border-border dark:border-dark-border
        rounded-ios-lg
        text-sm font-medium
        text-text-primary dark:text-dark-text-primary
        transition-all duration-300
        hover:bg-card dark:hover:bg-dark-card
        hover:border-primary/50 dark:hover:border-primary/50
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card
      "
    >
      <div class="flex items-center gap-2">
        <Icon name="heroicons:swatch" class="w-4 h-4 text-primary" />
        <span class="capitalize">{{ currentRoleLabel }}</span>
      </div>
      <Icon
        name="heroicons:chevron-down"
        class="w-4 h-4 text-text-secondary dark:text-dark-text-secondary transition-transform duration-300"
        :class="{ 'rotate-180': showDropdown }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="showDropdown"
        class="
          absolute bottom-full left-0 right-0 mb-2
          bg-card dark:bg-dark-card
          border border-border dark:border-dark-border
          rounded-ios-lg shadow-ios-xl
          overflow-hidden
          z-50
        "
      >
        <div class="p-2 space-y-1">
          <div class="px-3 py-2 text-xs font-semibold text-text-secondary dark:text-dark-text-secondary uppercase tracking-wider">
            Switch Portal
          </div>
          <button
            v-for="roleOption in availableRoles"
            :key="roleOption.value"
            @click="switchRole(roleOption.value)"
            :disabled="isLoading || roleOption.value === currentRole"
            class="
              w-full
              flex items-center gap-3
              px-3 py-2
              rounded-ios
              text-sm font-medium
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-surface dark:hover:bg-dark-surface
            "
            :class="
              roleOption.value === currentRole
                ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                : 'text-text-primary dark:text-dark-text-primary'
            "
          >
            <Icon :name="roleOption.icon" class="w-4 h-4" />
            <span class="flex-1 text-left capitalize">{{ roleOption.label }}</span>
            <div class="flex items-center gap-2">
              <Icon
                v-if="roleOption.value === preferredRole"
                name="heroicons:star"
                class="w-4 h-4 text-warning"
                title="Default portal"
              />
              <Icon
                v-if="roleOption.value === currentRole"
                name="heroicons:check"
                class="w-4 h-4 text-primary"
              />
            </div>
          </button>
          <!-- Set as Default Option -->
          <div class="px-3 py-2 border-t border-border/50 dark:border-dark-border/50">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="preferredRole === currentRole"
                @change="togglePreferredRole($event)"
                :disabled="isLoading"
                class="w-4 h-4 rounded border-border dark:border-dark-border text-primary focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
              />
              <span class="text-xs text-text-secondary dark:text-dark-text-secondary">
                Set current as default
              </span>
            </label>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useTrpc } from '~/composables/useTrpc'
import { useToast } from '#app'

const { user, checkAuth } = useAuth()
const trpc = useTrpc()
const toast = useToast()

const showDropdown = ref(false)
const isLoading = ref(false)

// Role configuration
const roleConfig = {
  super_admin: {
    label: 'Platform Admin',
    icon: 'heroicons:shield-check',
    route: '/admin/dashboard',
  },
  company_admin: {
    label: 'Company Admin',
    icon: 'heroicons:building-office',
    route: '/organization/dashboard',
  },
  company_user: {
    label: 'Sales Agent',
    icon: 'heroicons:user',
    route: '/agent/dashboard',
  },
}

// Current role
const currentRole = computed(() => user.value?.role || '')

// Preferred role
const preferredRole = computed(() => {
  return (user.value as any)?.preferredRole || null
})

// Current role label
const currentRoleLabel = computed(() => {
  return roleConfig[currentRole.value as keyof typeof roleConfig]?.label || currentRole.value.replace('_', ' ')
})

// Available roles (all roles user has)
const availableRoles = computed(() => {
  const userRoles = user.value?.roles || (user.value?.role ? [user.value.role] : [])
  return userRoles
    .map(role => ({
      value: role,
      label: roleConfig[role as keyof typeof roleConfig]?.label || role.replace('_', ' '),
      icon: roleConfig[role as keyof typeof roleConfig]?.icon || 'heroicons:user',
      route: roleConfig[role as keyof typeof roleConfig]?.route || '/',
    }))
    .filter(Boolean)
})

// Check if user has multiple roles
const hasMultipleRoles = computed(() => {
  const userRoles = user.value?.roles || (user.value?.role ? [user.value.role] : [])
  return userRoles.length > 1
})

// Switch role
async function switchRole(role: string) {
  if (role === currentRole.value || isLoading.value) {
    showDropdown.value = false
    return
  }

  try {
    isLoading.value = true
    showDropdown.value = false

    // Update role in backend
    const result = await trpc.auth.selectPortal.mutate({ role })

    // Update local user state
    if (user.value && result.user) {
      user.value.role = result.user.role
      user.value.roles = result.user.roles
      ;(user.value as any).preferredRole = result.user.preferredRole
    }

    // Refresh auth to get latest user data
    await checkAuth()

    // Route to selected portal
    const route = roleConfig[role as keyof typeof roleConfig]?.route || '/'
    await navigateTo(route)

    toast.add({
      title: 'Portal switched',
      description: `You are now accessing the ${roleConfig[role as keyof typeof roleConfig]?.label || role} portal.`,
      color: 'success',
      timeout: 3000
    })
  } catch (err: any) {
    console.error('Failed to switch portal:', err)
    toast.add({
      title: 'Failed to switch portal',
      description: err?.message || 'Something went wrong. Please try again.',
      color: 'error',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}

// Toggle preferred role
async function togglePreferredRole(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  
  try {
    isLoading.value = true

    // Set or remove preferred role
    const result = await trpc.auth.setPreferredRole.mutate({
      role: currentRole.value,
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

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      showDropdown.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
