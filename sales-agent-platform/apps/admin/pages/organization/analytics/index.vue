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
    <div>
      <h1
        class="
          text-2xl font-bold
          md:text-3xl
          text-text-primary dark:text-dark-text-primary
        "
      >
        Analytics
      </h1>
      <p
        class="
          text-sm
          md:text-base
          text-text-secondary dark:text-dark-text-secondary
          mt-2
        "
      >
        Detailed insights into your company's performance
      </p>
    </div>

    <!-- Date Range Filter -->
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
      <div class="flex items-center gap-3">
        <label
          class="
            text-sm font-medium
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          From:
        </label>
        <input
          v-model="dateRange.start"
          type="date"
          class="
            px-4 py-2
            bg-surface dark:bg-dark-surface
            text-text-primary dark:text-dark-text-primary
            border border-border dark:border-dark-border
            rounded-ios
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-300
          "
        />
      </div>
      <div class="flex items-center gap-3">
        <label
          class="
            text-sm font-medium
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          To:
        </label>
        <input
          v-model="dateRange.end"
          type="date"
          class="
            px-4 py-2
            bg-surface dark:bg-dark-surface
            text-text-primary dark:text-dark-text-primary
            border border-border dark:border-dark-border
            rounded-ios
            focus:outline-none focus:ring-2 focus:ring-primary-500
            transition-all duration-300
          "
        />
      </div>
      <button
        @click="fetchAnalytics"
        class="
          px-6 py-3
          bg-primary-500 text-white
          rounded-ios-lg
          font-medium
          transition-all duration-300
          hover:bg-primary-600
          active:scale-95
        "
      >
        Apply Filter
      </button>
    </div>

    <!-- Overview Stats -->
    <div
      class="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
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
        <p
          class="
            text-sm font-medium
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Total Leads
        </p>
        <p class="text-3xl font-bold">{{ overview.totalLeads }}</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ overview.activeConversations }} active
        </p>
      </div>

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
        <p
          class="
            text-sm font-medium
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Conversion Rate
        </p>
        <p class="text-3xl font-bold text-success">
          {{ overview.conversionRate }}%
        </p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ overview.completedConversations }} completed
        </p>
      </div>

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
        <p
          class="
            text-sm font-medium
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Total Revenue
        </p>
        <p class="text-3xl font-bold text-success">
          {{ formatCurrency(overview.totalRevenue) }}
        </p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          This period
        </p>
      </div>

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
        <p
          class="
            text-sm font-medium
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Avg Response Time
        </p>
        <p class="text-3xl font-bold">
          {{ overview.avgResponseTime }}m
        </p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Average
        </p>
      </div>
    </div>

    <!-- Agent Performance -->
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
        Agent Performance
      </h2>

      <div v-if="isLoadingAgents" class="flex justify-center py-8">
        <div
          class="
            animate-spin rounded-full h-8 w-8
            border-b-2 border-primary-500
          "
        ></div>
      </div>

      <div
        v-else-if="agentPerformance.length === 0"
        class="py-8 text-center"
      >
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No agent data available
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
                Agent
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Conversations
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Completed
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Conversion Rate
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Revenue
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Avg Rating
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border dark:divide-dark-border">
            <tr
              v-for="agent in agentPerformance"
              :key="agent.agentId"
              class="
                transition-all duration-300
                hover:bg-surface dark:hover:bg-dark-surface
              "
            >
              <td class="px-6 py-4">
                <p
                  class="
                    font-medium
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  {{ agent.agentName }}
                </p>
                <p
                  class="
                    text-sm
                    text-text-secondary dark:text-dark-text-secondary
                  "
                >
                  {{ agent.agentEmail }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="text-text-primary dark:text-dark-text-primary">
                  {{ agent.totalConversations }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="text-text-primary dark:text-dark-text-primary">
                  {{ agent.completedConversations }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p
                  class="
                    font-semibold
                    text-success
                  "
                >
                  {{ agent.conversionRate }}%
                </p>
              </td>
              <td class="px-6 py-4">
                <p
                  class="
                    font-semibold
                    text-success
                  "
                >
                  {{ formatCurrency(agent.totalRevenue) }}
                </p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1">
                  <span class="text-text-primary dark:text-dark-text-primary">
                    {{ agent.avgRating.toFixed(1) }}
                  </span>
                  <Icon name="heroicons:star" class="w-4 h-4 text-warning" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Performance -->
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
        Product Performance
      </h2>

      <div v-if="isLoadingProducts" class="flex justify-center py-8">
        <div
          class="
            animate-spin rounded-full h-8 w-8
            border-b-2 border-primary-500
          "
        ></div>
      </div>

      <div
        v-else-if="productPerformance.length === 0"
        class="py-8 text-center"
      >
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No product sales data available
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
                Product
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Times Sold
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Quantity
              </th>
              <th
                class="
                  px-6 py-4 text-left text-xs font-semibold
                  text-text-secondary dark:text-dark-text-secondary
                  uppercase tracking-wider
                "
              >
                Revenue
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border dark:divide-dark-border">
            <tr
              v-for="product in productPerformance"
              :key="product.productId"
              class="
                transition-all duration-300
                hover:bg-surface dark:hover:bg-dark-surface
              "
            >
              <td class="px-6 py-4">
                <p
                  class="
                    font-medium
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  {{ product.name }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="text-text-primary dark:text-dark-text-primary">
                  {{ product.timesSold }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p class="text-text-primary dark:text-dark-text-primary">
                  {{ product.quantity }}
                </p>
              </td>
              <td class="px-6 py-4">
                <p
                  class="
                    font-semibold
                    text-success
                  "
                >
                  {{ formatCurrency(product.revenue) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Revenue Chart -->
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
        Revenue Trend
      </h2>
      <div
        class="
          flex items-center justify-center py-12
          bg-surface dark:bg-dark-surface
          rounded-ios-lg
        "
      >
        <p class="text-text-secondary dark:text-dark-text-secondary">
          Chart visualization will be implemented here
        </p>
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
  requiresAuth: true,
  requiredRole: "organization_admin",
});

const trpc = useTrpc();

const overview = ref({
  totalLeads: 0,
  activeConversations: 0,
  completedConversations: 0,
  conversionRate: 0,
  totalRevenue: 0,
  totalAgents: 0,
  avgResponseTime: 0,
});

const agentPerformance = ref<any[]>([]);
const productPerformance = ref<any[]>([]);
const isLoadingAgents = ref(false);
const isLoadingProducts = ref(false);
const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  end: new Date().toISOString().split("T")[0],
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const fetchAnalytics = async () => {
  try {
    const startDate = dateRange.value.start
      ? new Date(dateRange.value.start)
      : undefined;
    const endDate = dateRange.value.end
      ? new Date(dateRange.value.end)
      : undefined;

    const [overviewData, agentsData, productsData] = await Promise.all([
      trpc.analytics.getOverview.query({
        startDate,
        endDate,
      }),
      trpc.analytics.getAgentPerformance.query({
        startDate,
        endDate,
      }),
      trpc.analytics.getProductPerformance.query({
        startDate,
        endDate,
      }),
    ]);

    overview.value = overviewData;
    agentPerformance.value = agentsData;
    productPerformance.value = productsData;
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
  }
};

onMounted(() => {
  fetchAnalytics();
});
</script>

