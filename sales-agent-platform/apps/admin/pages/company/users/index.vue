<template>
  <div
    class="
      flex flex-col gap-6 p-4
      md:gap-8 md:p-6
      lg:gap-10 lg:p-8
      bg-background dark:bg-dark-background
      min-h-screen
    "
  >
    <!-- Header -->
    <div
      class="
        flex flex-col gap-4
        md:flex-row md:items-center md:justify-between
      "
    >
      <div>
        <h1
          class="
            text-2xl font-bold
            md:text-3xl
            text-text-primary dark:text-dark-text-primary
          "
        >
          Users
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Manage company users and agents
        </p>
      </div>

      <button
        @click="showCreateModal = true"
        class="
          px-6 py-3
          bg-primary-500 text-white
          rounded-ios-lg
          font-medium
          transition-all duration-300
          hover:bg-primary-600
          active:scale-95
          shadow-ios
          hover:shadow-ios-lg
        "
      >
        <Icon name="heroicons:plus" class="w-5 h-5 inline mr-2" />
        Add User
      </button>
    </div>

    <!-- Users List -->
    <div
      class="
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
        overflow-hidden
      "
    >
      <div v-if="isLoading" class="flex justify-center py-12">
        <div
          class="
            animate-spin rounded-full h-10 w-10
            border-b-2 border-primary-500
          "
        ></div>
      </div>

      <div
        v-else-if="users.length === 0"
        class="py-12 text-center"
      >
        <Icon
          name="heroicons:users"
          class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary"
        />
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No users yet
        </p>
      </div>

      <div v-else class="divide-y divide-border dark:divide-dark-border">
        <div
          v-for="user in users"
          :key="user.id"
          class="
            flex items-center gap-4 p-4
            transition-all duration-300
            hover:bg-surface dark:hover:bg-dark-surface
          "
        >
          <div
            class="
              w-12 h-12
              flex items-center justify-center
              bg-primary-100 dark:bg-primary-900
              text-primary-600 dark:text-primary-400
              rounded-full
              font-semibold
            "
          >
            {{ (user.name || user.email).charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <p
              class="
                font-medium
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ user.name || "No name" }}
            </p>
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ user.email }} • {{ user.role }}
            </p>
          </div>

          <span
            class="
              px-3 py-1
              rounded-full
              text-xs font-medium
            "
            :class="
              user.status === 'active'
                ? 'bg-success-light text-success'
                : 'bg-error-light text-error'
            "
          >
            {{ user.status }}
          </span>

          <div class="flex items-center gap-2">
            <button
              @click="editUser(user)"
              class="
                p-2
                rounded-ios
                hover:bg-surface dark:hover:bg-dark-surface
                transition-all duration-300
                text-text-primary dark:text-dark-text-primary
                active:scale-95
              "
            >
              <Icon name="heroicons:pencil" class="w-5 h-5" />
            </button>
            <button
              @click="deleteUser(user.id)"
              class="
                p-2
                rounded-ios
                text-error
                hover:bg-error-light
                transition-all duration-300
                active:scale-95
              "
            >
              <Icon name="heroicons:trash" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTrpc } from "~/composables/useTrpc";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const trpc = useTrpc();

const users = ref<any[]>([]);
const isLoading = ref(true);
const showCreateModal = ref(false);

const fetchUsers = async () => {
  isLoading.value = true;
  try {
    users.value = await trpc.user.list.query();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    isLoading.value = false;
  }
};

const editUser = (user: any) => {
  // TODO: Open edit modal
  console.log("Edit user:", user);
};

const deleteUser = async (userId: string) => {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await trpc.user.delete.mutate(userId);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

