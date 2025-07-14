'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EisenhowerTask, QuadrantType } from '@/types';
import DraggableTaskCard from './DraggableTaskCard';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface DroppableQuadrantProps {
  quadrant: {
    id: QuadrantType;
    title: string;
    description: string;
    color: string;
    tasks: EisenhowerTask[];
  };
  onTaskComplete: (id: string) => void;
  onTaskDelete: (id: string) => void;
  onTaskUpdate: (id: string, updates: Partial<EisenhowerTask>) => void;
  onTaskCreate: (content: string, quadrant: QuadrantType) => void;
}

export default function DroppableQuadrant({
  quadrant,
  onTaskComplete,
  onTaskDelete,
  onTaskUpdate,
  onTaskCreate,
}: DroppableQuadrantProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');

  const { isOver, setNodeRef } = useDroppable({
    id: quadrant.id,
  });

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      onTaskCreate(newTaskContent.trim(), quadrant.id);
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
    if (e.key === 'Escape') {
      setNewTaskContent('');
      setIsAddingTask(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 h-full flex flex-col transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : ''
      }`}
    >
      <div className="mb-4">
        <div className={`w-full h-2 ${quadrant.color} rounded-full mb-3`} />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {quadrant.title}
        </h2>
        <p className="text-sm text-gray-600 mb-2">{quadrant.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {quadrant.tasks.length} task{quadrant.tasks.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setIsAddingTask(true)}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Add task"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isAddingTask && (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 mb-3">
            <input
              type="text"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newTaskContent.trim()) {
                  setIsAddingTask(false);
                }
              }}
              placeholder="Enter task content..."
              className="w-full text-sm border-none outline-none bg-transparent placeholder-gray-400"
              autoFocus
            />
          </div>
        )}

        <SortableContext 
          items={quadrant.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {quadrant.tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onComplete={onTaskComplete}
              onDelete={onTaskDelete}
              onUpdate={onTaskUpdate}
            />
          ))}
        </SortableContext>

        {quadrant.tasks.length === 0 && !isAddingTask && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No tasks in this quadrant</p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2"
            >
              Add a task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}