'use client';

import { ExternalLink } from 'lucide-react';
import { PageConfig } from '../PageBuilder';

interface LinkComponentProps {
  props: {
    title: string;
    url: string;
    icon?: string;
  };
  theme: PageConfig['theme'];
}

export function LinkComponent({ props, theme }: LinkComponentProps) {
  const getButtonStyles = () => {
    const baseStyles = 'w-full px-6 py-4 font-medium transition-all flex items-center justify-between';
    const borderRadius = `rounded-[${theme.borderRadius}px]`;

    if (theme.buttonStyle === 'fill') {
      return `${baseStyles} ${borderRadius} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm`;
    }
    if (theme.buttonStyle === 'outline') {
      return `${baseStyles} ${borderRadius} border-2 border-current text-gray-900 hover:bg-gray-50`;
    }
    return `${baseStyles} ${borderRadius} bg-gray-100 text-gray-900 hover:bg-gray-200`;
  };

  return (
    <a
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
      className={getButtonStyles()}
      style={{ borderRadius: `${theme.borderRadius}px`, color: theme.primaryColor }}
    >
      <span className="flex-1 text-center">{props.title}</span>
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}
