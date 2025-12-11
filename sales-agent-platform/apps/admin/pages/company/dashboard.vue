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
          Dashboard
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Overview of your company's performance
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
      <!-- Total Leads -->
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
            Total Leads
          </p>
          <Icon
            name="heroicons:user-group"
            class="w-6 h-6 text-primary-500"
          />
        </div>
        <p class="text-3xl font-bold">{{ stats.totalLeads }}</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ stats.activeConversations }} active conversations
        </p>
      </div>

      <!-- Conversion Rate -->
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
            Conversion Rate
          </p>
          <Icon
            name="heroicons:chart-bar"
            class="w-6 h-6 text-success"
          />
        </div>
        <p class="text-3xl font-bold text-success">
          {{ stats.conversionRate }}%
        </p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ stats.completedConversations }} completed
        </p>
      </div>

      <!-- Revenue -->
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
            Revenue
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

      <!-- Active Agents -->
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
            Active Agents
          </p>
          <Icon
            name="heroicons:users"
            class="w-6 h-6 text-primary-500"
          />
        </div>
        <p class="text-3xl font-bold">{{ stats.totalAgents }}</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Handling conversations
        </p>
      </div>
    </div>

    <!-- Unassigned Conversations Queue -->
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
          Unassigned Conversations
        </h2>
        <NuxtLink
          to="/company/conversations/unassigned"
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

      <div v-if="unassignedLoading" class="flex justify-center py-8">
        <div
          class="
            animate-spin rounded-full h-8 w-8
            border-b-2 border-primary-500
          "
        ></div>
      </div>

      <div
        v-else-if="unassignedConversations.length === 0"
        class="py-8 text-center"
      >
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No unassigned conversations
        </p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="conversation in unassignedConversations.slice(0, 5)"
          :key="conversation.id"
          class="
            flex items-center gap-4 p-4
            bg-surface dark:bg-dark-surface
            rounded-ios
            border border-border dark:border-dark-border
            transition-all duration-300
            hover:shadow-ios
            cursor-pointer
          "
          @click="navigateTo(`/company/conversations/${conversation.id}`)"
        >
          <div class="flex-1 min-w-0">
            <p
              class="
                font-medium truncate
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ conversation.contact?.name || conversation.contact?.phone || "Unknown" }}
            </p>
            <p
              class="
                text-sm truncate
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ getLastMessage(conversation) }}
            </p>
          </div>
          <button
            @click.stop="showAssignModal(conversation)"
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
            Assign
          </button>
        </div>
      </div>
    </div>

    <!-- Lead Distribution -->
    <div
      class="
        grid grid-cols-1 lg:grid-cols-2 gap-6
      "
    >
      <!-- Lead Distribution Chart -->
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
          Lead Distribution
        </h2>
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="
                  w-4 h-4 rounded-full bg-success
                "
              ></div>
              <span class="text-text-primary dark:text-dark-text-primary">
                Hot Leads
              </span>
            </div>
            <span class="font-semibold text-text-primary dark:text-dark-text-primary">
              {{ leadDistribution.green.count }}
              ({{ leadDistribution.green.percentage }}%)
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="
                  w-4 h-4 rounded-full bg-warning
                "
              ></div>
              <span class="text-text-primary dark:text-dark-text-primary">
                Warm Leads
              </span>
            </div>
            <span class="font-semibold text-text-primary dark:text-dark-text-primary">
              {{ leadDistribution.yellow.count }}
              ({{ leadDistribution.yellow.percentage }}%)
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="
                  w-4 h-4 rounded-full bg-error
                "
              ></div>
              <span class="text-text-primary dark:text-dark-text-primary">
                Cold Leads
              </span>
            </div>
            <span class="font-semibold text-text-primary dark:text-dark-text-primary">
              {{ leadDistribution.red.count }}
              ({{ leadDistribution.red.percentage }}%)
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
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
          Recent Activity
        </h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="
              flex items-center gap-3 p-3
              bg-surface dark:bg-dark-surface
              rounded-ios
            "
          >
            <Icon
              :name="getActivityIcon(activity.type)"
              class="w-5 h-5 text-primary-500"
            />
            <div class="flex-1 min-w-0">
              <p
                class="
                  text-sm font-medium truncate
                  text-text-primary dark:text-dark-text-primary
                "
              >
                {{ activity.message }}
              </p>
              <p
                class="
                  text-xs
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                {{ formatTimeAgo(activity.createdAt) }}
              </p>
            </div>
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
  requiresAuth: true,
  requiredRole: "company_admin",
});

const trpc = useTrpc();

const stats = ref({
  totalLeads: 0,
  activeConversations: 0,
  completedConversations: 0,
  conversionRate: 0,
  totalRevenue: 0,
  totalAgents: 0,
  avgResponseTime: 0,
});

const unassignedConversations = ref<any[]>([]);
const unassignedLoading = ref(false);
const leadDistribution = ref({
  green: { count: 0, percentage: 0 },
  yellow: { count: 0, percentage: 0 },
  red: { count: 0, percentage: 0 },
  total: 0,
});
const recentActivity = ref<any[]>([]);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const formatTimeAgo = (date: Date | string) => {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

const getLastMessage = (conversation: any) => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages[0].content;
  }
  return "No messages yet";
};

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    conversation_assigned: "heroicons:user-plus",
    message_sent: "heroicons:chat-bubble-left",
    sale_completed: "heroicons:check-circle",
    lead_created: "heroicons:user",
  };
  return icons[type] || "heroicons:bell";
};

const showAssignModal = (conversation: any) => {
  // TODO: Open assignment modal
  navigateTo(`/company/conversations/${conversation.id}`);
};

const fetchDashboardData = async () => {
  try {
    // Fetch overview stats
    const overview = await trpc.analytics.getOverview.query({});
    stats.value = overview;

    // Fetch unassigned conversations
    unassignedLoading.value = true;
    unassignedConversations.value =
      await trpc.conversations.listUnassigned.query();
    unassignedLoading.value = false;

    // Fetch lead distribution
    const distribution = await trpc.analytics.getLeadDistribution.query({});
    leadDistribution.value = distribution;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

