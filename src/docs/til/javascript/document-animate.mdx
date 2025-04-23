# Document Animate

## 1. Web Animation API란?

 CSS 애니메이션과 자바스크립트를 통합하여 애니메이션을 제어할 수 있는 API

## 2. Web Animation API 사용하기

- Element.animate()

> Animation = Element.animate(Keyframes, duration)

```javascript
var animationInterface = document.getElementById("code1").animate([
	{ transform: 'scale(1)', opacity: 1},
	{ transform: 'scale(.5)', opacity: .5},
	{ transform: 'scale(.667)', opacity: .667},
	{ transform: 'scale(.6)', opacity: .6}
], 3000);
```
	
[Animation Interface](https://www.w3.org/TR/web-animations/#animation)

```ts
animate(keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: number | KeyframeAnimationOptions): Animation;

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation) */
interface Animation extends EventTarget {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/currentTime) */
    currentTime: CSSNumberish | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/effect) */
    effect: AnimationEffect | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/finished) */
    readonly finished: Promise<Animation>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/id) */
    id: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/cancel_event) */
    oncancel: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/finish_event) */
    onfinish: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/remove_event) */
    onremove: ((this: Animation, ev: Event) => any) | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/pending) */
    readonly pending: boolean;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/playState) */
    readonly playState: AnimationPlayState;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/playbackRate) */
    playbackRate: number;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/ready) */
    readonly ready: Promise<Animation>;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/replaceState) */
    readonly replaceState: AnimationReplaceState;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/startTime) */
    startTime: CSSNumberish | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/timeline) */
    timeline: AnimationTimeline | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/cancel) */
    cancel(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/commitStyles) */
    commitStyles(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/finish) */
    finish(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/pause) */
    pause(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/persist) */
    persist(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/play) */
    play(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/reverse) */
    reverse(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Animation/updatePlaybackRate) */
    updatePlaybackRate(playbackRate: number): void;
    addEventListener<K extends keyof AnimationEventMap>(type: K, listener: (this: Animation, ev: AnimationEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AnimationEventMap>(type: K, listener: (this: Animation, ev: AnimationEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
```

### 파라미터 설명

effect:
    - null인 경우에는 전역 객체인 document를 사용하며, 그렇지 않은 경우에는 effect를 사용한다. effect는 애니메이션의 효과를 정의하는 객체이다. Array로 여러 개의 effect를 넣을 수도 있다.
```ts
interface Keyframe {
    composite?: CompositeOperationOrAuto;
    easing?: string;
    offset?: number | null;
    [property: string]: string | number | null | undefined;
}
```
timeline:
    - 애니메이션의 타임라인을 정의하는 객체이다. 기본적으로 숫자를 사용할 수도 있지만, duration, delay, easing, iterations, fill 등을 정의하는 객체를 넣을 수도 있다.
```ts
interface KeyframeAnimationOptions extends KeyframeEffectOptions {
    id?: string;
    timeline?: AnimationTimeline | null;
}

interface KeyframeEffectOptions extends EffectTiming {
    composite?: CompositeOperation;
    iterationComposite?: IterationCompositeOperation;
    pseudoElement?: string | null;
}

interface EffectTiming {
    delay?: number;
    direction?: PlaybackDirection;
    duration?: number | CSSNumericValue | string;
    easing?: string;
    endDelay?: number;
    fill?: FillMode;
    iterationStart?: number;
    iterations?: number;
    playbackRate?: number;
}

```

파라미터뿐만 아니라 새로운 Animation 객체를 생성하여 다양한 Methods를 사용할 수 있다.