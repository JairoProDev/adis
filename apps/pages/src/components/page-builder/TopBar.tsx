'use client';

import { Save, Eye, EyeOff } from 'lucide-react';

interface TopBarProps {
  onSave: () => void;
  saving: boolean;
  previewMode: boolean;
  onTogglePreview: () => void;
}

export function TopBar({ onSave, saving, previewMode, onTogglePreview }: TopBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Page Builder</h1>
        <p className="text-sm text-gray-500">Design your Publicadis Page</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePreview}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {previewMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Edit Mode</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </>
          )}
        </button>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Page</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
