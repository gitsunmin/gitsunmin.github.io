---
title: 관심사의 분리로 해보는 리팩토링
summary: 관심사의 분리 원칙으로 리팩토링하여 코드의 품질을 향상시킨 경험을 공유합니다.
description: 관심사의 분리 원칙으로 리팩토링하여 코드의 품질을 향상시킨 경험을 공유합니다.
date: 2023-01-07 12:00:00
image: /images/blogs/default_thumbnail.webp
author: 'Gitsunmin'
categories:
  - '2023'
tags:
  - Refactoring
---

# 서론

총 40만줄이 넘는 프로젝트를 운영하며 코드와 로직이 모두 복잡하여 유지보수에 어려움을 겪었습니다. "어떻게든 해야, 나라도 코드를 수정할 수 있겠다."는 생각으로 리펙토링을 고려해보았습니다. 가장 먼저 각 로직을 분석하기 위해서 "일단 나누자"는 생각으로 접근하여, "관심사의 분리"를 이용한 경험을 이야기 해보려고 합니다.

# 본론

> 본론의 내용 및 코드는 이해를 돕기 위해서 축약 및 과장되었을 수 있습니다.

## 관심사의 분리란?

### 정의

> [컴퓨터 과학](https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99 '컴퓨터 과학')에서 **관심사 분리**(separation of concerns, **SoC**)는 [컴퓨터 프로그램](https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%93%A8%ED%84%B0_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8 '컴퓨터 프로그램')을 구별된 부분으로 분리시키는 디자인 원칙으로, 각 부문은 개개의 관심사를 해결한다.

간단하게 요약해보면, 관심사의 분리란 코드나 로직에서 관심을 가질 수 있는 부분을 분리시키는 것을 이야기합니다. 이렇게하면, 사람으로 하여금 단위 코드 혹은 로직당 받아들여야하는 정보의 양이 작아질 수 있기 때문에, 코드나 로직을 파악하기에 좀 더 쉽다는 느낌이 들 수 있습니다.

아래에 관심사의 분리 방법에 대해서 이야기할 것인데, 이름이 왜 Horizontal, Vertical인지 보다는 어떻게 직교하는지에 촛점을 두고 보면 이해하기 더 쉽습니다.

우선, 요리를 하는 로직에서 수평분할(Horizontal Separation)과 수직 분함(vertical Separation)에 대해서 이야기 해보겠습니다.

### 수평분할(Horizontal Separation)

수평분할은 만약에 라면을 끓인다고 가정하였을 때, 라면을 끓이는 행위를 아래와 같이 분할하는 것을 이야기합니다.

- 라면을 끓인다.

1. 냄비를 준비한다.
2. 물을 끓인다.
3. 면을 넣는다.
4. 스프류를 넣는다.
5. 3~5분을 기다린다.
6. 완료 콜백을 보낸다.

> 라면은 내맘대로 끓였습니다. 이렇게 먹어도 맛있습니다. ㅡㅡ

위에서 보았듯이, 라면을 끓인다는 하나의 로직을 각 행위로 분할이 되어진 것을 볼 수 있습니다. 이제 실제 프로젝트에서는 어떻게 적용할 수 있는지를 한 번 살펴보겠습니다.

- 상품을 구입하는 서비스를 만든다.

1. UI
2. Data
3. Business Logic
4. Resources

이 예시를 보시면, 상품을 구입하는 서비스를 구성하는 UI와 Data 그리고 Business Logic과 Resources들로 관심사를 분리한 것을 볼 수 있습니다.

만약에, 한 파일의 한 함수에 UI를 구성하고, Data를 조회 및 수정하며, 구입이 이루어지는 모든 Business Logic과 이미지와 같은 것들이 그냥 절차대로 추상화 없이 전부 나열되어있는 코드가 있다고 상상해보십시오.

"안 분리 불안"이 오지 않을까요? 아마 분리하고 싶어서 불안하고 초조한 상태가 될 것입니다.

### 수직분할(Vertical Separation)

수직분할도 요리로 예시를 들어보려고 하는데, 이 수직 분할은 아래와 같이 예시를 들 수 있습니다.

- 라면을 끓이면서 햇반을 데웁니다. 그리고 출출함을 방지하기 위해서 햄버거 배달 주문을 하겠습니다.
- 라면을 끓인다.
- 햇반을 전자레인지에 데운다.
- 햄버거를 배달 주문한다.

위에서 보았듯이, 배고플 때에는 정신없이 요리를 준비하기에 바쁩니다. 이해는 하지만, 저것들을 누군가에게 명령을 해야한다고 생각해보면, 듣는 입장에서는 또 "안 분리 불안"이 옵니다. 저는 위와 같이 하나의 요리씩 분리해서 명령을 내려주면 좋을 것 같습니다. 이와 같은 예시를 실제 프로젝트에서는 어떻게 적용할 수 있는지를 한 번 살펴보겠습니다.

- 상품 구입을 하면서 같은 소비자들끼리 채팅을 할 수 있는 서비스를 만든다.
- 상품을 구입하는 기능
- 소비자의 정보를 조회하는 기능
- 채팅 기능

이 예시를 보시면, 서비스에 많은 기능이 있습니다. 이 또한 상품을 조회하고, 상품을 선택하고 채팅 내용을 조회하거나 하는 모든 기능들이 `renderChatableProductsPage()`라는 함수에 전부 절차대로 혹은 채팅 처럼 코드의 순서로는 파악하기 힘든 로직이 막 쓰여있다고 생각해 보겠습니다. "안 분리 불안"이 올 것 같습니다.

위 내용처럼 프로그래밍에서 관심사의 분리란, 한 행동을 여러 작은 행동으로 분할하거나, 여러 행동을 공통되는 행동끼리 분리하는 것을 이야기합니다.

사람은 컴퓨터와 마찬가지로 한 번에 받아들일 수 있는 정보에 제한이 있습니다. 분리되지 않은 코드는 사람이 한 번에 많은 양의 코드를 분석하도록 합니다. 하지만, 분리된 코드는 마치 Map 자료구조처럼 하나의 Key로 요약을 하여 정보를 받아들일 수 있습니다. 그렇기 때문에, 관심사의 분리는 프로그램의 성능보다는 사람이 읽고 파악하기 쉽게 하기 위해서 사용할 수 있습니다. 저는 꼭 필요한 원칙이라고 생각합니다.

## 리팩토링

관심사의 분리가 필요하다고 생각된 코드는 상품을 등록하기 위해서 상품 선택 다이얼로그를 띄우고, 상품을 여러개 선택하여 여러건을 한 번에 등록하여 거래 전표를 작성하는 기능이었습니다.

이 기능의 코드를 각색하여 Before & After로 표현해보겠습니다.

### 기존 코드의 문제점

```typescript
const onClick = async () => {
  const config = {
    closingDate: '2020-12-31', // 상품 등록 마감일
    minOrderQuantity: 1, // 최소 주문 수량
    maxOrderQuantity: 100, // 최대 주문 수량
    customerClosingData: '2020-12-31', // 거래처 상품 등록 마감일
    stockQuantityMap: {
      1: 10,
      2: 20,
      3: 30,
    }, // 재고량 맵, key: 상품 id, value: 재고량
    limitAmount: 100000, // 총 금액 한도
    totalAmountNotation: 2, // 총 금액 표기법 (소수점 2째 자리에서 반올림)
    vatNotation: 1, // 부가세 표기법 (소수점 1째 자리에서 반올림)
    // 여러가지 설정들...
  };

  const itemDialog = await openItemDialog(config);

  if (itemDialog.result) {
    const checkedItems = checkItems(itemDialog.items, config);
    if (_.isEmpty(checkedItems)) {
      openToast({ message: '등록된 상품이 없습니다.' });
    } else {
      // store에 상품을 등록한다.
      mutateDetail(checkedItems);

      // 그리드에 상품을 등록한다.
      insertMultiRows(checkedItems);

      // 등록된 상품에 포커스를 준다.
      focusItem(checkedItems);

      reSortItems(checkedItems);
    }
  } else {
    openToast({ message: '등록된 상품이 없습니다.' });
  }
};

/**
 * checkItems 함수는 아래와 같은 일을 한다.
 * 기존에 등록된 상품이 있는지 체크한다.
 * 상품 등록 기간이 마감되었는지 체크한다.
 * 거래처에서 상품등록을 마감했는지 체크한다.
 * 상품 수량이 재고량을 초과하였는지 체크한다.
 * 상품 등록 최대수량 및 최소 수량을 초과 혹은 미달하였는지 체크한다.
 * 총 상품의 가격이 최대 한도를 초과하였는지 체크한다.
 *
 * 상품의 총 금액에 사용자가 설정한 총 금액 표기법을 적용한다.
 * 상품의 부가세에 사용자가 설정한 부가세 표기법을 적용한다.
 */
const checkItems = (items: any[], config: any) => {
  let run = true;

  run = items.some((item) => {
    item.closingDate > config.closingDate;
  });

  if (!run) return [];

  run = items.some((item) => {
    item.customerClosingDate > config.customerClosingDate;
  });

  if (!run) return [];

  items = items.filter((item) => {
    item.stockQuantity > config.stockQuantityMap[item.id];
  });

  if (items.length === 0) return [];

  run = items.some((item) => {
    item.totalAmount > config.limitAmount;
  });

  if (!run) return [];

  let totalAmount = 0;
  items.forEach((item) => {
    totalAmount = totalAmount + item.totalAmount;
  });

  if (totalAmount > config.limitAmount) return [];

  return items.map((item) => ({
    ...item,
    totalAmount: item.totalAmount.toFixed(config.totalAmountNotation),
    vat: item.vat.toFixed(config.vatNotation),
  }));
};
```

위 코드는 실제 코드를 요약한 것으로서, 더욱 복잡하였지만, 관심사의 분리의 필요성에 대해서 이야기하기에는 충분한 것 같습니다.

해당 코드는 `onClick`만 보았을 때에는, 심각하게 이해하기 힘들다는 생각이 들지는 않습니다. 하지만 `checkItems`함수는 보게되면, 어떤 역할을 하는지, 어떤 변경이 일어나는지를 파악하기에 어렵습니다. 또한, `checkItems`함수는 단순히 상품을 확인만 하는 것이 아니라, 값을 변경하고 있습니다.

물론 이 부분은 기획된 내용 조차도 너무 복잡합니다. 위에서 이야기하였던 마치 자료구조의 Map처럼 하나의 키로서 요약을 하더라도 키가 너무 많습니다. 하지만, 이 부분을 분리하여 코드를 이해하기 쉽게 만들 수 있습니다. (키가 많은건 어쩔 수 없더라고요..키ㅋ)

### 수정된 코드

기존 코드의 문제점을 개선하기 위한 관심사의 분리를 적용한 수정된 코드입니다.

```typescript
// 1. UI 업데이트 관련 코드를 별도의 함수로 분리
function updateUIWithItems(checkedItems: any[]) {
  // 그리드에 상품을 등록한다.
  insertMultiRows(checkedItems);
  // 등록된 상품에 포커스를 준다.
  focusItem(checkedItems);
  // 상품을 재정렬한다.
  reSortItems(checkedItems);
}

// 2. 상품 검증 로직을 별도의 함수로 분리
function validateItems(items: any[], config: any): any[] {
  // 상품 등록 기간, 거래처 마감일, 재고량, 최대 한도 체크 등의 복잡한 로직을 분리하여 처리
  const validItems = items.filter((item) => {
    return (
      isWithinClosingDate(item, config) &&
      isCustomerClosingDateValid(item, config) &&
      isStockSufficient(item, config) &&
      isQuantityValid(item, config) &&
      isTotalAmountWithinLimit(item, config)
    );
  });

  return applyNotationsToItems(validItems, config);
}

// 3. 각 조건별 검증 로직을 더 작은 함수로 분리
function isWithinClosingDate(item: any, config: any): boolean {
  return item.closingDate <= config.closingDate;
}

function isCustomerClosingDateValid(item: any, config: any): boolean {
  return item.customerClosingDate <= config.customerClosingDate;
}

function isStockSufficient(item: any, config: any): boolean {
  return item.stockQuantity <= config.stockQuantityMap[item.id];
}

function isQuantityValid(item: any, config: any): boolean {
  return (
    item.orderQuantity >= config.minOrderQuantity &&
    item.orderQuantity <= config.maxOrderQuantity
  );
}

function isTotalAmountWithinLimit(item: any, config: any): boolean {
  return item.totalAmount <= config.limitAmount;
}

// 4. 금액 관련 표기법 적용 로직 분리
function applyNotationsToItems(items: any[], config: any): any[] {
  return items.map((item) => ({
    ...item,
    totalAmount: item.totalAmount.toFixed(config.totalAmountNotation),
    vat: item.vat.toFixed(config.vatNotation),
  }));
}

// 5. 이벤트 핸들러에서 분리된 로직 사용
const onClick = async () => {
  const config = {
    closingDate: '2020-12-31', // 상품 등록 마감일
    minOrderQuantity: 1, // 최소 주문 수량
    maxOrderQuantity: 100, // 최대 주문 수량
    customerClosingData: '2020-12-31', // 거래처 상품 등록 마감일
    stockQuantityMap: {
      1: 10,
      2: 20,
      3: 30,
    }, // 재고량 맵, key: 상품 id, value: 재고량
    limitAmount: 100000, // 총 금액 한도
    totalAmountNotation: 2, // 총 금액 표기법 (소수점 2째 자리에서 반올림)
    vatNotation: 1, // 부가세 표기법 (소수점 1째 자리에서 반올림)
    // 여러가지 설정들...
  }; // 설정 객체는 동일하게 유지
  const itemDialog = await openItemDialog(config);

  if (itemDialog.result) {
    const checkedItems = validateItems(itemDialog.items, config);
    if (_.isEmpty(checkedItems)) {
      openToast({ message: '등록된 상품이 없습니다.' });
    } else {
      // store에 상품을 등록한다.
      mutateDetail(checkedItems);
      // UI 업데이트
      updateUIWithItems(checkedItems);
    }
  } else {
    openToast({ message: '상품 선택이 취소되었습니다.' });
  }
};
```

이 수정된 코드는 다음과 같은 방법으로 관심사를 분리하였습니다.

1. **UI 업데이트**: UI와 관련된 코드를 `updateUIWithItems` 함수로 분리하여, 데이터 처리 로직과 분리시킵니다.
2. **상품 검증 로직**: `validateItems` 함수에서는 상품의 유효성 검증만을 수행합니다.
3. **검증 조건 분리**: 각각의 검증 조건을 작은 함수로 분리하여, 각각의 검증 로직을 명확하게 합니다.
4. **금액 표기법 적용**: 금액 표기법을 적용하는 로직을 `applyNotationsToItems` 함수로 분리하여, 변환 로직의 책임을 명확히 합니다.
5. **이벤트 핸들링**: 최종적으로 `onClick` 이벤트 핸들러에서는 이러한 함수들을 호출하여, 각 함수가 독립적으로 관심사를 처리하도록 구성합니다.

이벤트 핸들러에서는 이러한 함수들을 호출하여, 각 함수가 독립적으로 관심사를 처리하도록 구성합니다.

이와 같이 코드를 작성함으로써 각 함수는 명확한 역할과 책임을 가지며, 수정 및 유지보수가 용이한 구조가 되었습니다.

# 결론

이 프로젝트의 리팩토링은 관심사의 분리 원칙을 적용하여 복잡한 코드베이스를 명확하고 관리 가능한 단위로 재구성하는 과정을 포함합니다. 기존 코드에서 분석한 문제점을 토대로, 개선 방향을 설정하고 구체적인 개선 사항을 실행하는 단계로 진행되었습니다.

리팩토링을 통해 개선된 코드는 다음과 같은 장점을 가집니다.

1. **가독성 향상**: 함수와 모듈이 각각의 책임에 따라 분리되어, 코드를 이해하고 파악하기 쉬워졌습니다.
2. **유지보수 용이성**: 작은 단위로 분할된 코드는 개별적으로 수정 및 확장이 용이하며, 버그 발생 시 추적과 수정이 간결해집니다.
3. **테스트 가능성 증가**: 각 함수가 단일 책임을 가지므로, 단위 테스트를 통한 검증이 용이해집니다.
4. **재사용성**: 공통 로직을 재사용 가능한 함수로 분리함으로써, 코드 중복을 줄이고 효율성을 높입니다.

앞으로의 개발 과정에서도 이 원칙들을 유지하면서, 코드의 개선과 확장성을 위한 기반을 마련하려고 합니다.

최종적으로, 이 프로젝트에서 리팩토링을 통해 얻은 교훈은 단순히 코드의 성능 개선을 넘어서 개발자의 작업 효율성과 코드의 질적인 면에서의 향상에 기여한다는 것입니다. 따라서, 지속적인 리팩토링과 코드 품질 관리는 소프트웨어 개발의 핵심적인 부분임을 재확인할 수 있었습니다.

이 프로젝트의 경험을 바탕으로, 향후 유사한 규모와 복잡성을 지닌 다른 프로젝트에서도 관심사의 분리와 같은 원칙들이 적극적으로 채택되어, 지속 가능하고 유연한 소프트웨어 아키텍처를 구축하는 데 도움이 되기를 기대합니다.

# 참조

- https://velog.io/@seanlion/soc1
- https://kaki104.tistory.com/725
