// typefaces, font library
import "typeface-montserrat"
import "typeface-merriweather"

// Highlighting for code blocks
import "prismjs/themes/prism.css"

// normalize CSS across browsers
import "./src/styles/css/normalize.css"
// custom CSS styles
import "./src/styles/css/style.css"

// React, Recoil 적용
import React from "react"
import { RecoilRoot } from "recoil"

export const wrapRootElement = ({ element }) => {
  return <RecoilRoot>{element}</RecoilRoot>
}