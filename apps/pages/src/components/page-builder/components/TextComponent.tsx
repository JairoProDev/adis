'use client';

import { PageConfig } from '../PageBuilder';

interface TextComponentProps {
  props: {
    content: string;
    alignment: 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large';
  };
  theme: PageConfig['theme'];
}

export function TextComponent({ props, theme }: TextComponentProps) {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-2xl font-bold',
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <p
      className={`${sizeClasses[props.size]} ${alignmentClasses[props.alignment]} text-gray-800`}
      style={{ color: theme.secondaryColor }}
    >
      {props.content}
    </p>
  );
}
