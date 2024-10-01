export interface Event {
  id: number;
  title: string;
  description: string | null;
  start: string;
  end: string;
  date: string;
  duration: number;
  category: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}
