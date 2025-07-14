export interface TodoistTask {
  id: string;
  content: string;
  description: string;
  priority: number;
  is_completed: boolean;
  labels: string[];
  project_id: string;
  section_id: string;
  parent_id: string | null;
  order: number;
  due?: {
    date: string;
    timezone: string;
    string: string;
    lang: string;
    is_recurring: boolean;
  };
  url: string;
  comment_count: number;
  created_at: string;
  creator_id: string;
  assignee_id: string | null;
}

export interface EisenhowerTask extends TodoistTask {
  quadrant: 'do' | 'schedule' | 'delegate' | 'delete';
  urgency: 'urgent' | 'not-urgent';
  importance: 'important' | 'not-important';
}

export type QuadrantType = 'do' | 'schedule' | 'delegate' | 'delete';

export interface Quadrant {
  id: QuadrantType;
  title: string;
  description: string;
  color: string;
  tasks: EisenhowerTask[];
}