# shallow Merge And Deep Merge
javascript에서의 object를 병합하는 방법이 두 가지가 있습니다. 하나는 shallow merge, 또 다른 하나는 deep merge입니다.

이 두 가지는 depth가 2 이상인 경우에 처리하는 방법에 따라서 달라집니다.

```jsx
const objA = {
	a: {
		aa: 1,
		bb: 2,
	},
	b: {
		aa: 3
	}
};

const objB = {
	a: {
		cc: 11,
		dd: 22,
	},
	c: {
		aa: 33,
	},
};

```

### shallow merge

```jsx
const objC = { ...objA, ...objB };
const objD = Object.assign({}, objA, objB );

// objC, objD result
{
	a: {
		cc: 11,
		dd: 22,
	},
	b: {
		aa: 3
	}
	c: {
		aa: 33,
	},
}
```

### deep merge

deep merge는 사실 javascript에서 따로 문법을 제공하지는 않고, 따로 만들어야한다. 우리는 간단하게 라이브러리를 사용하겠습니다. (참고: [deepmerge](https://www.npmjs.com/package/deepmerge))

```jsx
import deepmerge from 'deepmerge';

const objE = deepmerge(objA, objB);

// objE result
{
	a: {
		aa: 1,
		bb: 2,
		cc: 11,
		dd: 22,
	},
	b: {
		aa: 3
	}
	c: {
		aa: 33,
	},
}
```

deep merge는 가장 마지막 depth의 field가 같지 않다면, override하지 않고 추가한다.