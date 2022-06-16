// typefaces, font library
import 'typeface-montserrat';
import 'typeface-merriweather';

// Highlighting for code blocks
import 'prismjs/themes/prism.css';

// normalize CSS across browsers
import './src/styles/css/normalize.css';

// React, Recoil 적용
import React from 'react';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from '@src/styles';
import { theme } from '@src/styles/theme';

export const wrapRootElement = ({ element }) => {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {element}
      </ThemeProvider>
    </RecoilRoot>
  );
};
