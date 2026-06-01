import{j as t}from"./jsx-runtime.u17CrQMm.js";import{r as n}from"./index.CO9X3OiW.js";import{r as _}from"./index.DQgKYfj8.js";import{c as y}from"./utils.Cm_RJUQe.js";var g=_();function S({tabs:i}){const[r,h]=n.useState(()=>{if(typeof window<"u"){const e=window.location.hash.slice(1);if(i.find(o=>o.id===e))return e}return i[0]?.id??""}),[f,c]=n.useState(null),m=n.useRef(null),d=n.useRef(null),b=i.findIndex(e=>e.id===r),l=i[b+1]??null,u=l===null,w=f===r,a=n.useCallback(()=>{d.current!==null&&(clearTimeout(d.current),d.current=null)},[]),k=n.useCallback(()=>{a(),c(null),l?(h(l.id),requestAnimationFrame(()=>{document.querySelector("[data-work-tab-bar]")?.scrollIntoView({behavior:"smooth",block:"start"})})):window.location.href="/works"},[l,a]),v=n.useCallback(()=>{a(),c(null)},[a]);n.useEffect(()=>{const e=document.createElement("style");return e.textContent=`
      @keyframes hint-slide-up {
        from { opacity: 0; transform: translateX(-50%) translateY(120%); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      .work-next-hint {
        position: fixed;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 50;
        display: flex;
        align-items: center;
        height: 2.75rem;
        border-radius: 9999px;
        border: 1px solid hsl(var(--border) / 0.6);
        background: hsl(var(--background) / 0.94);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow: 0 4px 20px hsl(var(--foreground) / 0.07);
        overflow: hidden;
        white-space: nowrap;
        animation: hint-slide-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
        transition: border-color 180ms ease, box-shadow 180ms ease;
      }

      /* :has() 지원 브라우저에서 CTA 호버 시 pill 테두리·그림자 강조 */
      .work-next-hint:has(.work-next-hint__cta:hover) {
        border-color: hsl(var(--primary) / 0.35);
        box-shadow: 0 4px 24px hsl(var(--primary) / 0.1), 0 0 0 3px hsl(var(--primary) / 0.06);
      }

      .work-next-hint__cta {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0 0.625rem 0 1.125rem;
        height: 100%;
        font-size: 0.8125rem;
        font-weight: 500;
        color: hsl(var(--foreground) / 0.75);
        background: none;
        border: none;
        cursor: pointer;
        transition: color 150ms ease, transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
        outline: none;
      }

      .work-next-hint__cta:hover {
        color: hsl(var(--foreground));
      }

      .work-next-hint__cta:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: -2px;
        border-radius: 9999px;
      }

      .work-next-hint__cta:active {
        transform: scale(0.96);
        transition-duration: 80ms;
      }

      .work-next-hint__label {
        max-width: 12rem;
        overflow: hidden;
        text-overflow: ellipsis;
        color: hsl(var(--primary));
        font-weight: 600;
      }

      .work-next-hint__arrow {
        display: inline-block;
        color: hsl(var(--primary));
        transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .work-next-hint__cta:hover .work-next-hint__arrow {
        transform: translateX(4px);
      }

      .work-next-hint__divider {
        width: 1px;
        height: 1.25rem;
        background: hsl(var(--border) / 0.7);
        flex-shrink: 0;
      }

      .work-next-hint__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 100%;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 0.75rem;
        color: hsl(var(--muted-foreground) / 0.6);
        transition: color 150ms ease, background 150ms ease;
        flex-shrink: 0;
        border-radius: 0 9999px 9999px 0;
      }

      .work-next-hint__close:hover {
        color: hsl(var(--foreground) / 0.7);
        background: hsl(var(--muted) / 0.35);
      }

      .work-next-hint__close:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: -2px;
        border-radius: 0 9999px 9999px 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .work-next-hint { animation: none; }
        .work-next-hint__cta,
        .work-next-hint__arrow,
        .work-next-hint__close { transition: none !important; }
      }

      @media (max-width: 480px) {
        .work-next-hint { bottom: 1rem; }
        .work-next-hint__cta { padding: 0 0.5rem 0 0.875rem; }
        .work-next-hint__label { max-width: 8rem; }
      }
    `,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[]),n.useEffect(()=>{i.forEach(o=>{const s=document.querySelector(`[data-tab-content="${o.id}"]`);s&&(o.id===r?(s.style.display="",s.dataset.entering="true",requestAnimationFrame(()=>{requestAnimationFrame(()=>{delete s.dataset.entering})})):s.style.display="none")});const e=new URL(window.location.href);r===i[0]?.id?history.replaceState(null,"",e.pathname+e.search):history.replaceState(null,"",`${e.pathname}#${r}`)},[r,i]),n.useEffect(()=>{const e=()=>{const o=window.location.hash.slice(1);i.find(s=>s.id===o)&&h(o)};return window.addEventListener("hashchange",e),()=>window.removeEventListener("hashchange",e)},[i]),n.useEffect(()=>{const e=m.current;if(!e)return;e.querySelector(`[data-tab-btn="${r}"]`)?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},[r]),n.useEffect(()=>{a();const e=document.querySelector(`[data-tab-sentinel="${r}"]`);if(!e)return a;const o=new IntersectionObserver(([s])=>{s.isIntersecting?d.current=setTimeout(()=>{c(r)},600):(a(),c(null))},{threshold:1});return o.observe(e),()=>{o.disconnect(),a()}},[r,a]);const x=u?"Works 목록":l?.label??"",p=u?"← 돌아가기":"다음";return t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"sticky z-10 -mx-4 md:mx-0 bg-background/95 backdrop-blur-sm border-b border-border/60 mb-6",style:{top:"48px"},children:t.jsx("div",{ref:m,className:"flex overflow-x-auto px-4 md:px-0",style:{scrollSnapType:"x mandatory",scrollbarWidth:"none"},children:i.map(e=>t.jsxs("button",{type:"button","data-tab-btn":e.id,onClick:()=>h(e.id),className:y("shrink-0 relative px-4 py-3 text-sm font-medium whitespace-nowrap","transition-colors duration-150 outline-none rounded-t","focus-visible:ring-2 focus-visible:ring-primary",r===e.id?"text-primary":"text-muted-foreground hover:text-foreground"),children:[e.label,r===e.id&&t.jsx("span",{className:"absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm tab-underline"})]},e.id))})}),w&&typeof document<"u"&&g.createPortal(t.jsxs("div",{role:"status","aria-live":"polite","aria-label":`${p}: ${x}`,className:"work-next-hint",children:[t.jsxs("button",{type:"button",onClick:k,className:"work-next-hint__cta",children:[t.jsx("span",{style:{color:"hsl(var(--muted-foreground) / 0.8)",fontSize:"0.75rem"},children:p}),t.jsx("span",{className:"work-next-hint__label",children:x}),t.jsx("span",{className:"work-next-hint__arrow","aria-hidden":"true",children:u?"↩":"→"})]}),t.jsx("span",{className:"work-next-hint__divider","aria-hidden":"true"}),t.jsx("button",{type:"button",onClick:v,"aria-label":"힌트 닫기",className:"work-next-hint__close",children:"✕"})]}),document.body)]})}export{S as WorkTabBar};
