# Future and Stream

Dart 언어에서 `Future`와 `Stream`은 비동기 프로그래밍의 핵심 컴포넌트입니다. 이 두 개념을 이해하면 비동기적으로 동작하는 코드를 효과적으로 작성할 수 있습니다.

### 1. Future

**설명:**  
`Future`는 Dart에서 비동기 작업의 결과를 나타내는 객체입니다. 흔히, 데이터베이스 쿼리나 네트워크 요청과 같이 시간이 걸리는 작업의 결과를 나타낼 때 사용됩니다. `Future`는 두 가지 상태를 가질 수 있습니다: 완료(completed) 상태와 미완료(not completed) 상태. `Future`는 완료되면 값을 반환하거나 오류를 발생시킬 수 있습니다.

**예시:**

```dart
Future<String> fetchUserData() async {
  await Future.delayed(Duration(seconds: 2)); // 2초의 지연을 나타냅니다.
  return 'User Data';
}

void main() async {
  print('Fetching user data...');
  String data = await fetchUserData();
  print(data); // 'User Data'
}
```

### 2. Stream

**설명:**  
`Stream`은 시간에 따라 여러 값을 생성하는 비동기 시퀀스입니다. 간단히 말해서, `Future`가 단일 값이나 오류를 반환하는 반면, `Stream`은 시간에 따라 여러 개의 값이나 오류를 반환할 수 있습니다. 예를 들어, 사용자가 버튼을 누를 때마다 값을 생성하는 스트림 또는 파일을 읽을 때마다 데이터 청크를 생성하는 스트림과 같은 것을 생각해볼 수 있습니다.

**예시:**

```dart
Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

void main() async {
  print('Start counting...');
  await for (var number in countStream(5)) {
    print(number);
  }
  print('Done.');
}
```

위의 스트림 예제에서 `countStream`은 1부터 5까지의 숫자를 매 초마다 생성하는 스트림입니다. `await for` 루프는 스트림에서 값을 하나씩 읽어들여 처리합니다.
