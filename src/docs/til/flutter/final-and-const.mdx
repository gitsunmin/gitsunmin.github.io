# Final and Const

## 1. `final`

- **정의**: 한 번 초기화되면 그 이후로 값이 변경될 수 없는 변수를 선언할 때 사용됩니다. 
- **런타임에서 초기화**: `final` 변수는 런타임에 초기화 될 수 있습니다.
- **유용성**: 객체의 불변성을 보장하기 위해 주로 사용됩니다. 예를 들어, Flutter에서 `StatefulWidget`의 `State` 클래스 내부에서는 멤버 변수를 `final`로 선언하여 불변성을 보장하기도 합니다.

**예시**:

```dart
class Car {
  final String model;
  Car(this.model); // 생성자에서 model 초기화
}

void main() {
  final car = Car("Sedan");
  // car.model = "SUV";   // 오류! final 변수는 재할당 할 수 없습니다.
}
```

## 2. `const`

- **정의**: 컴파일 타임 상수를 선언하는데 사용됩니다. 이것은 변하지 않고 항상 동일한 값을 가질 것임을 의미합니다.
- **컴파일 타임에서 초기화**: `const` 값은 컴파일 타임에 알려져 있어야 합니다.
- **유용성**: 메모리 최적화를 위해 주로 사용됩니다. 동일한 `const` 값을 여러 곳에서 사용할 때, 메모리 내에서 하나의 고정된 위치만 차지합니다.

**예시**:

```dart
const double pi = 3.14159265359;

void main() {
  // const radius = getRadius(); // 오류! const는 컴파일 타임에 값을 알아야 합니다.
  const double radius = 10.0;
  final area = pi * radius * radius;  // 여기서는 const 값을 final 변수와 함께 사용할 수 있습니다.
}
```

## 차이점 요약:

- `final`은 런타임에 초기화할 수 있지만 한 번 초기화된 후에는 변경할 수 없습니다.
- `const`는 컴파일 타임에 값이 초기화되어야 하며, 항상 동일한 값을 가져야 합니다.

## `final`과 `const`의 공통점:

1. **재할당 불가**: 두 키워드 모두 변수에 값을 재할당하는 것을 금지합니다. 한 번 선언되면 그 변수의 참조(또는 값)는 변경될 수 없습니다.

2. **불변성 보장**: 둘 다 값을 변경할 수 없게 만듭니다. 이를 통해 코드의 예측성을 높이고 버그 발생 확률을 줄일 수 있습니다.

3. **선언 시 초기화 필요**: `final`과 `const`로 선언된 변수는 선언과 동시에 초기화되어야 합니다. 나중에 초기화할 수 없습니다.

4. **클래스 멤버 변수로 사용 가능**: `final`과 `const` 모두 클래스의 멤버 변수로 사용될 수 있습니다. 하지만 `const`는 클래스 내에서는 static const로 선언되어야 합니다.

**예시**:

```dart
class Example {
  // 1. final 멤버 변수: 생성자에서 초기화될 예정입니다.
  // 'final' 키워드를 사용한 변수는 선언과 동시에 초기화하거나 생성자에서 초기화해야 합니다.
  final String finalExample;

  // 2. 'late final'을 사용하면 초기화를 나중에 수행할 수 있습니다.
  // 이 경우, 초기화 전까지 해당 변수에 접근하면 오류가 발생합니다.
  late final String lateFinalExample;

  // 3. 클래스의 멤버 변수로 'const'를 사용할 때는 반드시 'static'이어야 합니다.
  // 'const' 변수는 컴파일 타임에 알려진 값을 가집니다.
  static const String constExample = "Const Value";

  // 생성자에서 'finalExample'을 초기화합니다.
  Example(this.finalExample);

  // 'lateFinalExample'을 초기화하는 메서드
  void initializeLateFinal() {
    lateFinalExample = "Late Final Value";
  }
}

void main() {
  // 'Example' 클래스의 인스턴스를 생성하면서 'finalExample'을 초기화합니다.
  final example = Example("Final Value Initialized in Constructor");

  // 'lateFinalExample' 초기화
  example.initializeLateFinal();

  // 값을 출력합니다.
  print(example.finalExample);       // 생성자에서 초기화된 값
  print(example.lateFinalExample);   // 메서드에서 초기화된 값
  print(Example.constExample);       // static const 변수의 값
}
```

`final`과 `const`는 Dart에서 변수의 불변성을 보장하는 공통점을 갖고 있습니다. 그러나 초기화의 타이밍과 사용하는 경우에 따라 적합한 키워드가 달라질 수 있으므로, 필요에 따라 적절하게 선택하여 사용해야 합니다.