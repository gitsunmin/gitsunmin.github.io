# Tagged Union Type (Discriminated Union)

먼저, union Type의 정의를 알아보자면, 아래와 같습니다.

- 컴퓨터 과학에서 'union type'은 여러 다른 타입 중 하나를 가질 수 있는 변수를 나타냅니다.

이를 TypeScript에서는 아래와 같이 표현할 수 있습니다.

```typescript
interface Cash {
  amount: number;
}

interface PayPal {
  email: string;
}

interface CreditCard {
  cardNumber: string;
  securityCode: string;
}

type PaymentMethod = Cash | PayPal | CreditCard;
```

하지만, 위 코드는 PaymentMethod Type을 갖는 변수가 runtime 환경에서 어떤 타입을 갖는지 알 수 없습니다. 이를 해결하기 위해, Tagged Union Type을 사용할 수 있습니다.

Tagged Union Type은 아래와 같이 표현할 수 있습니다.

```typescript
interface Cash {
  type: "cash";
  amount: number;
}

interface PayPal {
  type: "paypal";
  email: string;
}

interface CreditCard {
  type: "creditcard";
  cardNumber: string;
  securityCode: string;
}

type PaymentMethod = Cash | PayPal | CreditCard;
```

위 코드에서는 각각의 Type에 `type`이라는 공통된 속성을 추가하였습니다. 이를 통해, runtime 환경에서 어떤 타입을 갖는지 알 수 있습니다.

```typescript
function processPayment(method: PaymentMethod) {
  switch (method.type) {
    case "cash":
      return `${method.amount}`;
    case "paypal":
      return `${method.email}`;
    case "creditcard":
      return `${method.cardNumber}`;
  }
}
```

위 코드에서는 `switch`문을 통해, `method`의 `type`을 확인하고, 각각의 `type`에 맞는 처리를 하고 있습니다.

이렇게 Tagged Union Type을 사용하면, runtime 환경에서 어떤 타입을 갖는지 알 수 있기 때문에, `switch`문을 통해 각각의 타입에 맞는 처리를 할 수 있습니다.
