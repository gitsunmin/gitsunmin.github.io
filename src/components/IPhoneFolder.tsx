import { useState, useEffect, useCallback } from 'react';
import { Blend, Mic, Frame, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP = {
  Blend,
  Mic,
  Frame,
  QrCode,
} as const;

type IconName = keyof typeof ICON_MAP;

export type FolderLink = {
  id: string;
  label: string;
  to: string;
  target: '_self' | '_blank';
  iconName: IconName;
};

type Props = {
  label: string;
  links: FolderLink[];
};

export function IPhoneFolder({ label, links }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
  };

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 350);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Folder closed icon */}
      <button
        type="button"
        onClick={open}
        aria-label={`Open ${label} folder`}
        aria-expanded={isOpen}
        className={cn(
          'flex w-14 flex-col justify-center items-center gap-y-2',
          'group relative',
          'transition-transform duration-100 active:scale-90'
        )}
      >
        <div
          className={cn(
            'size-14 rounded-xl overflow-hidden',
            'backdrop-blur-md backdrop-saturate-150',
            'bg-white/30 dark:bg-white/10',
            'border border-white/70 dark:border-white/20',
            'shadow-[0_4px_24px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.05)]',
            'dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]',
            'transition-all duration-300',
            'group-hover:bg-white/40 dark:group-hover:bg-white/15',
            'group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.8)]',
            'dark:group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]'
          )}
        >
          {/* 2×2 mini icon grid */}
          <div className="grid grid-cols-2 gap-0.75 p-2.25 w-full h-full">
            {links.slice(0, 4).map((link) => {
              const Icon = ICON_MAP[link.iconName];
              return (
                <div key={link.id} className="flex items-center justify-center">
                  {Icon && <Icon size={12} className="text-foreground opacity-70" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Static label */}
        <div
          className={cn(
            'text-xs text-foreground break-keep text-center line-clamp-1',
            'transition-all duration-300 ease-out',
            'group-hover:opacity-0 group-hover:translate-y-1'
          )}
        >
          {label}
        </div>

        {/* Hover tooltip — matches other icons on the page */}
        <div
          className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap',
            'text-xs text-foreground px-2.5 py-[5px] rounded-lg',
            'backdrop-blur-md backdrop-saturate-150',
            'bg-white/25 dark:bg-white/10',
            'border border-white/60 dark:border-white/20',
            'shadow-[0_2px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.5)]',
            'dark:shadow-[0_2px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
            'pointer-events-none z-10',
            'opacity-0 -translate-y-1',
            'group-hover:opacity-100 group-hover:translate-y-0',
            'transition-all duration-300 ease-out'
          )}
        >
          {label}
        </div>
      </button>

      {/* Folder overlay */}
      {isOpen && (
        <button
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            'transition-opacity duration-300',
            isVisible ? 'opacity-100 backdrop-blur-xs' : 'opacity-0',
            'bg-transparent border-0 p-0 cursor-auto'
          )}
          onClick={close}
          type="button"
        >
          {/* Liquid Glass backdrop — uniform blur + dim, no gradient (matches real iOS) */}
          <div className="absolute inset-0 backdrop-blur-2xl backdrop-brightness-[78%] backdrop-saturate-[85%]" />
          <div className="absolute inset-0 bg-black/12 dark:bg-black/25" />

          {/*
           * ── Liquid Glass panel ──
           * Outer div: carries only the shadow (no overflow-hidden = shadow not clipped)
           * Glass layer: absolute-positioned material (backdrop + tint + border)
           * Sheen layer: absolute-positioned light interaction effects
           * Content: z-10 so it sits above all glass layers
           */}
          <button
            type='button'
            className={cn(
              'relative z-10 rounded-[28px] min-w-67',
              'backdrop-blur-xs backdrop-saturate-150',
              'shadow-[0_2px_0_0.5px_rgba(255,255,255,0.55),0_32px_80px_rgba(0,0,0,0.22),0_0_40px_rgba(255,255,255,0.10)]',
              'dark:shadow-[0_2px_0_0.5px_rgba(255,255,255,0.13),0_32px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(255,255,255,0.04)]',
              'transition-[transform,opacity] duration-380',
              isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-[0.72] translate-y-6 opacity-0'
            )}
            style={{
              transitionTimingFunction: isVisible
                ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'cubic-bezier(0.4, 0, 0.8, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            {/* Glass material — backdrop filter + tint + hairline border */}
            <div
              className={cn(
                'absolute inset-0 rounded-[28px]',
                'backdrop-blur-xs backdrop-saturate-200 backdrop-brightness-112',
                'bg-white/38 dark:bg-white/12',
                'border border-white/75 dark:border-white/20',
              )}
            />

            {/* Content */}
            <div className="relative z-10 px-8 py-6">
              {/* Folder title */}
              <p className="text-sm font-medium text-center text-foreground/65 mb-5 tracking-wide select-none">
                {label}
              </p>

              {/* App icons with staggered entrance */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {links.map((link, i) => {
                  const Icon = ICON_MAP[link.iconName];
                  return (
                    <a
                      key={link.id}
                      href={link.to}
                      target={link.target}
                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                      onClick={close}
                      className={cn(
                        'flex flex-col items-center gap-y-2 group/app',
                        'transition-[transform,opacity] duration-300',
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
                        'active:scale-90'
                      )}
                      style={{ transitionDelay: isVisible ? `${60 + i * 40}ms` : '0ms' }}
                    >
                      <div
                        className={cn(
                          'size-14 rounded-xl flex items-center justify-center',
                          'backdrop-blur-md backdrop-saturate-150',
                          'bg-white/35 dark:bg-white/12',
                          'border border-white/70 dark:border-white/20',
                          'shadow-[0_4px_24px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.78)]',
                          'dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)]',
                          'transition-all duration-200',
                          'group-hover/app:bg-white/50 dark:group-hover/app:bg-white/20',
                          'group-hover/app:scale-110',
                          'group-hover/app:shadow-[0_8px_32px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]',
                          'dark:group-hover/app:shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]'
                        )}
                      >
                        {Icon && <Icon size={28} className="text-foreground" />}
                      </div>
                      <span className="text-xs text-foreground/90 text-center select-none">
                        {link.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </button>
        </button>
      )}
    </>
  );
}
