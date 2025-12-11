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
          Success Case Templates
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Manage templates for your company. AI checks these first before generating responses.
        </p>
      </div>

      <button
        @click="showCreateModal = true"
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
        Create Template
      </button>
    </div>

    <!-- Tabs -->
    <div
      class="
        flex gap-2
        border-b border-border dark:border-dark-border
      "
    >
      <button
        @click="activeTab = 'enabled'"
        class="
          px-4 py-2
          font-medium
          transition-all duration-300
          border-b-2
        "
        :class="
          activeTab === 'enabled'
            ? 'border-primary-500 text-primary-500'
            : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
        "
      >
        Enabled Templates
      </button>
      <button
        @click="activeTab = 'global'"
        class="
          px-4 py-2
          font-medium
          transition-all duration-300
          border-b-2
        "
        :class="
          activeTab === 'global'
            ? 'border-primary-500 text-primary-500'
            : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
        "
      >
        Global Templates
      </button>
      <button
        @click="activeTab = 'company'"
        class="
          px-4 py-2
          font-medium
          transition-all duration-300
          border-b-2
        "
        :class="
          activeTab === 'company'
            ? 'border-primary-500 text-primary-500'
            : 'border-transparent text-text-secondary dark:text-dark-text-secondary hover:text-text-primary dark:hover:text-dark-text-primary'
        "
      >
        Company Templates
      </button>
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
          placeholder="Search templates..."
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
        v-model="categoryFilter"
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
        <option value="">All Categories</option>
        <option value="greeting">Greeting</option>
        <option value="objection_handling">Objection Handling</option>
        <option value="product_inquiry">Product Inquiry</option>
        <option value="closing">Closing</option>
        <option value="follow_up">Follow-up</option>
      </select>

      <select
        v-model="languageFilter"
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
        <option value="">All Languages</option>
        <option value="en">English</option>
        <option value="zh">Chinese</option>
        <option value="bm">Bahasa Malaysia</option>
      </select>
    </div>

    <!-- Templates List -->
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
      v-else-if="filteredTemplates.length === 0"
      class="
        flex flex-col items-center justify-center py-12
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <Icon
        name="heroicons:document-text"
        class="w-16 h-16 mb-4 text-text-secondary dark:text-dark-text-secondary"
      />
      <p class="text-text-secondary dark:text-dark-text-secondary">
        No templates found
      </p>
    </div>

    <div
      v-else
      class="
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
      "
    >
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="
          flex flex-col gap-4 p-6
          bg-card dark:bg-dark-card
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <!-- Template Header -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3
              class="
                text-lg font-semibold mb-1
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ template.name }}
            </h3>
            <p
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ template.category || "General" }} • {{ template.language }}
            </p>
          </div>
          <div
            v-if="template.isPreferred"
            class="
              px-2 py-1
              bg-primary-100 dark:bg-primary-900
              text-primary-700 dark:text-primary-300
              rounded-full
              text-xs font-medium
            "
          >
            Preferred
          </div>
        </div>

        <!-- Template Description -->
        <p
          v-if="template.description"
          class="
            text-sm line-clamp-2
            text-text-secondary dark:text-dark-text-secondary
          "
        >
          {{ template.description }}
        </p>

        <!-- Template Stats -->
        <div
          class="
            flex items-center gap-4 pt-4
            border-t border-border dark:border-dark-border
          "
        >
          <div class="flex items-center gap-2">
            <Icon
              name="heroicons:chart-bar"
              class="w-4 h-4 text-text-secondary dark:text-dark-text-secondary"
            />
            <span
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ template.usageCount || 0 }} uses
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-2">
          <button
            v-if="activeTab === 'global' && !template.isEnabled"
            @click="enableTemplate(template.id)"
            class="
              flex-1 px-4 py-2
              bg-primary-500 text-white
              rounded-ios
              font-medium text-sm
              transition-all duration-300
              hover:bg-primary-600
              active:scale-95
            "
          >
            Enable
          </button>
          <button
            v-else-if="activeTab === 'enabled'"
            @click="disableTemplate(template.id)"
            class="
              flex-1 px-4 py-2
              bg-warning text-white
              rounded-ios
              font-medium text-sm
              transition-all duration-300
              hover:bg-warning-dark
              active:scale-95
            "
          >
            Disable
          </button>
          <button
            @click="testTemplate(template)"
            class="
              px-4 py-2
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-text-primary
              rounded-ios
              font-medium text-sm
              transition-all duration-300
              hover:bg-surface/80
              active:scale-95
            "
          >
            Test
          </button>
          <button
            @click="setPreferred(template.id, !template.isPreferred)"
            class="
              px-4 py-2
              rounded-ios
              font-medium text-sm
              transition-all duration-300
              active:scale-95
            "
            :class="
              template.isPreferred
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                : 'bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary hover:bg-surface/80'
            "
          >
            <Icon
              :name="template.isPreferred ? 'heroicons:star-solid' : 'heroicons:star'"
              class="w-4 h-4"
            />
          </button>
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

const enabledTemplates = ref<any[]>([]);
const globalTemplates = ref<any[]>([]);
const companyTemplates = ref<any[]>([]);
const isLoading = ref(true);
const activeTab = ref("enabled");
const searchQuery = ref("");
const categoryFilter = ref("");
const languageFilter = ref("");
const showCreateModal = ref(false);

const filteredTemplates = computed(() => {
  let templates: any[] = [];

  if (activeTab.value === "enabled") {
    templates = enabledTemplates.value;
  } else if (activeTab.value === "global") {
    templates = globalTemplates.value;
  } else {
    templates = companyTemplates.value;
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    templates = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }

  if (categoryFilter.value) {
    templates = templates.filter((t) => t.category === categoryFilter.value);
  }

  if (languageFilter.value) {
    templates = templates.filter((t) => t.language === languageFilter.value);
  }

  return templates;
});

const fetchTemplates = async () => {
  isLoading.value = true;
  try {
    const [enabled, global, company] = await Promise.all([
      trpc.templates.listEnabled.query(),
      trpc.templates.listGlobalForCompany.query(),
      trpc.templates.listCompany.query(),
    ]);

    enabledTemplates.value = enabled;
    globalTemplates.value = global;
    companyTemplates.value = company;
  } catch (error) {
    console.error("Failed to fetch templates:", error);
  } finally {
    isLoading.value = false;
  }
};

const enableTemplate = async (templateId: string) => {
  try {
    await trpc.templates.enable.mutate({ templateId });
    await fetchTemplates();
  } catch (error) {
    console.error("Failed to enable template:", error);
  }
};

const disableTemplate = async (templateId: string) => {
  try {
    // Disable by setting enabled to false via enable mutation
    await trpc.templates.enable.mutate({ templateId, isEnabled: false });
    await fetchTemplates();
  } catch (error) {
    console.error("Failed to disable template:", error);
  }
};

const setPreferred = async (templateId: string, isPreferred: boolean) => {
  try {
    await trpc.templates.setPreferred.mutate({ templateId, isPreferred });
    await fetchTemplates();
  } catch (error) {
    console.error("Failed to set preferred:", error);
  }
};

const testTemplate = (template: any) => {
  // TODO: Open test modal
  console.log("Test template:", template);
};

onMounted(() => {
  fetchTemplates();
});
</script>

