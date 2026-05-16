import{r as n}from"./index.DiEladB3.js";import{c as a}from"./createLucideIcon.DwjmCPeJ.js";const m=(t,r=.15)=>{const[c,o]=n.useState(!1);return n.useEffect(()=>{const s=t.current;if(!s)return;const e=new IntersectionObserver(([i])=>{i.isIntersecting&&(o(!0),e.disconnect())},{threshold:r});return e.observe(s),()=>e.disconnect()},[t,r]),c};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],y=a("calendar",u);export{y as C,m as u};
