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
          Welcome back
        </h1>
        <p class="text-base sm:text-lg text-text-secondary dark:text-dark-text-secondary">
          Sign in to continue to your account
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
            New to our platform?
          </span>
          <div class="flex-1 h-px bg-border/30 dark:bg-dark-border/30"></div>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <NuxtLink
            to="/auth/register"
            class="inline-flex items-center justify-center w-full h-12 sm:h-14 px-6 rounded-ios-lg border-2 border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-card dark:hover:bg-dark-card hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-ios focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card"
          >
            Create an account
          </NuxtLink>
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

// Meta
definePageMeta({
  layout: false,
  auth: false,
})

// Composables
const { login } = useAuth()
const isLoading = ref(false)
const toast = useToast()

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

// Submit Handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    
    await login(event.data.email, event.data.password)
    
    toast.add({ 
      title: 'Welcome back!', 
      description: 'You have been successfully logged in.', 
      color: 'success',
      timeout: 3000
    })
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    await navigateTo('/')
  } catch (error: any) {
    console.error('Login failed:', error)
    
    // More user-friendly error messages
    const errorMessage = error?.message?.includes('Invalid') 
      ? 'Invalid email or password. Please check your credentials and try again.'
      : 'Something went wrong. Please try again in a moment.'
    
    toast.add({ 
      title: 'Sign in failed', 
      description: errorMessage, 
      color: 'error',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script> 