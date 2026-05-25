import Link from 'next/link';

interface AdPlaceholderProps {
  size?: 'banner' | 'rectangle' | 'square' | 'sidebar';
  text?: string;
  className?: string;
}

export function AdPlaceholder({ size = 'banner', text, className = '' }: AdPlaceholderProps) {
  const sizeClasses: Record<string, string> = {
    banner: 'w-full max-w-[728px] h-[90px] mx-auto',
    rectangle: 'w-full max-w-[336px] h-[280px] mx-auto',
    square: 'w-full max-w-[250px] h-[250px] mx-auto',
    sidebar: 'w-full h-[250px]',
  };

  return (
    <Link
      href="/advertise"
      className={`block ${sizeClasses[size]} ${className} border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center hover:border-bitcoin/40 hover:bg-bitcoin/5 transition-all cursor-pointer group`}
    >
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground/60 group-hover:text-bitcoin/80 transition-colors">
          {text || 'Your Ad Here'}
        </p>
        <p className="text-xs text-muted-foreground/40 group-hover:text-bitcoin/60 transition-colors mt-0.5">
          Click to advertise
        </p>
      </div>
    </Link>
  );
}
