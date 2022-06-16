// src/styles/media.ts
import { css, CSSObject, SimpleInterpolation } from 'styled-components';

const viewSizes: Record<DeviceType, number> = {
  desktop: 1200,
  tablet: 768,
  mobile: 600,
};

const media = Object.entries(viewSizes).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: SimpleInterpolation[]
    ) => css`
      @media (max-width: ${value}px) {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<DeviceType, any>;

export { media, viewSizes };
