<template>
  <div class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background py-8 px-4 sm:px-6 lg:px-8">
    <!-- Main Container -->
    <div class="w-full max-w-md">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8 sm:mb-10 lg:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-ios-xl bg-primary/10 dark:bg-primary/20 shadow-ios">
          <UIcon name="i-heroicons-lock-closed" class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-dark-text-primary tracking-tight mb-2 sm:mb-3">
          {{ appName }}
        </h1>
        <p class="text-base sm:text-lg text-text-secondary dark:text-dark-text-secondary">
          Sign in to access your dashboard
        </p>
      </div>

      <!-- Auth Card -->
      <div class="bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-lg p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-ios-xl">
        <UForm :schema="schema" :state="state" class="space-y-5 sm:space-y-6" @submit="onSubmit">
          <!-- Email Field -->
          <UFormField label="Email address" name="email" class="space-y-2">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="you@example.com"
              icon="i-heroicons-envelope"
              size="lg"
              :disabled="isLoading"
              class="w-full"
              autocomplete="email"
              autofocus
            />
        </UFormField>

          <!-- Password Field -->
          <UFormField label="Password" name="password" class="space-y-2">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="Enter your password"
              icon="i-heroicons-lock-closed"
              size="lg"
              :disabled="isLoading"
              class="w-full"
              autocomplete="current-password"
            />
        </UFormField>

          <!-- Remember Me & Forgot Password -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-1">
          <UCheckbox
            v-model="state.rememberMe"
            label="Remember me"
            name="rememberMe"
              :disabled="isLoading"
              class="text-sm sm:text-base"
          />
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm sm:text-base font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card rounded-md px-1 -mx-1"
            >
            Forgot password?
          </NuxtLink>
        </div>

          <!-- Submit Button -->
          <div class="pt-2 sm:pt-4">
        <InteractiveHoverButton
          type="submit"
              :text="isLoading ? 'Signing in...' : 'Sign in'"
              :class="cn(
                'w-full h-12 sm:h-14 text-base sm:text-lg font-semibold',
                isLoading && 'opacity-75 cursor-not-allowed'
              )"
              :disabled="isLoading"
            />
          </div>
        </UForm>

        <!-- Divider -->
        <div class="flex items-center my-6 sm:my-8 gap-4">
          <div class="flex-1 h-px bg-border/30 dark:bg-dark-border/30"></div>
          <span class="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
            Or continue with
          </span>
          <div class="flex-1 h-px bg-border/30 dark:bg-dark-border/30"></div>
        </div>

        <!-- Google Login Icon -->
        <div class="flex justify-center pt-2 sm:pt-4">
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="isLoading || isGoogleLoading"
            aria-label="Sign in with Google"
            class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-white dark:bg-white shadow-ios-lg flex items-center justify-center transition-all duration-300 hover:shadow-ios-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-ios-lg disabled:active:scale-100 relative"
          >
            <!-- Loading Spinner -->
            <div
              v-if="isGoogleLoading"
              class="absolute inset-0 flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 animate-spin text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <!-- Google Icon -->
            <UIcon 
              v-else
              name="i-simple-icons-google" 
              class="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 transition-opacity duration-300" 
            />
          </button>
        </div>
      </div>

      <!-- Footer Help Text -->
      <p class="mt-6 sm:mt-8 text-center text-sm sm:text-base text-text-tertiary dark:text-dark-text-secondary">
        Need help? 
        <a href="mailto:support@example.com" class="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200">
          Contact support
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { cn } from '@/lib/utils'

// Meta - Auth pages should not require authentication
definePageMeta({
  layout: false,
  requiresAuth: false,
})

// Composables
const { loginWithEmail, loginWithGoogle, loading, error, isConfigured } = useAuth0()
const { checkAuth, user } = useAuth()
const isLoading = computed(() => loading.value)
const toast = useToast()
const config = useRuntimeConfig()
const appName = computed(() => config.public.appName || 'Sales Agent Platform')

// Google Login Loading State
const isGoogleLoading = ref(false)

// Form Schema
const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false)
})

type Schema = z.output<typeof schema>

// Form State
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  rememberMe: false
})

// Submit Handler - Email/Password Login via Auth0
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    if (!isConfigured.value) {
      toast.add({
        title: 'Configuration Error',
        description: 'Auth0 is not configured. Please contact support.',
        color: 'error',
        timeout: 5000
      })
      return
    }

    const loggedInUser = await loginWithEmail(event.data.email, event.data.password)
    
    // Check if user has multiple roles - show portal selection
    await checkAuth()
    const currentUser = user.value
    
    if (currentUser?.roles && currentUser.roles.length > 1) {
      // User has multiple roles - redirect to portal selection
      await navigateTo('/auth/select-portal')
    } else {
      // Single role - route directly
      await routeToDashboard(currentUser?.role || loggedInUser.role)
    }
    
    toast.add({ 
      title: 'Welcome back!', 
      description: 'You have been successfully logged in.', 
      color: 'success',
      timeout: 3000
    })
  } catch (err: any) {
    console.error('Login failed:', err)
    
    const errorMessage = err?.message?.includes('Invalid') || err?.message?.includes('password')
      ? 'Invalid email or password. Please check your credentials and try again.'
      : err?.message || 'Something went wrong. Please try again in a moment.'
    
    toast.add({ 
      title: 'Sign in failed', 
      description: errorMessage, 
      color: 'error',
      timeout: 5000
    })
  }
}

// Google Login Handler
async function handleGoogleLogin() {
  // Prevent multiple clicks
  if (isGoogleLoading.value || isLoading.value) {
    return
  }

  try {
    if (!isConfigured.value) {
      toast.add({
        title: 'Configuration Error',
        description: 'Auth0 is not configured. Please contact support.',
        color: 'error',
        timeout: 5000
      })
      return
    }

    // Set loading state immediately
    isGoogleLoading.value = true

    await loginWithGoogle()
    // User will be redirected to Auth0, then to callback page
    // Note: The redirect happens so fast that loading state might not be visible,
    // but it prevents multiple clicks
  } catch (err: any) {
    console.error('Google login failed:', err)
    isGoogleLoading.value = false // Reset on error
    
    toast.add({
      title: 'Google login failed',
      description: err?.message || 'Something went wrong. Please try again.',
      color: 'error',
      timeout: 5000
    })
  }
}

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
</script> 