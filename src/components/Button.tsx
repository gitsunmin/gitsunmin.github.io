import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  className?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  onClick?: () => void;
}>;

export const Button = (props: Props) => {
  const { className, variant, disabled, children, onClick } = props;

  return (
    <button
      className={cn(
        {
          'bg-primary px-4 py-2 rounded-md': variant === 'primary',
          'bg-inherit outline-1 outline-primary-foreground':
            variant === 'outline',
          'bg-transparent p-1': variant === 'ghost',
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <div
        className={cn(
          {
            'text-primary-foreground': variant === 'primary',
            'text-muted-foreground': variant === 'outline',
          },
          'text-center'
        )}
      >
        {children}
      </div>
    </button>
  );
};
