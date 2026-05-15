import { useState } from 'react';
import { cn } from '@/lib/utils';

const NoImageAvailable = '/assets/no_image_available.png';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export const SafeImage = ({ src, alt, className, ...props }: Props) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImageSrc(NoImageAvailable);
      setHasError(true);
    }
  };

  return (
    <img
      {...props}
      src={imageSrc}
      alt={hasError ? 'No image available' : alt || 'Image'}
      aria-describedby={hasError ? 'no-image-available' : undefined}
      data-origin-src={hasError ? src : undefined}
      onError={handleError}
      className={cn('rounded-lg shadow-md mx-auto my-2 max-w-full h-auto', className)}
      loading="lazy"
      decoding="async"
    />
  );
};
