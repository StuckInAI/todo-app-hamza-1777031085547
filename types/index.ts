export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoRow {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}
