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
          Conversations
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Monitor and manage all company conversations
        </p>
      </div>

      <NuxtLink
        to="/company/conversations/unassigned"
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
        <Icon name="heroicons:inbox" class="w-5 h-5 inline mr-2" />
        Unassigned Queue ({{ unassignedCount }})
      </NuxtLink>
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
          placeholder="Search conversations..."
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
        <option value="new">New</option>
        <option value="in_progress">In Progress</option>
        <option value="waiting">Waiting</option>
        <option value="completed">Completed</option>
        <option value="lost">Lost</option>
      </select>

      <select
        v-model="assignedToFilter"
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
        <option value="">All Agents</option>
        <option
          v-for="agent in agents"
          :key="agent.id"
          :value="agent.id"
        >
          {{ agent.name }}
        </option>
      </select>
    </div>

    <!-- Conversations List -->
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
        v-else-if="filteredConversations.length === 0"
        class="py-12 text-center"
      >
        <Icon
          name="heroicons:chat-bubble-left-right"
          class="w-16 h-16 mx-auto mb-4 text-text-secondary dark:text-dark-text-secondary"
        />
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No conversations found
        </p>
      </div>

      <div v-else class="divide-y divide-border dark:divide-dark-border">
        <div
          v-for="conversation in filteredConversations"
          :key="conversation.id"
          class="
            flex items-center gap-4 p-4
            transition-all duration-300
            hover:bg-surface dark:hover:bg-dark-surface
            cursor-pointer
          "
          @click="navigateTo(`/company/conversations/${conversation.id}`)"
        >
          <!-- Contact Avatar -->
          <div
            class="
              w-12 h-12
              flex items-center justify-center
              bg-primary-100 dark:bg-primary-900
              text-primary-600 dark:text-primary-400
              rounded-full
              font-semibold
              flex-shrink-0
            "
          >
            {{
              (conversation.contact?.name || conversation.contact?.phone || "?")
                .charAt(0)
                .toUpperCase()
            }}
          </div>

          <!-- Conversation Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <p
                class="
                  font-medium truncate
                  text-text-primary dark:text-dark-text-primary
                "
              >
                {{
                  conversation.contact?.name ||
                  conversation.contact?.phone ||
                  "Unknown Contact"
                }}
              </p>
              <span
                class="
                  px-2 py-0.5
                  rounded-full
                  text-xs font-medium
                "
                :class="
                  conversation.contact?.scoreColor === 'green'
                    ? 'bg-success-light text-success'
                    : conversation.contact?.scoreColor === 'yellow'
                    ? 'bg-warning-light text-warning'
                    : 'bg-error-light text-error'
                "
              >
                {{ conversation.contact?.behaviorScore || 0 }}
              </span>
            </div>
            <p
              class="
                text-sm truncate
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ getLastMessage(conversation) }}
            </p>
          </div>

          <!-- Assignment Info -->
          <div class="flex flex-col items-end gap-2 flex-shrink-0">
            <div
              v-if="conversation.assignedToUser"
              class="
                flex items-center gap-2
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              <Icon name="heroicons:user" class="w-4 h-4" />
              <span>{{ conversation.assignedToUser.name }}</span>
            </div>
            <div
              v-else
              class="
                px-3 py-1
                bg-warning-light text-warning
                rounded-full
                text-xs font-medium
              "
            >
              Unassigned
            </div>
            <span
              class="
                px-3 py-1
                rounded-full
                text-xs font-medium
              "
              :class="
                conversation.status === 'completed'
                  ? 'bg-success-light text-success'
                  : conversation.status === 'in_progress'
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : conversation.status === 'new'
                  ? 'bg-info-light text-info'
                  : 'bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary'
              "
            >
              {{ conversation.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTrpc } from "~/composables/useTrpc";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const trpc = useTrpc();

const conversations = ref<any[]>([]);
const agents = ref<any[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const statusFilter = ref("");
const assignedToFilter = ref("");
const unassignedCount = ref(0);

const filteredConversations = computed(() => {
  let filtered = conversations.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.contact?.name?.toLowerCase().includes(query) ||
        c.contact?.phone?.toLowerCase().includes(query) ||
        getLastMessage(c).toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    filtered = filtered.filter((c) => c.status === statusFilter.value);
  }

  if (assignedToFilter.value) {
    filtered = filtered.filter(
      (c) => c.assignedTo === assignedToFilter.value
    );
  }

  return filtered;
});

const getLastMessage = (conversation: any) => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages[0].content;
  }
  return "No messages yet";
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [conversationsResult, agentsResult, unassignedResult] =
      await Promise.all([
        trpc.conversations.list.query({
          limit: 50,
          offset: 0,
        }),
        trpc.user.list.query(),
        trpc.conversations.listUnassigned.query(),
      ]);

    conversations.value = conversationsResult.conversations;
    agents.value = agentsResult.filter(
      (u: any) => u.role === "company_user"
    );
    unassignedCount.value = unassignedResult.length;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

