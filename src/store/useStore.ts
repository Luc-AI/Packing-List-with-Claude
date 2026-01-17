import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { List, Item } from '../types/database';

interface PackingStore {
  lists: List[];
  items: Item[];

  // List actions
  addList: (name: string, emoji: string) => string;
  updateList: (id: string, updates: Partial<Pick<List, 'name' | 'emoji' | 'color'>>) => void;
  deleteList: (id: string) => void;
  getList: (id: string) => List | undefined;

  // Item actions
  addItem: (listId: string, text: string) => void;
  updateItem: (id: string, updates: Partial<Pick<Item, 'text' | 'checked' | 'position'>>) => void;
  deleteItem: (id: string) => void;
  toggleItem: (id: string) => void;
  getItemsByListId: (listId: string) => Item[];
  reorderItems: (listId: string, itemIds: string[]) => void;

  // Stats
  getListStats: (listId: string) => { total: number; packed: number };
}

const generateId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// Initial mock data
const initialLists: List[] = [
  {
    id: '1',
    user_id: 'local',
    name: 'Bali Urlaub 2024',
    emoji: '🏝️',
    color: '#3d98a8',
    created_at: now(),
    updated_at: now(),
  },
  {
    id: '2',
    user_id: 'local',
    name: 'Geschäftsreise Berlin',
    emoji: '💼',
    color: '#1e5f74',
    created_at: now(),
    updated_at: now(),
  },
  {
    id: '3',
    user_id: 'local',
    name: 'Wochenende Camping',
    emoji: '⛺',
    color: '#60b8c5',
    created_at: now(),
    updated_at: now(),
  },
];

const initialItems: Item[] = [
  // Bali items
  { id: '101', list_id: '1', text: 'Reisepass', checked: true, position: 0, created_at: now(), updated_at: now() },
  { id: '102', list_id: '1', text: 'Flugtickets', checked: true, position: 1, created_at: now(), updated_at: now() },
  { id: '103', list_id: '1', text: 'Kreditkarten', checked: false, position: 2, created_at: now(), updated_at: now() },
  { id: '104', list_id: '1', text: 'T-Shirts (3x)', checked: true, position: 3, created_at: now(), updated_at: now() },
  { id: '105', list_id: '1', text: 'Sonnencreme', checked: false, position: 4, created_at: now(), updated_at: now() },
  // Berlin items
  { id: '201', list_id: '2', text: 'Laptop', checked: true, position: 0, created_at: now(), updated_at: now() },
  { id: '202', list_id: '2', text: 'Ladekabel', checked: true, position: 1, created_at: now(), updated_at: now() },
  { id: '203', list_id: '2', text: 'Anzug', checked: true, position: 2, created_at: now(), updated_at: now() },
  { id: '204', list_id: '2', text: 'Visitenkarten', checked: true, position: 3, created_at: now(), updated_at: now() },
  // Camping items
  { id: '301', list_id: '3', text: 'Zelt', checked: true, position: 0, created_at: now(), updated_at: now() },
  { id: '302', list_id: '3', text: 'Schlafsack', checked: true, position: 1, created_at: now(), updated_at: now() },
  { id: '303', list_id: '3', text: 'Taschenlampe', checked: false, position: 2, created_at: now(), updated_at: now() },
  { id: '304', list_id: '3', text: 'Erste-Hilfe-Set', checked: false, position: 3, created_at: now(), updated_at: now() },
  { id: '305', list_id: '3', text: 'Kochgeschirr', checked: false, position: 4, created_at: now(), updated_at: now() },
];

export const useStore = create<PackingStore>()(
  persist(
    (set, get) => ({
      lists: initialLists,
      items: initialItems,

      // List actions
      addList: (name, emoji) => {
        const id = generateId();
        const newList: List = {
          id,
          user_id: 'local',
          name,
          emoji,
          color: '#3d98a8',
          created_at: now(),
          updated_at: now(),
        };
        set((state) => ({ lists: [...state.lists, newList] }));
        return id;
      },

      updateList: (id, updates) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates, updated_at: now() } : list
          ),
        }));
      },

      deleteList: (id) => {
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
          items: state.items.filter((item) => item.list_id !== id),
        }));
      },

      getList: (id) => get().lists.find((list) => list.id === id),

      // Item actions
      addItem: (listId, text) => {
        const items = get().getItemsByListId(listId);
        const maxPosition = items.length > 0 ? Math.max(...items.map((i) => i.position)) : -1;
        const newItem: Item = {
          id: generateId(),
          list_id: listId,
          text,
          checked: false,
          position: maxPosition + 1,
          created_at: now(),
          updated_at: now(),
        };
        set((state) => ({ items: [...state.items, newItem] }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates, updated_at: now() } : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItem: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked, updated_at: now() } : item
          ),
        }));
      },

      getItemsByListId: (listId) =>
        get()
          .items.filter((item) => item.list_id === listId)
          .sort((a, b) => a.position - b.position),

      reorderItems: (listId, itemIds) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.list_id !== listId) return item;
            const newPosition = itemIds.indexOf(item.id);
            if (newPosition === -1) return item;
            return { ...item, position: newPosition, updated_at: now() };
          }),
        }));
      },

      // Stats
      getListStats: (listId) => {
        const items = get().getItemsByListId(listId);
        return {
          total: items.length,
          packed: items.filter((item) => item.checked).length,
        };
      },
    }),
    {
      name: 'packing-list-storage',
    }
  )
);
