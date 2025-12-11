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
          Platform Dashboard
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Overview of all companies and platform metrics
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div
      class="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      <!-- Total Companies -->
      <div
        class="
          flex flex-col gap-3 p-6
          bg-card dark:bg-dark-card
          text-text-primary dark:text-dark-text-primary
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <div class="flex items-center justify-between">
          <p
            class="
              text-sm font-medium
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Total Companies
          </p>
          <Icon
            name="heroicons:building-office-2"
            class="w-6 h-6 text-primary-500"
          />
        </div>
        <p class="text-3xl font-bold">{{ stats.totalCompanies }}</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ stats.activeCompanies }} active
        </p>
      </div>

      <!-- Active Companies -->
      <div
        class="
          flex flex-col gap-3 p-6
          bg-card dark:bg-dark-card
          text-text-primary dark:text-dark-text-primary
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <div class="flex items-center justify-between">
          <p
            class="
              text-sm font-medium
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Active Companies
          </p>
          <Icon
            name="heroicons:check-circle"
            class="w-6 h-6 text-success"
          />
        </div>
        <p class="text-3xl font-bold text-success">
          {{ stats.activeCompanies }}
        </p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ stats.suspendedCompanies }} suspended
        </p>
      </div>

      <!-- Total Users -->
      <div
        class="
          flex flex-col gap-3 p-6
          bg-card dark:bg-dark-card
          text-text-primary dark:text-dark-text-primary
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <div class="flex items-center justify-between">
          <p
            class="
              text-sm font-medium
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Total Users
          </p>
          <Icon
            name="heroicons:users"
            class="w-6 h-6 text-primary-500"
          />
        </div>
        <p class="text-3xl font-bold">{{ stats.totalUsers }}</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Across all companies
        </p>
      </div>

      <!-- Platform Revenue -->
      <div
        class="
          flex flex-col gap-3 p-6
          bg-card dark:bg-dark-card
          text-text-primary dark:text-dark-text-primary
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <div class="flex items-center justify-between">
          <p
            class="
              text-sm font-medium
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Platform Revenue
          </p>
          <Icon
            name="heroicons:currency-dollar"
            class="w-6 h-6 text-success"
          />
        </div>
        <p class="text-3xl font-bold text-success">
          {{ formatCurrency(stats.totalRevenue) }}
        </p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          This month
        </p>
      </div>
    </div>

    <!-- Recent Companies -->
    <div
      class="
        flex flex-col gap-4 p-6
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <div class="flex items-center justify-between">
        <h2
          class="
            text-xl font-semibold
            text-text-primary dark:text-dark-text-primary
          "
        >
          Recent Companies
        </h2>
        <NuxtLink
          to="/admin/companies"
          class="
            px-4 py-2
            bg-primary-500 text-white
            rounded-ios
            text-sm font-medium
            transition-all duration-300
            hover:bg-primary-600
            active:scale-95
          "
        >
          View All
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="recentCompanies.length === 0" class="py-8 text-center">
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No companies yet
        </p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="company in recentCompanies"
          :key="company.id"
          class="
            flex items-center gap-4 p-4
            bg-surface dark:bg-dark-surface
            rounded-ios
            border border-border dark:border-dark-border
            transition-all duration-300
            hover:shadow-ios
            cursor-pointer
          "
          @click="navigateTo(`/admin/companies/${company.id}`)"
        >
          <div
            v-if="company.logoUrl"
            class="
              w-12 h-12
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
              w-12 h-12
              flex items-center justify-center
              bg-primary-100 dark:bg-primary-900
              text-primary-600 dark:text-primary-400
              rounded-ios
              font-semibold
            "
          >
            {{ company.name.charAt(0).toUpperCase() }}
          </div>

          <div class="flex-1 min-w-0">
            <p
              class="
                font-medium truncate
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ company.name }}
            </p>
            <p
              class="
                text-sm truncate
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ company.country }} • {{ company.industryCategory || "N/A" }}
            </p>
          </div>

          <div
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCompanyStore } from "~/stores/useCompanyStore";
import { useTrpc } from "~/composables/useTrpc";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const companyStore = useCompanyStore();
const trpc = useTrpc();

const stats = ref({
  totalCompanies: 0,
  activeCompanies: 0,
  suspendedCompanies: 0,
  totalUsers: 0,
  totalRevenue: 0,
});

const recentCompanies = ref<any[]>([]);
const isLoading = ref(true);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // Fetch companies
    await companyStore.fetchCompanies();
    const companies = companyStore.companies;

    stats.value = {
      totalCompanies: companies.length,
      activeCompanies: companies.filter((c) => c.status === "active").length,
      suspendedCompanies: companies.filter((c) => c.status === "suspended")
        .length,
      totalUsers: 0, // TODO: Fetch from analytics
      totalRevenue: 0, // TODO: Fetch from analytics
    };

    recentCompanies.value = companies
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

