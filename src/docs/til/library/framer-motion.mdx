# Framer Motion

Framer Motion은 React 애니메이션 라이브러리입니다. Framer Motion은 모션을 위한 강력한 API를 제공하며, 모션을 위한 간단한 구문을 제공합니다.

## 설치

Framer Motion은 npm을 통해 설치할 수 있습니다.

```bash
npm install framer-motion
```

## Animation

### Basic
Anmation은 `motion` 컴포넌트에서 animate 속성을 변경함으로서 최종 값으로 변하는 Animation이 동작하도록 동작합니다.

```tsx

<motion.div animate={{ x: 100 }} />

```

또한 Animation의 초기에 동작 여부 혹은 초기 값과 마지막 값을 지정하는 것이 가능합니다.

```tsx
<motion.div
  initial={{ opacity: 0 }}
  exit={{ opacity: 0 }}
  animate={{ x: 100 }}
/>
```

animation을 다룰 떄 가장 중요한 `Keyframe`을 다루는 것도 가능합니다.

```tsx
<motion.div
  animate={{ x: [0, 100, 0] }}
/>
```
* 여기서는 null을 할당함으로서 초기 값을 초기 Keyframe값으로 설정하는 것이 가능합니다.

또한 Animation에 variants를 설정하는 것이 가능한데, 이는 여러가지 상태를 설정할 수 있습니다.

```tsx
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
/>
```

이 Variant 속성은 만약, 자식 요소가 있는 경우에는 자식 요소에 까지 전파가 되어집니다. 그렇기 때문에, 전역으로 설정하는 것 또한 가능합니다.

또한 동적으로 할당하여 사용하는 것도 가능합니다.

```tsx
const variants = {
  visible: i => ({
    opacity: 1,
    transition: {
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0 },
}

return items.map((item, i) => (
  <motion.li
    custom={i}
    animate="visible"
    variants={variants}
  />
))
```

하나 이상의 variant를 사용하는 것도 가능합니다.

```tsx
<motion.ul variants={["open", "primary"]} />
```

### Gestures

Framer Motion은 제스처를 사용하여 애니메이션을 다루는 것이 가능합니다.

```tsx
<motion.div whileHover={{ scale: 1.1 }} />
```

이러한 Gestures는 아래와 같이 다양하게 사용할 수 있습니다.

#### Hover

- whileHover: 속성 또는 제스처가 인식되는 동안 애니메이션을 적용할 변형 레이블을 설정합니다.
```tsx
<motion.div whileHover={{ scale: 1.2 }} />
```
- onHoverStart: 마우스가 요소에 올라갔을 때
```tsx
<motion.div onHoverStart={() => console.log('Hover starts')} />
```
- onHoverEnd: 마우스가 요소에서 벗어났을 때
```tsx
<motion.div onHoverEnd={() => console.log('Hover ends')} />
```

#### Focus

- whileFocus: 속성 또는 변형 레이블을 추가하여 초점 제스처가 인식되는 동안 애니메이션을 적용할 수 있습니다.
```tsx
<motion.div whileFocus={{ scale: 1.2 }} />
```

#### Tap

- whileTap: 컴포넌트를 누르는 동안 애니메이션을 적용할 속성 또는 변형 레이블을 선택합니다.
```tsx
<motion.div whileTap={{ scale: 0.9 }} />
```
- onTap: 컴포넌트를 누르는 동작을 감지합니다.
```tsx
function onTap(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div
    onTap={onTap}
/>
```
- onTapStart: 컴포넌트를 누르기 시작할 때
```tsx
function onTapStart(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onTapStart={onTapStart} />

```
- onTapCancel: 컴포넌트를 누르는 동작이 취소될 때
```tsx
function onTapCancel(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onTapCancel={onTapCancel} />
```

#### Pan
이동 제스처는 포인터가 컴포넌트를 누르고 3픽셀 이상 이동하면 이를 인식합니다. 포인터를 놓으면 팬 제스처가 종료됩니다.

- onPan: 이 요소에서 이동 제스처가 인식되면 실행되는 콜백 함수입니다.
```tsx
// event: MouseEvent | TouchEvent | PointerEvent
// info: PanInfo

// A PanInfo object containing x and y values for:

// point: Relative to the device or page.
// delta: Distance moved since the last event.
// offset: Offset from the original pan event.
// velocity: Current velocity of the pointer.
function onPan(event, info) {
  console.log(info.offset.x, info.offset.y)
}

<motion.div onPan={onPan} />
```
- onPanStart: 이동 제스처가 시작될 때 실행되는 콜백 함수입니다.
```tsx
function onPanStart(event, info) {
  console.log(info.offset.x, info.offset.y)
}

<motion.div onPanStart={onPanStart} />
```
- onPanEnd: 이동 제스처가 종료될 때 실행되는 콜백 함수입니다.
```tsx
function onPanEnd(event, info) {
  console.log(info.offset.x, info.offset.y)
}

<motion.div onPanEnd={onPanEnd} />
```

#### Drag

드래그 제스처는 이동 제스처의 규칙을 따르지만 컴포넌트의 x축 및/또는 y축에 포인터 이동을 적용합니다.

우선, drag가 가능하도록 설정을 해주어야합니다.
    
```tsx
<motion.div drag />
```

- whileDrag: 속성 또는 변형 레이블을 드래그 제스처가 인식되는 동안 애니메이션을 적용할 수 있습니다.
```tsx
<motion.div whileDrag={{ scale: 1.2 }} />
```
- drag: 축별로 드래그 제스처를 활성화할 수 있습니다.
```tsx
<motion.div drag="x" />
```
- dragConstraints: 드래그 제스처의 제약 조건을 설정할 수 있습니다.
```tsx
<motion.div dragConstraints={{ left: 0, right: 100, top: 0, bottom: 100 }} />
```
- dragSnapToOrigin: 드래그 제스처가 종료될 때 컴포넌트를 원래 위치로 스냅합니다.
```tsx
<motion.div dragSnapToOrigin />
```
- dragElastic: 드래그 제스처가 제약 조건을 벗어날 때 컴포넌트를 제약 조건으로 되돌릴 때까지의 시간을 설정합니다.
```tsx
<motion.div dragElastic={0.5} />
```
- dragMomentum: 드래그 제스처가 종료될 때 컴포넌트의 모멘텀을 활성화합니다.
```tsx
<motion.div dragMomentum />
```
- dragTransition: 드래그 제스처가 종료될 때 컴포넌트의 애니메이션을 설정합니다.
```tsx
<motion.div dragTransition={{ bounceDamping: 10, bounceStiffness: 100 }} />
```
- dragPropagation: 드래그 제스처가 인식되는 동안 자식 요소에 드래그 제스처를 전파합니다.
```tsx
<motion.div dragPropagation />
```
- dragControls: 드래그 제스처를 사용하여 컴포넌트를 제어할 수 있습니다.
```tsx
const dragControls = useDragControls()

function startDrag(event) {
  dragControls.start(event, { snapToCursor: true })
}

return (
  <>
    <div onPointerDown={startDrag} />
    <motion.div drag="x" dragControls={dragControls} />
  </>
)
```
- dragListener: 이벤트 리스너에서 드래그 제스처를 트리거할지 여부를 결정합니다. dragControls를 전달하는 경우 이 값을 false로 설정하면 드래그 가능한 요소의 포인터다운 이벤트가 아닌 컨트롤에 의해서만 드래그가 시작될 수 있습니다.
```tsx
<motion.div dragListener={false} />
```
- onDrag: 드래그 제스처가 인식되면 실행되는 콜백 함수입니다.
```tsx
function onDrag(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onDrag={onDrag} />
```
- onDragStart: 드래그 제스처가 시작될 때 실행되는 콜백 함수입니다.
```tsx
function onDragStart(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onDragStart={onDragStart} />
```
- onDragEnd: 드래그 제스처가 종료될 때 실행되는 콜백 함수입니다.
```tsx
function onDragEnd(event, info) {
  console.log(info.point.x, info.point.y)
}

<motion.div onDragEnd={onDragEnd} />
```
- onDirectionLock: 드래그 제스처가 인식되면 실행되는 콜백 함수입니다.
```tsx
function onDirectionLock(axis) {
  console.log(axis)
}

<motion.div onDirectionLock={onDirectionLock} />
```