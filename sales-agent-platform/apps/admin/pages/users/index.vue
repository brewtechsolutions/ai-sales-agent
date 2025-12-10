<template>
  <div class="space-y-6">
    <!-- Data Table -->
    <div v-if="!loading">
      <RTable
        title="Users"
        :data="users"
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
      :title="isEditing ? 'Edit User' : 'Create User'"
      class="max-w-2xl"
    >
      <template #body>
        <UForm :state="form" class="space-y-6">
          <UFormField label="Name" class="space-y-2">
            <UInput
              v-model="form.name"
              placeholder="Enter user name"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="Email" class="space-y-2">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="Enter user email"
              required
              class="w-full"
            />
          </UFormField>
          <UFormField label="Password" class="space-y-2">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Enter user password"
              class="w-full"
            />
          </UFormField>
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
      title="Delete User"
      class="max-w-md"
    >
      <template #body>
        <div class="space-y-2">
          <p class="text-text-secondary dark:text-dark-text-secondary">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <p class="text-sm text-text-tertiary dark:text-dark-text-secondary">
            User: {{ selectedUser?.name || selectedUser?.email }}
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
import { h, ref, onMounted } from 'vue';
import { useTrpc } from '~/composables/useTrpc';
import type { User } from '~/types/user';
import type { TableColumn } from '@nuxt/ui';
import { UButton } from '#components';

const trpc = useTrpc();
const users = ref<(User | null)[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isEditing = ref(false);
const selectedUser = ref<User | null>(null);

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.getValue('email')
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return h('div', { class: 'text-text-secondary dark:text-dark-text-secondary' }, date.toLocaleDateString())
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
];

const form = ref<{
  name?: string;
  email: string;
  password: string;
}>({
  name: '',
  email: '',
  password: '',
});

const fetchUsers = async () => {
  try {
    loading.value = true;
    users.value = await trpc.user.getAll.query();
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to fetch users');
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = {
    name: '',
    email: '',
    password: '',
  };
  isModalOpen.value = true;
};

const openEditModal = (user: User) => {
  isEditing.value = true;
  selectedUser.value = user;
  form.value = {
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
  };
  isModalOpen.value = true;
};

const openDeleteModal = (user: User) => {
  selectedUser.value = user;
  isDeleteModalOpen.value = true;
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    if (isEditing.value && selectedUser.value) {
      await trpc.user.update.mutate({
        id: selectedUser.value.id,
        ...form.value,
      });
    } else {
      await trpc.user.create.mutate(form.value);
    }
    await fetchUsers();
    isModalOpen.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to submit user');
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async () => {
  if (!selectedUser.value) return;

  try {
    isDeleting.value = true;
    await trpc.user.delete.mutate(selectedUser.value.id);
    await fetchUsers();
    isDeleteModalOpen.value = false;
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to delete user');
  } finally {
    isDeleting.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const handlePageSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

onMounted(fetchUsers);
</script> 