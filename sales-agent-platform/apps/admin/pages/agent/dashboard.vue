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
        My Dashboard
        </h1>
      <p
        class="
          text-sm
          md:text-base
          text-text-secondary dark:text-dark-text-secondary
          mt-2
        "
      >
        Your assigned conversations and performance
      </p>
    </div>

    <!-- Stats Grid -->
    <div
      class="
        grid grid-cols-1 gap-4
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      <!-- Assigned Conversations -->
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
            Assigned Conversations
          </p>
          <Icon
            name="heroicons:chat-bubble-left-right"
            class="w-6 h-6 text-primary-500"
          />
        </div>
        <p class="text-3xl font-bold">{{ stats.assignedConversations }}</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ stats.activeConversations }} active
        </p>
      </div>

      <!-- Completed -->
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
            Completed
          </p>
          <Icon
            name="heroicons:check-circle"
            class="w-6 h-6 text-success"
          />
        </div>
        <p class="text-3xl font-bold text-success">
          {{ stats.completedConversations }}
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
            class="w-6 h-6 text-primary-500"
          />
        </div>
        <p class="text-3xl font-bold">{{ stats.conversionRate }}%</p>
        <p
          class="
            text-xs
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Personal best
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
            Revenue Generated
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

    <!-- Assigned Leads by Score -->
    <div
      class="
        grid grid-cols-1 lg:grid-cols-3 gap-6
      "
    >
      <!-- Hot Leads -->
      <div
        class="
          flex flex-col gap-4 p-6
          bg-card dark:bg-dark-card
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
        "
      >
        <div class="flex items-center gap-3">
          <div
            class="
              w-3 h-3 rounded-full bg-success
            "
          ></div>
          <h2
            class="
              text-lg font-semibold
              text-text-primary dark:text-dark-text-primary
            "
          >
            Hot Leads ({{ hotLeads.length }})
          </h2>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="lead in hotLeads.slice(0, 5)"
            :key="lead.id"
            class="
              flex items-center justify-between p-3
              bg-surface dark:bg-dark-surface
              rounded-ios
              cursor-pointer
              transition-all duration-300
              hover:shadow-ios
            "
            @click="navigateTo(`/agent/conversations/${lead.id}`)"
          >
            <div class="flex-1 min-w-0">
              <p
                class="
                  font-medium truncate
                  text-text-primary dark:text-dark-text-primary
                "
              >
                {{ lead.contact?.name || lead.contact?.phone || "Unknown" }}
              </p>
              <p
                class="
                  text-xs truncate
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Score: {{ lead.contact?.behaviorScore || 0 }}
              </p>
            </div>
            <Icon
              name="heroicons:chevron-right"
              class="w-5 h-5 text-text-secondary dark:text-dark-text-secondary"
            />
          </div>
          <NuxtLink
            v-if="hotLeads.length > 5"
            to="/agent/conversations?filter=hot"
            class="
              text-center px-4 py-2
              text-primary-500
              text-sm font-medium
              transition-all duration-300
              hover:text-primary-600
            "
          >
            View All ({{ hotLeads.length }})
          </NuxtLink>
        </div>
      </div>

      <!-- Warm Leads -->
      <div
        class="
          flex flex-col gap-4 p-6
          bg-card dark:bg-dark-card
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
        "
      >
        <div class="flex items-center gap-3">
          <div
            class="
              w-3 h-3 rounded-full bg-warning
            "
          ></div>
          <h2
            class="
              text-lg font-semibold
              text-text-primary dark:text-dark-text-primary
            "
          >
            Warm Leads ({{ warmLeads.length }})
          </h2>
        </div>
        <div class="flex flex-col gap-2">
          <div
            v-for="lead in warmLeads.slice(0, 5)"
            :key="lead.id"
            class="
              flex items-center justify-between p-3
              bg-surface dark:bg-dark-surface
              rounded-ios
              cursor-pointer
              transition-all duration-300
              hover:shadow-ios
            "
            @click="navigateTo(`/agent/conversations/${lead.id}`)"
          >
            <div class="flex-1 min-w-0">
              <p
                class="
                  font-medium truncate
                  text-text-primary dark:text-dark-text-primary
                "
              >
                {{ lead.contact?.name || lead.contact?.phone || "Unknown" }}
              </p>
              <p
                class="
                  text-xs truncate
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                Score: {{ lead.contact?.behaviorScore || 0 }}
              </p>
            </div>
            <Icon
              name="heroicons:chevron-right"
              class="w-5 h-5 text-text-secondary dark:text-dark-text-secondary"
            />
          </div>
          <NuxtLink
            v-if="warmLeads.length > 5"
            to="/agent/conversations?filter=warm"
            class="
              text-center px-4 py-2
              text-primary-500
              text-sm font-medium
              transition-all duration-300
              hover:text-primary-600
            "
          >
            View All ({{ warmLeads.length }})
          </NuxtLink>
        </div>
      </div>

      <!-- Today's Tasks -->
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
            text-lg font-semibold
            text-text-primary dark:text-dark-text-primary
          "
        >
          Today's Tasks
        </h2>
        <div class="flex flex-col gap-2">
          <div
            v-for="task in todaysTasks"
            :key="task.id"
            class="
              flex items-center gap-3 p-3
              bg-surface dark:bg-dark-surface
              rounded-ios
            "
          >
            <Icon
              :name="task.icon"
              class="w-5 h-5 text-primary-500"
            />
            <div class="flex-1 min-w-0">
              <p
                class="
                  text-sm font-medium
                  text-text-primary dark:text-dark-text-primary
                "
              >
                {{ task.title }}
              </p>
              <p
                class="
                  text-xs
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                {{ task.description }}
              </p>
            </div>
          </div>
          <div
            v-if="todaysTasks.length === 0"
            class="
              py-8 text-center
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            No tasks for today
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTrpc } from "~/composables/useTrpc";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  layout: "default",
  middleware: "auth",
  requiresAuth: true,
  requiredRole: "company_user",
});

const trpc = useTrpc();

const stats = ref({
  assignedConversations: 0,
  activeConversations: 0,
  completedConversations: 0,
  conversionRate: 0,
  totalRevenue: 0,
});

const conversations = ref<any[]>([]);
const todaysTasks = ref<any[]>([]);

const hotLeads = computed(() => {
  return conversations.value.filter(
    (c) => c.contact?.scoreColor === "green"
  );
});

const warmLeads = computed(() => {
  return conversations.value.filter(
    (c) => c.contact?.scoreColor === "yellow"
  );
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const fetchDashboardData = async () => {
  try {
    // Check if user has a company
    const { user } = useAuth();
    if (!user.value?.company_id) {
      // User doesn't have a company, redirect to onboarding
      await navigateTo('/onboarding');
      return;
    }

    // Fetch agent's assigned conversations
    const agentConversations = await trpc.agent.conversations.list.query();
    conversations.value = agentConversations;

    // Calculate stats
    stats.value = {
      assignedConversations: agentConversations.length,
      activeConversations: agentConversations.filter(
        (c) => c.status === "in_progress" || c.status === "waiting"
      ).length,
      completedConversations: agentConversations.filter(
        (c) => c.status === "completed"
      ).length,
      conversionRate: 0, // TODO: Calculate from analytics
      totalRevenue: 0, // TODO: Calculate from completed conversations
    };

    // Fetch personal stats
    const myStats = await trpc.agent.dashboard.myStats.query();
    if (myStats) {
      stats.value = { ...stats.value, ...myStats };
    }

    // Generate today's tasks
    todaysTasks.value = [
      {
        id: "1",
        title: "Follow up with hot leads",
        description: `${hotLeads.value.length} hot leads need attention`,
        icon: "heroicons:fire",
      },
      {
        id: "2",
        title: "Complete pending conversations",
        description: `${agentConversations.filter((c) => c.status === "waiting").length} waiting`,
        icon: "heroicons:clock",
      },
    ];
  } catch (error: any) {
    console.error("Failed to fetch dashboard data:", error);
    
    // If error is due to missing company, redirect to onboarding
    if (error?.message?.includes('company') || error?.data?.code === 'BAD_REQUEST') {
      await navigateTo('/onboarding');
    }
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

