const color = {
  white: 'rgb(250, 250, 250)',
  black: 'rgb(30, 31, 33, 0.94)',
  yellow: 'rgb(253, 216, 4)',
  gainsboro: 'rgb(220,220,220)',
  grey: 'rgb(128,128,128)',
  lightgray: 'rgb(211,211,211)',
  silver: 'rgb(192,192,192)',
  purple: 'rgba(107, 82, 248, 1)',
  whiteDarker: 'rgba(233, 233, 233, 0.96)',
  skyblue: 'rgb(135,206,235)',
  orange: '#FFA500',
};

const SPACING_VARIABLES = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

/**
 * * 프로젝트의 spacing을 관리한다.
 * - 1: 1rem
 * - ...
 * - 8: 2rem
 */
const spacing = (target: keyof typeof SPACING_VARIABLES) => {
  return SPACING_VARIABLES[target] ?? 0;
};

const FONT_SIZE_VARIABLES = {
  0: '0.833rem',
  1: '1rem',
  2: '1.2rem',
  3: '1.44rem',
  4: '1.728rem',
  5: '2.074rem',
  6: '2.488rem',
  7: '2.986rem',
};

/**
 * * 프로젝트의 폰트 사이즈를 관리한다.
 */
const fontSize = (target: keyof typeof FONT_SIZE_VARIABLES) => {
  return FONT_SIZE_VARIABLES[target] ?? 0;
};

const MAX_WIDTH_VARIABLES = {
  none: 'none',
  xs: '20rem',
  sm: '24rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  full: '100%',
  wrapper: '56rem',
};

/**
 * * 프로젝트의 maxWidth를 관리한다.
 */
const maxWidth = (target: keyof typeof MAX_WIDTH_VARIABLES) => {
  return MAX_WIDTH_VARIABLES[target] ?? 'none';
};

export const theme = {
  color: {
    ...color,
    primary: color.skyblue,
  },
  spacing,
  fontSize,
  maxWidth,
};
