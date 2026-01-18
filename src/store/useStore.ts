import { create } from 'zustand';
import type { List, Item } from '../types/database';
import { listsApi, itemsApi } from '../lib/api';
import { useToastStore } from './useToastStore';

interface PackingStore {
  // State
  lists: List[];
  items: Item[];
  isLoading: boolean;
  error: string | null;

  // Data fetching
  fetchData: (userId: string) => Promise<void>;
  clearData: () => void;

  // List actions (async)
  addList: (userId: string, name: string, emoji: string) => Promise<string | null>;
  updateList: (id: string, updates: Partial<Pick<List, 'name' | 'emoji' | 'color'>>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  getList: (id: string) => List | undefined;

  // Item actions (async)
  addItem: (listId: string, text: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<Pick<Item, 'text' | 'checked' | 'position'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  getItemsByListId: (listId: string) => Item[];
  reorderItems: (listId: string, itemIds: string[]) => Promise<void>;

  // Stats
  getListStats: (listId: string) => { total: number; packed: number };
}

export const useStore = create<PackingStore>()((set, get) => ({
  // Initial state
  lists: [],
  items: [],
  isLoading: true,
  error: null,

  // Data fetching
  fetchData: async (userId: string) => {
    set({ isLoading: true, error: null });

    // Fetch lists
    const listsResult = await listsApi.fetchAll(userId);
    if (listsResult.error) {
      set({ isLoading: false, error: listsResult.error });
      useToastStore.getState().addToast('Fehler beim Laden der Listen', 'error');
      return;
    }

    const lists = listsResult.data ?? [];

    // Fetch all items for user's lists
    const listIds = lists.map((l) => l.id);
    const itemsResult = await itemsApi.fetchAllForUser(listIds);
    if (itemsResult.error) {
      set({ isLoading: false, error: itemsResult.error });
      useToastStore.getState().addToast('Fehler beim Laden der Items', 'error');
      return;
    }

    set({
      lists,
      items: itemsResult.data ?? [],
      isLoading: false,
      error: null,
    });
  },

  clearData: () => {
    set({
      lists: [],
      items: [],
      isLoading: true,
      error: null,
    });
  },

  // List actions
  addList: async (userId, name, emoji) => {
    const result = await listsApi.create({ user_id: userId, name, emoji });
    if (result.error || !result.data) {
      set({ error: result.error ?? 'Failed to create list' });
      useToastStore.getState().addToast('Fehler beim Erstellen der Liste', 'error');
      return null;
    }

    set((state) => ({ lists: [result.data!, ...state.lists] }));
    return result.data.id;
  },

  updateList: async (id, updates) => {
    // Optimistic update
    const previousLists = get().lists;
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === id ? { ...list, ...updates } : list
      ),
    }));

    const result = await listsApi.update(id, updates);
    if (result.error) {
      // Rollback on error
      set({ lists: previousLists, error: result.error });
      useToastStore.getState().addToast('Fehler beim Aktualisieren der Liste', 'error');
    }
  },

  deleteList: async (id) => {
    // Optimistic update
    const previousLists = get().lists;
    const previousItems = get().items;
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
      items: state.items.filter((item) => item.list_id !== id),
    }));

    const result = await listsApi.delete(id);
    if (result.error) {
      // Rollback on error
      set({ lists: previousLists, items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Löschen der Liste', 'error');
    } else {
      useToastStore.getState().addToast('Liste gelöscht', 'success');
    }
  },

  getList: (id) => get().lists.find((list) => list.id === id),

  // Item actions
  addItem: async (listId, text) => {
    const items = get().getItemsByListId(listId);
    const maxPosition = items.length > 0 ? Math.max(...items.map((i) => i.position)) : -1;

    const result = await itemsApi.create({
      list_id: listId,
      text,
      position: maxPosition + 1,
    });

    if (result.error || !result.data) {
      set({ error: result.error ?? 'Failed to add item' });
      useToastStore.getState().addToast('Fehler beim Hinzufügen des Items', 'error');
      return;
    }

    set((state) => ({ items: [...state.items, result.data!] }));
  },

  updateItem: async (id, updates) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));

    const result = await itemsApi.update(id, updates);
    if (result.error) {
      // Rollback on error
      set({ items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Aktualisieren des Items', 'error');
    }
  },

  deleteItem: async (id) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    const result = await itemsApi.delete(id);
    if (result.error) {
      // Rollback on error
      set({ items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Löschen des Items', 'error');
    }
  },

  toggleItem: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;

    const newChecked = !item.checked;

    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, checked: newChecked } : i
      ),
    }));

    const result = await itemsApi.update(id, { checked: newChecked });
    if (result.error) {
      // Rollback on error
      set({ items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Aktualisieren des Items', 'error');
    }
  },

  getItemsByListId: (listId) =>
    get()
      .items.filter((item) => item.list_id === listId)
      .sort((a, b) => a.position - b.position),

  reorderItems: async (listId, itemIds) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) => {
        if (item.list_id !== listId) return item;
        const newPosition = itemIds.indexOf(item.id);
        if (newPosition === -1) return item;
        return { ...item, position: newPosition };
      }),
    }));

    // Build updates for API
    const updates = itemIds.map((id, index) => ({ id, position: index }));
    const result = await itemsApi.reorder(updates);
    if (result.error) {
      // Rollback on error
      set({ items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Sortieren der Items', 'error');
    }
  },

  // Stats
  getListStats: (listId) => {
    const items = get().getItemsByListId(listId);
    return {
      total: items.length,
      packed: items.filter((item) => item.checked).length,
    };
  },
}));
