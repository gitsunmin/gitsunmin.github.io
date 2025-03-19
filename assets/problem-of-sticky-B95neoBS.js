const t=`# Problem of Sticky

CSS position: sticky 속성

1. sticky 속성의 기본 개념과 예시

position: sticky는 상대적 위치와 고정 위치의 특성을 모두 가진 CSS 속성입니다. 특정 임계 지점(예: top: 0px)에 도달하기 전까지는 일반적인 흐름에 따라 배치되고, 그 지점에 도달하면 마치 position: fixed처럼 지정한 위치에 고정됩니다 ￼. 이는 요소가 스크롤을 따라 움직이다가 지정된 offset 위치에 이르면 화면에 붙어서 더 이상 스크롤되지 않는 동작입니다. 고정된 이후에도 부모 영역을 벗어나지 않으며, 부모 요소의 끝에서는 다시 상대적으로 배치되어 더 이상 화면에 남아있지 않게 됩니다.

또한 sticky 요소는 fixed와 달리 레이아웃 상의 자리를 차지합니다. 즉, 스크롤 전에는 원래 배치된 자리에서 다른 콘텐츠를 밀어내고 있다가, 스크롤하여 임계점에 도달해도 그 자리 공간을 유지한 채 화면에 고정됩니다 ￼. 이 때문에 fixed 요소처럼 문서 흐름에서 완전히 빠지지 않아, 다른 요소들이 갑자기 위치가 변경되는 것을 방지합니다.

사용 방법: position: sticky를 적용할 때는 반드시 top, left, right, bottom 중 하나 이상의 offset 속성을 함께 지정해야 합니다. 지정한 offset 위치가 없다면 일반적인 relative처럼 동작해서 아무 효과가 없습니다 ￼. 예를 들어 아래와 같이 CSS를 작성할 수 있습니다:

<!-- HTML 예시 -->
<div class="container">
  <h2 class="sticky-header">고정 헤더 영역</h2>
  <p>긴 내용 ...</p>
  <p>긴 내용 ...</p>
  <!-- 내용이 충분히 길어 스크롤바가 생긴다고 가정 -->
</div>

/* CSS 예시 */
.container {
  height: 300px;           /* 컨테이너에 고정 높이를 주어 스크롤 가능하게 함 */
  overflow-y: auto;        /* 세로로 스크롤 발생 */
}
.sticky-header {
  position: sticky;
  top: 0;                  /* 컨테이너 또는 뷰포트 기준 상단 0에 고정 */
  background: #ffea00;
  padding: 10px;
}

위 예시에서 .sticky-header 요소는 컨테이너 내에서 스크롤되다가, 컨테이너의 상단에 도달하면 상단에 고정되어 더 이상 위로 사라지지 않습니다. 이처럼 스크롤되는 영역 내에서 중요한 헤더나 메뉴 등을 항상 보이도록 할 때 sticky를 활용할 수 있습니다 ￼. (참고로 모든 최신 브라우저에서 position: sticky를 지원하지만, Internet Explorer에서는 지원하지 않으므로 IE에서는 그냥 static처럼 동작합니다 ￼.)

2. sticky 사용 시 발생하는 height 및 레이아웃 문제

position: sticky를 적용할 때 몇 가지 레이아웃 문제가 발생할 수 있습니다. 주요 이슈와 그 원인은 다음과 같습니다:
	•	부모 컨테이너의 높이와 overflow 문제: Sticky 요소는 자신이 속한 스크롤 컨테이너 내부에서만 동작합니다. 따라서 부모 요소(또는 조상) 중 하나가 스크롤 영역을 형성해야 하며, 보통 그 부모에 명시적인 높이(height)가 지정되어 있어야 스크롤이 가능합니다 ￼. 부모에 높이가 설정되지 않고 내용물에 따라 자동으로 늘어날 경우, 별도의 스크롤 영역이 생기지 않아 sticky 임계점이 발생하지 않을 수 있습니다. 또한 부모나 조상 요소에 overflow: hidden, auto, scroll와 같은 속성이 설정되어 있으면 sticky가 의도대로 동작하지 않게 됩니다 ￼. 예를 들어 전체 페이지에 가로 스크롤바를 제거하기 위해 최상위 요소에 overflow-x: hidden을 걸어두면, 해당 요소가 새로운 스크롤 컨테이너로 인식되어 자식 sticky가 페이지에 붙지 않고 그냥 스크롤돼버리는 식입니다 ￼. 이처럼 잘못된 부모 조건(높이 미지정이나 overflow 지정)으로 인해 sticky가 아예 작동하지 않거나, 예상과 다르게 작동하는 문제가 생길 수 있습니다.
	•	Sticky 요소의 높이 변화로 인한 레이아웃 점프: Sticky 요소가 화면에 붙는 순간 또는 떼어지는 순간에 자신의 크기(height)가 변하는 경우, 레이아웃이 튕기는 현상이 발생할 수 있습니다. 일반적으로 sticky 요소는 원래 자리 공간을 유지하므로 고정 자체만으로 레이아웃에 변화를 주지는 않지만 ￼, 고정되면서 요소의 높이가 줄어들거나 늘어나면 그 차이만큼 빈 공간이나 겹침이 발생하게 됩니다. 예를 들어 상단에 붙을 때 헤더의 내용을 축소하거나 padding을 제거해 높이가 작아지면, 본문 콘텐츠가 그만큼 위로 점프하며 올라오게 됩니다. 실제 사례로, 한 개발자는 sticky 헤더에 클래스가 붙으면서 높이가 달라질 때 <body> 높이가 변해 스크롤바 위치가 순간적으로 변하는 “점프” 현상을 겪었다고 보고했습니다 ￼. 이처럼 스크롤 진행 중 sticky 요소의 높이 변화나 DOM 변화가 일어나면 Layout Shift(레이아웃 이동)가 발생하여 사용자에게 깜빡이거나 튀는 느낌을 줄 수 있습니다. 특히 sticky가 붙었다 떨어지는 경계 지점에서 높이 변화가 생기면, 요소가 빠르게 붙었다 떨어졌다를 반복하면서 화면이 흔들리는 현상(flickering)까지 나타날 수 있습니다.

3. 문제 해결 방법 및 우회 방법

위와 같은 문제를 해결하거나 완화하기 위한 몇 가지 방법이 있습니다:
	•	여분 공간을 확보하는 패딩 이용: Sticky 요소의 높이가 고정되면서 변하는 경우, padding을 활용하여 높이 변화를 상쇄할 수 있습니다. 예를 들어, 평소에는 큰 헤더였다가 상단 고정 시 높이를 줄이고 싶다면, 고정 상태에서도 요소의 전체 높이는 유지하되 내용물만 작아지도록 디자인합니다. 구체적으로는 sticky 상태에서 콘텐츠를 작게 만들면서 그 아래에 동일한 크기의 padding이나 여백을 넣어주면, 시각적으로는 축소되지만 레이아웃 상 높이는 그대로여서 주변 요소의 위치 변동이 없게 됩니다. 이 기법을 사용하면 sticky 요소가 붙을 때 주변 내용이 밀려오는 것을 막아 레이아웃 점프를 최소화할 수 있습니다.
	•	플레이스홀더 요소 추가: Sticky 요소가 원래 자리에서 이탈해 생기는 공간 변화가 크다면, 빈 Placeholder 요소를 활용하는 방법이 있습니다. 즉, sticky 요소의 원래 자리(부모 내 위치)에 동일한 높이의 빈 <div> 등을 배치해두거나, sticky가 활성화될 때 그만큼의 높이를 가진 요소를 동적으로 삽입하여 공간을 차지하게 만드는 것입니다. 한 개발 사례에서는 sticky로 전환될 때 높이가 달라지는 헤더 문제를 해결하기 위해 *“일반 상태와 sticky 상태 높이 차이만큼의 placeholder 요소”*를 추가하는 방안을 제시했습니다 ￼. 이렇게 하면 헤더가 고정되어도 원래 자리의 공간이 보존되어, 콘텐츠가 튀어 올라가는 현상을 막아줄 수 있습니다.
	•	CSS를 통한 높이 고정: 가능한 경우, 아예 sticky 요소의 높이를 변하지 않도록 고정하는 것이 가장 간단한 해결책입니다. 헤더처럼 내용이 유동적이지 않다면 min-height나 구체적인 height 값을 지정해서 스크롤 전후에 높이가 일정하게 유지되도록 합니다. 앞서 언급한 문제에서, 한 개발자는 CSS에 고정 높이를 부여하여 sticky 헤더의 깜빡임 문제가 해결되었다고 합니다 ￼. 높이가 고정되면 스크롤 중에 레이아웃에 변경을 줄 일이 없어지므로 안정적인 동작을 기대할 수 있습니다. 다만 콘텐츠 길이에 따라 유동적으로 높이가 변해야 하는 경우에는 이 방법이 어렵기 때문에, 이럴 땐 다음의 스크립트 방식도 고려해야 합니다.
	•	자바스크립트를 활용한 동적 조정: CSS만으로 해결하기 어려운 복잡한 경우에는 JavaScript로 보조하는 방법도 있습니다. 예를 들어, Intersection Observer나 scroll 이벤트를 사용해 sticky 요소가 붙는 시점을 감지한 다음, 미리 정의한 보조 요소의 스타일을 조정하거나 클래스 추가/삭제를 통해 레이아웃을 보정할 수 있습니다. 스크롤 위치를 계산하여 sticky 요소에 추가적인 margin-top을 주거나, 또는 placeholder 요소의 높이를 조정하는 스크립트를 작성하면 높이 변화에 따른 깜빡임을 완화할 수 있습니다. 이 방법은 구현은 비교적 복잡하지만, sticky 동작을 세밀하게 제어할 수 있어 부모에 overflow를 제거할 수 없는 상황 등에서 대안이 될 수 있습니다 ￼. (실제로 Chrome 개발자 문서에서는 position: sticky 요소가 붙거나 떨어질 때 custom 이벤트를 발생시키는 예제를 보여주고 있습니다.)
`;export{t as default};
