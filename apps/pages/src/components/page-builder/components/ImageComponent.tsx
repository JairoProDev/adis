'use client';

import { PageConfig } from '../PageBuilder';

interface ImageComponentProps {
  props: {
    url: string;
    alt: string;
    width: string;
    alignment: 'left' | 'center' | 'right';
  };
  theme: PageConfig['theme'];
}

export function ImageComponent({ props, theme }: ImageComponentProps) {
  if (!props.url) {
    return (
      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">Add image URL</span>
      </div>
    );
  }

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <div className={`${alignmentClasses[props.alignment]}`} style={{ width: props.width }}>
      <img
        src={props.url}
        alt={props.alt}
        className="w-full h-auto object-cover"
        style={{ borderRadius: `${theme.borderRadius}px` }}
      />
    </div>
  );
}
