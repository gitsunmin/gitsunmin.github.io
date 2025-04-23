# Sealed Class

Sealed는 "봉인된"이라는 뜻이로써 어떠한 것을 감싸는 의미를 가지고 있다. 이 sealed class는 Kotlin and Scala 언어에서도 이미 사용되고 있는 키워드입니다.

sealed class는 abstract class와 유사한 성질을 가지고 있습니다. 하지만 sealed class는 abstract class와는 다르게, sealed class를 상속받은 클래스는 sealed class를 상속받은 클래스 내부에서만 상속이 가능합니다.

sealed class는 다음과 같은 특징을 가지고 있습니다.

- sealed class는 자체적으로 생성될 수 없습니다.

- sealed class는 factory constructor를 가질 수 있습니다.

- sealed class는 자신의 하위 클래스가 사용할 수 있는 constructor를 정의할 수 있습니다.

## Sealed Class의 사용

sealed class는 다음과 같이 사용할 수 있습니다.

```dart

sealed class Vehicle {}

class Car extends Vehicle {}

class Truck implements Vehicle {}

class Bicycle extends Vehicle {}

// ERROR: Cannot be instantiated
Vehicle myVehicle = Vehicle();

// Subclasses can be instantiated
Vehicle myCar = Car();

String getVehicleSound(Vehicle vehicle) {
    // ERROR: The switch is missing the Bicycle subtype or a default case.
    return switch (vehicle) {
        Car() => 'vroom',
        Truck() => 'VROOOOMM',
    };
}

```

## Sealed Class의 장점

sealed class는 다음과 같은 장점을 가지고 있습니다.

- switch case문을 작성할 때에, class의 속성(상태)도 함께 고려할 수 있습니다.
- switch case문을 작성할 때에, 모든 경우의 수를 고려할 수 있습니다. (컴파일 타임에서 오류를 미리 알 수 있습니다.)

## 응용

sealed class는 다음과 같이 사용할 수 있습니다.

```dart
sealed class Vehicle {
    String get sound;
}

class Car extends Vehicle {
  String get sound => 'voo';
}

class Truck implements Vehicle {
  String get sound => 'Vooooo';
}

class Bicycle extends Vehicle {
  String get sound => 'VOOOOO';
}

String getVehicleSound(Vehicle vehicle) => switch (vehicle) {
        Car(sound: final sound) => sound,
        Truck(sound: final sound) => sound,
        Bicycle(sound: final sound) => sound,
    };


void main() {
  print(getVehicleSound(Car())); // voo
  print(getVehicleSound(Truck())); // Vooooo
  print(getVehicleSound(Bicycle())); // VOOOOO
}
```

위 Pattern Matching에서 Matching된 Vehicle의 sound를 반환하는 함수를 작성할 수 있습니다.
