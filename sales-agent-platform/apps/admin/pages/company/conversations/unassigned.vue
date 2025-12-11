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
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/company/conversations"
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
            Unassigned Conversations
          </h1>
          <p
            class="
              text-sm
              md:text-base
              text-text-secondary dark:text-dark-text-secondary
              mt-2
            "
          >
            Assign new conversations to agents
          </p>
        </div>
      </div>
    </div>

    <!-- Unassigned List -->
    <div
      v-if="isLoading"
      class="flex justify-center py-12"
    >
      <div
        class="
          animate-spin rounded-full h-10 w-10
          border-b-2 border-primary-500
        "
      ></div>
    </div>

    <div
      v-else-if="conversations.length === 0"
      class="
        flex flex-col items-center justify-center py-12
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <Icon
        name="heroicons:check-circle"
        class="w-16 h-16 mb-4 text-success"
      />
      <p class="text-text-secondary dark:text-dark-text-secondary">
        All conversations are assigned!
      </p>
    </div>

    <div
      v-else
      class="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
      "
    >
      <div
        v-for="conversation in conversations"
        :key="conversation.id"
        class="
          flex flex-col gap-4 p-6
          bg-card dark:bg-dark-card
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <!-- Contact Info -->
        <div class="flex items-center gap-3">
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
            {{
              (conversation.contact?.name || conversation.contact?.phone || "?")
                .charAt(0)
                .toUpperCase()
            }}
          </div>
          <div class="flex-1 min-w-0">
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
            <p
              class="
                text-sm truncate
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ conversation.contact?.platform }}
            </p>
          </div>
          <span
            class="
              px-2 py-1
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

        <!-- Last Message -->
        <div
          class="
            p-3
            bg-surface dark:bg-dark-surface
            rounded-ios
            text-sm
            text-text-primary dark:text-dark-text-primary
            line-clamp-2
          "
        >
          {{ getLastMessage(conversation) }}
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
          <select
            v-model="assignmentMap[conversation.id]"
            class="
              w-full px-4 py-2
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-text-primary
              border border-border dark:border-dark-border
              rounded-ios
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all duration-300
            "
            @change="assignConversation(conversation.id, $event.target.value)"
          >
            <option value="">Select agent...</option>
            <option
              v-for="agent in agents"
              :key="agent.id"
              :value="agent.id"
            >
              {{ agent.name }}
            </option>
          </select>
          <NuxtLink
            :to="`/company/conversations/${conversation.id}`"
            class="
              w-full px-4 py-2
              bg-primary-500 text-white
              rounded-ios
              font-medium text-center
              transition-all duration-300
              hover:bg-primary-600
              active:scale-95
            "
          >
            View Details
          </NuxtLink>
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

const conversations = ref<any[]>([]);
const agents = ref<any[]>([]);
const isLoading = ref(true);
const assignmentMap = ref<Record<string, string>>({});

const getLastMessage = (conversation: any) => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages[0].content;
  }
  return "No messages yet";
};

const assignConversation = async (conversationId: string, userId: string) => {
  if (!userId) return;

  try {
    await trpc.conversations.assign.mutate({
      conversationId,
      userId,
      reason: "Assigned from unassigned queue",
    });

    // Remove from list
    conversations.value = conversations.value.filter(
      (c) => c.id !== conversationId
    );
  } catch (error) {
    console.error("Failed to assign conversation:", error);
    assignmentMap.value[conversationId] = "";
  }
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const [unassignedResult, agentsResult] = await Promise.all([
      trpc.conversations.listUnassigned.query(),
      trpc.user.list.query(),
    ]);

    conversations.value = unassignedResult;
    agents.value = agentsResult.filter(
      (u: any) => u.role === "company_user"
    );
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

