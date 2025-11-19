'use client';

import { Mail, Phone, MessageCircle } from 'lucide-react';
import { PageConfig } from '../PageBuilder';

interface ContactComponentProps {
  props: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  theme: PageConfig['theme'];
}

export function ContactComponent({ props, theme }: ContactComponentProps) {
  return (
    <div className="space-y-3">
      {props.email && (
        <a
          href={`mailto:${props.email}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderRadius: `${theme.borderRadius}px` }}
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
          >
            <Mail className="w-5 h-5" />
          </div>
          <span className="text-gray-700">{props.email}</span>
        </a>
      )}

      {props.phone && (
        <a
          href={`tel:${props.phone}`}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderRadius: `${theme.borderRadius}px` }}
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
          >
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-gray-700">{props.phone}</span>
        </a>
      )}

      {props.whatsapp && (
        <a
          href={`https://wa.me/${props.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ borderRadius: `${theme.borderRadius}px` }}
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
          >
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-gray-700">{props.whatsapp}</span>
        </a>
      )}
    </div>
  );
}
