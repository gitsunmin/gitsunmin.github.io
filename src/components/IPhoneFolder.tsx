import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ICON_MAP } from '@/lib/iconMap';
import type { IconName } from '@/lib/iconMap';

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
    setTimeout(() => setIsOpen(false), 380);
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
      {/* ── Folder closed icon ── */}
      <button
        type="button"
        onClick={open}
        aria-label={`Open ${label} folder`}
        aria-expanded={isOpen}
        className={cn(
          'flex w-14 flex-col justify-center items-center gap-y-2',
          'group relative',
          'transition-transform duration-100 ease-out active:scale-[0.86]'
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
            'transition-[transform,box-shadow,background-color] duration-300 ease-out',
            'group-hover:bg-white/45 dark:group-hover:bg-white/16',
            'group-hover:scale-[1.05]',
            'group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.85)]',
            'dark:group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.50),inset_0_1px_0_rgba(255,255,255,0.22)]'
          )}
        >
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

        {/* Label — fades out on hover */}
        <div
          className={cn(
            'text-xs text-foreground break-keep text-center line-clamp-1',
            'transition-[transform,opacity] duration-200 ease-out',
            'group-hover:opacity-0 group-hover:translate-y-1.5'
          )}
        >
          {label}
        </div>

        {/* Hover tooltip */}
        <div
          className={cn(
            'absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap',
            'text-xs text-foreground px-2.5 py-1.25 rounded-lg',
            'backdrop-blur-md backdrop-saturate-150',
            'bg-white/25 dark:bg-white/10',
            'border border-white/60 dark:border-white/20',
            'shadow-[0_2px_16px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.5)]',
            'dark:shadow-[0_2px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]',
            'pointer-events-none z-10',
            'opacity-0 translate-y-2',
            'group-hover:opacity-100 group-hover:translate-y-0',
            'transition-[transform,opacity] duration-200 ease-out'
          )}
        >
          {label}
        </div>
      </button>

      {/* ── Folder overlay ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop — blur value itself animates (0px→6px) so it's smooth from frame 1 */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: isVisible
                  ? 'blur(6px) brightness(90%) saturate(105%)'
                  : 'blur(0px) brightness(100%) saturate(100%)',
                WebkitBackdropFilter: isVisible
                  ? 'blur(6px) brightness(90%) saturate(105%)'
                  : 'blur(0px) brightness(100%) saturate(100%)',
                transition: `backdrop-filter ${isVisible ? '280ms' : '320ms'} ease-out, -webkit-backdrop-filter ${isVisible ? '280ms' : '320ms'} ease-out`,
              }}
            />
            <div
              className="absolute inset-0 bg-black/18 dark:bg-black/28"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${isVisible ? '280ms' : '320ms'} ease-out`,
              }}
            />
          </div>

          {/* Click-away zone (behind panel) */}
          <button
            type="button"
            className="absolute inset-0 cursor-auto border-0 bg-transparent"
            onClick={close}
            aria-label="Close folder"
            tabIndex={-1}
          />

          {/* Title + panel — pointer-events-none so clicks fall through to close button */}
          <div className="relative z-10 flex flex-col items-center gap-4 pointer-events-none">
            {/* Folder title */}
            <p
              className="text-xl font-bold text-center text-white tracking-tight select-none"
              style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: isVisible ? '400ms' : '220ms',
                transitionTimingFunction: isVisible
                  ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'cubic-bezier(0.4, 0, 1, 1)',
                transitionDelay: isVisible ? '40ms' : '0ms',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(-12px)',
              }}
            >
              {label}
            </p>

            {/*
             * ── Liquid Glass panel ──
             * Outer div: shadow only (overflow visible so shadow isn't clipped)
             * Layer 1: backdrop blur + tint (glass base)
             * Layer 2: specular gradient (top highlight — glass curvature)
             * Layer 3: hairline border + inner glow
             * Content: z-10
             */}
            <div
              className={cn(
                'relative rounded-[28px] min-w-67',
                // Bright top rim (glass edge) + large drop shadow
                'shadow-[0_2.5px_0_1px_rgba(255,255,255,0.75),0_24px_72px_rgba(0,0,0,0.28),0_8px_20px_rgba(0,0,0,0.10)]',
                'dark:shadow-[0_2.5px_0_1px_rgba(255,255,255,0.30),0_24px_72px_rgba(0,0,0,0.70),0_8px_20px_rgba(0,0,0,0.40)]',
                'will-change-transform',
                'pointer-events-auto',
              )}
              style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: isVisible ? '500ms' : '300ms',
                transitionTimingFunction: isVisible
                  ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'cubic-bezier(0.4, 0, 1, 1)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.70) translateY(32px)',
              }}
            >
              {/* Layer 1: glass base — backdrop-filter transitions alongside panel so color change is gradual */}
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden"
                style={{
                  backdropFilter: isVisible
                    ? 'blur(32px) saturate(160%) brightness(108%)'
                    : 'blur(0px) saturate(100%) brightness(100%)',
                  WebkitBackdropFilter: isVisible
                    ? 'blur(32px) saturate(160%) brightness(108%)'
                    : 'blur(0px) saturate(100%) brightness(100%)',
                  transition: `backdrop-filter ${isVisible ? '500ms' : '300ms'} ease-out, -webkit-backdrop-filter ${isVisible ? '500ms' : '300ms'} ease-out`,
                }}
              />

              {/*
               * Layer 2: specular gradient (glass curvature — top bright, fades quickly)
               * Reduced top opacity vs before so white doesn't wash out background colors.
               */}
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.07) 28%, rgba(255,255,255,0) 100%)',
                }}
              />

              {/* Layer 3: hairline border + bright inner rim */}
              <div
                className={cn(
                  'absolute inset-0 rounded-[28px] pointer-events-none',
                  'border border-white/72 dark:border-white/28',
                  'shadow-[inset_0_2px_0_rgba(255,255,255,0.88),inset_0_-1.5px_0_rgba(255,255,255,0.28),inset_1.5px_0_0_rgba(255,255,255,0.18),inset_-1.5px_0_0_rgba(255,255,255,0.18)]',
                  'dark:shadow-[inset_0_2px_0_rgba(255,255,255,0.38),inset_0_-1.5px_0_rgba(255,255,255,0.10),inset_1.5px_0_0_rgba(255,255,255,0.08),inset_-1.5px_0_0_rgba(255,255,255,0.08)]',
                )}
              />

              {/* Content */}
              <div className="relative z-10 px-8 py-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  {links.map((link, i) => {
                    const Icon = ICON_MAP[link.iconName];
                    return (
                      /* Stagger entrance wrapper — owns the enter/exit animation */
                      <div
                        key={link.id}
                        style={{
                          transitionProperty: 'transform, opacity',
                          transitionDuration: isVisible ? '380ms' : '160ms',
                          transitionTimingFunction: isVisible
                            ? 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                            : 'ease-in',
                          transitionDelay: isVisible ? `${90 + i * 55}ms` : '0ms',
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
                        }}
                      >
                        {/* Interactive link — owns hover/press states */}
                        <a
                          href={link.to}
                          target={link.target}
                          rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                          onClick={close}
                          className={cn(
                            'flex flex-col items-center gap-y-2 group/app',
                            'transition-transform duration-100 ease-out',
                            'active:scale-[0.88]',
                          )}
                        >
                          {/*
                           * App icon tile — Liquid Glass (3-layer)
                           * Outer: no overflow-hidden so box-shadow isn't clipped
                           */}
                          <div
                            className={cn(
                              'size-14 rounded-xl flex items-center justify-center',
                              'border border-white/55 dark:border-white/20',
                              'shadow-[inset_0_1.5px_0_rgba(255,255,255,0.70)] dark:shadow-[inset_0_1.5px_0_rgba(255,255,255,0.22)]',
                              'transition-transform duration-220 ease-out',
                              'group-hover/app:scale-[1.12]',
                            )}
                          >
                            {Icon && <Icon size={28} className="text-foreground" />}
                          </div>

                          <span className="text-xs text-foreground/90 text-center select-none font-medium">
                            {link.label}
                          </span>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
