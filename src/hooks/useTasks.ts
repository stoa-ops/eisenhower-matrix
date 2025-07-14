'use client';

import { useState, useEffect } from 'react';
import { TodoistTask, EisenhowerTask } from '@/types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<EisenhowerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const todoistTasks: TodoistTask[] = await response.json();
      
      // Transform Todoist tasks to Eisenhower tasks
      const eisenhowerTasks: EisenhowerTask[] = todoistTasks.map(task => ({
        ...task,
        quadrant: categorizeTask(task),
        urgency: getUrgency(task),
        importance: getImportance(task),
      }));
      
      setTasks(eisenhowerTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (content: string, description?: string, priority?: number) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, description, priority }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      const newTask: TodoistTask = await response.json();
      const eisenhowerTask: EisenhowerTask = {
        ...newTask,
        quadrant: categorizeTask(newTask),
        urgency: getUrgency(newTask),
        importance: getImportance(newTask),
      };
      
      setTasks(prev => [...prev, eisenhowerTask]);
      return eisenhowerTask;
    } catch (err) {
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<TodoistTask>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (err) {
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const completeTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'complete' }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete task');
      }
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  };
};

// Helper functions to categorize tasks
const categorizeTask = (task: TodoistTask): 'do' | 'schedule' | 'delegate' | 'delete' => {
  const isUrgent = getUrgency(task) === 'urgent';
  const isImportant = getImportance(task) === 'important';
  
  if (isUrgent && isImportant) return 'do';
  if (!isUrgent && isImportant) return 'schedule';
  if (isUrgent && !isImportant) return 'delegate';
  return 'delete';
};

const getUrgency = (task: TodoistTask): 'urgent' | 'not-urgent' => {
  // Check if task has a due date
  if (task.due) {
    const dueDate = new Date(task.due.date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Consider urgent if due within 2 days
    return diffDays <= 2 ? 'urgent' : 'not-urgent';
  }
  
  // Consider high priority tasks as urgent
  return task.priority >= 3 ? 'urgent' : 'not-urgent';
};

const getImportance = (task: TodoistTask): 'important' | 'not-important' => {
  // Use Todoist priority (1-4, where 4 is highest)
  // Priority 3 and 4 are considered important
  if (task.priority >= 3) return 'important';
  
  // Check for important keywords in content
  const importantKeywords = ['project', 'deadline', 'meeting', 'presentation', 'review'];
  const content = task.content.toLowerCase();
  
  return importantKeywords.some(keyword => content.includes(keyword)) 
    ? 'important' 
    : 'not-important';
};