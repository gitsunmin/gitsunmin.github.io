# Test Coverage

테스트 커버리지란 시스템 또는 소프트웨어의 테스트를 논할 때 얼마나 테스트가 충분한가를 나타낸 것이다. 보통 "OO 커버리지에서 100% 통과되었다." 등 처럼 사용하는 용어입니다.

이러한 테스트 커버리지는 당연하게 높은 것이 더 안정적인 소프트웨어이지만, 100%를 달성했다고 해서, 해당 소프트웨어를 100% 믿는 것은 위험합니다. 왜냐하면, 테스트 커버리지에 속하지 않는 부분은 테스트가 되지 않았기 때문입니다.

이러한 테스트 커버리지에는 다양한 종류가 있는데 아래에 몇 가지 소개하겠습니다.


## 코드 커버리지의 종류

### 구문 커버리지(Statement Coverage)
Statement Coverage는 프로그램 코드의 각각의 문장이 최소한 한 번은 실행되는지 확인하는 것입니다.

예를 들어, 아래와 같은 JavaScript 코드가 있다고 가정해봅시다.
```javascript
function example(a) {
    if (a) {
        return true;
    }
    return false;
}
```

위의 코드에 대한 Statement Coverage 테스트는 다음과 같이 작성될 수 있습니다.
```javascript
const assert = require('assert');
describe('Statement Coverage Test', function() {
    it('should return true when a is true', function() {
        assert.equal(example(true), true);
    });
    it('should return false when a is false', function() {
        assert.equal(example(false), false);
    });
});
```

### 결정 커버리지(Decision Coverage)
#### 정의
Decision Coverage는 프로그램 코드의 각각의 결정점(조건문 등)이 true와 false를 모두 가질 수 있도록 하는 것입니다. 이는 각각의 결정점이 모든 가능한 결과를 가질 수 있도록 하여, 결정점이 올바르게 작동하는지 확인합니다.

#### 예시
아래와 같은 코드가 있다고 가정해보겠습니다.
```javascript
function example(a, b) {
    if (a > b) {
        return true;
    } else {
        return false;
    }
}
```

위의 코드에 대한 Decision Coverage 테스트는 다음과 같이 작성될 수 있습니다.

```javascript
const assert = require('assert');
describe('Decision Coverage Test', function() {
    it('should return true when a is greater than b', function() {
        assert.equal(example(2, 1), true);
    });
    it('should return false when a is less than b', function() {
        assert.equal(example(1, 2), false);
    });
    it('should return false when a is equal to b', function() {
        assert.equal(example(1, 1), false);
    });
});
```

위의 테스트 코드는 if (a > b)라는 결정점이 true와 false를 모두 가질 수 있도록 테스트가 작성되었습니다. 이렇게 각각의 결정점이 모든 가능한 결과를 가질 수 있도록 하는 것이 Decision Coverage 테스트의 핵심입니다.

### 변형 조건/결정 커버리지(Modified Condition/Decision Coverage)
#### 정의
Modified Condition/Decision Coverage (MC/DC)는 각각의 조건이 결정에 영향을 미치는지 확인하는 것입니다. 이는 각각의 조건이 true와 false를 모두 가질 수 있도록 하며, 다른 조건들은 그대로 유지하면서 각각의 조건이 결과에 영향을 미치는지 확인합니다.

#### 예시
```javascript
function example(a, b, c) {
    if (a && b || c) {
        return true;
    } else {
        return false;
    }
}
```

```javascript
const assert = require('assert');
describe('MC/DC Test', function() {
    it('should return true when a is true, b is true, and c is false', function() {
        assert.equal(example(true, true, false), true);
    });
    it('should return false when a is false, b is true, and c is false', function() {
        assert.equal(example(false, true, false), false);
    });
    it('should return true when a is false, b is false, and c is true', function() {
        assert.equal(example(false, false, true), true);
    });
    it('should return false when a is false, b is false, and c is false', function() {
        assert.equal(example(false, false, false), false);
    });
});
```
위의 테스트 코드는 각각의 조건(a, b, c)이 결과에 어떤 영향을 미치는지 확인합니다. 이렇게 각각의 조건이 결과에 영향을 미치는지 확인하는 것이 MC/DC 테스트의 핵심입니다.
