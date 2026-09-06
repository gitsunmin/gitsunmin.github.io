import { useState } from 'react';
import { cn } from '@/lib/utils';

const NoImageAvailable = '/assets/no_image_available.png';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export const SafeImage = ({ src, alt, className, loading = 'lazy', ...props }: Props) => {
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
      // 기본은 지연 로드지만, 호출부가 끌 수 있어야 한다 — 문서 전체를 한 번에
      // 쌓아 두는 화면(발표 덱·인쇄)에서는 지연 로드가 끝내 걸리지 않고
      // 빈 액자만 남는다.
      loading={loading}
      decoding="async"
    />
  );
};
