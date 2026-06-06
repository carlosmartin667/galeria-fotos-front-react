import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
}

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | GaleriaFotos`;
    upsertMeta('description', description);
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:type', 'website', 'property');
  }, [description, title]);

  return null;
}
