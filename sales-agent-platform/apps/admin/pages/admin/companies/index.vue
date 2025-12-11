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
          Companies
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Manage all companies on the platform
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
        Create Company
      </button>
    </div>

    <!-- Filters -->
    <div
      class="
        flex flex-col gap-4
        sm:flex-row sm:items-center
        p-4
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search companies..."
          class="
            w-full px-4 py-2
            bg-surface dark:bg-dark-surface
            text-text-primary dark:text-dark-text-primary
            border border-border dark:border-dark-border
            rounded-ios
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-300
          "
        />
      </div>

      <select
        v-model="statusFilter"
        class="
          px-4 py-2
          bg-surface dark:bg-dark-surface
          text-text-primary dark:text-dark-text-primary
          border border-border dark:border-dark-border
          rounded-ios
          focus:outline-none focus:ring-2 focus:ring-primary-500
          transition-all duration-300
        "
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="trial">Trial</option>
      </select>
    </div>

    <!-- Companies Table -->
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

      <div v-else-if="filteredCompanies.length === 0" class="py-12 text-center">
        <Icon
          name="heroicons:building-office-2"
          class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary"
        />
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No companies found
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead
            class="
              bg-surface dark:bg-dark-surface
              border-b border-border dark:border-dark-border
            "
          >
            <tr>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Company
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Country
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Industry
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Status
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Created
              </th>
              <th
                class="
                  px-6 py-4 text-right text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border dark:divide-dark-border">
            <tr
              v-for="company in filteredCompanies"
              :key="company.id"
              class="
                transition-all duration-300
                hover:bg-surface dark:hover:bg-dark-surface
                cursor-pointer
              "
              @click="navigateTo(`/admin/companies/${company.id}`)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    v-if="company.logoUrl"
                    class="
                      w-10 h-10
                      rounded-ios
                      overflow-hidden
                      bg-surface dark:bg-dark-surface
                    "
                  >
                    <img
                      :src="company.logoUrl"
                      :alt="company.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="
                      w-10 h-10
                      flex items-center justify-center
                      bg-primary-100 dark:bg-primary-900
                      text-primary-600 dark:text-primary-400
                      rounded-ios
                      font-semibold text-sm
                    "
                  >
                    {{ company.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p
                      class="
                        font-medium
                        text-text-primary dark:text-dark-text-primary
                      "
                    >
                      {{ company.name }}
                    </p>
                    <p
                      class="
                        text-sm
                        text-text-secondary dark:text-dark-text-secondary
                      "
                    >
                      {{ company.slug }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-text-primary dark:text-dark-text-primary">
                  {{ company.country }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="text-text-primary dark:text-dark-text-primary">
                  {{ company.industryCategory || "N/A" }}
                </p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="
                    px-3 py-1
                    rounded-full
                    text-xs font-medium
                    transition-all duration-300
                  "
                  :class="
                    company.status === 'active'
                      ? 'bg-success-light text-success'
                      : company.status === 'suspended'
                      ? 'bg-error-light text-error'
                      : 'bg-warning-light text-warning'
                  "
                >
                  {{ company.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <p
                  class="
                    text-sm
                    text-text-secondary dark:text-dark-text-secondary
                  "
                >
                  {{ formatDate(company.createdAt) }}
                </p>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click.stop="
                      company.status === 'active'
                        ? suspendCompany(company.id)
                        : activateCompany(company.id)
                    "
                    class="
                      p-2
                      rounded-ios
                      transition-all duration-300
                      hover:bg-surface dark:hover:bg-dark-surface
                      active:scale-95
                    "
                    :class="
                      company.status === 'active'
                        ? 'text-warning'
                        : 'text-success'
                    "
                  >
                    <Icon
                      :name="
                        company.status === 'active'
                          ? 'heroicons:pause-circle'
                          : 'heroicons:play-circle'
                      "
                      class="w-5 h-5"
                    />
                  </button>
                  <button
                    @click.stop="deleteCompany(company.id)"
                    class="
                      p-2
                      rounded-ios
                      text-error
                      transition-all duration-300
                      hover:bg-error-light
                      active:scale-95
                    "
                  >
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Company Modal -->
    <div
      v-if="showCreateModal"
      class="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        p-4
        z-50
      "
      @click="showCreateModal = false"
    >
      <div
        class="
          w-full max-w-2xl
          bg-card dark:bg-dark-card
          rounded-ios-xl shadow-ios-xl
          border border-border dark:border-dark-border
          p-6
          max-h-[90vh] overflow-y-auto
        "
        @click.stop
      >
        <h2
          class="
            text-2xl font-bold mb-6
            text-text-primary dark:text-dark-text-primary
          "
        >
          Create Company
        </h2>
        <!-- Create form will go here -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showCreateModal = false"
            class="
              px-4 py-2
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-text-primary
              rounded-ios
              transition-all duration-300
              hover:bg-surface/80
            "
          >
            Cancel
          </button>
          <button
            @click="handleCreate"
            class="
              px-4 py-2
              bg-primary-500 text-white
              rounded-ios
              transition-all duration-300
              hover:bg-primary-600
            "
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCompanyStore } from "~/stores/useCompanyStore";

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
  requiredRole: "super_admin",
});

const companyStore = useCompanyStore();
const searchQuery = ref("");
const statusFilter = ref("");
const showCreateModal = ref(false);

const isLoading = computed(() => companyStore.isLoading);

const filteredCompanies = computed(() => {
  let companies = companyStore.companies;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    companies = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    companies = companies.filter((c) => c.status === statusFilter.value);
  }

  return companies;
});

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const suspendCompany = async (id: string) => {
  if (confirm("Are you sure you want to suspend this company?")) {
    await companyStore.suspendCompany(id);
  }
};

const activateCompany = async (id: string) => {
  await companyStore.activateCompany(id);
};

const deleteCompany = async (id: string) => {
  if (
    confirm(
      "Are you sure you want to delete this company? This action cannot be undone."
    )
  ) {
    await companyStore.deleteCompany(id);
  }
};

const handleCreate = () => {
  // TODO: Implement create form
  showCreateModal.value = false;
};

onMounted(() => {
  companyStore.fetchCompanies();
});
</script>

