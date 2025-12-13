<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from '~/composables/useUser'

const route = useRoute()
const { loadUser } = useUser()

onMounted(async () => {
  // Don't redirect on auth pages (login, register, callback, etc.)
  if (route.path.startsWith('/auth')) {
    return
  }

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
