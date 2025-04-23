# Grid

CSS Grid Layout은 웹 페이지를 행(row)과 열(column)로 구성할 수 있는 2차원 레이아웃 시스템입니다. 이 시스템을 사용하면 페이지의 가로와 세로 공간을 모두 자유롭게 제어할 수 있습니다. Grid는 복잡한 레이아웃을 유연하게 만들 수 있는 강력한 도구입니다.

## 1. 기본 용어

CSS Grid를 배우기 전에 알아두어야 할 몇 가지 주요 용어가 있습니다:

- **Grid Container**: 그리드 아이템을 포함하는 컨테이너입니다.
- **Grid Items**: 그리드 컨테이너의 자식 요소로, 그리드 안에 배치됩니다.
- **Grid Lines**: 행과 열을 구분하는 보이지 않는 선입니다.
- **Grid Tracks**: 두 인접한 그리드 라인 사이의 공간으로, 이는 행 또는 열이 될 수 있습니다.
- **Grid Cell**: 그리드 아이템이 차지하는 공간입니다.
- **Grid Area**: 하나 이상의 그리드 셀을 포함할 수 있는 공간입니다.

---

## 2. 기본 그리드 만들기

CSS Grid를 사용하려면 먼저 컨테이너를 정의하고, 이를 그리드로 선언해야 합니다. `display: grid`를 사용하여 그리드를 활성화할 수 있습니다.

```html
<div class="grid-container">
  <div class="grid-item">아이템 1</div>
  <div class="grid-item">아이템 2</div>
  <div class="grid-item">아이템 3</div>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 100px 200px 100px;
  grid-template-rows: 100px 100px;
}

.grid-item {
  background-color: lightblue;
  border: 1px solid black;
}
```

### 설명:
- **`grid-template-columns`**: 각 열의 너비를 정의합니다. 이 예시에서는 100px, 200px, 100px의 세 개의 열을 가지고 있습니다.
- **`grid-template-rows`**: 각 행의 높이를 정의합니다. 두 개의 행이 각각 100px로 설정되어 있습니다.

---

## 3. 자동 크기 조정 열과 행

그리드의 열이나 행이 내부 콘텐츠 크기에 맞게 자동으로 조정되도록 설정할 수 있습니다.

```css
.grid-container {
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-template-rows: auto;
}
```

- **`auto`**: 콘텐츠 크기에 따라 자동으로 크기를 조정합니다.

---

## 4. Fractional Unit (fr)

`fr` 단위는 유연한 레이아웃을 만들 때 유용한 단위입니다. 이 단위는 사용 가능한 공간을 비율로 나눕니다.

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
```

- **`1fr 2fr 1fr`**: 그리드 컨테이너를 세 개의 열로 나눕니다. 가운데 열은 양 옆의 열보다 두 배의 공간을 차지합니다.

---

## 5. 그리드 간격 설정

`grid-gap`, `grid-column-gap`, `grid-row-gap` 속성을 사용하여 그리드 아이템 간의 간격을 설정할 수 있습니다.

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}
```

- **`grid-gap`**: 행과 열 사이에 각각 20px의 간격을 설정합니다.

---

## 6. 그리드 아이템 배치하기

그리드 아이템을 특정 행과 열에 배치하려면 `grid-column`과 `grid-row` 속성을 사용합니다.

```css
.grid-item {
  grid-column: 2 / 4;
  grid-row: 1 / 3;
}
```

- **`grid-column: 2 / 4`**: 이 아이템은 2번째 열부터 4번째 열까지 차지합니다.
- **`grid-row: 1 / 3`**: 이 아이템은 1번째 행부터 3번째 행까지 차지합니다.

---

## 7. grid-template-areas: 명명된 영역을 사용한 레이아웃 정의

`grid-template-areas` 속성은 그리드에서 사용자 정의 이름을 가진 영역을 정의할 수 있게 해줍니다. 복잡한 페이지 레이아웃을 관리할 때 매우 유용합니다.

### 예시:

```html
<div class="grid-container">
  <div class="header">헤더</div>
  <div class="sidebar">사이드바</div>
  <div class="content">콘텐츠</div>
  <div class="footer">푸터</div>
</div>
```

```css
.grid-container {
  display: grid;
  grid-template-columns: 150px 1fr;
  grid-template-rows: 100px 1fr 100px;
  grid-template-areas: 
    "header header"
    "sidebar content"
    "footer footer";
  grid-gap: 10px;
}

.header {
  grid-area: header;
  background-color: lightcoral;
}

.sidebar {
  grid-area: sidebar;
  background-color: lightgreen;
}

.content {
  grid-area: content;
  background-color: lightblue;
}

.footer {
  grid-area: footer;
  background-color: lightgray;
}
```

### 설명:

- **`grid-template-areas`**: 그리드 내에서 명명된 영역을 정의합니다. 이 예시에서는:
  - 첫 번째 행은 두 개의 열을 가지고 있으며, 둘 다 "header" 영역에 속합니다.
  - 두 번째 행은 첫 번째 열에 "sidebar", 두 번째 열에 "content"가 배치됩니다.
  - 세 번째 행은 두 개의 열을 모두 "footer" 영역으로 설정합니다.

이후 `grid-area`를 사용하여 아이템을 `grid-template-areas`에서 정의한 이름에 맞춰 배치합니다.

이 방식은 레이아웃을 재배치하거나 반응형 디자인을 처리할 때 매우 직관적입니다. HTML을 수정하지 않고도 영역 할당을 변경하여 그리드 구조를 쉽게 조정할 수 있습니다.

---

## 8. 명시적 그리드 vs 암시적 그리드

`grid-template-columns`와 `grid-template-rows`를 사용하여 명시적으로 그리드 행과 열을 정의할 수 있습니다. 그러나 정의된 그리드에 맞지 않는 아이템이 추가되면, 암시적인 그리드가 생성됩니다.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 100px);
  grid-auto-rows: 50px;
}
```

- **`grid-auto-rows`**: 그리드 아이템이 명시된 행을 초과할 경우, 높이가 50px인 행을 자동으로 생성합니다.

---

## 9. 그리드 정렬

CSS Grid는 그리드 셀 내에서 아이템을 정렬할 수 있는 다양한 속성을 제공합니다. 주요 속성은 다음과 같습니다:

- **`justify-items`**: 그리드 아이템을 수평으로 정렬합니다.
- **`align-items`**: 그리드 아이템을 수직으로 정렬합니다.
- **`justify-content`**: 그리드 전체를 컨테이너 내에서 수평으로 정렬합니다.
- **`align-content`**: 그리드 전체를 컨테이너 내에서 수직으로 정렬합니다.

### 예시:

```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
}
```

이 예시에서는 모든 그리드 아이템이 셀 내에서 수평, 수직 중앙에 정렬됩니다.

---

## 10. Grid vs. Flexbox

CSS Grid는 행과 열을 모두 사용하는 2차원 레이아웃에 적합하지만, Flexbox는 행 또는 열 중 하나만 사용하는 1차원 레이아웃에 더 적합합니다. 복잡한 레이아웃을 만들 때는 CSS Grid를, 단순한 레이아웃이나 컴포넌트(예: 네비게이션 바)를 만들 때는 Flexbox를 사용하는 것이 좋습니다.

---

## 결론

CSS Grid는 웹 페이지 레이아웃을 제어하는 데 있어 매우 강력하고 유연한 시스템입니다. `grid-template-areas`, fractional unit, 그리드 정렬 속성 등을 통해 반응형이면서도 복잡한 레이아웃을 쉽게 만들 수 있습니다. 이러한 기술을 익히면 적은 노력으로 복잡한 웹 레이아웃을 설계할 수 있습니다.

### 핵심 포인트:
- `display: grid`를 사용하여 그리드를 활성화합니다.
- `grid-template-columns`와 `grid-template-rows`로 열과 행을 제어합니다.
- `grid-template-areas`를 사용하여 명명된 레이아웃 영역을 정의합니다.
- `justify-items`, `align-items`와 같은 속성으로 아이템을 정렬합니다.
