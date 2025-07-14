'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EisenhowerTask } from '@/types';
import { CheckCircle, Circle, Trash2, Edit3, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface DraggableTaskCardProps {
  task: EisenhowerTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EisenhowerTask>) => void;
  isDragOverlay?: boolean;
}

export default function DraggableTaskCard({ 
  task, 
  onComplete, 
  onDelete, 
  onUpdate, 
  isDragOverlay = false 
}: DraggableTaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = () => {
    if (isEditing) {
      onUpdate(task.id, { content: editContent });
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    }
    if (e.key === 'Escape') {
      setEditContent(task.content);
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 4: return 'border-red-500';
      case 3: return 'border-orange-500';
      case 2: return 'border-yellow-500';
      default: return 'border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(task.priority)} p-4 mb-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${isDragOverlay ? 'rotate-3 shadow-lg' : ''}`}
      {...attributes}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <div
            {...listeners}
            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-1"
          >
            <GripVertical size={16} />
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleEdit}
                className="w-full text-gray-900 border-none outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {task.content}
              </h3>
            )}
            
            {task.description && (
              <p className="text-xs text-gray-600 mb-2">{task.description}</p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {task.due && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {formatDate(task.due.date)}
                </span>
              )}
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                P{task.priority}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Edit task"
          >
            <Edit3 size={14} />
          </button>
          
          <button
            onClick={() => onComplete(task.id)}
            className="text-gray-400 hover:text-green-600 p-1"
            title="Complete task"
          >
            {task.is_completed ? <CheckCircle size={14} /> : <Circle size={14} />}
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 p-1"
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}