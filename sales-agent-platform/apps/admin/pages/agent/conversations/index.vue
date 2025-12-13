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
        My Conversations
      </h1>
      <p
        class="
          text-sm
          md:text-base
          text-text-secondary dark:text-dark-text-secondary
          mt-2
        "
      >
        Conversations assigned to you
      </p>
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
        <option value="in_progress">In Progress</option>
        <option value="waiting">Waiting</option>
        <option value="completed">Completed</option>
      </select>

      <select
        v-model="scoreFilter"
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
        <option value="">All Scores</option>
        <option value="green">Hot Leads</option>
        <option value="yellow">Warm Leads</option>
        <option value="red">Cold Leads</option>
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
          No conversations assigned
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
          @click="navigateTo(`/agent/conversations/${conversation.id}`)"
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

          <!-- Status & Time -->
          <div class="flex flex-col items-end gap-2 flex-shrink-0">
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
                  : 'bg-surface dark:bg-dark-surface text-text-secondary dark:text-dark-text-secondary'
              "
            >
              {{ conversation.status }}
            </span>
            <p
              class="
                text-xs
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ formatTimeAgo(getLastMessageTime(conversation)) }}
            </p>
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
  requiresAuth: true,
  requiredRole: "organization_user",
});

const trpc = useTrpc();

const conversations = ref<any[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const statusFilter = ref("");
const scoreFilter = ref("");

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

  if (scoreFilter.value) {
    filtered = filtered.filter(
      (c) => c.contact?.scoreColor === scoreFilter.value
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

const getLastMessageTime = (conversation: any) => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages[0].timestamp;
  }
  return conversation.updatedAt || conversation.createdAt;
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

const fetchConversations = async () => {
  isLoading.value = true;
  try {
    conversations.value = await trpc.agent.conversations.list.query();
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchConversations();
});
</script>

