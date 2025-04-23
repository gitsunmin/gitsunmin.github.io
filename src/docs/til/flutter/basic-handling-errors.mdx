# Basic Handling Errors

Flutter에서의 에러 처리는 크게 두 가지로 나눌 수 있습니다.

- Flutter 프레임워크에서 발생하는 에러
- Flutter 프레임워크 외에서 발생하는 에러(사용자 코드에서 발생하는 에러)

## Flutter 프레임워크에서 발생하는 에러

예를들면, 특정 행위 시 `throw`를 이용하여 에러가 발생되었을 때, Flutter에서는 아래와 같이 Handling할 수 있습니다.

```dart
// 에러 발사 🚀
... throw Exception('에러 발생!');
```

```dart
// 에러 잡기 📷import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

void main() {
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    print('ERROR!!!!!');
    // if (kReleaseMode) exit(1); 앱을 종료할 수도 있습니다.
  };
  runApp(const MyApp());
}

```

## Flutter 프레임워크 외에서 발생하는 에러

```dart
// 에러 발사 🚀
OutlinedButton(
  child: const Text('Click me!'),
  onPressed: () async {
    const channel = MethodChannel('crashy-custom-channel')
    await channel.invokeMethod('blah')
  },
)
```

```dart
// 에러 잡기 📷
import 'package:flutter/material.dart';
import 'dart:ui';

void main() {
  PlatformDispatcher.instance.onError = (error, stack) {
    print('ERROR!!!!!');
    return true;
  };
  runApp(const MyApp());
}
```
