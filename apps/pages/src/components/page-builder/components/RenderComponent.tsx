'use client';

import { PageComponent, PageConfig } from '../PageBuilder';
import { LinkComponent } from './LinkComponent';
import { TextComponent } from './TextComponent';
import { ImageComponent } from './ImageComponent';
import { SocialComponent } from './SocialComponent';
import { DividerComponent } from './DividerComponent';
import { VideoComponent } from './VideoComponent';
import { ContactComponent } from './ContactComponent';

interface RenderComponentProps {
  component: PageComponent;
  theme: PageConfig['theme'];
}

export function RenderComponent({ component, theme }: RenderComponentProps) {
  switch (component.type) {
    case 'link':
      return <LinkComponent props={component.props} theme={theme} />;
    case 'text':
      return <TextComponent props={component.props} theme={theme} />;
    case 'image':
      return <ImageComponent props={component.props} theme={theme} />;
    case 'social':
      return <SocialComponent props={component.props} theme={theme} />;
    case 'divider':
      return <DividerComponent props={component.props} theme={theme} />;
    case 'video':
      return <VideoComponent props={component.props} theme={theme} />;
    case 'contact':
      return <ContactComponent props={component.props} theme={theme} />;
    default:
      return null;
  }
}
