import * as React from "react"
import { ThemeProvider } from 'styled-components';

const StyledThemeProvider: React.FC<{ children: any }> = ({ children }) => {
  const color = {
    white: "rgb(250, 250, 250)",
    black: "rgb(30, 31, 33, 0.94)",
    yellow: "rgb(253, 216, 4)",
    purple: "rgba(107, 82, 248, 1)",
    whiteDarker: "rgba(233, 233, 233, 0.96)",
  }

  const theme = {
    color: {
      ...color,
      primary: color.black,
      dark: color.white,
      icon: color.yellow,
    },
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default StyledThemeProvider
