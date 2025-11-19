'use client';

import { PageConfig } from '../PageBuilder';

interface DividerComponentProps {
  props: {
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    width: string;
  };
  theme: PageConfig['theme'];
}

export function DividerComponent({ props, theme }: DividerComponentProps) {
  return (
    <hr
      className="my-2"
      style={{
        borderStyle: props.style,
        borderColor: props.color,
        width: props.width,
        margin: '0 auto',
      }}
    />
  );
}
