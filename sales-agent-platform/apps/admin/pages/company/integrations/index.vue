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
        Integrations
      </h1>
      <p
        class="
          text-sm
          md:text-base
          text-text-secondary dark:text-dark-text-secondary
          mt-2
        "
      >
        Configure WhatsApp and Telegram integrations
      </p>
    </div>

    <!-- WhatsApp Integration -->
    <div
      class="
        flex flex-col gap-6 p-6
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon
            name="heroicons:chat-bubble-left-right"
            class="w-8 h-8 text-success"
          />
          <div>
            <h2
              class="
                text-xl font-semibold
                text-text-primary dark:text-dark-text-primary
              "
            >
              WhatsApp (OnSend)
            </h2>
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Connect your WhatsApp Business account
            </p>
          </div>
        </div>
        <span
          class="
            px-3 py-1
            rounded-full
            text-sm font-medium
          "
          :class="
            whatsappStatus === 'connected'
              ? 'bg-success-light text-success'
              : whatsappStatus === 'error'
              ? 'bg-error-light text-error'
              : 'bg-warning-light text-warning'
          "
        >
          {{ whatsappStatus || "Not Connected" }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="
              block text-sm font-medium mb-2
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            OnSend API Key
          </label>
          <input
            v-model="whatsappForm.apiKey"
            type="password"
            placeholder="Enter API key..."
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
        <div>
          <label
            class="
              block text-sm font-medium mb-2
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            OnSend API Secret
          </label>
          <input
            v-model="whatsappForm.apiSecret"
            type="password"
            placeholder="Enter API secret..."
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
        <div>
          <label
            class="
              block text-sm font-medium mb-2
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Phone Number ID
          </label>
          <input
            v-model="whatsappForm.phoneNumberId"
            type="text"
            placeholder="Enter phone number ID..."
            class="
              w-full px-4 py-3
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-surface
              border border-border dark:border-dark-border
              rounded-ios-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all duration-300
            "
          />
        </div>
      </div>

      <div
        v-if="whatsappWebhookUrl"
        class="
          p-4
          bg-surface dark:bg-dark-surface
          rounded-ios-lg
        "
      >
        <label
          class="
            block text-sm font-medium mb-2
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Webhook URL
        </label>
        <div class="flex items-center gap-2">
          <input
            :value="whatsappWebhookUrl"
            type="text"
            readonly
            class="
              flex-1 px-4 py-2
              bg-background dark:bg-dark-background
              text-text-primary dark:text-dark-text-primary
              border border-border dark:border-dark-border
              rounded-ios
              focus:outline-none
            "
          />
          <button
            @click="copyToClipboard(whatsappWebhookUrl)"
            class="
              px-4 py-2
              bg-primary-500 text-white
              rounded-ios
              transition-all duration-300
              hover:bg-primary-600
              active:scale-95
            "
          >
            <Icon name="heroicons:clipboard" class="w-5 h-5" />
          </button>
        </div>
        <p
          class="
            text-xs mt-2
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Configure this URL in your OnSend dashboard
        </p>
      </div>

      <div class="flex gap-3">
        <button
          @click="testWhatsApp"
          :disabled="isTestingWhatsApp"
          class="
            px-6 py-3
            bg-surface dark:bg-dark-surface
            text-text-primary dark:text-dark-text-primary
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-surface/80
            active:scale-95
            disabled:opacity-50
          "
        >
          Test Connection
        </button>
        <button
          @click="saveWhatsApp"
          :disabled="isSavingWhatsApp"
          class="
            px-6 py-3
            bg-primary-500 text-white
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-primary-600
            active:scale-95
            disabled:opacity-50
          "
        >
          Save Configuration
        </button>
      </div>
    </div>

    <!-- Telegram Integration -->
    <div
      class="
        flex flex-col gap-6 p-6
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon
            name="heroicons:paper-airplane"
            class="w-8 h-8 text-info"
          />
          <div>
            <h2
              class="
                text-xl font-semibold
                text-text-primary dark:text-dark-text-primary
              "
            >
              Telegram
            </h2>
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Connect your Telegram bot
            </p>
          </div>
        </div>
        <span
          class="
            px-3 py-1
            rounded-full
            text-sm font-medium
          "
          :class="
            telegramStatus === 'connected'
              ? 'bg-success-light text-success'
              : telegramStatus === 'error'
              ? 'bg-error-light text-error'
              : 'bg-warning-light text-warning'
          "
        >
          {{ telegramStatus || "Not Connected" }}
        </span>
      </div>

      <div>
        <label
          class="
            block text-sm font-medium mb-2
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Telegram Bot Token
        </label>
        <input
          v-model="telegramForm.botToken"
          type="password"
          placeholder="Enter bot token from @BotFather..."
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

      <div
        v-if="telegramWebhookUrl"
        class="
          p-4
          bg-surface dark:bg-dark-surface
          rounded-ios-lg
        "
      >
        <label
          class="
            block text-sm font-medium mb-2
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Webhook URL
        </label>
        <div class="flex items-center gap-2">
          <input
            :value="telegramWebhookUrl"
            type="text"
            readonly
            class="
              flex-1 px-4 py-2
              bg-background dark:bg-dark-background
              text-text-primary dark:text-dark-text-primary
              border border-border dark:border-dark-border
              rounded-ios
              focus:outline-none
            "
          />
          <button
            @click="copyToClipboard(telegramWebhookUrl)"
            class="
              px-4 py-2
              bg-primary-500 text-white
              rounded-ios
              transition-all duration-300
              hover:bg-primary-600
              active:scale-95
            "
          >
            <Icon name="heroicons:clipboard" class="w-5 h-5" />
          </button>
        </div>
        <p
          class="
            text-xs mt-2
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          Configure this URL in your Telegram Bot settings
        </p>
      </div>

      <div class="flex gap-3">
        <button
          @click="testTelegram"
          :disabled="isTestingTelegram"
          class="
            px-6 py-3
            bg-surface dark:bg-dark-surface
            text-text-primary dark:text-dark-text-primary
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-surface/80
            active:scale-95
            disabled:opacity-50
          "
        >
          Test Connection
        </button>
        <button
          @click="saveTelegram"
          :disabled="isSavingTelegram"
          class="
            px-6 py-3
            bg-primary-500 text-white
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-primary-600
            active:scale-95
            disabled:opacity-50
          "
        >
          Save Configuration
        </button>
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

const whatsappStatus = ref<string>("");
const telegramStatus = ref<string>("");
const whatsappForm = ref({
  apiKey: "",
  apiSecret: "",
  phoneNumberId: "",
});
const telegramForm = ref({
  botToken: "",
});
const whatsappWebhookUrl = ref("");
const telegramWebhookUrl = ref("");
const isTestingWhatsApp = ref(false);
const isSavingWhatsApp = ref(false);
const isTestingTelegram = ref(false);
const isSavingTelegram = ref(false);

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // TODO: Show toast notification
  } catch (error) {
    console.error("Failed to copy:", error);
  }
};

const fetchIntegrations = async () => {
  try {
    const integration = await trpc.integrations.get.query();
    if (integration) {
      whatsappStatus.value = integration.onsendConnectionStatus || "";
      telegramStatus.value = integration.telegramConnectionStatus || "";
      whatsappWebhookUrl.value = integration.whatsappWebhookUrl || "";
      telegramWebhookUrl.value = integration.telegramWebhookUrl || "";
    }

    const webhookUrls = await trpc.integrations.getWebhookUrls.query();
    whatsappWebhookUrl.value = webhookUrls.whatsapp || "";
    telegramWebhookUrl.value = webhookUrls.telegram || "";
  } catch (error) {
    console.error("Failed to fetch integrations:", error);
  }
};

const testWhatsApp = async () => {
  isTestingWhatsApp.value = true;
  try {
    const result = await trpc.integrations.testWhatsApp.mutate();
    whatsappStatus.value = result.connected ? "connected" : "error";
  } catch (error) {
    whatsappStatus.value = "error";
    console.error("Failed to test WhatsApp:", error);
  } finally {
    isTestingWhatsApp.value = false;
  }
};

const saveWhatsApp = async () => {
  isSavingWhatsApp.value = true;
  try {
    await trpc.integrations.updateWhatsApp.mutate({
      onsendApiKey: whatsappForm.value.apiKey,
      onsendApiSecret: whatsappForm.value.apiSecret,
      onsendPhoneNumberId: whatsappForm.value.phoneNumberId,
    });
    await fetchIntegrations();
  } catch (error) {
    console.error("Failed to save WhatsApp config:", error);
  } finally {
    isSavingWhatsApp.value = false;
  }
};

const testTelegram = async () => {
  isTestingTelegram.value = true;
  try {
    const result = await trpc.integrations.testTelegram.mutate();
    telegramStatus.value = result.connected ? "connected" : "error";
  } catch (error) {
    telegramStatus.value = "error";
    console.error("Failed to test Telegram:", error);
  } finally {
    isTestingTelegram.value = false;
  }
};

const saveTelegram = async () => {
  isSavingTelegram.value = true;
  try {
    await trpc.integrations.updateTelegram.mutate({
      telegramBotToken: telegramForm.value.botToken,
    });
    await fetchIntegrations();
  } catch (error) {
    console.error("Failed to save Telegram config:", error);
  } finally {
    isSavingTelegram.value = false;
  }
};

onMounted(() => {
  fetchIntegrations();
});
</script>

