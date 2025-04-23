# Learning Dart
Dart 공식 문서를 읽으면서, Typescript나 Javascript만 사용한 나에게 새롭거나 잘 안 외워지는 것들을 적어보았습니다.

## Null safety

Dart에서는 Null 역참조 오류를 run-time이 아닌, compile-time에서 확인할 수 있습니다. 그렇기 때문에, 빌드가 되었다면 run-time에서 안전하게 변수를 사용할 수 있습니다.

아래와 같이 참고할 수 있는 3가지 성질이 있습니다.

1. 변수를 선언할 때에, Null을 활성화 하는 것이 가능합니다.

```dart
String? name  // Nullable type. Can be `null` or string.

String name   // Non-nullable type. Cannot be `null` but can be string.
```

1. 변수를 사용하기 전에 초기화해야 합니다. 널 가능 변수는 기본값이 널이므로 기본적으로 초기화됩니다. Dart는 초기 값을 널이 아닌 유형으로 설정하지 않습니다. 초기값을 설정하도록 강제합니다.
2. 널 가능 타입의 표현식에서는 프로퍼티에 액세스하거나 메서드를 호출할 수 없습니다. (`hashCode`나 `toString()`과 같이 널이 지원하는 속성이나 메서드인 경우에도 동일한 예외가 적용됩니다.)

## Late Variables

느리게 변수를 초기화하는 방식으로 변수를 선언하는 것입니다.

```dart
late String description;

void main() {
  description = 'Feijoada!';
  print(description);
}
```

(만약에 `description` 변수를 초기화 하지 않는다면, runtime환경에서 에러가 발생합니다.)

이 기능은 아래와 같이 사용하지 않을 수도 있는 변수를 선언할 때에 유용하게 동작할 수 있는데, 아래의 `readThermometer` 함수는 `temperature` 변수가 사용 되지 않으면, 실행되지 않도록 설계되었습니다.

```dart
// This is the program's only call to readThermometer().
late String temperature = readThermometer(); // Lazily initialized.
```

## Operator

- `~/` : 나누기 후 정수 결과만 반환.
    - ex) 2/5 ⇒ 2.5, 2~/5 ⇒ 2
- Type test operators: runtime에서 Type을 확인할 때 사용하는 문법
    
    
    | as | Typecast (also used to specify https://dart.dev/language/libraries#specifying-a-library-prefix) |
    | --- | --- |
    | is | True if the object has the specified type |
    | is! | True if the object doesn’t have the specified type |
- Other operators
    
    
    | ?[] | Conditional subscript access | Like [], but the leftmost operand can be null; example: fooList?[1] passes the int 1 to fooList to access the element at index 1 unless fooList is null (in which case the expression evaluates to null) |
    | --- | --- | --- |
    | ?. | Conditional member access | Like ., but the leftmost operand can be null; example: foo?.bar selects property bar from expression foo unless foo is null (in which case the value of foo?.bar is null) |
    | ! | Null assertion operator | Casts an expression to its underlying non-nullable type, throwing a runtime exception if the cast fails; example: foo!.bar asserts foo is non-null and selects the property bar, unless foo is null in which case a runtime exception is thrown |
- Cascade notation
    - 객체 선언 후 재학습 필요.

## Metadata

- @Deprecated
- @deprecated
- @override
- 사용저 정의 가능.

## Libraries & imports

- Specifying a library prefix
    
    ```dart
    import 'package:lib1/lib1.dart';
    import 'package:lib2/lib2.dart' as lib2;
    
    // Uses Element from lib1.
    Element element1 = Element();
    
    // Uses Element from lib2.
    lib2.Element element2 = lib2.Element();
    ```
    
- Importing only part of a library
    
    ```dart
    // Import only foo.
    import 'package:lib1/lib1.dart' show foo;
    
    // Import all names EXCEPT foo.
    import 'package:lib2/lib2.dart' hide foo;
    ```
    

## Types

### Number

- `int`와 `double`은 모두 `num` Type에 하위 개념.
- int
    - Native에서는
    
    $$
    -2^{63} ~~to~~ 2^{63} - 1
    $$
    
    - Web에서는
    
    $$
    -2^{53} ~~to~~ 2^{53} - 1
    $$
    
- double
    - 소수점을 표현하기 위한 Type

### Strings

- 문자열 합치기 (붙여서 나옴 → ‘String concatencation works even over line breaks.’)

```dart
var s1 = 'String '
    'concatenation'
    " works even over line breaks.";

```

### Symbols

```dart
void main() {
  var id = #radix;
  print(id); // Symbol("radix")
}
```

### Records

Dart에서의 Record는 익명으로 사용이 가능하며, `immutable` 한 Type으로 사용되고 있습니다.  얼핏 보면, 다른 Collection Type들과 비슷해 보이지만, size가 고정적인 것과, 서로 다른 Type들을 묶을 수 있는 점에서 다릅니다.

```dart
(String, int, { int a, bool b }) record = ('first', 22, a: 1, b: true);
```

위 의 record를 보면, type도 요소별로 다르게 설정할 수 있고, javascript의 obejct와 같이 사용도 가능합니다. 특이하네요. 각 요소에 접근하는 방법은 아래와 같습니다.

```dart
void main() {
  print(record.$1); // first
  print(record.a); // 1
  print(record.b); // true
  print(record.$2); // 22
}
```

또, javascript와 다른 점은 변수의 참조 주소로 동등성 비교를 하지 않는 다는 점입니다. dart의 record는 필드와 값이 같다면, 같은 record로 판단됩니다.

```dart
(String, int, { int a, bool b }) record = ('first', 22, a: 1, b: true);
(String, int, { int a, bool b }) record2 = ('first', 22, a: 1, b: true);

void main() {
  print(record == record2); // true
}
```

## Collections

- Map, List, Set 등 다른 Collection에서는 동등 비교를 Record 처럼 하지 않습니다.

```dart
({ int a, String b }) r1 = ( a: 1, b: 'ss' );
({ int a, String b }) r2 = ( a: 1, b: 'ss' );

Map<String, int> m1 = { 'a': 123, 'b': 234 };
Map<String, int> m2 = { 'a': 123, 'b': 234 };

List<int> l1 = [1,2,3,4];
List<int> l2 = [1,2,3,4];

Set<int> s1 = {1,2,3,4};
Set<int> s2 = {1,2,3,4};

void main() {
  print(r1 == r2); // True
  print(m1 == m2); // False
  print(l1 == l2); // False
  print(s1 == s2); // False
}
```

- destructuring을 하게되면, 아래와 같은 것도 가능합니다.

```dart
Map<String, int> hist = {
  'a': 23,
  'b': 100,
};

for (var MapEntry(key: key, value: count) in hist.entries) {
  print('$key occurred $count times');
	// a occurred 23 times
  // b occurred 100 times
}
```

그리고 다음과 같이 Key를 축약하는 것도 가능합니다. (`key: key` → `:key`)

```dart
for (var MapEntry(:key, value: count) in hist.entries)
```

### Dynamic

아래와 같이 사용 가능한 Dynamic Type을 제공함. (마치 javascript 같은..)

```dart
List<dynamic> l1 = [1,2,'3', {2}];
  print(l1); // [1, 2, 3, {2}]
```

### Control-flow operators

Control-flow operators은 각 Collection을 정의할 때에 conrtol-flow를 사용할 수 있도록 제공하는 문법입니다.

```dart
var nav = ['Home', 'Furniture', 'Plants', if (promoActive) 'Outlet'];
// promoActive가 true -> ['Home', 'Furniture', 'Plants', 'Outlet']
// promoActive가 false -> ['Home', 'Furniture', 'Plants']
```

위와 같이 작성하면, `promoActive`가 `true`인 경우에만 `Outlet`이 nav의 요소에 추가된 것을 볼 수 있습니다.

```dart
var listOfInts = [1, 2, 3, 4];
var listOfStrings = ['#0', for (var i in listOfInts) '#${i}'];
print(listOfStrings);
// [#0, #1, #2, #3, #4]
```

---

## Typedefs

```dart
typedef IntList = List<int>;
IntList il = [1, 2, 3];
```

이렇게 정의합니다.

`is` keyword를 사용하여 아래와 같이 확인하는 것도 가능합니다.

```dart
typedef Compare<T> = int Function(T a, T b);

int sort(int a, int b) => a - b;

void main() {
  assert(sort is Compare<int>); // True!
}
```

## Type System

Super Class와 Sub Class가 있을 때, 아래와 같은 규칙이 적용됩니다.

- Super Class, Method의 Return Type은 Sub Class에서 Override할 경우에 Super Class의 Method의 Return Type과 같거나 하위인 Type이 적용되어야 합니다.
- Super Class, Methods의 Parameter Type은 Sub Class에서 Override할 경우에 Super Class의 Method의 Parameter Type과 같거나 상위인 Type이 적용되어야 합니다.
- 변수를 생성할 때에, Type의 할당은 Sub Class에 Super Class의 Type을 넣을 수는 있지만, 반대는 불가능합니다.

## Patterns

dart에서는 Pattern matching을 `switch` 문으로 제공을 하는데, 아래와 같은 Pattern을 제공합니다.

### Logical-or

```dart
var isPrimary = switch (color) {
  Color.red || Color.yellow || Color.blue => true,
  _ => false
};
```

### Logical-and

```dart
var isPrimary = switch (color) {
  Color.red && Color.yellow && Color.blue => true,
  _ => false
};
```

### **Relational**

```dart
String asciiCharType(int char) {
  const space = 32;
  const zero = 48;
  const nine = 57;

  return switch (char) {
    < space => 'control',
    == space => 'space',
    > space && < zero => 'punctuation',
    >= zero && <= nine => 'digit',
    _ => ''
  };
}

void main() {
  print(asciiCharType(40)); // punctuation
}
```

### Null-check

```dart
void main() {
  String? maybeString = 'my name is gitunmin';
  switch (maybeString) {
    case var s?:
      print('s: $s');
    case null:
      print('this is the null');
    case _:
      print('wildcard');
  }
}
```

- 위와 같은 경우에는 `s: my name is gitsunmin` 으로 로그가 찍히고, maybeString이 `null` 인 경우에는 `this is the null` 이 로그에 찍힘
- `case var s?` vs `case var s`
    - `?` keyword를 붙이지 않으면, `null`인 경우에도 첫 번째 `case`에 매칭됩니다.

### Null-assert

아래와 같이 사용하게 되면, `var name`이 항상 null이 아님을 보증할 수 있습니다. 만약 null이라면 runtime 에러가 발생합니다.

```dart
void main() {
  List<String?> row = ['user', null];

  switch (row) {
    case ['user', var name!]:
      print('user Name');
    default:
      print('wildcard');
  }
}
```

### Rest element
```dart
var [a, b, ..., c, d] = [1, 2, 3, 4, 5, 6, 7];
// Prints "1 2 6 7".
print('$a $b $c $d');

var [a, b, ...rest, c, d] = [1, 2, 3, 4, 5, 6, 7];
// Prints "1 2 [3, 4, 5] 6 7".
print('$a $b $rest $c $d');
```

## Functions

```dart

// arrow function
String ping() => 'pong';

void enabledFlags({bool? bold, required bool hidden, bool error = false}) {
  print('bold: $bold, hidden: $hidden, error: $error');
}

// function as first-class object
var loudify = (String message) => '!!!${message.toUpperCase()}!!!';

void main() {
  // arrow function
  print('ping -> ${ping()}'); // ping -> pong
  // error가 기본값으로 채워짐
  enabledFlags(bold: true, hidden: false); // bold: true, hidden: false, error: false
  // bold가 null로 채워짐
  enabledFlags(hidden: true); // bold: null, hidden: true, error: false
  // error에 값을 할당함.
  enabledFlags(hidden: false, error: true); // bold: null, hidden: false, error: true
  // required 값이 채워지지 않으면 에러가 발생함.
  enabledFlags(bold: true); // ! Error: Required named parameter 'hidden' must be provided.

	print('${loudify('퇴근하고싶다')}'); // !!!퇴근하고싶다!!!
}
```

- return 하지 않는 Function은 null을 반환합니다.

```
foo() {}

assert(foo() == null);
```

### Generators

- Synchronous generator는 Iterable 객체를 반환하는 함수입니다.

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) yield k++;
}
```

- Asynchronous henerator는 Steam 객체를 반환하는 함수입니다.

```dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}
```