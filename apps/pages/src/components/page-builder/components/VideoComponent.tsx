'use client';

import { PageConfig } from '../PageBuilder';

interface VideoComponentProps {
  props: {
    url: string;
    provider: 'youtube' | 'vimeo';
  };
  theme: PageConfig['theme'];
}

export function VideoComponent({ props, theme }: VideoComponentProps) {
  if (!props.url) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">Add video URL</span>
      </div>
    );
  }

  // Extract video ID from URL
  const getEmbedUrl = () => {
    if (props.provider === 'youtube') {
      const videoId = props.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    // Add vimeo support
    return props.url;
  };

  const embedUrl = getEmbedUrl();

  if (!embedUrl) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400 text-sm">Invalid video URL</span>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video" style={{ borderRadius: `${theme.borderRadius}px`, overflow: 'hidden' }}>
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
