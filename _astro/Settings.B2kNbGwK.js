import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{u as c,a as m}from"./useFontSize.DCiVzsK0.js";import{c as a}from"./createLucideIcon.H8DUYhgo.js";import"./index.WFquGv8Z.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],l=a("moon",o);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],x=a("sun",i);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]],h=a("type",p),g=()=>{const{darkMode:s,setDarkMode:d}=c(),{fontSize:n,changeFontSize:r}=m();return e.jsx("div",{className:"max-w-3xl mx-auto mt-12 px-4 py-8 w-full",children:e.jsxs("div",{className:"bg-card rounded-lg shadow-sm dark:shadow-gray-600 divide-y",children:[e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[s?e.jsx(l,{className:"h-5 w-5 text-blue-400"}):e.jsx(x,{className:"h-5 w-5 text-yellow-500"}),e.jsx("span",{className:"font-medium",children:"테마 모드"})]}),e.jsx("button",{type:"button",onClick:()=>d(!s),className:"flex items-center justify-center h-6 w-12 rounded-full relative bg-secondary","aria-label":s?"라이트 모드로 전환":"다크 모드로 전환",children:e.jsx("div",{className:`absolute h-5 w-5 rounded-full bg-primary transition-transform ${s?"translate-x-3":"-translate-x-3"}`})})]}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:s?"다크 모드가 활성화되어 있습니다.":"라이트 모드가 활성화되어 있습니다."})]}),e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx(h,{className:"h-5 w-5 text-blue-400"}),e.jsx("span",{className:"font-medium",children:"폰트 크기"})]}),e.jsx("p",{className:"text-sm text-muted-foreground mb-3",children:"컨텐츠의 텍스트 크기를 조절합니다."}),e.jsx("div",{className:"flex gap-2",children:["small","medium","large"].map(t=>e.jsx("button",{type:"button",onClick:()=>r(t),className:`px-3 py-1.5 rounded-md text-sm ${n===t?"bg-primary text-primary-foreground":"bg-secondary text-secondary-foreground hover:bg-secondary/80"}`,children:t==="small"?"작게":t==="medium"?"보통":"크게"},t))})]})]})})};export{g as SettingsPage};
