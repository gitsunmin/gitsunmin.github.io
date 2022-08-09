---
title: "기묘한 Typescript 이야기"
description: "Typescript의 쉽지않은 부분을 알아보았습니다."
date: "2022-08-10T00:02:37.121Z"
categories:
  - "2022"
tags:
  - Typescript
---
## **배경**

Typescript는 자칫 잘 못 보면 굉장히 쉬워보입니다.  하지만, Javascript만 사용한 사람에게 Generics나 Unions 등 생소한 용어도 많고, 기묘한 순간에 기묘한 Type을 선언해야 할 일들이 많이 생깁니다. 오늘은 기본적인 Typescript의 문법 보다는 좀 더 Typescript의 기묘한 부분을 공부 해 보려고 합니다.

## **Type으로 Type 만들기**

재사용 가능한 검포넌트를 구축하는 것은 소프트웨어를 만드는 것에 중요한 부분입니다. Typescript는 이러한 재사용성을 위해서 Type으로 Type을 선언하는 유연한 기능을 제공합니다.

### **Generics**

기본적인 문법만으로도 아래의 Typescript를 해석할 수 있습니다.

```Typescript
function example(arg: number): number {
	return arg;
}
```

이 정도는 기묘하지 않습니다.

여기서 `arg` 에 `number`가 아닌, 여러가지 Type들이 들어와야하는 함수라고 생각을 해 봅시다.

```Typescript
function example(arg: any) : any {
	return arg;
}
```

위 의 코드는 요구사항을 만족하는 훌륭한 Typescript라고 생각하지는 않습니다… 왜냐하면, `arg`를 파라미터로 받아서 `arg`를 return하지만, 파라미터의 `arg`와 return하는 `arg`의 Type이 다를 수 있습니다.

이러한 경우에 사용하는 것이 Generic입니다.

```Typescript
function example<T>(arg: T): T {
	return arg;
}
```

위 의 문법을 보시면, T라는 것을 세 번이나 사용한 것을 알 수 있습니다. 이 T는 무엇일까요? (아무 문자나 가능.)

이 함수를 한 번 사용해 보겠습니다.

```Typescript
example<string>('Hello bizarre Typescript');
```

이렇게 사용하는 것을 보면, `T`자리에 `string`을 넣어서 사용하는 것을 알 수 있습니다. 즉, Generic은 

함수를 사용할 때 **Type을 파라미터로 받아서 원하는대로 새롭게 정의할 수 있습니다.** Generic을 사용하면 위에서 문제가 되었던, 모든 Type을 허용하지만, 파라미터와 return Type이 같은 Type이 되도록 정의할 수 있습니다. 👍

이렇게도 사용 가능 합니다.

```Typescript
// Case 1 - Multiple Types
function example2<T, K>(arg: T[], arg2: K): K {
	const s: K = arg2;
	return arg.join(arg2);
}

example2<string, number>(['A', 'B', 'C'], 1234)
// A1234B1234C
```

```Typescript
// Case 2 - Default Type
function example3<T = string>(arg: T):  T{
	return arg
}
```

```Typescript
// Case 3 - Class
class Example4<T> {
	private _name: string = 'gitsunmin';
	
	getName(arg: T): string {
		return this._name;
	},
}
```

### **keyof**

keyof는 Object의 Type에서의 key를 뽑아서 새로운 Type을 만드는 기묘한 Type Operator입니다.

```Typescript
type Example = { x: number; y: number };
type ExampleKeys: keyof Example;

const ex1: ExampleKeys = 'x';
const ex2: ExampleKeys = 'y';
const ex3: ExampleKeys = 'z'; // Error
```

이렇게도 사용 가능 합니다.

```Typescript
type ArrayExample = { [n: number]: any };
type A = keyof ArrayExample;

type MapExample = { [k: string]: boolean };
type M = keyof MapExample;
```
    
### **typeof & ReturnType**

typeof는 Javascript에도 이미 있는 문법이지만, Typescript에서는 javascript의 기본 Type이 아닌 Typescript의 Type을 알아낼 수 있습니다. 그리고 함수가 Return하는 Type을 정의하는 ReturnType과 함께 함수의 Type을 정의하는 것에 기묘하게 사용할 수 있습니다.

- typeof

```Typescript
let name = 'gitsunmin';
let name2: typeof name; // let n: string
```

- ReturnType

```Typescript
type ExampleFn = (x: string) => boolean;
type ExampleReturn = ReturnType<ExampleFn> // type ExampleReturn = boolean;
```

- typeof & ReturnType

```Typescript
function exampleFn() {
	return { x: 10, y: 11 };
}

type exampleFnType = ReturnType<typeof exampleFn>
```

typeof & ReturnType을 이용하면, 귀찮… 기묘한 function의 Type을 선언하지 않고도 function의 Type으로 다른 Type을 정의하는 곳에 사용할 수 있습니다.

### **Indexed Access Types**

Typescript에서 Object의 Type을 정의하면, 이 Type의 Key, Value의 특징을 그대로 이용하여 Value의 Type을 뽑아낼 수 있습니다.

```Typescript
type Example = { a: number; b: string; c: boolean };
type ExampleB = Example['a']; // type ExampleB = number;
```

이렇게도 사용 가능 합니다.

```Typescript
type ExampleC = Example['a' | 'b']; // type ExampleC = number | string;

type ExampleD = Example[keyof Example]; // type ExampleC = string | number | boolean;
```

```Typescript
const TempArray = [
	{ a: 'aaaa', b: 123 },
	{ a: 'bbbb', b: 234 },
	{ a: 'cccc', b: 345 },
];

type ExampleE = typeof TempArray[number]
// type ExampleE = { a: string, b: number };

type ExampleD = typeof TempArray[number]['a'];
// type ExampleD = string;
```

### **Conditional Types**

조건부 Types는 삼항 연산자와 같은 형태를 가지며, A Type이 B Type의 확장형인지를 검사하여 Type을 지정할 수 있습니다.

```Typescript
interface AAA {
	name: string;
}

interface BBB extends AAA {
	age: number;
}

interface CCC {
	address: string;
}

type Example1 = BBB extends AAA ? boolean : string;
// Example1 = boolean;

type Example2 = CCC extends AAA ? boolean : string;
// Example2 = string;
```

이렇게만 보아도 기묘한 느낌이 물씬 느껴지지만, 앞에서 알아보았던, Generic과 함께 사용하면, 더욱 기묘한 Typescript를 볼 수 있습니다.

```Typescript
interface Animal {
	id: number;
}
interface People {
	name: string;
}

type AnimalOrPeople<T extends number | string> = T extends number ? Animal : People;
```

이렇게 `AnimalOrPeople` 로 정의를 하였을 때, 아래처럼 함수를 정의하여 사용할 수 있습니다.

```Typescript
function createSomething<T extends number | string>(animalOrPeople: T): AnimalOrPeople<T> {
	...
}

let a = createSomething('ts');
// let a: People;

let b = createSomething(29);
// let b: Animal;

let c = createSomething(Math.random() ? 'hello' : 42);
// let c: Animal | People;
```

이렇게도 사용 가능 합니다.

```Typescript
type Example<T> = T extends any[] ? T[number] : T;

type Str = Example<string[]>;
// type Str = string

type Num = Example<number>;
// type Num = number;
```

`T[number]` 는 `string[]` Type의 요소 하나의 Type을 말합니다. `number` 는 index입니다.

### **Mapped Types**

`Mapped Types`에서는 Object의 Type을 정의하거나, 다른 Object의 Type으로 만드는 것 또는, 그냥 기묘한 것들을 알아보겠습니다.

```Typescript
type Obj1 = {
	[key: string]: boolean | string;
}

const obj1: Obj1 = {
	aaa: false,
	bbb: '아래꺼는 불가능',
	// ccc: 123,
}
```

위 코드는 obj1의 Type을 간단하게 정의해본 것입니다. 미리 정의된 Object의 Type이 있다면, 좀 더 명확하게 Type을 지정할 수 있습니다.

```Typescript
type OptionsFlags<T> = {
	[Property in keyof T]: boolean;
}

type FeatureFlags = {
	createUser: () => void;
	updateUser: () => void;
}

type FeatureFlags = OptionsFlags<FeatureFlags>;
/**
*  type FeatureFlags = {
*    createUser: boolean;
*    updateUser: boolean;
*  }
**/
```

- Mapping Modifiers

바로 위에서는 Object의 Type을 이용해서 새로운 Object의 Type을 정의 해 보았습니다. (Key만 빼왔습니다.)

여기에 추가적으로 기묘한 접두사로 기묘한 Type을 정의 해 보겠습니다.

```Typescript
type Example1<T> = {
	readonly [Property in keyof T]: boolean;
}

// readonly 속성을 제거합니다.
type Example2<T> = {
	-readonly [Property in keyof T]: boolean;
}

type Example3<T> = {
	[Property in keyof T]?: boolean;
}

// optional 속성을 제거합니다.
type Example4<T> = {
	[Property in keyof T]-?: boolean;
}

type Obj = {
	readonly id: string;
	name: string;
	age?: number;
}

type Ex1 = Example1<Obj>;
/**
*  type Ex1 = {
*    readonly id: boolean;
*    readonly name: boolean;
*    readonly age?: boolean | undefined;
*  }
**/

type Ex2 = Example2<Obj>;
/**
*  type Ex2 = {
*    id: boolean | undefined;
*    name: boolean | undefined;
*    age?: boolean | undefined;
*  }
**/

type Ex3 = Example3<Obj>;
/**
*  type Ex3 = {
*    readonly id?: boolean;
*    name?: boolean;
*    age?: boolean;
*  }
**/

type Ex4 = Example4<Obj>;
/**
*  type Ex4 = {
*    readonly id: boolean;
*    name: boolean;
*    age: boolean;
*  }
**/
```

### **Template Literal Types**

Javascript에 있는 **[Template literals](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals)**와 같은 방법으로 Type도 선언할 수 있습니다. 이것도 좀 기묘하다고 생각합니다..

```Typescript
type World = 'world';

type FirstWord = `hello ${World}`;
// type FirstWord = 'hello world';
```

이것까지는 저도 받아들이려고 했습니다.

```Typescript
type A = 'red' | 'blue';
type B = 'orange' | 'skyblue';

type C = `${A | B}_id`;
// type C = 'red_id' | 'blue_id' | 'orange_id' | 'skyblue_id';

type Lang = 'en' | 'ko';

type D = `${Lang}_${C}`;
// type D = 'en_red_id' | 'en_blue_id' | 'en_orange_id' | 'en_skyblue_id' | 'ko_red_id' | 'ko_blue_id' | 'ko_orange_id' | ko_skyblue_id';
```

마치 `for`문을 돌린 것 처럼 Type이 정의 되었습니다. 기묘하지만, 유용하게 사용 가능해 보입니다.

그리고 지금까지 알아본 것들을 사용해 서 아래와 같은 것을 만들 수 있습니다.

```Typescript
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on('firstNameChanged', (newValue) => {
	console.log(newValue);
});

person.on('lastNameChanged', (newValue) => {
	console.log(newValue);
});

person.on('ageChanged', (newValue) => {
	console.log(newValue);
});

// Error
person.on('addressChange', (newValue) => {
	console.log(newValue);
});
```

SSE나 web socket의 Event Type을 정의할 때, 비슷하게 정의할 수 있을 것 같은데, 너무 복잡하게 되어있어서 그냥 enum을 쓰는게 좋을 수도 있어 보입니다..

## 이쯤되면 그냥 내장함수가 아닌가?

- **Uppercase**<StringType>

```Typescript
type Str = 'hello, world';
type UppercaseStr = Uppercase<Str>;
// type UppercaseStr = 'HELLO, WORLD';
```

- **Lowercase**<StringType>

```Typescript
type Str = 'HELLO, WORLD';
type LowercaseStr = Lowercase<Str>;
// type LowercaseStr = 'hello, world';
```

- **Capitalize**<StringType>

```Typescript
type Str = 'hello, world';
type CapitalizeStr = Capitalize<Str>;
// type CapitalizeStr = 'Hello, World';
```

- **Uncapitalize**<StringType>

```Typescript
type Str = 'HELLO, WORLD';
type UncapitalizeStr = Uncapitalize<Str>;
// type UncapitalizeStr = 'hELLO, wORLD';
```

## 기묘한 순간에 기묘하게 사용하기 좋은 **Utility Types**

위에서 다양하게 Type을 선언하는 방법을 알아보았습니다. 하지만, 쓸대없이 복잡한 것들도 있었다고 생각합니다. 이러한 문제를 해결하기 위해서 Typescript에서는 친절하게 Utility Types를 따로 제공하고 있습니다. 한 번씩 읽어두면, 기묘한 순간에 기묘하게 사용할 수 있을 것입니다.

- [https://www.typescriptlang.org/ko/docs/handbook/utility-types.html](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html)

## 결론

Typescript는 진입장벽이 낮을 뿐, 많은 기능 및 문법이 존재한다. 어디가서 쉽다고 하지 말자.

## 참조

- [https://www.typescriptlang.org/docs/handbook/2/everyday-types.html](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- [https://www.typescriptlang.org/docs/handbook/2/types-from-types.html](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)