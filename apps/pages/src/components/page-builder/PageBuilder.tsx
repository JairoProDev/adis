'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ComponentLibrary } from './ComponentLibrary';
import { CanvasArea } from './CanvasArea';
import { PropertiesPanel } from './PropertiesPanel';
import { TopBar } from './TopBar';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const UPDATE_PAGE_CONFIG = gql`
  mutation UpdatePageConfig($input: UpdatePageConfigInput!) {
    updatePageConfig(input: $input) {
      id
      slug
      theme
    }
  }
`;

export interface PageComponent {
  id: string;
  type: 'link' | 'text' | 'image' | 'social' | 'divider' | 'video' | 'contact';
  props: Record<string, any>;
  order: number;
}

export interface PageConfig {
  components: PageComponent[];
  theme: {
    backgroundColor: string;
    backgroundImage?: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    borderRadius: number;
    buttonStyle: 'fill' | 'outline' | 'soft';
  };
}

interface PageBuilderProps {
  businessId: string;
  initialConfig?: PageConfig;
  onSave?: (config: PageConfig) => void;
}

const defaultTheme = {
  backgroundColor: '#ffffff',
  primaryColor: '#10b981',
  secondaryColor: '#1f2937',
  font: 'Inter',
  borderRadius: 8,
  buttonStyle: 'fill' as const,
};

export function PageBuilder({ businessId, initialConfig, onSave }: PageBuilderProps) {
  const [components, setComponents] = useState<PageComponent[]>(
    initialConfig?.components || []
  );
  const [theme, setTheme] = useState(initialConfig?.theme || defaultTheme);
  const [selectedComponent, setSelectedComponent] = useState<PageComponent | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [updatePageConfig, { loading: saving }] = useMutation(UPDATE_PAGE_CONFIG);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const addComponent = useCallback((type: PageComponent['type']) => {
    const newComponent: PageComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      order: components.length,
    };
    setComponents([...components, newComponent]);
  }, [components]);

  const updateComponent = useCallback((id: string, props: Record<string, any>) => {
    setComponents((items) =>
      items.map((item) => (item.id === id ? { ...item, props } : item))
    );
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setComponents((items) => items.filter((item) => item.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const handleSave = async () => {
    const config: PageConfig = { components, theme };

    try {
      await updatePageConfig({
        variables: {
          input: {
            businessId,
            theme: config,
          },
        },
      });
      onSave?.(config);
    } catch (error) {
      console.error('Error saving page config:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <TopBar
        onSave={handleSave}
        saving={saving}
        previewMode={previewMode}
        onTogglePreview={() => setPreviewMode(!previewMode)}
      />

      <div className="flex-1 flex overflow-hidden">
        {!previewMode && (
          <ComponentLibrary onAddComponent={addComponent} />
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={components.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <CanvasArea
              components={components}
              theme={theme}
              selectedId={selectedComponent?.id}
              onSelect={setSelectedComponent}
              onDelete={deleteComponent}
              previewMode={previewMode}
            />
          </SortableContext>
        </DndContext>

        {!previewMode && selectedComponent && (
          <PropertiesPanel
            component={selectedComponent}
            theme={theme}
            onUpdateComponent={updateComponent}
            onUpdateTheme={setTheme}
            onClose={() => setSelectedComponent(null)}
          />
        )}
      </div>
    </div>
  );
}

function getDefaultProps(type: PageComponent['type']): Record<string, any> {
  switch (type) {
    case 'link':
      return { title: 'New Link', url: 'https://example.com', icon: null };
    case 'text':
      return { content: 'Your text here', alignment: 'center', size: 'medium' };
    case 'image':
      return { url: '', alt: '', width: '100%', alignment: 'center' };
    case 'social':
      return {
        links: [
          { platform: 'instagram', url: '' },
          { platform: 'facebook', url: '' },
          { platform: 'twitter', url: '' },
        ],
      };
    case 'divider':
      return { style: 'solid', color: '#e5e7eb', width: '100%' };
    case 'video':
      return { url: '', provider: 'youtube' };
    case 'contact':
      return { email: '', phone: '', whatsapp: '' };
    default:
      return {};
  }
}
