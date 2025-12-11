<template>
  <div
    class="
      flex flex-col h-screen
      bg-background dark:bg-dark-background
    "
  >
    <!-- Header -->
    <div
      class="
        flex items-center justify-between p-4
        bg-card dark:bg-dark-card
        border-b border-border dark:border-dark-border
      "
    >
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/agent/conversations"
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
        <div class="flex items-center gap-3">
          <div
            class="
              w-10 h-10
              flex items-center justify-center
              bg-primary-100 dark:bg-primary-900
              text-primary-600 dark:text-primary-400
              rounded-full
              font-semibold
            "
          >
            {{
              (contact?.name || contact?.phone || "?")
                .charAt(0)
                .toUpperCase()
            }}
          </div>
          <div>
            <p
              class="
                font-medium
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ contact?.name || contact?.phone || "Unknown Contact" }}
            </p>
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ contact?.platform }} • Score:
              <span
                :class="
                  contact?.scoreColor === 'green'
                    ? 'text-success'
                    : contact?.scoreColor === 'yellow'
                    ? 'text-warning'
                    : 'text-error'
                "
              >
                {{ contact?.behaviorScore || 0 }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="showCompleteModal = true"
          class="
            px-4 py-2
            bg-success text-white
            rounded-ios
            font-medium
            transition-all duration-300
            hover:bg-success-dark
            active:scale-95
          "
        >
          Mark Complete
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div
      ref="messagesContainer"
      class="
        flex-1 overflow-y-auto p-4
        space-y-4
      "
    >
      <div v-if="isLoading" class="flex justify-center py-8">
        <div
          class="
            animate-spin rounded-full h-8 w-8
            border-b-2 border-primary-500
          "
        ></div>
      </div>

      <div
        v-for="message in messages"
        :key="message.id"
        class="
          flex
          transition-all duration-300
        "
        :class="
          message.senderType === 'contact'
            ? 'justify-start'
            : 'justify-end'
        "
      >
        <div
          class="
            max-w-[70%] md:max-w-[60%]
            flex flex-col gap-1
          "
          :class="
            message.senderType === 'contact'
              ? 'items-start'
              : 'items-end'
          "
        >
          <div
            class="
              px-4 py-3
              rounded-ios-lg
              transition-all duration-300
            "
            :class="
              message.senderType === 'contact'
                ? 'bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary'
                : 'bg-primary-500 text-white'
            "
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <div
              v-if="message.suggestedByAi"
              class="
                mt-2 pt-2 border-t
                text-xs opacity-75
              "
              :class="
                message.senderType === 'contact'
                  ? 'border-border dark:border-dark-border'
                  : 'border-white/20'
              "
            >
              ✨ AI Suggested
            </div>
          </div>
          <p
            class="
              text-xs px-2
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            {{ formatTime(message.timestamp) }}
          </p>
        </div>
      </div>
    </div>

    <!-- AI Suggestion Panel -->
    <div
      v-if="aiSuggestion && !messageInput"
      class="
        p-4
        bg-primary-50 dark:bg-primary-900/20
        border-t border-border dark:border-dark-border
      "
    >
      <div class="flex items-start gap-3">
        <Icon
          name="heroicons:sparkles"
          class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
        />
        <div class="flex-1">
          <p
            class="
              text-sm font-medium mb-2
              text-text-primary dark:text-dark-text-primary
            "
          >
            AI Suggestion
          </p>
          <p
            class="
              text-sm mb-3
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            {{ aiSuggestion.suggestedMessage }}
          </p>
          <div class="flex gap-2">
            <button
              @click="useAISuggestion"
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
              Use Suggestion
            </button>
            <button
              @click="dismissSuggestion"
              class="
                px-4 py-2
                bg-surface dark:bg-dark-surface
                text-text-primary dark:text-dark-text-primary
                rounded-ios
                text-sm font-medium
                transition-all duration-300
                hover:bg-surface/80
                active:scale-95
              "
            >
              Dismiss
            </button>
            <button
              @click="rateSuggestion(5)"
              class="
                px-3 py-2
                bg-surface dark:bg-dark-surface
                text-text-primary dark:text-dark-text-primary
                rounded-ios
                text-sm
                transition-all duration-300
                hover:bg-surface/80
                active:scale-95
              "
            >
              ⭐ Rate
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div
      class="
        p-4
        bg-card dark:bg-dark-card
        border-t border-border dark:border-dark-border
      "
    >
      <div class="flex items-end gap-3">
        <div class="flex-1">
          <textarea
            v-model="messageInput"
            placeholder="Type a message..."
            rows="1"
            class="
              w-full px-4 py-3
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-text-primary
              border border-border dark:border-dark-border
              rounded-ios-lg
              resize-none
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all duration-300
            "
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact="messageInput += '\n'"
          ></textarea>
        </div>
        <button
          @click="requestAISuggestion"
          :disabled="isLoadingAI"
          class="
            p-3
            bg-surface dark:bg-dark-surface
            text-primary-500
            rounded-ios-lg
            transition-all duration-300
            hover:bg-surface/80
            active:scale-95
            disabled:opacity-50
          "
        >
          <Icon
            name="heroicons:sparkles"
            class="w-5 h-5"
          />
        </button>
        <button
          @click="sendMessage"
          :disabled="!messageInput.trim() || isSending"
          class="
            px-6 py-3
            bg-primary-500 text-white
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-primary-600
            active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Complete Conversation Modal -->
    <div
      v-if="showCompleteModal"
      class="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        p-4
        z-50
      "
      @click="showCompleteModal = false"
    >
      <div
        class="
          w-full max-w-md
          bg-card dark:bg-dark-card
          rounded-ios-xl shadow-ios-xl
          border border-border dark:border-dark-border
          p-6
        "
        @click.stop
      >
        <h2
          class="
            text-xl font-bold mb-4
            text-text-primary dark:text-dark-text-primary
          "
        >
          Complete Conversation
        </h2>
        <div class="flex flex-col gap-4">
          <div>
            <label
              class="
                block text-sm font-medium mb-2
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Status
            </label>
            <select
              v-model="completeForm.status"
              class="
                w-full px-4 py-3
                bg-surface dark:bg-dark-surface
                text-text-primary dark:text-dark-text-primary
                border border-border dark:border-dark-border
                rounded-ios-lg
                focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-all duration-300
              "
            >
              <option value="completed">Completed (Sale)</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          <div v-if="completeForm.status === 'completed'">
            <label
              class="
                block text-sm font-medium mb-2
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Sale Amount
            </label>
            <input
              v-model.number="completeForm.saleAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              class="
                w-full px-4 py-3
                bg-surface dark:bg-dark-surface
                text-text-primary dark:text-dark-text-primary
                border border-border dark:border-dark-border
                rounded-ios-lg
                focus:outline-none focus:ring-2 focus:ring-primary-500
                transition-all duration-300
              "
            />
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="showCompleteModal = false"
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
              @click="completeConversation"
              class="
                px-4 py-2
                bg-primary-500 text-white
                rounded-ios
                transition-all duration-300
                hover:bg-primary-600
              "
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useTrpc } from "~/composables/useTrpc";

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const route = useRoute();
const trpc = useTrpc();

const conversation = ref<any>(null);
const contact = ref<any>(null);
const messages = ref<any[]>([]);
const aiSuggestion = ref<any>(null);
const messageInput = ref("");
const isLoading = ref(true);
const isSending = ref(false);
const isLoadingAI = ref(false);
const showCompleteModal = ref(false);
const completeForm = ref({
  status: "completed",
  saleAmount: 0,
});
const messagesContainer = ref<HTMLElement | null>(null);

const formatTime = (date: Date | string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop =
        messagesContainer.value.scrollHeight;
    }
  });
};

const fetchConversation = async () => {
  isLoading.value = true;
  try {
    const conversationId = route.params.id as string;
    const conv = await trpc.agent.conversations.get.query({ conversationId });

    conversation.value = conv;
    contact.value = conv.contact;
    messages.value = conv.messages || [];

    scrollToBottom();
  } catch (error) {
    console.error("Failed to fetch conversation:", error);
  } finally {
    isLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!messageInput.value.trim() || isSending.value) return;

  const content = messageInput.value.trim();
  messageInput.value = "";
  isSending.value = true;

  try {
    await trpc.agent.conversations.sendMessage.mutate({
      conversationId: conversation.value.id,
      message: content,
    });

    aiSuggestion.value = null;
    await fetchConversation();
  } catch (error) {
    console.error("Failed to send message:", error);
    messageInput.value = content;
  } finally {
    isSending.value = false;
  }
};

const requestAISuggestion = async () => {
  if (isLoadingAI.value) return;

  isLoadingAI.value = true;
  try {
    const suggestion = await trpc.agent.ai.getSuggestion.query({
      conversationId: conversation.value.id,
    });
    aiSuggestion.value = suggestion;
  } catch (error) {
    console.error("Failed to get AI suggestion:", error);
  } finally {
    isLoadingAI.value = false;
  }
};

const useAISuggestion = async () => {
  if (!aiSuggestion.value) return;

  try {
    await trpc.agent.ai.useAndSend.mutate({
      suggestionId: aiSuggestion.value.suggestionId,
      modifiedMessage: messageInput.value || undefined,
    });

    messageInput.value = "";
    aiSuggestion.value = null;
    await fetchConversation();
  } catch (error) {
    console.error("Failed to use AI suggestion:", error);
  }
};

const dismissSuggestion = () => {
  aiSuggestion.value = null;
};

const rateSuggestion = async (rating: number) => {
  if (!aiSuggestion.value) return;

  try {
    await trpc.agent.ai.rateSuggestion.mutate({
      suggestionId: aiSuggestion.value.suggestionId,
      rating,
    });
    aiSuggestion.value = null;
  } catch (error) {
    console.error("Failed to rate suggestion:", error);
  }
};

const completeConversation = async () => {
  try {
    await trpc.agent.conversations.markComplete.mutate({
      conversationId: conversation.value.id,
      status: completeForm.value.status,
      saleAmount:
        completeForm.value.status === "completed"
          ? completeForm.value.saleAmount
          : undefined,
    });

    showCompleteModal.value = false;
    await navigateTo("/agent/conversations");
  } catch (error) {
    console.error("Failed to complete conversation:", error);
  }
};

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

onMounted(() => {
  fetchConversation();
});
</script>

