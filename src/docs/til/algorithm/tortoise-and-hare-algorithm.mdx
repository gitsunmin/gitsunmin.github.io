# The Tortoise and Hare Algorithm

물론이죠! 아래는 **TIL** 문서로 사용할 수 있도록 정리한 내용입니다.

---

## 개요
**The Tortoise and Hare Algorithm**, 또는 **Floyd's Cycle Detection Algorithm**은 **연결 리스트에서 사이클이 있는지 탐지**하는 문제를 해결하기 위한 알고리즘입니다. 이 알고리즘은 두 개의 포인터(하나는 느리게 이동하고, 다른 하나는 빠르게 이동하는 포인터)를 이용하여 리스트를 순회하면서, 사이클이 존재하는지 탐지합니다.

## 알고리즘 설명

### 1. 알고리즘의 핵심 개념
- **Tortoise (거북이)**: 한 번에 한 칸씩 이동하는 포인터 (`slow`).
- **Hare (토끼)**: 한 번에 두 칸씩 이동하는 포인터 (`fast`).
  
두 포인터는 연결 리스트를 순회하면서, 만약 사이클이 존재한다면 결국 만나게 됩니다. 사이클이 없으면 `fast` 포인터가 끝에 도달하고 탐색을 종료하게 됩니다.

### 2. 동작 원리

1. **초기화**: 
   - 두 포인터 `slow`와 `fast`는 리스트의 `head`에서 시작합니다.

2. **포인터 이동**:
   - `slow`는 한 번에 한 칸씩 이동하고, `fast`는 한 번에 두 칸씩 이동합니다.
   
3. **만남 탐지**:
   - `slow`와 `fast`가 같은 노드를 가리키면, 이는 리스트에 **사이클이 존재**한다는 뜻입니다.
   
4. **사이클이 없는 경우**:
   - `fast`가 `null`에 도달하면, 사이클이 없다고 판단하고 종료합니다.

### 3. 시간 및 공간 복잡도

- **시간 복잡도**: O(n)
  - 리스트의 모든 노드를 한 번씩만 탐색하므로, 리스트의 노드 개수가 `n`일 때 **O(n)**의 시간이 소요됩니다.
  
- **공간 복잡도**: O(1)
  - 두 개의 포인터만 사용하므로 추가적인 메모리 사용이 거의 없으며, 상수 공간만 차지합니다.

## 알고리즘 구현 (TypeScript)

```typescript
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function hasCycle(head: ListNode | null): boolean {
    if (!head || !head.next) {
        return false; // 리스트가 비어있거나 노드가 하나뿐이면 사이클이 있을 수 없음
    }

    let slow: ListNode | null = head;
    let fast: ListNode | null = head;

    while (fast && fast.next) {
        slow = slow!.next;           // 한 칸씩 이동
        fast = fast.next.next;       // 두 칸씩 이동

        if (slow === fast) {
            return true; // slow와 fast가 만나면 사이클이 있음
        }
    }

    return false; // fast가 null에 도달하면 사이클이 없음
}
```

### 예시

연결 리스트가 다음과 같다고 가정:
```
3 -> 2 -> 0 -> -4
     ^         |
     |_________|
```
- 마지막 노드 `-4`는 1번 노드 `2`로 연결되어 **사이클**이 발생합니다.
- `hasCycle` 함수는 이 연결 리스트에서 두 포인터가 반복해서 순회한 뒤 만남을 감지하여 **사이클이 존재함**을 반환합니다.

## 결론

- **The Tortoise and Hare Algorithm**은 간단하면서도 매우 효율적인 **사이클 탐지 알고리즘**입니다.
- 시간 복잡도는 O(n), 공간 복잡도는 O(1)로 대규모 데이터에서도 성능이 뛰어납니다.
- 이 알고리즘은 연결 리스트뿐만 아니라, 다른 순환 구조를 가진 데이터 구조에도 응용할 수 있습니다.

---

이 문서가 TIL 형식으로 적합하길 바랍니다! 필요한 수정 사항이 있거나 다른 포맷으로 작성이 필요하면 말씀해 주세요!