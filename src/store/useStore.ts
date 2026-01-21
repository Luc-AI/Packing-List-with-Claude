import { create } from 'zustand';
import type { List, Item, Section } from '../types/database';
import { listsApi, itemsApi, sectionsApi } from '../lib/api';
import { useToastStore } from './useToastStore';

interface PackingStore {
  // State
  lists: List[];
  items: Item[];
  sections: Section[];
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

  // Section actions (async)
  addSection: (listId: string, name: string) => Promise<string | null>;
  updateSection: (id: string, updates: Partial<Pick<Section, 'name' | 'is_collapsed'>>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  deleteSectionMoveItems: (id: string) => Promise<void>;
  deleteLastSectionKeepItems: (id: string) => Promise<void>;
  toggleSectionCollapse: (id: string) => Promise<void>;
  getSectionsByListId: (listId: string) => Section[];
  reorderSections: (listId: string, sectionIds: string[]) => Promise<void>;

  // Item actions (async)
  addItem: (listId: string, sectionId: string | null, text: string) => Promise<void>;
  updateItem: (id: string, updates: Partial<Pick<Item, 'text' | 'checked' | 'position'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  getItemsByListId: (listId: string) => Item[];
  getItemsBySectionId: (sectionId: string) => Item[];
  reorderItems: (listId: string, itemIds: string[]) => Promise<void>;
  reorderItemsInSection: (sectionId: string, itemIds: string[]) => Promise<void>;
  moveItemToSection: (itemId: string, targetSectionId: string, newPosition?: number) => Promise<void>;
  resetListItems: (listId: string) => Promise<void>;

  // Stats
  getListStats: (listId: string) => { total: number; packed: number };
  getSectionStats: (sectionId: string) => { total: number; packed: number };
}

export const useStore = create<PackingStore>()((set, get) => ({
  // Initial state
  lists: [],
  items: [],
  sections: [],
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

    // Fetch all items and sections for user's lists
    const listIds = lists.map((l) => l.id);

    const [itemsResult, sectionsResult] = await Promise.all([
      itemsApi.fetchAllForUser(listIds),
      sectionsApi.fetchAllForUser(listIds),
    ]);

    if (itemsResult.error) {
      set({ isLoading: false, error: itemsResult.error });
      useToastStore.getState().addToast('Fehler beim Laden der Items', 'error');
      return;
    }

    if (sectionsResult.error) {
      set({ isLoading: false, error: sectionsResult.error });
      useToastStore.getState().addToast('Fehler beim Laden der Abschnitte', 'error');
      return;
    }

    set({
      lists,
      items: itemsResult.data ?? [],
      sections: sectionsResult.data ?? [],
      isLoading: false,
      error: null,
    });
  },

  clearData: () => {
    set({
      lists: [],
      items: [],
      sections: [],
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
    const previousSections = get().sections;
    set((state) => ({
      lists: state.lists.filter((list) => list.id !== id),
      items: state.items.filter((item) => item.list_id !== id),
      sections: state.sections.filter((section) => section.list_id !== id),
    }));

    const result = await listsApi.delete(id);
    if (result.error) {
      // Rollback on error
      set({ lists: previousLists, items: previousItems, sections: previousSections, error: result.error });
      useToastStore.getState().addToast('Fehler beim Löschen der Liste', 'error');
    } else {
      useToastStore.getState().addToast('Liste gelöscht', 'success');
    }
  },

  getList: (id) => get().lists.find((list) => list.id === id),

  // Section actions
  addSection: async (listId, name) => {
    const existingSections = get().getSectionsByListId(listId);
    const isFirstSection = existingSections.length === 0;
    const maxPosition = existingSections.length > 0
      ? Math.max(...existingSections.map(s => s.position))
      : -1;

    // Create the requested section
    const result = await sectionsApi.create({
      list_id: listId,
      name,
      position: maxPosition + 1,
    });

    if (result.error || !result.data) {
      set({ error: result.error ?? 'Failed to create section' });
      useToastStore.getState().addToast('Fehler beim Erstellen des Abschnitts', 'error');
      return null;
    }

    set((state) => ({ sections: [...state.sections, result.data!] }));
    const newSectionId = result.data.id;

    // If this is the first section, also create "Sonstiges" section
    if (isFirstSection) {
      const otherResult = await sectionsApi.create({
        list_id: listId,
        name: 'Sonstiges',
        position: maxPosition + 2,
      });

      if (otherResult.data) {
        set((state) => ({ sections: [...state.sections, otherResult.data!] }));

        // Move any existing items (section_id = null) to "Sonstiges"
        const existingItems = get().items.filter(
          (item) => item.list_id === listId && item.section_id === null
        );

        if (existingItems.length > 0) {
          const itemIds = existingItems.map((item) => item.id);
          await itemsApi.bulkUpdateSectionId(itemIds, otherResult.data.id);

          // Update local state
          set((state) => ({
            items: state.items.map((item) =>
              itemIds.includes(item.id)
                ? { ...item, section_id: otherResult.data!.id }
                : item
            ),
          }));

          useToastStore.getState().addToast(
            'Vorhandene Items wurden nach "Sonstiges" verschoben',
            'info'
          );
        }
      }
    }

    // Touch list timestamp
    const listResult = await listsApi.touchTimestamp(listId);
    if (listResult.data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
        ),
      }));
    }

    return newSectionId;
  },

  updateSection: async (id, updates) => {
    // Optimistic update
    const previousSections = get().sections;
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));

    const result = await sectionsApi.update(id, updates);
    if (result.error) {
      // Rollback on error
      set({ sections: previousSections, error: result.error });
      useToastStore.getState().addToast('Fehler beim Aktualisieren des Abschnitts', 'error');
    }
  },

  deleteSection: async (id) => {
    // Get section's list_id before deletion
    const section = get().sections.find((s) => s.id === id);
    const listId = section?.list_id;

    // Optimistic update - delete section and its items
    const previousSections = get().sections;
    const previousItems = get().items;
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      items: state.items.filter((item) => item.section_id !== id),
    }));

    const result = await sectionsApi.delete(id);
    if (result.error) {
      // Rollback on error
      set({ sections: previousSections, items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Löschen des Abschnitts', 'error');
    } else {
      // Touch list timestamp
      if (listId) {
        const listResult = await listsApi.touchTimestamp(listId);
        if (listResult.data) {
          set((state) => ({
            lists: state.lists.map((list) =>
              list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
            ),
          }));
        }
      }
    }
  },

  deleteSectionMoveItems: async (id) => {
    const section = get().sections.find((s) => s.id === id);
    if (!section) return;

    const listId = section.list_id;

    // Find "Sonstiges" section in the same list
    let sonstigesSection = get().sections.find(
      (s) => s.list_id === listId && s.name === 'Sonstiges' && s.id !== id
    );

    // If Sonstiges doesn't exist, create it
    if (!sonstigesSection) {
      const listSections = get().sections.filter((s) => s.list_id === listId);
      const maxPosition = Math.max(...listSections.map((s) => s.position), 0);

      const createResult = await sectionsApi.create({
        list_id: listId,
        name: 'Sonstiges',
        position: maxPosition + 1,
      });

      if (createResult.error) {
        useToastStore.getState().addToast('Fehler beim Erstellen von "Sonstiges"', 'error');
        return;
      }

      sonstigesSection = createResult.data!;
      set((state) => ({ sections: [...state.sections, createResult.data!] }));
      useToastStore.getState().addToast('Abschnitt „Sonstiges" wurde erstellt', 'info');
    }

    // Get items in the section to be deleted
    const itemsToMove = get().items.filter((item) => item.section_id === id);
    const itemIds = itemsToMove.map((item) => item.id);

    // Optimistic update - move items to Sonstiges and delete section
    const previousSections = get().sections;
    const previousItems = get().items;

    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      items: state.items.map((item) =>
        item.section_id === id ? { ...item, section_id: sonstigesSection!.id } : item
      ),
    }));

    // Move items to Sonstiges
    if (itemIds.length > 0) {
      const moveResult = await itemsApi.bulkUpdateSectionId(itemIds, sonstigesSection.id);
      if (moveResult.error) {
        set({ sections: previousSections, items: previousItems, error: moveResult.error });
        useToastStore.getState().addToast('Fehler beim Verschieben der Items', 'error');
        return;
      }
    }

    // Delete the now-empty section
    const deleteResult = await sectionsApi.delete(id);
    if (deleteResult.error) {
      set({ sections: previousSections, items: previousItems, error: deleteResult.error });
      useToastStore.getState().addToast('Fehler beim Löschen des Abschnitts', 'error');
    } else {
      useToastStore.getState().addToast(
        `${itemIds.length} ${itemIds.length === 1 ? 'Item' : 'Items'} nach "Sonstiges" verschoben`,
        'info'
      );
      // Touch list timestamp
      const listResult = await listsApi.touchTimestamp(listId);
      if (listResult.data) {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
          ),
        }));
      }
    }
  },

  deleteLastSectionKeepItems: async (id) => {
    const section = get().sections.find((s) => s.id === id);
    if (!section) return;

    const listId = section.list_id;

    // Get items in the section to convert to loose items
    const itemsToConvert = get().items.filter((item) => item.section_id === id);
    const itemIds = itemsToConvert.map((item) => item.id);

    // Optimistic update - convert items to loose (section_id = null) and delete section
    const previousSections = get().sections;
    const previousItems = get().items;

    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      items: state.items.map((item) =>
        item.section_id === id ? { ...item, section_id: null } : item
      ),
    }));

    // Update items to have section_id = null
    if (itemIds.length > 0) {
      const updateResult = await itemsApi.bulkUpdateSectionId(itemIds, null);
      if (updateResult.error) {
        set({ sections: previousSections, items: previousItems, error: updateResult.error });
        useToastStore.getState().addToast('Fehler beim Konvertieren der Items', 'error');
        return;
      }
    }

    // Delete the section
    const deleteResult = await sectionsApi.delete(id);
    if (deleteResult.error) {
      set({ sections: previousSections, items: previousItems, error: deleteResult.error });
      useToastStore.getState().addToast('Fehler beim Löschen des Abschnitts', 'error');
    } else {
      useToastStore.getState().addToast('Abschnitte entfernt, Items behalten', 'info');
      // Touch list timestamp
      const listResult = await listsApi.touchTimestamp(listId);
      if (listResult.data) {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
          ),
        }));
      }
    }
  },

  toggleSectionCollapse: async (id) => {
    const section = get().sections.find((s) => s.id === id);
    if (!section) return;

    const newCollapsed = !section.is_collapsed;

    // Optimistic update
    const previousSections = get().sections;
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, is_collapsed: newCollapsed } : s
      ),
    }));

    const result = await sectionsApi.update(id, { is_collapsed: newCollapsed });
    if (result.error) {
      // Rollback on error
      set({ sections: previousSections, error: result.error });
    }
  },

  getSectionsByListId: (listId) =>
    get()
      .sections.filter((section) => section.list_id === listId)
      .sort((a, b) => a.position - b.position),

  reorderSections: async (listId, sectionIds) => {
    // Optimistic update
    const previousSections = get().sections;
    set((state) => ({
      sections: state.sections.map((section) => {
        if (section.list_id !== listId) return section;
        const newPosition = sectionIds.indexOf(section.id);
        if (newPosition === -1) return section;
        return { ...section, position: newPosition };
      }),
    }));

    // Build updates for API
    const updates = sectionIds.map((id, index) => ({ id, position: index }));
    const result = await sectionsApi.reorder(updates);
    if (result.error) {
      // Rollback on error
      set({ sections: previousSections, error: result.error });
      useToastStore.getState().addToast('Fehler beim Sortieren der Abschnitte', 'error');
    }
  },

  // Item actions
  addItem: async (listId, sectionId, text) => {
    // Get items - either from section or loose items (section_id = null)
    const items = sectionId
      ? get().getItemsBySectionId(sectionId)
      : get().items.filter((i) => i.list_id === listId && i.section_id === null);
    const maxPosition = items.length > 0 ? Math.max(...items.map((i) => i.position)) : -1;

    const result = await itemsApi.create({
      list_id: listId,
      section_id: sectionId,
      text,
      position: maxPosition + 1,
    });

    if (result.error || !result.data) {
      set({ error: result.error ?? 'Failed to add item' });
      useToastStore.getState().addToast('Fehler beim Hinzufügen des Items', 'error');
      return;
    }

    set((state) => ({ items: [...state.items, result.data!] }));

    // Touch list timestamp
    const listResult = await listsApi.touchTimestamp(listId);
    if (listResult.data) {
      set((state) => ({
        lists: state.lists.map((list) =>
          list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
        ),
      }));
    }
  },

  updateItem: async (id, updates) => {
    // Get item for list_id before update
    const item = get().items.find((i) => i.id === id);
    const listId = item?.list_id;

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
      return;
    }

    // Touch list timestamp only when text is edited (not for checked/position changes)
    if (listId && updates.text !== undefined) {
      const listResult = await listsApi.touchTimestamp(listId);
      if (listResult.data) {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
          ),
        }));
      }
    }
  },

  deleteItem: async (id) => {
    // Get list_id before deletion
    const item = get().items.find((i) => i.id === id);
    const listId = item?.list_id;

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
      return;
    }

    // Touch list timestamp
    if (listId) {
      const listResult = await listsApi.touchTimestamp(listId);
      if (listResult.data) {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId ? { ...list, updated_at: listResult.data!.updated_at } : list
          ),
        }));
      }
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

  getItemsBySectionId: (sectionId) =>
    get()
      .items.filter((item) => item.section_id === sectionId)
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

  reorderItemsInSection: async (sectionId, itemIds) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) => {
        if (item.section_id !== sectionId) return item;
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

  moveItemToSection: async (itemId, targetSectionId, newPosition) => {
    const item = get().items.find((i) => i.id === itemId);
    if (!item) return;

    const targetSectionItems = get().getItemsBySectionId(targetSectionId);
    const finalPosition = newPosition ?? targetSectionItems.length;

    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId
          ? { ...i, section_id: targetSectionId, position: finalPosition }
          : i
      ),
    }));

    // Update section_id
    const result = await itemsApi.update(itemId, { section_id: targetSectionId });
    if (result.error) {
      // Rollback on error
      set({ items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Verschieben des Items', 'error');
      return;
    }

    // Update position
    const positionResult = await itemsApi.update(itemId, { position: finalPosition });
    if (positionResult.error) {
      useToastStore.getState().addToast('Fehler beim Sortieren der Items', 'error');
    }
  },

  resetListItems: async (listId) => {
    // Optimistic update
    const previousItems = get().items;
    set((state) => ({
      items: state.items.map((item) =>
        item.list_id === listId ? { ...item, checked: false } : item
      ),
    }));

    const result = await itemsApi.resetChecked(listId);
    if (result.error) {
      // Rollback on error
      set({ items: previousItems, error: result.error });
      useToastStore.getState().addToast('Fehler beim Zurücksetzen der Items', 'error');
    } else {
      useToastStore.getState().addToast('Items zurückgesetzt', 'success');
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

  getSectionStats: (sectionId) => {
    const items = get().getItemsBySectionId(sectionId);
    return {
      total: items.length,
      packed: items.filter((item) => item.checked).length,
    };
  },
}));
