export interface Event {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  date: string;
  duration?: number;
  category?: string;
}
