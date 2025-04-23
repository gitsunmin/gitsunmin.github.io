# typedef

typedef는 Type을 alias로 사용할 수 있게 해줍니다.

```dart
typedef IntList = List<int>;
IntList il = [1,2,3];
```

함수를 정의할 때에도 사용이 가능합니다.

```dart
typedef Compare<T> = int Function(T a, T b);

int sort(int a, int b) => a - b;

void main() {
  assert(sort is Compare<int>); // True!
}
```

## Example

저는 Record를 포함하는 Map 타입을 alias로 사용하고 싶어서 enum과 typedef를 사용해 보았습니다.

### AS-IS

```dart
class ErrorInfo {
  final String message;
  final String symbol;

  ErrorInfo({required this.message, required this.symbol});
}

final errorInfos = {
  'NetworkError': ErrorInfo(
    symbol: '📡',
    message: '네트워크 연결이 불안정합니다.',
  ),
  'default': ErrorInfo(
    symbol: '🙏',
    message: '''일시적인 에러가 발생하였습니다.
    잠시 후 다시 시도해주세요.''',
  ),
};
```

### TO-BE

```dart

typedef ErrorInfo = ({
  String message,
  String symbol,
});

enum ErrorType {
  network,
  otherwise,
}

typedef ErrorInfoMap = Map<ErrorType, ErrorInfo>;

final ErrorInfoMap errorInfos = {
  ErrorType.network: (
    symbol: '📡',
    message: '네트워크 연결이 불안정합니다.',
  ),
  ErrorType.otherwise: (
    symbol: '🙏',
    message: '''일시적인 에러가 발생하였습니다.
    잠시 후 다시 시도해주세요.''',
  ),
};
```
