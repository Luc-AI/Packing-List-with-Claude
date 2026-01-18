import { supabase } from './supabase';
import type { List, Item } from '../types/database';

// Generic API result type
export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

// Lists API
export const listsApi = {
  async fetchAll(userId: string): Promise<ApiResult<List[]>> {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data ?? [], error: null };
  },

  async create(list: {
    user_id: string;
    name: string;
    emoji: string;
    color?: string;
  }): Promise<ApiResult<List>> {
    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: list.user_id,
        name: list.name,
        emoji: list.emoji,
        color: list.color ?? '#3d98a8',
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },

  async update(
    id: string,
    updates: Partial<Pick<List, 'name' | 'emoji' | 'color'>>
  ): Promise<ApiResult<List>> {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },

  async delete(id: string): Promise<ApiResult<void>> {
    const { error } = await supabase.from('lists').delete().eq('id', id);

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: undefined, error: null };
  },
};

// Items API
export const itemsApi = {
  async fetchByListId(listId: string): Promise<ApiResult<Item[]>> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', listId)
      .order('position', { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data ?? [], error: null };
  },

  async fetchAllForUser(listIds: string[]): Promise<ApiResult<Item[]>> {
    if (listIds.length === 0) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .in('list_id', listIds)
      .order('position', { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: data ?? [], error: null };
  },

  async create(item: {
    list_id: string;
    text: string;
    position: number;
    checked?: boolean;
  }): Promise<ApiResult<Item>> {
    const { data, error } = await supabase
      .from('items')
      .insert({
        list_id: item.list_id,
        text: item.text,
        position: item.position,
        checked: item.checked ?? false,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },

  async update(
    id: string,
    updates: Partial<Pick<Item, 'text' | 'checked' | 'position'>>
  ): Promise<ApiResult<Item>> {
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  },

  async delete(id: string): Promise<ApiResult<void>> {
    const { error } = await supabase.from('items').delete().eq('id', id);

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: undefined, error: null };
  },

  async reorder(
    items: { id: string; position: number }[]
  ): Promise<ApiResult<void>> {
    // Update positions one by one (Supabase doesn't support bulk updates easily)
    for (const item of items) {
      const { error } = await supabase
        .from('items')
        .update({ position: item.position })
        .eq('id', item.id);

      if (error) {
        return { data: null, error: error.message };
      }
    }
    return { data: undefined, error: null };
  },
};
