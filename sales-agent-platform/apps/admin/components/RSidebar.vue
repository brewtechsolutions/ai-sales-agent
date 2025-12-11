<template>
  <!-- Backdrop for mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
    @click="$emit('update:isOpen', false)"
  />

  <aside
    class="fixed inset-y-0 left-0 z-50 w-48 md:w-64 bg-card dark:bg-dark-card border-r border-border dark:border-dark-border transform transition-transform duration-300 ease-in-out shadow-ios-lg"
    :class="[
      { '-translate-x-full': !isOpen },
      'lg:translate-x-0' // Always show on large screens
    ]"
  >
    <div class="flex flex-col h-full">
      <!-- Logo and Close Button -->
      <div class="flex items-center justify-center h-16 px-4 border-b border-border dark:border-dark-border">
        <span class="text-text-primary dark:text-dark-text-primary font-semibold">Template Demo</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-4 space-y-1">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          class="flex items-center px-4 py-2 text-sm font-medium rounded-ios transition-all duration-300"
          :class="[
            route.path === item.to
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'text-text-secondary dark:text-dark-text-secondary hover:bg-surface dark:hover:bg-dark-surface hover:text-text-primary dark:hover:text-dark-text-primary'
          ]"
        >
          <Icon :name="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-border dark:border-dark-border">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img
              class="w-8 h-8 rounded-full ring-2 ring-primary-200 dark:ring-primary-800"
              :src="`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`"
              :alt="user?.name || 'User'"
            >
            <div class="ml-3">
              <p class="text-sm font-medium text-text-primary dark:text-dark-text-primary">{{ user?.name || 'User' }}</p>
            </div>
          </div>
          <button
            class="flex items-center px-3 py-1.5 text-sm font-medium text-error dark:text-error-light hover:bg-error-light dark:hover:bg-error-dark rounded-ios transition-all duration-300"
            @click="handleLogout"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-1.5" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

const props = defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'update:isOpen', value: boolean): void
}>()

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const route = useRoute()
const authStore = useAuthStore()

// Determine navigation based on user role
const navigationItems = computed(() => {
  const user = authStore.user
  if (!user) return []

  // Super Admin navigation
  if (user.role === 'super_admin') {
    return [
      { name: 'Dashboard', to: '/admin/dashboard', icon: 'heroicons:home' },
      { name: 'Companies', to: '/admin/companies', icon: 'heroicons:building-office-2' },
      { name: 'Templates', to: '/admin/templates', icon: 'heroicons:document-text' },
      { name: 'Analytics', to: '/admin/analytics', icon: 'heroicons:chart-bar' },
    ]
  }

  // Company Admin navigation
  if (user.role === 'company_admin') {
    return [
      { name: 'Dashboard', to: '/company/dashboard', icon: 'heroicons:home' },
      { name: 'Conversations', to: '/company/conversations', icon: 'heroicons:chat-bubble-left-right' },
      { name: 'Users', to: '/company/users', icon: 'heroicons:users' },
      { name: 'Products', to: '/company/products', icon: 'heroicons:shopping-bag' },
      { name: 'AI Model', to: '/company/ai-model', icon: 'heroicons:sparkles' },
      { name: 'Templates', to: '/company/templates', icon: 'heroicons:document-text' },
      { name: 'Integrations', to: '/company/integrations', icon: 'heroicons:link' },
      { name: 'Analytics', to: '/company/analytics', icon: 'heroicons:chart-bar' },
    ]
  }

  // Company User (Agent) navigation
  return [
    { name: 'Dashboard', to: '/agent/dashboard', icon: 'heroicons:home' },
    { name: 'Conversations', to: '/agent/conversations', icon: 'heroicons:chat-bubble-left-right' },
    { name: 'Products', to: '/agent/products', icon: 'heroicons:shopping-bag' },
  ]
})

const handleLogout = async () => {
  authStore.logout()
  await navigateTo('/auth/login')
}
</script> 