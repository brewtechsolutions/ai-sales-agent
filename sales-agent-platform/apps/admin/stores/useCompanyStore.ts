/**
 * Company Store (Zustand)
 * Manages company data and state
 * Vue-compatible wrapper
 */

import { create } from "zustand";
import { ref, computed } from "vue";

interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  country: string;
  preferredLanguage: string;
  currency: string;
  timezone: string;
  industryCategory?: string;
  status: "active" | "suspended" | "trial";
  createdAt: Date;
  updatedAt: Date;
}

interface CompanyState {
  // State
  companies: Company[];
  selectedCompany: Company | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCompanies: () => Promise<void>;
  setSelectedCompany: (company: Company | null) => void;
  createCompany: (data: any) => Promise<Company>;
  updateCompany: (id: string, data: any) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;
  suspendCompany: (id: string) => Promise<void>;
  activateCompany: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create Zustand store
const store = create<CompanyState>((set, get) => ({
  // Initial state
  companies: [],
  selectedCompany: null,
  isLoading: false,
  error: null,

  // Actions
  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const { useTrpc } = await import("~/composables/useTrpc");
      const trpc = useTrpc();
      const result = await trpc.companies.list.query({});
      set({ companies: result.companies, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch companies",
        isLoading: false,
      });
    }
  },

  setSelectedCompany: (company) => set({ selectedCompany: company }),

  createCompany: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { useTrpc } = await import("~/composables/useTrpc");
      const trpc = useTrpc();
      const company = await trpc.companies.create.mutate(data);
      set((state) => ({
        companies: [...state.companies, company],
        isLoading: false,
      }));
      return company;
    } catch (error: any) {
      set({
        error: error.message || "Failed to create company",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCompany: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const { useTrpc } = await import("~/composables/useTrpc");
      const trpc = useTrpc();
      const updated = await trpc.companies.update.mutate({ id, ...data });
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? updated : c)),
        isLoading: false,
      }));
      return updated;
    } catch (error: any) {
      set({
        error: error.message || "Failed to update company",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { useTrpc } = await import("~/composables/useTrpc");
      const trpc = useTrpc();
      await trpc.companies.delete.mutate({ id });
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        selectedCompany:
          state.selectedCompany?.id === id ? null : state.selectedCompany,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete company",
        isLoading: false,
      });
      throw error;
    }
  },

  suspendCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { useTrpc } = await import("~/composables/useTrpc");
      const trpc = useTrpc();
      await trpc.companies.suspend.mutate({ id });
      set((state) => ({
        companies: state.companies.map((c) =>
          c.id === id ? { ...c, status: "suspended" } : c
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to suspend company",
        isLoading: false,
      });
      throw error;
    }
  },

  activateCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { useTrpc } = await import("~/composables/useTrpc");
      const trpc = useTrpc();
      await trpc.companies.activate.mutate({ id });
      set((state) => ({
        companies: state.companies.map((c) =>
          c.id === id ? { ...c, status: "active" } : c
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to activate company",
        isLoading: false,
      });
      throw error;
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));

// Export store for direct use
export { store as companyStore };

// Vue composable wrapper
export const useCompanyStore = () => {
  // Create reactive refs that sync with Zustand store
  const companiesRef = ref(store.getState().companies);
  const selectedCompanyRef = ref(store.getState().selectedCompany);
  const isLoadingRef = ref(store.getState().isLoading);
  const errorRef = ref(store.getState().error);

  // Subscribe to store changes
  store.subscribe((state) => {
    companiesRef.value = state.companies;
    selectedCompanyRef.value = state.selectedCompany;
    isLoadingRef.value = state.isLoading;
    errorRef.value = state.error;
  });

  return {
    // Reactive state
    companies: computed(() => companiesRef.value),
    selectedCompany: computed(() => selectedCompanyRef.value),
    isLoading: computed(() => isLoadingRef.value),
    error: computed(() => errorRef.value),

    // Actions
    fetchCompanies: () => store.getState().fetchCompanies(),
    setSelectedCompany: (company: Company | null) =>
      store.getState().setSelectedCompany(company),
    createCompany: (data: any) => store.getState().createCompany(data),
    updateCompany: (id: string, data: any) =>
      store.getState().updateCompany(id, data),
    deleteCompany: (id: string) => store.getState().deleteCompany(id),
    suspendCompany: (id: string) => store.getState().suspendCompany(id),
    activateCompany: (id: string) => store.getState().activateCompany(id),
    setLoading: (loading: boolean) => store.getState().setLoading(loading),
    setError: (error: string | null) => store.getState().setError(error),
  };
};
