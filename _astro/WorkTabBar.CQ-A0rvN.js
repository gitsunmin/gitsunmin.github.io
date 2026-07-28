import{j as o}from"./jsx-runtime.u17CrQMm.js";import{r as n}from"./index.CO9X3OiW.js";import{r as j}from"./index.DQgKYfj8.js";import{c as A}from"./utils.Cm_RJUQe.js";var C=j();function z({tabs:i}){const[r,d]=n.useState(()=>{if(typeof window<"u"){const e=window.location.hash.slice(1);if(i.find(t=>t.id===e))return e}return i[0]?.id??""}),[y,u]=n.useState(null),p=n.useRef(null),h=n.useRef(null),f=n.useRef(null),w=n.useRef(r);n.useEffect(()=>{w.current=r},[r]);const _=i.findIndex(e=>e.id===r),l=i[_+1]??null,x=l===null,E=y===r,s=n.useCallback(()=>{h.current!==null&&(clearTimeout(h.current),h.current=null)},[]),I=n.useCallback(()=>{s(),u(null),l?(d(l.id),requestAnimationFrame(()=>{document.querySelector("[data-work-tab-bar]")?.scrollIntoView({behavior:"smooth",block:"start"})})):window.location.href="/works"},[l,s]),T=n.useCallback(()=>{s(),u(null)},[s]);n.useEffect(()=>{const e=document.createElement("style");return e.textContent=`
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
    `,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[]);const m=n.useCallback(e=>{const t=document.getElementById(e);if(!t)return;t.scrollIntoView({behavior:"smooth",block:"start"});const a=t.closest("[data-work-case], [data-work-aux]")??t;a.classList.remove("work-target-flash"),a.offsetWidth,a.classList.add("work-target-flash")},[]);n.useEffect(()=>{const e=()=>{const t=decodeURIComponent(window.location.hash.slice(1));if(!t)return;if(i.some(g=>g.id===t)){d(t);return}const a=document.getElementById(t)?.closest("[data-tab-content]")?.getAttribute("data-tab-content");a&&(a===w.current?requestAnimationFrame(()=>m(t)):(f.current=t,d(a)))};return e(),window.addEventListener("hashchange",e),()=>window.removeEventListener("hashchange",e)},[i,m]),n.useEffect(()=>{i.forEach(b=>{const c=document.querySelector(`[data-tab-content="${b.id}"]`);c&&(b.id===r?(c.style.display="",c.dataset.entering="true",requestAnimationFrame(()=>{requestAnimationFrame(()=>{delete c.dataset.entering})})):c.style.display="none")});const e=f.current;if(e){document.getElementById(e)?.closest("[data-tab-content]")?.getAttribute("data-tab-content")===r&&(f.current=null,requestAnimationFrame(()=>requestAnimationFrame(()=>m(e))));return}const t=new URL(window.location.href),a=decodeURIComponent(t.hash.slice(1));a!==""&&document.getElementById(a)?.closest("[data-tab-content]")?.getAttribute("data-tab-content")===r||(r===i[0]?.id?history.replaceState(null,"",t.pathname+t.search):history.replaceState(null,"",`${t.pathname}#${r}`))},[r,i,m]),n.useEffect(()=>{const e=p.current;if(!e)return;e.querySelector(`[data-tab-btn="${r}"]`)?.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},[r]),n.useEffect(()=>{s();const e=document.querySelector(`[data-tab-sentinel="${r}"]`);if(!e)return s;const t=new IntersectionObserver(([a])=>{a.isIntersecting?h.current=setTimeout(()=>{u(r)},600):(s(),u(null))},{threshold:1});return t.observe(e),()=>{t.disconnect(),s()}},[r,s]);const k=x?"Works 목록":l?.label??"",v=x?"← 돌아가기":"다음";return o.jsxs(o.Fragment,{children:[o.jsx("div",{className:"sticky z-10 -mx-4 md:mx-0 bg-background/95 backdrop-blur-sm border-b border-border/60 mb-6",style:{top:"48px"},children:o.jsx("div",{ref:p,className:"flex overflow-x-auto px-4 md:px-0",style:{scrollSnapType:"x mandatory",scrollbarWidth:"none"},children:i.map(e=>o.jsxs("button",{type:"button","data-tab-btn":e.id,onClick:()=>d(e.id),className:A("shrink-0 relative px-4 py-3 text-sm font-medium whitespace-nowrap","transition-colors duration-150 outline-none rounded-t","focus-visible:ring-2 focus-visible:ring-primary",r===e.id?"text-primary":"text-muted-foreground hover:text-foreground"),children:[e.label,r===e.id&&o.jsx("span",{className:"absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-sm tab-underline"})]},e.id))})}),E&&typeof document<"u"&&C.createPortal(o.jsxs("div",{role:"status","aria-live":"polite","aria-label":`${v}: ${k}`,className:"work-next-hint",children:[o.jsxs("button",{type:"button",onClick:I,className:"work-next-hint__cta",children:[o.jsx("span",{style:{color:"hsl(var(--muted-foreground) / 0.8)",fontSize:"0.75rem"},children:v}),o.jsx("span",{className:"work-next-hint__label",children:k}),o.jsx("span",{className:"work-next-hint__arrow","aria-hidden":"true",children:x?"↩":"→"})]}),o.jsx("span",{className:"work-next-hint__divider","aria-hidden":"true"}),o.jsx("button",{type:"button",onClick:T,"aria-label":"힌트 닫기",className:"work-next-hint__close",children:"✕"})]}),document.body)]})}export{z as WorkTabBar};
