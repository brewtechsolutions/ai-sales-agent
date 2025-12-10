<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background dark:bg-dark-background">
    <div class="max-w-md w-full space-y-8 bg-card dark:bg-dark-card p-10 rounded-ios-lg shadow-ios-lg border border-border dark:border-dark-border">
      <div class="text-center">
        <h2 class="mt-6 text-4xl font-bold text-text-primary dark:text-dark-text-primary tracking-tight">
          Welcome back
        </h2>
        <p class="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary">
          Or
          <NuxtLink to="/auth/register" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300">
            create a new account
          </NuxtLink>
        </p>
      </div>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" class="w-full" type="password" />
        </UFormField>

        <div class="flex items-center justify-between">
          <UCheckbox
            v-model="state.rememberMe"
            label="Remember me"
            name="rememberMe"
          />
          <NuxtLink to="/auth/forgot-password" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300">
            Forgot password?
          </NuxtLink>
        </div>

        <InteractiveHoverButton
          type="submit"
          text="Sign in"
          :loading="isLoading"
          class="w-full"
          icon="i-heroicons-arrow-right-on-rectangle"
        >
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </InteractiveHoverButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { login } = useAuth()
const isLoading = ref(false)
const toast = useToast()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  rememberMe: z.boolean().default(false)
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
  rememberMe: false
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isLoading.value = true
    
    await login(event.data.email, event.data.password)
    
    toast.add({ 
      title: 'Success', 
      description: 'You have been successfully logged in.', 
      color: 'success' 
    })
    await navigateTo('/')
  } catch (error) {
    console.error('Login failed:', error)
    toast.add({ 
      title: 'Error', 
      description: 'Invalid email or password.', 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}
</script> 