import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  slides: React.ReactNode[];
  options?: Parameters<typeof useEmblaCarousel>[0];
  view?: 'full' | 'wide' | 'narrow';
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onSelect?: (index: number) => void;
};

const Carousel: React.FC<Props> = ({
  slides,
  options,
  view = 'full',
  onNextClick,
  onPrevClick,
  onSelect,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    onPrevClick?.();
  }, [emblaApi, onPrevClick]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    onNextClick?.();
  }, [emblaApi, onNextClick]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelectHandler = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    onSelect?.(index);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelectHandler);
    onSelectHandler();
  }, [emblaApi, onSelectHandler]);

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              className={cn('flex-[0_0_80%] px-2', {
                'flex-[0_0_100%]': view === 'full',
                'flex-[0_0_80%]': view === 'wide',
                'flex-[0_0_60%]': view === 'narrow',
              })}
              key={index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <button className="px-4 py-2" onClick={scrollPrev}>
          <ArrowLeft />
        </button>
        <button className="px-4 py-2" onClick={scrollNext}>
          <ArrowRight />
        </button>
      </div>

      {/* Dot Buttons */}
      <div className="flex justify-center mt-4 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
