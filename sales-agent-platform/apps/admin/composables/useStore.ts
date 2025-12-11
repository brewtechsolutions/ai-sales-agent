/**
 * Zustand store wrapper for Vue/Nuxt
 * Makes Zustand stores reactive in Vue components
 */

import { storeToRefs } from "pinia";
import type { StoreApi } from "zustand";

/**
 * Make a Zustand store reactive in Vue
 */
export function useStore<T>(store: StoreApi<T>) {
  // Get the store state
  const state = store.getState();

  // Create reactive refs for each property
  const reactiveState = reactive({ ...state });

  // Subscribe to store changes
  store.subscribe((newState) => {
    Object.assign(reactiveState, newState);
  });

  return reactiveState;
}

/**
 * Alternative: Use computed with store selector
 */
export function useStoreSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U
): Ref<U> {
  const value = ref(selector(store.getState()));

  store.subscribe((state) => {
    value.value = selector(state);
  });

  return value;
}

