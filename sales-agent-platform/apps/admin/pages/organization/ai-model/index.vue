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
          AI Model Configuration
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Configure and train your company's AI model
        </p>
      </div>

      <button
        @click="showCreateVersionModal = true"
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
        <Icon name="heroicons:plus" class="w-5 h-5 inline mr-2" />
        New Version
      </button>
    </div>

    <!-- Active Model Overview -->
    <div
      v-if="activeModel"
      class="
        flex flex-col gap-4 p-6
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <div class="flex items-center justify-between">
        <div>
          <h2
            class="
              text-xl font-semibold
              text-text-primary dark:text-dark-text-primary
            "
          >
            Active Model: {{ activeModel.version }}
          </h2>
          <p
            class="
              text-sm
              text-text-secondary dark:text-dark-text-secondary
              mt-1
            "
          >
            Deployed {{ formatDate(activeModel.deployedAt) }}
          </p>
        </div>
        <span
          class="
            px-3 py-1
            bg-success-light text-success
            rounded-full
            text-sm font-medium
          "
        >
          Active
        </span>
      </div>

      <!-- Performance Metrics -->
      <div
        class="
          grid grid-cols-2 md:grid-cols-4 gap-4
          pt-4 border-t border-border dark:border-dark-border
        "
      >
        <div>
          <p
            class="
              text-sm
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Usage Rate
          </p>
          <p
            class="
              text-2xl font-bold
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{
              activeModel.performanceMetrics?.usageRate
                ? `${Math.round(activeModel.performanceMetrics.usageRate)}%`
                : "N/A"
            }}
          </p>
        </div>
        <div>
          <p
            class="
              text-sm
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Avg Rating
          </p>
          <p
            class="
              text-2xl font-bold
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{
              activeModel.performanceMetrics?.avgRating
                ? activeModel.performanceMetrics.avgRating.toFixed(1)
                : "N/A"
            }}
            <span class="text-lg">⭐</span>
          </p>
        </div>
        <div>
          <p
            class="
              text-sm
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Human-Likeness
          </p>
          <p
            class="
              text-2xl font-bold
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{
              activeModel.rlhfMetrics?.humanLikenessScore
                ? `${Math.round(
                    activeModel.rlhfMetrics.humanLikenessScore * 100
                  )}%`
                : "N/A"
            }}
          </p>
        </div>
        <div>
          <p
            class="
              text-sm
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Suggestions
          </p>
          <p
            class="
              text-2xl font-bold
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{
              activeModel.performanceMetrics?.totalSuggestions || 0
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Model Versions -->
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
        Model Versions
      </h2>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div
          class="
            animate-spin rounded-full h-8 w-8
            border-b-2 border-primary-500
          "
        ></div>
      </div>

      <div
        v-else-if="modelVersions.length === 0"
        class="py-8 text-center"
      >
        <p class="text-text-secondary dark:text-dark-text-secondary">
          No model versions yet
        </p>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="version in modelVersions"
          :key="version.id"
          class="
            flex items-center justify-between p-4
            bg-surface dark:bg-dark-surface
            rounded-ios-lg
            border border-border dark:border-dark-border
            transition-all duration-300
            hover:shadow-ios
          "
        >
          <div class="flex items-center gap-4">
            <div
              class="
                w-12 h-12
                flex items-center justify-center
                bg-primary-100 dark:bg-primary-900
                text-primary-600 dark:text-primary-400
                rounded-ios-lg
                font-bold
              "
            >
              {{ version.version }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p
                  class="
                    font-semibold
                    text-text-primary dark:text-dark-text-primary
                  "
                >
                  {{ version.version }}
                </p>
                <span
                  v-if="version.isActive"
                  class="
                    px-2 py-0.5
                    bg-success-light text-success
                    rounded-full
                    text-xs font-medium
                  "
                >
                  Active
                </span>
              </div>
              <p
                class="
                  text-sm
                  text-text-secondary dark:text-dark-text-secondary
                "
              >
                {{ version.responseStyle }} • Temperature: {{ version.temperature }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="testModel(version.id)"
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
              Test
            </button>
            <button
              v-if="!version.isActive"
              @click="activateVersion(version.id)"
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
              Activate
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Interface -->
    <div
      v-if="showTestInterface"
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
        Test AI Model
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <label
            class="
              block text-sm font-medium mb-2
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            Customer Message
          </label>
          <textarea
            v-model="testCustomerMessage"
            rows="3"
            placeholder="Enter a customer message to test..."
            class="
              w-full px-4 py-3
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-text-primary
              border border-border dark:border-dark-border
              rounded-ios-lg
              focus:outline-none focus:ring-2 focus:ring-primary-500
              transition-all duration-300
            "
          ></textarea>
        </div>
        <button
          @click="runTest"
          :disabled="!testCustomerMessage.trim() || isTesting"
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
          Generate Response
        </button>
        <div
          v-if="testResponse"
          class="
            p-4
            bg-surface dark:bg-dark-surface
            rounded-ios-lg
            text-text-primary dark:text-dark-text-primary
          "
        >
          <p class="font-medium mb-2">AI Response:</p>
          <p class="text-sm whitespace-pre-wrap">{{ testResponse }}</p>
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
  requiredRole: "organization_admin",
});

const trpc = useTrpc();

const activeModel = ref<any>(null);
const modelVersions = ref<any[]>([]);
const isLoading = ref(true);
const showCreateVersionModal = ref(false);
const showTestInterface = ref(false);
const testCustomerMessage = ref("");
const testResponse = ref("");
const isTesting = ref(false);

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchModels = async () => {
  isLoading.value = true;
  try {
    const [active, versions] = await Promise.all([
      trpc.aiModels.getActiveModel.query(),
      trpc.aiModels.listModelVersions.query(),
    ]);

    activeModel.value = active;
    modelVersions.value = versions;
  } catch (error) {
    console.error("Failed to fetch models:", error);
  } finally {
    isLoading.value = false;
  }
};

const activateVersion = async (versionId: string) => {
  try {
    await trpc.aiModels.activateModelVersion.mutate({ versionId });
    await fetchModels();
  } catch (error) {
    console.error("Failed to activate version:", error);
  }
};

const testModel = (versionId: string) => {
  showTestInterface.value = true;
  // TODO: Set test version ID
};

const runTest = async () => {
  if (!testCustomerMessage.value.trim() || isTesting.value) return;

  isTesting.value = true;
  try {
    const result = await trpc.aiModels.testModel.mutate({
      modelVersionId: activeModel.value.id,
      customerMessage: testCustomerMessage.value,
      expectedBehavior: "Helpful and natural response",
    });

    testResponse.value = result.actualResponse;
  } catch (error) {
    console.error("Failed to test model:", error);
  } finally {
    isTesting.value = false;
  }
};

onMounted(() => {
  fetchModels();
});
</script>

