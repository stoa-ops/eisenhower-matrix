import axios from 'axios';
import { TodoistTask } from '@/types';

const TODOIST_API_URL = 'https://api.todoist.com/rest/v2';

export class TodoistAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async getTasks(): Promise<TodoistTask[]> {
    try {
      const response = await axios.get(`${TODOIST_API_URL}/tasks`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(content: string, description?: string, priority?: number): Promise<TodoistTask> {
    try {
      const response = await axios.post(
        `${TODOIST_API_URL}/tasks`,
        {
          content,
          description,
          priority: priority || 1,
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<TodoistTask>): Promise<void> {
    try {
      await axios.post(
        `${TODOIST_API_URL}/tasks/${id}`,
        updates,
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await axios.delete(`${TODOIST_API_URL}/tasks/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async completeTask(id: string): Promise<void> {
    try {
      await axios.post(
        `${TODOIST_API_URL}/tasks/${id}/close`,
        {},
        {
          headers: this.getHeaders(),
        }
      );
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
}