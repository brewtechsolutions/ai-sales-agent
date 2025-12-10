<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between p-4 md:p-6">
      <h2 class="text-2xl font-semibold text-text-primary dark:text-dark-text-primary">{{ title }}</h2>
      <UButton
        v-if="canCreate"
        color="primary"
        icon="i-heroicons-plus"
        class="transition-all duration-300 hover:shadow-ios-lg"
        @click="$emit('create')"
      >
        Add New
      </UButton>
    </div>

    <!-- Table -->
    <div class="bg-card dark:bg-dark-card rounded-ios-lg shadow-ios border border-border dark:border-dark-border overflow-hidden">
      <UTable
        :data="data"
        :columns="columns"
        :loading="loading"
      />

      <!-- Pagination -->
      <div class="px-4 md:px-6 py-4 border-t border-border dark:border-dark-border">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-text-secondary dark:text-dark-text-secondary">Show</span>
            <USelect
              v-model="localPageSize"
              :items="[10, 25, 50, 100]"
              class="w-24"
            />
            <span class="text-sm text-text-secondary dark:text-dark-text-secondary">entries</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-text-secondary dark:text-dark-text-secondary">
              {{ startIndex + 1 }}-{{ endIndex }} of {{ totalItems }}
            </span>
            <div class="flex space-x-1">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-chevron-left"
                :disabled="currentPage === 1"
                @click="$emit('update:currentPage', currentPage - 1)"
              />
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-heroicons-chevron-right"
                :disabled="currentPage === totalPages"
                @click="$emit('update:currentPage', currentPage + 1)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableColumn } from '@nuxt/ui'

interface Props<T = Record<string, unknown>> {
  title: string
  data: (T | null)[]
  columns: TableColumn<T>[]
  canCreate?: boolean
  loading?: boolean
  error?: Error | null
  currentPage?: number
  pageSize?: number
  totalItems?: number
}

const props = withDefaults(defineProps<Props>(), {
  canCreate: false,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalItems: 0
})

const emit = defineEmits(['create', 'update:currentPage', 'update:pageSize'])

const localPageSize = ref(props.pageSize)

watch(localPageSize, (newValue) => {
  emit('update:pageSize', newValue)
})

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))
const startIndex = computed(() => (props.currentPage - 1) * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, props.totalItems))
</script>
