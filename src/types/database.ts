export interface List {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  list_id: string;
  text: string;
  checked: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      lists: {
        Row: List;
        Insert: Omit<List, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<List, 'id'>>;
      };
      items: {
        Row: Item;
        Insert: Omit<Item, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Item, 'id'>>;
      };
    };
  };
}
