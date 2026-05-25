'use client';

import { useEffect } from 'react';
import { useSiteSettings } from '@/hooks/use-site-settings';

export function SeoSync() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (settings.seo?.title) {
      document.title = settings.seo.title;
    }

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (settings.seo?.description) setMeta('description', settings.seo.description);
    if (settings.seo?.keywords) setMeta('keywords', settings.seo.keywords);

    const setOg = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="og:${prop}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', `og:${prop}`);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (settings.seo?.title) setOg('title', settings.seo.title);
    if (settings.seo?.description) setOg('description', settings.seo.description);
    if (settings.seo?.ogImage) setOg('image', settings.seo.ogImage);

    if (settings.siteName) {
      let schemaEl = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (schemaEl) {
        try {
          const schema = JSON.parse(schemaEl.text);
          if (schema.name) schema.name = settings.siteName;
          if (schema.description) schema.description = settings.siteDescription || schema.description;
          schemaEl.text = JSON.stringify(schema);
        } catch {}
      }
    }
  }, [settings]);

  return null;
}
