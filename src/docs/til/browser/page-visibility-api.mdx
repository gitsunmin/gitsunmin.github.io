# Page Visibility API

`Page Visibility API`는 브라우저가 visible 또는 focus 상태인지, 개발자가 알 수 있도록 도와주는 API입니다. 브라우저에서 다른 탭을 선택하거나, 최소화하여 화면을 보고 있지 않을 경우에 혹은 보기 시작했을 때를 알려줍니다.

`Page Visibility API`는 `addEventListener`로 이벤트 리스너를 등록함으로서 사용이 가능한 API입니다. 저는 항상 불만에 가득찬 이벤트 리스너를 만들어 보겠습니다.

```javascript
document.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		console.log('저를 봐주세요. 외롭네요.');
	} else {
		console.log('그만 봐주세요. 부담스럽네요.');
	}
});
```

이렇게 간단하게, `Page Visibility API`를 사용할 수 있습니다.

다만, 모든 브라우저와 기기에 따라서 변수명이 조금씩 다르게 제공되고 있어서 아래의 작업을 해주어야합니다.

```javascript
let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

document.addEventListener(visibilitychange, () => {
	if (document[hidden]) {
		console.log('저를 봐주세요. 외롭네요.');
	} else {
		console.log('그만 봐주세요. 부담스럽네요.');
	}
});
```