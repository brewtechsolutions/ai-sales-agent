<template>
  <div class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background py-8 px-4 sm:px-6 lg:px-8">
    <!-- Main Container -->
    <div class="w-full max-w-md">
      <!-- Logo/Brand Section -->
      <div class="text-center mb-8 sm:mb-10 lg:mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-ios-xl bg-primary/10 dark:bg-primary/20 shadow-ios">
          <UIcon name="i-heroicons-user-plus" class="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-dark-text-primary tracking-tight mb-2 sm:mb-3">
          Create your account
        </h1>
        <p class="text-base sm:text-lg text-text-secondary dark:text-dark-text-secondary">
          Get started with your free account today
        </p>
      </div>

      <!-- Auth Card -->
      <div class="bg-card dark:bg-dark-card rounded-ios-xl shadow-ios-lg p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-ios-xl">
        <UForm :schema="schema" :state="state" class="space-y-5 sm:space-y-6" @submit="onSubmit">
          <!-- Full Name Field -->
          <UFormField label="Full name" name="name" class="space-y-2">
            <UInput
              v-model="state.name"
              type="text"
              placeholder="John Doe"
              icon="i-heroicons-user"
              size="lg"
              :disabled="isLoading"
              class="w-full"
              autocomplete="name"
              autofocus
            />
          </UFormField>

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
            />
          </UFormField>

          <!-- Password Field -->
          <UFormField label="Password" name="password" class="space-y-2">
            <UInput
              v-model="state.password"
              type="password"
              placeholder="At least 8 characters"
              icon="i-heroicons-lock-closed"
              size="lg"
              :disabled="isLoading"
              class="w-full"
              autocomplete="new-password"
            />
            <!-- Password Strength Indicator -->
            <div v-if="state.password" class="mt-2">
              <div class="flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  :class="cn(
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    getPasswordStrength() >= i
                      ? 'bg-success'
                      : 'bg-border dark:bg-dark-border'
                  )"
                />
              </div>
              <p class="text-xs text-text-secondary dark:text-dark-text-secondary">
                {{ getPasswordStrengthText() }}
              </p>
            </div>
          </UFormField>

          <!-- Confirm Password Field -->
          <UFormField label="Confirm password" name="confirmPassword" class="space-y-2">
            <UInput
              v-model="state.confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              icon="i-heroicons-lock-closed"
              size="lg"
              :disabled="isLoading"
              class="w-full"
              autocomplete="new-password"
            />
            <!-- Password Match Indicator -->
            <div v-if="state.confirmPassword && state.password" class="mt-2 flex items-center gap-2">
              <UIcon
                :name="state.password === state.confirmPassword ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="cn(
                  'w-4 h-4',
                  state.password === state.confirmPassword
                    ? 'text-success'
                    : 'text-error'
                )"
              />
              <span
                :class="cn(
                  'text-xs',
                  state.password === state.confirmPassword
                    ? 'text-success'
                    : 'text-error'
                )"
              >
                {{ state.password === state.confirmPassword ? 'Passwords match' : 'Passwords do not match' }}
              </span>
            </div>
          </UFormField>

          <!-- Terms & Conditions -->
          <div class="pt-2">
            <UCheckbox
              v-model="state.acceptTerms"
              name="acceptTerms"
              :disabled="isLoading"
              class="text-sm sm:text-base"
            >
              <span class="text-text-primary dark:text-dark-text-primary">
                I agree to the
                <a
                  href="/terms"
                  target="_blank"
                  class="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 underline-offset-2 hover:underline"
                >
                  Terms of Service
                </a>
                and
                <a
                  href="/privacy"
                  target="_blank"
                  class="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 underline-offset-2 hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </UCheckbox>
          </div>

          <!-- Submit Button -->
          <div class="pt-2 sm:pt-4">
            <InteractiveHoverButton
              type="submit"
              :text="isLoading ? 'Creating account...' : 'Create account'"
              :class="cn(
                'w-full h-12 sm:h-14 text-base sm:text-lg font-semibold',
                isLoading && 'opacity-75 cursor-not-allowed'
              )"
              :disabled="isLoading || !state.acceptTerms"
            />
          </div>
        </UForm>

        <!-- Divider -->
        <div class="flex items-center my-6 sm:my-8 gap-4">
          <div class="flex-1 h-px bg-border/30 dark:bg-dark-border/30"></div>
          <span class="text-sm sm:text-base text-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
            Already have an account?
          </span>
          <div class="flex-1 h-px bg-border/30 dark:bg-dark-border/30"></div>
        </div>

        <!-- Login Link -->
        <div class="text-center">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center justify-center w-full h-12 sm:h-14 px-6 rounded-ios-lg border-2 border-border dark:border-dark-border bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-card dark:hover:bg-dark-card hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-ios focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-card"
          >
            Sign in instead
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
import { useTrpc } from '~/composables/useTrpc'
import { cn } from '@/lib/utils'

// Meta
definePageMeta({
  layout: false,
  auth: false,
})

// Composables
const { login } = useAuth()
const client = useTrpc()
const isLoading = ref(false)
const toast = useToast()

// Form Schema
const schema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to continue'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type Schema = z.output<typeof schema>

// Form State
const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
  acceptTerms: false
})

// Password Strength Calculator
function getPasswordStrength(): number {
  if (!state.password) return 0
  
  let strength = 0
  
  // Length check
  if (state.password.length >= 8) strength++
  if (state.password.length >= 12) strength++
  
  // Complexity checks
  if (/[A-Z]/.test(state.password)) strength++
  if (/[a-z]/.test(state.password)) strength++
  if (/[0-9]/.test(state.password)) strength++
  if (/[^A-Za-z0-9]/.test(state.password)) strength++
  
  // Cap at 4 for visual indicator
  return Math.min(strength, 4)
}

function getPasswordStrengthText(): string {
  const strength = getPasswordStrength()
  
  if (strength === 0) return 'Enter a password'
  if (strength <= 1) return 'Weak password'
  if (strength <= 2) return 'Fair password'
  if (strength <= 3) return 'Good password'
  return 'Strong password'
}

// Submit Handler
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    
    // Call tRPC register mutation
    await client.auth.register.mutate({
      name: event.data.name,
      email: event.data.email,
      password: event.data.password
    })

    // Login with the new credentials
    await login(event.data.email, event.data.password)

    toast.add({ 
      title: 'Account created!', 
      description: 'Your account has been created successfully. Welcome!', 
      color: 'success',
      timeout: 3000
    })
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    await navigateTo('/')
  } catch (error: any) {
    console.error('Registration failed:', error)
    
    // More user-friendly error messages
    let errorMessage = 'Something went wrong. Please try again in a moment.'
    
    if (error?.message?.includes('email') || error?.message?.includes('Email')) {
      errorMessage = 'This email is already registered. Please sign in or use a different email.'
    } else if (error?.message?.includes('password')) {
      errorMessage = 'Password requirements not met. Please check and try again.'
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    toast.add({ 
      title: 'Registration failed', 
      description: errorMessage, 
      color: 'error',
      timeout: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script> 