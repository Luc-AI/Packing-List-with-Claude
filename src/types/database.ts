export interface List {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  list_id: string;
  name: string;
  position: number;
  is_collapsed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  list_id: string;
  section_id: string | null;
  text: string;
  checked: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

// Supabase Database Schema Type
export type Database = {
  public: {
    Tables: {
      lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          emoji: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          emoji: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          emoji?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sections: {
        Row: {
          id: string;
          list_id: string;
          name: string;
          position: number;
          is_collapsed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          name: string;
          position: number;
          is_collapsed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          name?: string;
          position?: number;
          is_collapsed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      items: {
        Row: {
          id: string;
          list_id: string;
          section_id: string | null;
          text: string;
          checked: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          list_id: string;
          section_id?: string | null;
          text: string;
          checked?: boolean;
          position: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          list_id?: string;
          section_id?: string | null;
          text?: string;
          checked?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
