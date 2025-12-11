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
          Global Templates
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Manage success case templates for all companies
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

    <!-- Templates Grid -->
    <div v-if="isLoading" class="flex justify-center py-12">
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
          cursor-pointer
        "
        @click="selectedTemplate = template"
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
          <span
            v-if="template.isRecommended"
            class="
              px-2 py-1
              bg-primary-100 dark:bg-primary-900
              text-primary-700 dark:text-primary-300
              rounded-full
              text-xs font-medium
            "
          >
            Recommended
          </span>
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
        <div class="flex items-center gap-4 pt-4 border-t border-border dark:border-dark-border">
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
          <div
            v-if="template._count"
            class="flex items-center gap-2"
          >
            <Icon
              name="heroicons:building-office-2"
              class="w-4 h-4 text-text-secondary dark:text-dark-text-secondary"
            />
            <span
              class="
                text-sm
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              {{ template._count.companySelections || 0 }} companies
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-2">
          <button
            @click.stop="editTemplate(template)"
            class="
              flex-1 px-4 py-2
              bg-surface dark:bg-dark-surface
              text-text-primary dark:text-dark-text-primary
              rounded-ios
              font-medium text-sm
              transition-all duration-300
              hover:bg-surface/80
              active:scale-95
            "
          >
            Edit
          </button>
          <button
            @click.stop="deleteTemplate(template.id)"
            class="
              px-4 py-2
              bg-error-light text-error
              rounded-ios
              font-medium text-sm
              transition-all duration-300
              hover:bg-error-light/80
              active:scale-95
            "
          >
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Template Detail Modal -->
    <div
      v-if="selectedTemplate"
      class="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        p-4
        z-50
      "
      @click="selectedTemplate = null"
    >
      <div
        class="
          w-full max-w-3xl
          bg-card dark:bg-dark-card
          rounded-ios-xl shadow-ios-xl
          border border-border dark:border-dark-border
          p-6
          max-h-[90vh] overflow-y-auto
        "
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h2
            class="
              text-2xl font-bold
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{ selectedTemplate.name }}
          </h2>
          <button
            @click="selectedTemplate = null"
            class="
              p-2
              rounded-ios
              hover:bg-surface dark:hover:bg-dark-surface
              transition-all duration-300
              text-text-primary dark:text-dark-text-primary
            "
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Template Details -->
        <div class="flex flex-col gap-6">
          <div>
            <label
              class="
                block text-sm font-medium mb-2
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Category
            </label>
            <p class="text-text-primary dark:text-dark-text-primary">
              {{ selectedTemplate.category || "General" }}
            </p>
          </div>

          <div>
            <label
              class="
                block text-sm font-medium mb-2
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Language
            </label>
            <p class="text-text-primary dark:text-dark-text-primary">
              {{ selectedTemplate.language }}
            </p>
          </div>

          <div>
            <label
              class="
                block text-sm font-medium mb-2
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Agent Response
            </label>
            <div
              class="
                p-4
                bg-surface dark:bg-dark-surface
                rounded-ios
                text-text-primary dark:text-dark-text-primary
              "
            >
              {{ selectedTemplate.agentResponse }}
            </div>
          </div>

          <div v-if="selectedTemplate.customerMessageExamples">
            <label
              class="
                block text-sm font-medium mb-2
                text-text-secondary dark:text-dark-text-secondary
              "
            >
              Customer Message Examples
            </label>
            <ul class="list-disc list-inside space-y-1 text-text-primary dark:text-dark-text-primary">
              <li
                v-for="(example, idx) in (selectedTemplate.customerMessageExamples as string[])"
                :key="idx"
              >
                {{ example }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Template Modal -->
    <div
      v-if="showCreateModal"
      class="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        p-4
        z-50
      "
      @click="showCreateModal = false"
    >
      <div
        class="
          w-full max-w-2xl
          bg-card dark:bg-dark-card
          rounded-ios-xl shadow-ios-xl
          border border-border dark:border-dark-border
          p-6
          max-h-[90vh] overflow-y-auto
        "
        @click.stop
      >
        <h2
          class="
            text-2xl font-bold mb-6
            text-text-primary dark:text-dark-text-primary
          "
        >
          Create Global Template
        </h2>
        <!-- Create form will go here -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showCreateModal = false"
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
            @click="handleCreate"
            class="
              px-4 py-2
              bg-primary-500 text-white
              rounded-ios
              transition-all duration-300
              hover:bg-primary-600
            "
          >
            Create
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

const templates = ref<any[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const categoryFilter = ref("");
const languageFilter = ref("");
const showCreateModal = ref(false);
const selectedTemplate = ref<any>(null);

const filteredTemplates = computed(() => {
  let filtered = templates.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }

  if (categoryFilter.value) {
    filtered = filtered.filter((t) => t.category === categoryFilter.value);
  }

  if (languageFilter.value) {
    filtered = filtered.filter((t) => t.language === languageFilter.value);
  }

  return filtered;
});

const fetchTemplates = async () => {
  isLoading.value = true;
  try {
    templates.value = await trpc.templates.listGlobal.query();
  } catch (error) {
    console.error("Failed to fetch templates:", error);
  } finally {
    isLoading.value = false;
  }
};

const editTemplate = (template: any) => {
  // TODO: Open edit modal
  selectedTemplate.value = template;
};

const deleteTemplate = async (id: string) => {
  if (confirm("Are you sure you want to delete this template?")) {
    try {
      await trpc.templates.deleteGlobal.mutate({ templateId: id });
      await fetchTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  }
};

const handleCreate = () => {
  // TODO: Implement create form
  showCreateModal.value = false;
};

onMounted(() => {
  fetchTemplates();
});
</script>

