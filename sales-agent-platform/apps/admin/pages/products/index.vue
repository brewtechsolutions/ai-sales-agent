<template>
  <div class="space-y-6">
    <!-- Data Table -->
    <div v-if="!loading">
      <RTable
        title="Products"
        :data="products"
        :columns="columns"
        :can-create="true"
        :loading="loading"
        :error="error"
        :current-page="currentPage"
        :page-size="pageSize"
        :total-items="totalItems"
        @create="openCreateModal"
        @update:current-page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- Create/Edit Modal -->
    <UModal
      v-model:open="isModalOpen"
      :title="isEditing ? 'Edit Product' : 'Create Product'"
      class="max-w-2xl"
    >
      <template #body>
        <UForm :state="form" class="space-y-6">
          <UFormField label="Name" class="space-y-2">
            <UInput
              v-model="form.name"
              placeholder="Enter product name"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="Description" class="space-y-2">
            <UTextarea
              v-model="form.description"
              placeholder="Enter product description"
              class="w-full"
            />
          </UFormField>
          <div class="grid grid-cols-2 gap-6">
            <UFormField label="Price" class="space-y-2">
              <UInput
                v-model.number="form.price"
                type="number"
                placeholder="Enter product price"
                required
                class="w-full"
              />
            </UFormField>
            <UFormField label="Stock" class="space-y-2">
              <UInput
                v-model.number="form.stock"
                type="number"
                placeholder="Enter product stock"
                required
                class="w-full"
              />
            </UFormField>
          </div>
        </UForm>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="soft"
          class="px-4 py-2"
          @click="isModalOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          class="px-4 py-2"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Update' : 'Create' }}
        </UButton>
      </template>
    </UModal>

    <!-- Delete Modal -->
    <UModal
      v-model:open="isDeleteModalOpen"
      title="Delete Product"
      class="max-w-md"
    >
      <template #body>
        <div class="space-y-2">
          <p class="text-text-secondary dark:text-dark-text-secondary">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <p class="text-sm text-text-tertiary dark:text-dark-text-secondary">
            Product: {{ selectedProduct?.name }}
          </p>
        </div>
      </template>
      <template #footer>
        <UButton
          color="neutral"
          variant="soft"
          class="px-4 py-2"
          @click="isDeleteModalOpen = false"
        >
          Cancel
        </UButton>
        <UButton
          color="error"
          variant="solid"
          class="px-4 py-2"
          :loading="isDeleting"
          @click="handleDelete"
        >
          Delete
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { useTrpc } from '~/composables/useTrpc'
import { useUser } from '~/composables/useUser'
import type { Product } from '~/types/product'
import type { TableColumn } from '@nuxt/ui'
import { UButton } from '#components'

const trpc = useTrpc()
const { user } = useUser()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<Error | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isEditing = ref(false)
const selectedProduct = ref<Product | null>(null)

const columns: TableColumn<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => row.getValue('description') || '-'
  },
  {
    accessorKey: 'price',
    header: () => h('div', { class: 'text-right' }, 'Price'),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price)
      return h('div', { class: 'text-right font-medium' }, formatted)
    }
  },
  {
    accessorKey: 'stock',
    header: () => h('div', { class: 'text-right' }, 'Stock'),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      return h('div', { class: 'text-right font-medium' }, String(stock))
    }
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Actions'),
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center justify-end space-x-2' }, [
        h(UButton, {
          color: 'primary',
          variant: 'ghost',
          size: 'xs',
          icon: 'i-heroicons-pencil',
          onClick: () => openEditModal(row.original)
        }),
        h(UButton, {
          color: 'error',
          variant: 'ghost',
          size: 'xs',
          icon: 'i-heroicons-trash',
          onClick: () => openDeleteModal(row.original)
        })
      ])
    }
  }
]

const form = ref<{
  name: string
  description?: string
  price: number
  stock: number
  userId: string
}>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  userId: user.value?.id || ''
})

const fetchProducts = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await trpc.product.getAll.query({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    products.value = response.items || []
    totalItems.value = response.total
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to fetch products')
    products.value = []
    totalItems.value = 0
    console.error('Error fetching products:', e)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    userId: user.value?.id || ''
  }
  isModalOpen.value = true
}

const openEditModal = (product: Product) => {
  isEditing.value = true
  selectedProduct.value = product
  form.value = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    userId: user.value?.id || ''
  }
  isModalOpen.value = true
}

const openDeleteModal = (product: Product) => {
  selectedProduct.value = product
  isDeleteModalOpen.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    error.value = null
    if (isEditing.value && selectedProduct.value) {
      await trpc.product.update.mutate({
        id: selectedProduct.value.id,
        ...form.value
      })
    } else {
      await trpc.product.create.mutate(form.value)
    }
    await fetchProducts()
    isModalOpen.value = false
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to submit product')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!selectedProduct.value) return

  try {
    isDeleting.value = true
    error.value = null
    await trpc.product.delete.mutate(selectedProduct.value.id)
    await fetchProducts()
    isDeleteModalOpen.value = false
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to delete product')
  } finally {
    isDeleting.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProducts()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProducts()
}

onMounted(fetchProducts)
</script> 