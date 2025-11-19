'use client';

import { Link, Type, Image, Share2, Minus, Video, Mail } from 'lucide-react';
import { PageComponent } from './PageBuilder';

interface ComponentLibraryProps {
  onAddComponent: (type: PageComponent['type']) => void;
}

const components = [
  { type: 'link' as const, label: 'Link', icon: Link, description: 'Add a clickable link' },
  { type: 'text' as const, label: 'Text', icon: Type, description: 'Add text or heading' },
  { type: 'image' as const, label: 'Image', icon: Image, description: 'Add an image' },
  { type: 'social' as const, label: 'Social Links', icon: Share2, description: 'Social media links' },
  { type: 'divider' as const, label: 'Divider', icon: Minus, description: 'Add a divider line' },
  { type: 'video' as const, label: 'Video', icon: Video, description: 'Embed a video' },
  { type: 'contact' as const, label: 'Contact', icon: Mail, description: 'Contact information' },
];

export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Components</h3>

      <div className="space-y-2">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <button
              key={component.type}
              onClick={() => onAddComponent(component.type)}
              className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left group"
            >
              <div className="p-2 rounded-md bg-gray-100 group-hover:bg-emerald-100 transition-colors">
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900">{component.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{component.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-sm text-gray-900 mb-3">Templates</h4>
        <div className="space-y-2">
          <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left">
            <div className="font-medium text-sm text-gray-900">Simple</div>
            <div className="text-xs text-gray-500 mt-0.5">Clean and minimal</div>
          </button>
          <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left">
            <div className="font-medium text-sm text-gray-900">Business</div>
            <div className="text-xs text-gray-500 mt-0.5">Professional layout</div>
          </button>
          <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left">
            <div className="font-medium text-sm text-gray-900">Creative</div>
            <div className="text-xs text-gray-500 mt-0.5">Bold and colorful</div>
          </button>
        </div>
      </div>
    </div>
  );
}
