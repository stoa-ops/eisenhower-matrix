'use client';

import { useTasks } from '@/hooks/useTasks';
import { EisenhowerTask, QuadrantType } from '@/types';
import QuadrantColumn from './QuadrantColumn';
import { RefreshCw } from 'lucide-react';

export default function EisenhowerMatrix() {
  const { tasks, loading, error, refetch, createTask, updateTask, deleteTask, completeTask } = useTasks();

  const quadrants = [
    {
      id: 'do' as QuadrantType,
      title: 'Do',
      description: 'Urgent & Important',
      color: 'bg-red-500',
      tasks: tasks.filter(task => task.quadrant === 'do'),
    },
    {
      id: 'schedule' as QuadrantType,
      title: 'Schedule',
      description: 'Important, Not Urgent',
      color: 'bg-blue-500',
      tasks: tasks.filter(task => task.quadrant === 'schedule'),
    },
    {
      id: 'delegate' as QuadrantType,
      title: 'Delegate',
      description: 'Urgent, Not Important',
      color: 'bg-yellow-500',
      tasks: tasks.filter(task => task.quadrant === 'delegate'),
    },
    {
      id: 'delete' as QuadrantType,
      title: 'Delete',
      description: 'Not Urgent, Not Important',
      color: 'bg-gray-500',
      tasks: tasks.filter(task => task.quadrant === 'delete'),
    },
  ];

  const handleTaskCreate = async (content: string, quadrant: QuadrantType) => {
    try {
      // Determine priority based on quadrant
      let priority = 1;
      if (quadrant === 'do') priority = 4;
      else if (quadrant === 'schedule') priority = 3;
      else if (quadrant === 'delegate') priority = 2;
      
      await createTask(content, '', priority);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskUpdate = async (id: string, updates: Partial<EisenhowerTask>) => {
    try {
      await updateTask(id, updates);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskComplete = async (id: string) => {
    try {
      await completeTask(id);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading tasks: {error}</p>
        <button
          onClick={refetch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eisenhower Matrix</h1>
          <p className="text-gray-600">Organize your tasks by urgency and importance</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {quadrants.map((quadrant) => (
          <QuadrantColumn
            key={quadrant.id}
            quadrant={quadrant}
            onTaskComplete={handleTaskComplete}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
          />
        ))}
      </div>
    </div>
  );
}