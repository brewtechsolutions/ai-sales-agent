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
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/admin/companies"
          class="
            p-2
            rounded-ios
            hover:bg-surface dark:hover:bg-dark-surface
            transition-all duration-300
            text-text-primary dark:text-dark-text-primary
          "
        >
          <Icon name="heroicons:arrow-left" class="w-6 h-6" />
        </NuxtLink>
        <div>
          <h1
            class="
              text-2xl font-bold
              md:text-3xl
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{ company?.name || "Loading..." }}
          </h1>
          <p
            class="
              text-sm
              md:text-base
              text-text-secondary dark:text-dark-text-secondary
              mt-1
            "
          >
            Company details and settings
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          v-if="company?.status === 'active'"
          @click="handleSuspend"
          class="
            px-4 py-2
            bg-warning text-white
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-warning-dark
            active:scale-95
            shadow-ios
          "
        >
          Suspend
        </button>
        <button
          v-else
          @click="handleActivate"
          class="
            px-4 py-2
            bg-success text-white
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-success-dark
            active:scale-95
            shadow-ios
          "
        >
          Activate
        </button>
        <button
          @click="handleDelete"
          class="
            px-4 py-2
            bg-error text-white
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-error-dark
            active:scale-95
            shadow-ios
          "
        >
          Delete
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div
        class="
          animate-spin rounded-full h-10 w-10
          border-b-2 border-primary-500
        "
      ></div>
    </div>

    <div v-else-if="company" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <!-- Basic Information -->
        <div
          class="
            flex flex-col gap-4 p-6
            bg-card dark:bg-dark-card
            rounded-ios-lg shadow-ios
            border border-border dark:border-dark-border
          "
        >
          <h2
            class="
              text-xl font-semibold
              text-text-primary dark:text-dark-text-primary
            "
          >
            Basic Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Company Name
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.name }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Slug
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.slug }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Country
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.country }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Industry Category
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.industryCategory || "N/A" }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Preferred Language
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.preferredLanguage }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Currency
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.currency }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Timezone
              </label>
              <p class="text-text-primary dark:text-dark-text-primary">
                {{ company.timezone }}
              </p>
            </div>

            <div>
              <label
                class="
                  block text-sm font-medium mb-2
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Status
              </label>
              <span
                class="
                  inline-block px-3 py-1
                  rounded-full
                  text-xs font-medium
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
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div
          class="
            grid grid-cols-2 md:grid-cols-4 gap-4
          "
        >
          <div
            class="
              flex flex-col gap-2 p-4
              bg-card dark:bg-dark-card
              rounded-ios-lg shadow-ios
              border border-border dark:border-dark-border
            "
          >
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Total Users
            </p>
            <p
              class="
                text-2xl font-bold
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ stats.totalUsers }}
            </p>
          </div>

          <div
            class="
              flex flex-col gap-2 p-4
              bg-card dark:bg-dark-card
              rounded-ios-lg shadow-ios
              border border-border dark:border-dark-border
            "
          >
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Conversations
            </p>
            <p
              class="
                text-2xl font-bold
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ stats.totalConversations }}
            </p>
          </div>

          <div
            class="
              flex flex-col gap-2 p-4
              bg-card dark:bg-dark-card
              rounded-ios-lg shadow-ios
              border border-border dark:border-dark-border
            "
          >
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Revenue
            </p>
            <p
              class="
                text-2xl font-bold text-success
              "
            >
              {{ formatCurrency(stats.totalRevenue) }}
            </p>
          </div>

          <div
            class="
              flex flex-col gap-2 p-4
              bg-card dark:bg-dark-card
              rounded-ios-lg shadow-ios
              border border-border dark:border-dark-border
            "
          >
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Conversion Rate
            </p>
            <p
              class="
                text-2xl font-bold
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ stats.conversionRate }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="flex flex-col gap-6">
        <!-- Logo -->
        <div
          class="
            flex flex-col items-center gap-4 p-6
            bg-card dark:bg-dark-card
            rounded-ios-lg shadow-ios
            border border-border dark:border-dark-border
          "
        >
          <div
            v-if="company.logoUrl"
            class="
              w-24 h-24
              rounded-ios-lg
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
              w-24 h-24
              flex items-center justify-center
              bg-primary-100 dark:bg-primary-900
              text-primary-600 dark:text-primary-400
              rounded-ios-lg
              font-bold text-3xl
            "
          >
            {{ company.name.charAt(0).toUpperCase() }}
          </div>
        </div>

        <!-- Quick Actions -->
        <div
          class="
            flex flex-col gap-3 p-6
            bg-card dark:bg-dark-card
            rounded-ios-lg shadow-ios
            border border-border dark:border-dark-border
          "
        >
          <h3
            class="
              text-lg font-semibold
              text-text-primary dark:text-dark-text-primary
            "
          >
            Quick Actions
          </h3>
          <NuxtLink
            :to="`/company/${company.id}/dashboard`"
            class="
              w-full px-4 py-3
              bg-primary-500 text-white
              rounded-ios-lg
              font-medium text-center
              transition-all duration-300
              hover:bg-primary-600
              active:scale-95
              shadow-ios
            "
          >
            View Company Dashboard
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTrpc } from "~/composables/useTrpc";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const route = useRoute();
const trpc = useTrpc();

const company = ref<any>(null);
const isLoading = ref(true);
const stats = ref({
  totalUsers: 0,
  totalConversations: 0,
  totalRevenue: 0,
  conversionRate: 0,
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const fetchCompany = async () => {
  isLoading.value = true;
  try {
    const companyId = route.params.id as string;
    company.value = await trpc.companies.get.query({ id: companyId });
    // TODO: Fetch stats
  } catch (error) {
    console.error("Failed to fetch company:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleSuspend = async () => {
  if (confirm("Are you sure you want to suspend this company?")) {
    try {
      await trpc.companies.suspend.mutate({ id: company.value.id });
      await fetchCompany();
    } catch (error) {
      console.error("Failed to suspend company:", error);
    }
  }
};

const handleActivate = async () => {
  try {
    await trpc.companies.activate.mutate({ id: company.value.id });
    await fetchCompany();
  } catch (error) {
    console.error("Failed to activate company:", error);
  }
};

const handleDelete = async () => {
  if (
    confirm(
      "Are you sure you want to delete this company? This action cannot be undone."
    )
  ) {
    try {
      await trpc.companies.delete.mutate({ id: company.value.id });
      await navigateTo("/admin/companies");
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  }
};

onMounted(() => {
  fetchCompany();
});
</script>

