import { cn } from '@/lib/utils';

type Props = {
  src: string;
  alt: string;
  size: number;
  className?: string;
  bordered?: boolean;
};

export const Avatar = ({ src, alt, size, className }: Props) => {
  return (
    <div
      className={cn('rounded-full', className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        className="object-cover rounded-full"
        style={{ width: size, height: size }}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = 'https://github.com/gitsunmin.png?raw=true';
        }}
      />
    </div>
  );
};
