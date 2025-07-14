'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
// import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTasks } from '@/hooks/useTasks';
import { EisenhowerTask, QuadrantType } from '@/types';
import DraggableTaskCard from './DraggableTaskCard';
import DroppableQuadrant from './DroppableQuadrant';
import { RefreshCw } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { useState } from 'react';

export default function DragDropMatrix() {
  const { tasks, loading, error, refetch, createTask, updateTask, deleteTask, completeTask } = useTasks();
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(task => task.id === activeId);
    if (!activeTask) return;

    // Check if dropping on a quadrant
    const quadrantIds = ['do', 'schedule', 'delegate', 'delete'];
    if (quadrantIds.includes(overId)) {
      const newQuadrant = overId as QuadrantType;
      
      if (activeTask.quadrant !== newQuadrant) {
        // Update task's quadrant and priority based on new quadrant
        let newPriority = activeTask.priority;
        if (newQuadrant === 'do') newPriority = 4;
        else if (newQuadrant === 'schedule') newPriority = 3;
        else if (newQuadrant === 'delegate') newPriority = 2;
        else if (newQuadrant === 'delete') newPriority = 1;

        try {
          await updateTask(activeId, { 
            priority: newPriority,
            // Note: We'll update the local state to reflect the quadrant change
            // but won't send quadrant to Todoist API as it's not a native field
          });
          
          // Update local state to reflect quadrant change
          // This will be handled by the useTasks hook through the categorizeTask function
          
          // Refresh tasks to ensure consistency
          await refetch();
        } catch (error) {
          console.error('Error updating task:', error);
        }
      }
    }
  };

  const handleTaskCreate = async (content: string, quadrant: QuadrantType) => {
    try {
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

  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={`Error loading tasks: ${error}`} 
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eisenhower Matrix</h1>
          <p className="text-gray-600">Drag tasks between quadrants to organize by urgency and importance</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
          {quadrants.map((quadrant) => (
            <DroppableQuadrant
              key={quadrant.id}
              quadrant={quadrant}
              onTaskComplete={handleTaskComplete}
              onTaskDelete={handleTaskDelete}
              onTaskUpdate={handleTaskUpdate}
              onTaskCreate={handleTaskCreate}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <DraggableTaskCard
              task={activeTask}
              onComplete={() => {}}
              onDelete={() => {}}
              onUpdate={() => {}}
              isDragOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}