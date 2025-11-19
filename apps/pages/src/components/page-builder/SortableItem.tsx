'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  previewMode: boolean;
}

export function SortableItem({ id, children, active, onSelect, onDelete, previewMode }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (previewMode) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-lg transition-all ${
        active ? 'ring-2 ring-emerald-500 bg-emerald-50/50' : 'hover:ring-2 hover:ring-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="bg-white border border-gray-200 rounded-lg p-1 shadow-sm mr-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-1 shadow-sm ml-2">
          <Trash2 className="w-4 h-4" />
        </div>
      </button>

      {children}
    </div>
  );
}
