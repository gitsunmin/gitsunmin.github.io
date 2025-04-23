# Difference Between CSR and SSR

1. 동적 데이터 처리의 함정: SSR 환경에서 Date.now() 사용 시 주의점

Cookie의 expires를 설정할 때 아래와 같이 사용하였다.

```ts
// COOKIE expires.ts
export const expires_1week = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
```

```ts
// app.ts (SSR)

import { expires_1week } from './expires.ts';

cookie.set(
    name: 'session',
    value: '123',
    {
        expires: expires_1week,
    }
)
```


CSR에서는 화면이 랜더링될 때마다 새로운 Date.now()가 생성되지만, SSR에서는 서버가 시작될 때 생성된 Date.now()가 계속 사용된다. 따라서, SSR 환경에서 Date.now()를 사용할 때는 주의해야 한다.

그래서 서버의 시작 시점의 시간을 사용하려는 의도라면 위와 같이 사용할 수 있지만, 화면이 랜더링될 때마다 새로운 시간을 사용하려면 아래와 같이 사용해야 한다.

```ts
// COOKIE expires.ts
export const expires_1week = () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
```

```ts
// app.ts (SSR)

import { expires_1week } from './expires.ts';

cookie.set(
    name: 'session',
    value: '123',
    {
        expires: expires_1week(),
    }
)
```

