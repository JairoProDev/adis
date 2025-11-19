'use client';

import { useState } from 'react';
import { X, Palette, Type as TypeIcon } from 'lucide-react';
import { PageComponent, PageConfig } from './PageBuilder';

interface PropertiesPanelProps {
  component: PageComponent;
  theme: PageConfig['theme'];
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
  onUpdateTheme: (theme: PageConfig['theme']) => void;
  onClose: () => void;
}

export function PropertiesPanel({
  component,
  theme,
  onUpdateComponent,
  onUpdateTheme,
  onClose,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'component' | 'theme'>('component');

  const updateProp = (key: string, value: any) => {
    onUpdateComponent(component.id, {
      ...component.props,
      [key]: value,
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Properties</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('component')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'component'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TypeIcon className="w-4 h-4 inline mr-2" />
          Component
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'theme'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Theme
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'component' ? (
          <ComponentProperties component={component} updateProp={updateProp} />
        ) : (
          <ThemeProperties theme={theme} onUpdateTheme={onUpdateTheme} />
        )}
      </div>
    </div>
  );
}

function ComponentProperties({
  component,
  updateProp,
}: {
  component: PageComponent;
  updateProp: (key: string, value: any) => void;
}) {
  if (component.type === 'link') {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={component.props.title}
            onChange={(e) => updateProp('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            value={component.props.url}
            onChange={(e) => updateProp('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </>
    );
  }

  if (component.type === 'text') {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={component.props.content}
            onChange={(e) => updateProp('content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <select
            value={component.props.size}
            onChange={(e) => updateProp('size', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </>
    );
  }

  if (component.type === 'image') {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            value={component.props.url}
            onChange={(e) => updateProp('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
          <input
            type="text"
            value={component.props.alt}
            onChange={(e) => updateProp('alt', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </>
    );
  }

  if (component.type === 'video') {
    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
          <input
            type="url"
            value={component.props.url}
            onChange={(e) => updateProp('url', e.target.value)}
            placeholder="YouTube or Vimeo URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </>
    );
  }

  return null;
}

function ThemeProperties({
  theme,
  onUpdateTheme,
}: {
  theme: PageConfig['theme'];
  onUpdateTheme: (theme: PageConfig['theme']) => void;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={theme.backgroundColor}
            onChange={(e) => onUpdateTheme({ ...theme, backgroundColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={theme.backgroundColor}
            onChange={(e) => onUpdateTheme({ ...theme, backgroundColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={(e) => onUpdateTheme({ ...theme, primaryColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
        <select
          value={theme.font}
          onChange={(e) => onUpdateTheme({ ...theme, font: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
          <option value="Roboto">Roboto</option>
          <option value="Montserrat">Montserrat</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
        <input
          type="range"
          min="0"
          max="24"
          value={theme.borderRadius}
          onChange={(e) => onUpdateTheme({ ...theme, borderRadius: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">{theme.borderRadius}px</div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
        <div className="grid grid-cols-3 gap-2">
          {['fill', 'outline', 'soft'].map((style) => (
            <button
              key={style}
              onClick={() => onUpdateTheme({ ...theme, buttonStyle: style as any })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme.buttonStyle === style
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
