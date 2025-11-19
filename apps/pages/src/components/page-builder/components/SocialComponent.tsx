'use client';

import { Instagram, Facebook, Twitter, Linkedin, Youtube, Github } from 'lucide-react';
import { PageConfig } from '../PageBuilder';

interface SocialComponentProps {
  props: {
    links: Array<{
      platform: string;
      url: string;
    }>;
  };
  theme: PageConfig['theme'];
}

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
};

export function SocialComponent({ props, theme }: SocialComponentProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {props.links.map((link, index) => {
        const Icon = socialIcons[link.platform.toLowerCase()];
        if (!Icon || !link.url) return null;

        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full hover:scale-110 transition-transform"
            style={{
              backgroundColor: `${theme.primaryColor}20`,
              color: theme.primaryColor,
            }}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}
