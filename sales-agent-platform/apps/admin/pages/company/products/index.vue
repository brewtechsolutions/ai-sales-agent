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
          Products
        </h1>
        <p
          class="
            text-sm
            md:text-base
            text-text-secondary dark:text-dark-text-secondary
            mt-2
          "
        >
          Manage your product catalog
        </p>
      </div>

      <div class="flex gap-3">
        <button
          @click="showImportModal = true"
          class="
            px-6 py-3
            bg-surface dark:bg-dark-surface
            text-text-primary dark:text-dark-text-primary
            rounded-ios-lg
            font-medium
            transition-all duration-300
            hover:bg-surface/80
            active:scale-95
            shadow-ios
          "
        >
          <Icon name="heroicons:arrow-up-tray" class="w-5 h-5 inline mr-2" />
          Import CSV
        </button>
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
          Add Product
        </button>
      </div>
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
          placeholder="Search products..."
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
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>

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
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Products Grid -->
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
      v-else-if="filteredProducts.length === 0"
      class="
        flex flex-col items-center justify-center py-12
        bg-card dark:bg-dark-card
        rounded-ios-lg shadow-ios
        border border-border dark:border-dark-border
      "
    >
      <Icon
        name="heroicons:shopping-bag"
        class="w-16 h-16 mb-4 text-text-secondary dark:text-dark-text-secondary"
      />
      <p class="text-text-secondary dark:text-dark-text-secondary">
        No products found
      </p>
    </div>

    <div
      v-else
      class="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
      "
    >
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="
          flex flex-col gap-4 p-6
          bg-card dark:bg-dark-card
          rounded-ios-lg shadow-ios
          border border-border dark:border-dark-border
          transition-all duration-300
          hover:shadow-ios-lg
        "
      >
        <!-- Product Image -->
        <div
          class="
            w-full aspect-square
            bg-surface dark:bg-dark-surface
            rounded-ios-lg
            overflow-hidden
            flex items-center justify-center
          "
        >
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <Icon
            v-else
            name="heroicons:photo"
            class="w-16 h-16 text-text-secondary dark:text-dark-text-secondary"
          />
        </div>

        <!-- Product Info -->
        <div class="flex flex-col gap-2">
          <h3
            class="
              font-semibold
              text-text-primary dark:text-dark-text-primary
            "
          >
            {{ product.name }}
          </h3>
          <p
            v-if="product.description"
            class="
              text-sm line-clamp-2
              text-text-secondary dark:text-dark-text-secondary
            "
          >
            {{ product.description }}
          </p>
          <div class="flex items-center justify-between">
            <p
              class="
                text-lg font-bold text-success
              "
            >
              {{ formatCurrency(product.price) }}
            </p>
            <span
              class="
                px-2 py-1
                rounded-full
                text-xs font-medium
              "
              :class="
                product.stockStatus === 'in_stock'
                  ? 'bg-success-light text-success'
                  : 'bg-error-light text-error'
              "
            >
              {{ product.stockStatus }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-2 border-t border-border dark:border-dark-border">
          <button
            @click="editProduct(product)"
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
            @click="deleteProduct(product.id)"
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

const products = ref<any[]>([]);
const categories = ref<string[]>([]);
const isLoading = ref(true);
const searchQuery = ref("");
const categoryFilter = ref("");
const statusFilter = ref("");
const showCreateModal = ref(false);
const showImportModal = ref(false);

const filteredProducts = computed(() => {
  let filtered = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query))
    );
  }

  if (categoryFilter.value) {
    filtered = filtered.filter((p) => p.category === categoryFilter.value);
  }

  if (statusFilter.value) {
    filtered = filtered.filter(
      (p) => (statusFilter.value === "active" ? p.isActive : !p.isActive)
    );
  }

  return filtered;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    const result = await trpc.product.getAll.query({
      page: 1,
      pageSize: 100,
    });
    products.value = result.items;

    // Extract unique categories
    const uniqueCategories = new Set(
      products.value.map((p) => p.category).filter(Boolean)
    );
    categories.value = Array.from(uniqueCategories).sort();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    isLoading.value = false;
  }
};

const editProduct = (product: any) => {
  // TODO: Open edit modal
  console.log("Edit product:", product);
};

const deleteProduct = async (productId: string) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await trpc.product.delete.mutate(productId);
      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

