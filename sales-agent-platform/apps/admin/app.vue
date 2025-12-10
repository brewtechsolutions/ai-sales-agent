<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '~/composables/useUser'

const { loadUser } = useUser()

onMounted(async () => {
  // Try to load user data
  const loadedUser = await loadUser()
  
  if (loadedUser) {
    // User is authenticated, redirect to dashboard
    await navigateTo('/')
  } else {
    // User is not authenticated, redirect to login
    await navigateTo('/auth/login')
  }
})
</script>
