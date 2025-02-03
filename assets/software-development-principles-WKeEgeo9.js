const n=`# Software Development Principles

## KISS
"Keep it simple, stupid" (KISS)는 프로그래밍 원리 중 하나입니다. 이 원리는 소프트웨어 디자인의 가장 기본적인 원칙 중 하나로, 가능한 한 간단하게 유지하도록 권장합니다.

KISS 원칙은 다양한 의미로 해석될 수 있지만, 대개는 코드의 복잡성을 최소화하고, 코드를 이해하고 유지보수하기 쉽도록 하는 것을 의미합니다. 이를 위해서는 필요한 최소한의 기능만 구현하고, 간단한 알고리즘과 구조를 사용하며, 코드를 최대한 재사용 가능하게 작성해야 합니다.

또한 KISS 원칙은 코드의 가독성을 향상시키는 데도 도움이 됩니다. 코드가 간단하고 명확하면, 다른 개발자들이 코드를 이해하고 수정하는 데 어려움을 덜 겪게 됩니다.

추가로, KISS 원칙의 간단한 예시가 아래에 있습니다.

### KISS 원칙의 예시

#### 함수의 크기 제한 
함수를 작성할 때, KISS 원칙에 따라 가능한 한 함수를 작고 간단하게 유지해야 합니다. 이를 위해 함수의 크기를 일정한 수준으로 제한하거나, 함수가 한 가지 기능만 수행하도록 만듭니다. 이렇게 하면 코드의 가독성과 유지보수성이 향상됩니다.
#### 중복 코드 제거
중복 코드는 코드의 복잡성을 증가시키고 유지보수성을 낮춥니다. 따라서 KISS 원칙에 따라 중복 코드를 최소화하고, 가능한 경우 함수나 클래스 등으로 모듈화하여 재사용성을 높이는 것이 좋습니다.
#### 단순한 데이터 구조 사용
데이터 구조를 선택할 때도 KISS 원칙을 적용할 수 있습니다. 가능한 경우 간단한 데이터 구조를 사용하여 코드의 복잡성을 낮추고 성능을 향상시킬 수 있습니다.
#### 일관된 네이밍 규칙 사용
KISS 원칙은 코드의 가독성을 향상시키는 것도 중요하다고 강조합니다. 따라서 변수, 함수, 클래스 등의 네이밍에 일관된 규칙을 적용하여 코드의 가독성을 높이는 것이 좋습니다.
#### 불필요한 코드 제거
불필요한 코드는 코드의 복잡성을 증가시키고 디버깅을 어렵게 만듭니다. 따라서 KISS 원칙에 따라 불필요한 코드를 제거하고, 가능한 최소한의 코드만 유지하는 것이 좋습니다.

#### 간단한 코드 예시

\`\`\`javascript
// Bad
const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return \`\${year}/\${month}/\${day} \${hour}:\${minute}:\${second}\`;
};

// Good
const getFormattedDate = (date) => date.toLocaleString();
\`\`\``;export{n as default};
