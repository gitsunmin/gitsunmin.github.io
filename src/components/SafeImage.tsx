import NoImageAvailable from '@/assets/no_image_available.png';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
      className={cn('rounded-lg shadow-md mx-auto my-2', className)}
    />
  );
};
