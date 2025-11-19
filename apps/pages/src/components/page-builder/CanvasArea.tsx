'use client';

import { SortableItem } from './SortableItem';
import { PageComponent, PageConfig } from './PageBuilder';
import { RenderComponent } from './components/RenderComponent';

interface CanvasAreaProps {
  components: PageComponent[];
  theme: PageConfig['theme'];
  selectedId?: string;
  onSelect: (component: PageComponent) => void;
  onDelete: (id: string) => void;
  previewMode: boolean;
}

export function CanvasArea({
  components,
  theme,
  selectedId,
  onSelect,
  onDelete,
  previewMode,
}: CanvasAreaProps) {
  const canvasStyle = {
    backgroundColor: theme.backgroundColor,
    backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : undefined,
    fontFamily: theme.font,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Phone mockup frame */}
        <div className="bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
          <div
            className="bg-white rounded-[2.5rem] overflow-hidden h-[812px]"
            style={canvasStyle}
          >
            {/* Status bar */}
            {!previewMode && (
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-4 py-2 flex items-center justify-between">
                <span>Page Builder - Drag components to reorder</span>
                <span>{components.length} components</span>
              </div>
            )}

            {/* Content area */}
            <div className="p-6 space-y-4 overflow-y-auto h-full">
              {components.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">
                      <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Add components to get started</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Click components from the sidebar to add them
                    </p>
                  </div>
                </div>
              ) : (
                components.map((component) => (
                  <SortableItem
                    key={component.id}
                    id={component.id}
                    active={selectedId === component.id}
                    onSelect={() => onSelect(component)}
                    onDelete={() => onDelete(component.id)}
                    previewMode={previewMode}
                  >
                    <RenderComponent component={component} theme={theme} />
                  </SortableItem>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
