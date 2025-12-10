<template>
  <div class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-card dark:bg-dark-card p-8 rounded-ios-lg shadow-ios-lg border border-border dark:border-dark-border">
      <div class="text-center">
        <h2 class="mt-6 text-4xl font-bold text-text-primary dark:text-dark-text-primary tracking-tight">
          Create your account
        </h2>
        <p class="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary">
          Or
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-300">
            sign in to your account
          </NuxtLink>
        </p>
      </div>
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Full name" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Email address" name="email">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UFormField label="Confirm password" name="confirmPassword">
          <UInput v-model="state.confirmPassword" type="password" class="w-full" />
        </UFormField>

        <UCheckbox
          v-model="state.acceptTerms"
          label="I agree to the Terms of Service and Privacy Policy"
          name="acceptTerms"
        />

        <InteractiveHoverButton
          type="submit"
          text="Create account"
          :loading="isLoading"
          class="w-full"
          icon="i-heroicons-user-plus"
        >
          {{ isLoading ? 'Creating account...' : 'Create account' }}
        </InteractiveHoverButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useTrpc } from '~/composables/useTrpc'

const { login } = useAuth()
const client = useTrpc()
const isLoading = ref(false)
const toast = useToast()

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
  acceptTerms: false
})

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
      title: 'Success', 
      description: 'Your account has been created successfully.', 
      color: 'success' 
    })
    await navigateTo('/')
  } catch (error) {
    console.error('Registration failed:', error)
    toast.add({ 
      title: 'Error', 
      description: 'Failed to create account. Please try again.', 
      color: 'error' 
    })
  } finally {
    isLoading.value = false
  }
}
</script> 