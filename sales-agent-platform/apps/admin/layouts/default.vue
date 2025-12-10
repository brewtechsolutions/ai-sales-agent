<template>
  <div v-if="isAuthRoute" class="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background">
    <slot />
  </div>
  <div v-else class="min-h-screen bg-background dark:bg-dark-background">
    <RSidebar :is-open="isSidebarOpen" @update:is-open="isSidebarOpen = $event" />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 lg:pl-48 md:lg:pl-64">
      <!-- Mobile Header -->
      <div class="lg:hidden flex items-center justify-between p-4 border-b border-border dark:border-dark-border bg-card dark:bg-dark-card">
        <button
          class="p-2 rounded-ios hover:bg-surface dark:hover:bg-dark-surface transition-all duration-300 text-text-primary dark:text-dark-text-primary"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <Icon :name="isSidebarOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
        </button>
      </div>

      <!-- Page Content -->
      <main class="flex-1 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isSidebarOpen = ref(false)

// Auto-close sidebar on mobile when route changes
watch(() => route.path, () => {
  if (window.innerWidth < 1024) { // lg breakpoint
    isSidebarOpen.value = false
  }
})

const isAuthRoute = computed(() => {
  return route.path.startsWith('/auth')
})
</script> 