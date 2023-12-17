---
title: Custom Date Picker
summary: date picker를 만들면서 분석, 고민한 내용을 공유합니다.
description: date picker를 만들면서 분석, 고민한 내용을 공유합니다.
date: 2023-03-14 12:00:00
image: /images/blogs/default_thumbnail.jpeg
author: 'Gitsunmin'
categories:
  - '2023'
tags:
  - Frontend
---

# 서론

디자인 시스템을 개발 중에 Date Picker를 만들 기회가 생겨서 만들어보게 되었습니다. 이 글에서는 Date Picker를 만들면서 고민하였던 것들과 알게된 것들 등 정리를 해보려고합니다.

<aside> 🙏 코드의 모든 부분을 제공하지는 않습니다.

</aside>

# 본론

## Date Picker란

Date Picker는 사용자가 쉽게 날짜를 선택하고 입력할 수 있도록 도와주는 UI 컴포넌트입니다.

Date Picker는 기본 HTML으로도 구현을 할 수 있는 UI 요소인데, [이 글](https://www.scaler.com/topics/date-picker-in-html/)에서 Date Picker의 기본적인 기능을 소개해주고 있습니다.

저는 위 글에서 소개한 Date Picker의 기본적인 기능들 중에 일부 기능을 가진 Date Picker를 구현해야 했고, 아래의 Custom Date Picker를 찾게 되어 분석을 해보았습니다.

- [https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)

## Custom Date Picker 분석하기

최근에 WAI-ARIA을 공부하고 있었고, 디자인 시스템이야말로, 적용하기에 적합한 프로젝트라고 생각이 들어서 위 Custom Date Picker를 선택하여 분석을 해 보았습니다.

### **구조**

- Input
  - input tag
  - icon
- Dialog
  - header
    - previous year button
    - previous month button
    - current month, year
    - next month button
    - next year button
  - dates
    - 요일
    - day
  - ok-cancel-group
    - ok button
    - cancel button

### 어떤 WAI-ARIA를 사용하고 있을까요?

- `role=”dialog” / aria-modal`
  - `role="dialog"`: 대화 상자를 나타내는 역할을 합니다. 이 역할을 가진 요소는 `aria-modal` 속성을 가질 수 있으며, 이 속성이 true로 설정되면 대화 상자 이외의 페이지의 다른 요소들이 keyboard focus를 받을 수 없게 됩니다. 이것은 대화 상자가 뜬 상태에서 다른 요소들에 대한 keyboard focus가 방지되어야 할 때 적용되는 것입니다. 대화 상자를 닫을 수 있는 방법을 제공하는 것이 중요합니다.
- `role=”grid” / role=”gridcell”`
  `role="grid"`는 데이터그리드를 나타내는 역할을 합니다. 데이터그리드는 행과 열로 구성된 테이블 형태의 데이터를 보여주고, 키보드나 마우스 조작으로 데이터를 선택하고 수정할 수 있습니다. `role="grid"`는 테이블과 유사하지만, 표현하려는 데이터에 따라서 행과 열이 정해지지 않아 유연하게 구성할 수 있습니다. 데이터그리드를 구성하는 요소로는 `role="row"` (행), `role="columnheader"` (열 제목), `role="rowheader"` (행 제목), `role="gridcell"` (셀) 등이 있습니다.
- `aria-describedby`
  `aria-describedby` 속성은 해당 엘리먼트가 참조하고 있는 설명을 나타냅니다. 이 속성은 해당 요소에 대한 보충적인 정보를 제공하며, 스크린 리더 사용자가 요소를 이해하는 데 도움이 됩니다. `aria-describedby` 속성 값으로는 설명을 담고 있는 요소의 `id`를 지정합니다. 이러한 설명 요소는 일반적으로 `role="tooltip"` 또는 `role="alert"`와 같은 역할을 가지며, 이러한 역할을 가지지 않는 엘리먼트의 경우 `id` 속성을 사용하여 라벨링이 필요합니다.
- `aria-labelledby`
  `aria-labelledby` 속성은 해당 요소에 대한 레이블을 제공하기 위해 사용됩니다. 이 속성은 `id` 속성 값을 이용하여 레이블 요소를 가리킵니다. `aria-labelledby`를 사용하면 레이블을 제공하기 위해 별도의 요소를 생성할 필요가 없어집니다. 이 속성을 사용하는 경우 `aria-label` 속성과는 달리 레이블의 텍스트를 직접 지정할 수 없습니다.
- `aria-label`
  `aria-label` 속성은 해당 요소에 대한 레이블을 제공하는 데 사용됩니다. 이 속성을 사용하면 해당 요소와 관련된 텍스트 레이블을 제공할 수 있습니다. 이 속성은 `aria-labelledby` 속성과 유사하지만, 레이블의 텍스트를 직접 지정할 수 있습니다. 그러나 `aria-labelledby`를 사용하는 것이 더 우선시 되며, 가능한 경우 `aria-label` 대신 `aria-labelledby`를 사용하는 것이 좋습니다.
- `aria-live`
  `aria-live` 속성은 동적으로 변하는 콘텐츠를 스크린 리더 사용자에게 실시간으로 전달해주는 역할을 합니다. 이 속성에는 3가지 값이 있습니다.
  - `off`: 해당 콘텐츠가 스크린 리더에게 전달되지 않습니다.
  - `polite`: 현재 스크린 리더가 발화하고 있는 내용과 충돌하지 않는 선에서, 사용자가 놓치면 안 되는 콘텐츠가 있을 때 사용합니다. 스크린 리더가 발화 중인 내용이 끝나면 즉시 해당 콘텐츠를 전달합니다.
  - `assertive`: 현재 스크린 리더가 발화하고 있는 내용보다 우선순위가 높은 콘텐츠가 있을 때 사용합니다. 스크린 리더가 발화 중인 내용이 끝나지 않아도 즉시 해당 콘텐츠를 전달합니다.
- `aria-selected`
  `aria-selected` 속성은 사용자가 선택한 요소를 나타내는 데 사용됩니다. 이 속성은 키보드 또는 마우스 등의 입력 방법을 통해 선택한 요소를 표시합니다. `aria-selected` 속성은 boolean 값으로 `true` 또는 `false`를 가집니다. 대부분의 경우, 이 속성은 `role="listbox"`와 `role="grid"`와 같이 선택 가능한 요소를 가진 위젯에서 사용됩니다.

### 코드 분석

- 요일과 월에 대한 정보를 미리 선언해 줍니다.
- 달력 테이블 데이터를 셋팅만 해주는 로직을 따로 갖습니다.

```tsx
// Create Grid of Dates

this.tbodyNode.innerHTML = '';
for (var i = 0; i < 6; i++) {
  var row = this.tbodyNode.insertRow(i);
  this.lastRowNode = row;
  for (var j = 0; j < 7; j++) {
    var cell = document.createElement('td');

    cell.tabIndex = -1;
    cell.addEventListener('click', this.handleDayClick.bind(this));
    cell.addEventListener('keydown', this.handleDayKeyDown.bind(this));
    cell.addEventListener('focus', this.handleDayFocus.bind(this));

    cell.textContent = '-1';

    row.appendChild(cell);
    this.days.push(cell);
  }
}
```

## Custom Date Picker 만들기

### 분석한 내용과 다른점

- 라이브러리의 사용하였습니다.
  - [Day.js](https://day.js.org/) - Date API만 가지고 만들기에는 너무 복잡한 로직을 갖게되고, 대응도 어려워서, 저는 Day.js 라이브러리를 사용하였습니다.
- `role=”dialog” / aria-modal` 대신 dialog 태그 사용하였습니다.
  - WAI-ARIA에서 role보다 우선 해야하는 것은 목적에 맞는 태그 사용하는 것이기 때문에, role=”dialog”보다는 `<dialog>` 태그를 사용하는 것이 좋습니다.
  - `<dialog>` 태그 사용 시 이점
    - open 속성을 갖게되어, open=false인 경우에는 dialog 내용을 보여주지 않습니다.
    - dialog 내용이 기본적으로 화면의 중앙에 위치하도록 설계되어 있습니다.
      - left: 50%, top: 50% <<< 이런거 안 해주어도 됩니다.

### 간단 정리

```jsx

validate Layer
	- 날짜 형식 이상
	- ...

input = (date) => {
	date controll Layer
		- 초기 값을 셋팅하며, props으로 받은 format을 이용하여 input에 표시한다.
	dialog controll Layer
		- input 혹은 아이콘을 클릭할 경우에 dialog를 open = true
}

dialog = (value) => {
		load data Layer
			- 날짜 정보 로드 (value에 해당하는 월 혹은 현재 날짜에 대한 데이터 로드)
		data converting Layer
			- prop으로 설정한 선택 불가능한 날짜가 disalbled 되도록 설정
			- load data Layer에서 불러온 날짜 데이터를 table에 뿌려주기 위해서 데이터를 가공
		data controll Layer
			- data converting Layer에서 변환된 데이터를 실제 화면에 보여주기 위해 set state해줌
}

<input />
<dialog open={open}>
```

### 코드 작성

Input의 로직 보다는 Date Picker의 테이블을 만드는 로직을 공유하겠습니다.

```tsx
const DEFAULT_WEEKDAYS = [
  {
    key: 0,
    ko: '일',
  },
  {
    key: 1,
    ko: '월',
  },
  {
    key: 2,
    ko: '화',
  },
  {
    key: 3,
    ko: '수',
  },
  {
    key: 4,
    ko: '목',
  },
  {
    key: 5,
    ko: '금',
  },
  {
    key: 6,
    ko: '토',
  },
];

const value = 선택한_값;

const currentDays = dayjs(value);

const startDayOfMonth = currentDays.startOf('M');
const endDayOfMonth = currentDays.endOf('M');
const daysInMonthLength = currentDays.daysInMonth();

const startDayIndex = startDayOfMonth.day();
const endDayIndex = endDayOfMonth.day();

/** 2중 Array로 날짜 테이블을 만듭니다. */
const dateTable: Dayjs[][] = [];

/** 현재 선택된 월의 일자를 셋팅한다. */
const daysInMonthArray = new Array(daysInMonthLength)
  .fill(null)
  .map((_, index) => endDayOfMonth.set('D', daysInMonthLength - index));

/** 캘린더의 행 갯수 */
const rowCount = Math.ceil((daysInMonthArray.length + startDayIndex) / 7);

/** 현재 선택된 월의 공간을 만든다. */
for (let week = 0; week < rowCount; week++) {
  dateTable.push([]);

  for (let weekday = 0; weekday < 7; weekday++) {
    /** 첫 주 */
    if (week === 0) {
      /**
       * * 이전 달의ㅈ 일자를 표시
       * * 선택된 달의 일자를 표시
       */
      const date =
        weekday < startDayIndex
          ? startDayOfMonth.add(weekday - startDayIndex, 'days')
          : daysInMonthArray.pop();

      dateTable[week].push(date);
      continue;
    }

    /**
     * * 첫 주가 아닌 다른 주
     * * 선택된 달의 일자를 표시
     * * 다음 달의 일자를 표시
     */
    dateTable[week].push(
      daysInMonthArray.pop() ?? endDayOfMonth.add(weekday - endDayIndex, 'days')
    );
  }
}
```

```html

<dialog open={open}>
	<div role="grid">
	  <div role="row" style={{ display: 'flex' }}>
	    {DEFAULT_WEEKDAYS.map((weekDayTitle) => (
	      <div key={weekDayTitle.key} role="gridcell" style={{ display: 'flex' }}>
	        {/** 한국어 요일을 일요일 부터 월요일  */}
	        {weekDayTitle.ko}
	      </div>
	    ))}
	  </div>

	  {dateTable.map((weekdays) => {
	    return (
	      <div key={weekdays.at(0).toString()} role="row" style={{ display: 'flex' }}>
	        {weekdays.map((day) => (
	          <span key={day.toString()} role="gridcell" style={{ display: 'flex', }}>
	            <button
	              aria-label={day.format('YYYY년MM월DD일')}
	              disabled={disableDayCallback(day)}
                aria-selected={day.isSame(value, 'D')}
	              onClick={() => {
	                onClick(day);
	              }}
	            >
	              {day.get('D')}
	            </button>
	          </span>
	        ))}
	      </div>
	    );
	  })}
	</div>
</dialog>
```

# 결론

처음으로 Date Picker를 만들어 보았는데, WAI-ARIA를 적용하니, 탭 키를 이용해서 날짜를 선택하는 것도 가능하고, Day.js로 계산하여 Date Picker를 만드는 것이 생각보다 간편하다는 생각이 들었습니다. 이제 월 변경 시 currentDays를 바꿔주고, 디자인을 적용해서 사용하면 될 것 같습니다.

위 내용들이 절대 잘 짜여진 내용은 아니겠지만, 참고가 되었으면 좋겠습니다.

# 참조

- [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
- [https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)
- [https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
