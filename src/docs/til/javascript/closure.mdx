# Closure

## **1. 클로저(Closure)란 무엇인가?**

클로저는 **함수와 그 함수가 선언된 렉시컬 환경(Lexical Environment)을 함께 기억하는 함수**를 의미합니다.  
쉽게 말해, **외부 함수의 변수에 접근할 수 있는 내부 함수**를 클로저라고 부릅니다.

JavaScript에서는 함수가 생성될 때 자신의 렉시컬 환경을 저장하기 때문에, 클로저를 통해 외부 함수가 종료된 이후에도 그 환경에 접근할 수 있습니다.

---

## **2. 클로저의 원리**

JavaScript의 클로저는 다음과 같은 두 가지 개념을 기반으로 작동합니다.

### **1) 렉시컬 스코핑(Lexical Scoping)**

JavaScript는 함수를 선언할 때의 스코프를 기준으로 변수의 범위를 결정합니다.  
따라서 내부 함수는 자신이 선언된 위치의 스코프에 접근할 수 있습니다.

> 렉시컬(lexical)의 의미는 사전전으로는 "어휘"라는 의미이다. 자바스크립트에서는 프로그램이 구현된 "코드"와 관련돼 있음을 의미한다.
변수를 검색할 때 함수가 실행되는 환경을 근거로 판단하는것이 아니라 함수를 정의한 코드의 문맥을 근거로 판단한다는 것이다.

### **2) 스코프 체인(Scope Chain)**

내부 함수는 자신의 스코프뿐만 아니라, 외부 함수나 전역 스코프의 변수에도 접근할 수 있습니다.  
클로저는 이러한 스코프 체인을 유지하여 외부 함수의 변수를 "기억"합니다.

---

## **3. 클로저의 예제**

### **기본 예제**
```javascript
function outerFunction(outerVariable) {
    return function innerFunction(innerVariable) {
        console.log(`Outer Variable: ${outerVariable}`);
        console.log(`Inner Variable: ${innerVariable}`);
    };
}

const newFunction = outerFunction("outside");
newFunction("inside");
// 출력:
// Outer Variable: outside
// Inner Variable: inside
```
위 예제에서 내부 함수 `innerFunction`은 외부 함수 `outerFunction`의 `outerVariable`을 클로저로 캡처하여 접근합니다.

---

## **4. 클로저와 "폐쇄"라는 의미**

"Closure"는 영어로 **"닫힌 상태"** 또는 **"종결"**이라는 뜻을 가지고 있습니다.  
JavaScript에서 클로저는 이 뜻을 다음과 같은 방식으로 구현합니다.

### **1) 외부 스코프의 닫힌 환경을 캡처한다**

클로저는 외부 함수의 변수를 닫힌 상태로 내부 함수에 캡슐화합니다.  
즉, 외부 함수가 실행을 종료하더라도, 내부 함수는 외부 스코프를 "닫힌 환경"으로 유지하며 접근할 수 있습니다.

```javascript
function outer() {
    let count = 0;
    return function inner() {
        count++;
        console.log(count);
    };
}

const counter = outer();
counter(); // 1
counter(); // 2
```

### **2) 데이터 보호**

클로저는 외부 변수에 대한 직접 접근을 막고, 내부 함수에서만 접근할 수 있도록 제한합니다.  
이로 인해 데이터가 은닉되어 외부 간섭으로부터 보호됩니다.

---

## **5. 클로저의 실제 활용 사례**

### **1) 데이터 은닉**
클로저를 사용하면 외부에서 직접 접근할 수 없는 변수를 생성할 수 있습니다.

```javascript
function createCounter() {
    let count = 0; // 은닉된 변수

    return {
        increment: function () {
            count++;
            console.log(`Count: ${count}`);
        },
        decrement: function () {
            count--;
            console.log(`Count: ${count}`);
        },
        getCount: function () {
            return count;
        },
    };
}

const counter = createCounter();
counter.increment(); // Count: 1
counter.increment(); // Count: 2
console.log(counter.getCount()); // 2
counter.decrement(); // Count: 1
```

### **2) 이벤트 핸들러**

```javascript
function attachEventHandlers() {
    const buttons = document.querySelectorAll("button");

    buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
            console.log(`Button ${index} clicked`);
        });
    });
}
attachEventHandlers();
```

위 코드에서 클로저는 각 버튼의 `index` 값을 기억하여 클릭 이벤트 시 정확히 출력할 수 있습니다.

---

## **6. 클로저의 장점과 단점**

### **장점**
1. **데이터 은닉**: 외부에서 변수에 직접 접근하지 못하게 하여 캡슐화를 구현할 수 있습니다.
2. **상태 유지**: 함수 호출 이후에도 특정 상태를 유지할 수 있습니다.
3. **모듈화**: 클로저를 사용해 모듈 패턴을 쉽게 구현할 수 있습니다.

### **단점**
1. **메모리 사용 증가**: 클로저는 자신이 참조하는 변수들을 계속해서 유지하므로, 메모리 누수가 발생할 가능성이 있습니다.
2. **디버깅 어려움**: 여러 스코프가 얽혀 있기 때문에 디버깅이 복잡할 수 있습니다.

---

## **7. 클로저와 관련된 추가 개념**

### **1) 즉시 실행 함수 표현(IIFE)와 클로저**

```javascript
const counter = (function () {
    let count = 0;
    return function () {
        count++;
        return count;
    };
})();

console.log(counter()); // 1
console.log(counter()); // 2
```

### **2) 클로저와 메모리 누수 방지**

불필요한 참조를 제거하거나, 함수 호출이 끝난 뒤 필요 없는 데이터는 `null`로 설정하여 메모리 누수를 방지할 수 있습니다.

---

## **8. 클로저를 활용한 실용적인 패턴**

### **1) 커링(Currying)**
```javascript
function multiply(a) {
    return function (b) {
        return a * b;
    };
}

const multiplyByTwo = multiply(2);
console.log(multiplyByTwo(5)); // 10
```

### **2) 디바운스(Debounce)**
```javascript
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const log = debounce(() => console.log("Debounced!"), 300);
log();
log();
log();
// 마지막 호출로부터 300ms 후에 "Debounced!" 출력
```
