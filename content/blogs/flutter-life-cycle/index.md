---
title: Flutter APP & Widget Life Cycle
summary: Flutter의 라이프사이클을 설명하였습니다.
description: Flutter의 라이프사이클을 설명하였습니다.
date: 2023-08-17 12:00:00
author: 'Gitsunmin'
image: /images/blogs/flutter_thumbnail.webp
categories:
  - '2023'
tags:
  - Flutter
---

# 서론

Flutter는 세련된 UI와 뛰어난 성능을 제공하는 모바일 앱 개발 프레임워크입니다. APP과 Widget의 라이프사이클은 Flutter에서 앱의 행동과 성능을 이해하는 핵심요소입니다.

# 본론

## **Flutter APP 라이프사이클**

Flutter APP의 라이프사이클은 기본적으로 기기의 OS에 따라 결정됩니다. Android와 iOS 모두 APP의 상태 변화에 따른 이벤트를 발생시키는데, 이 이벤트들은 Flutter에서 특정 콜백 메서드를 통해 처리됩니다. 주요 라이프사이클 상태는 다음과 같습니다:

- **`inactive`**: APP이 활성 상태에서 벗어났지만 아직 메모리에 있습니다.
- **`paused`**: APP이 백그라운드로 이동하였으나, 아직 실행 중입니다.
- **`resumed`**: APP이 백그라운드에서 포그라운드로 돌아왔습니다.
- **`detached`**: APP이 종료되기 직전의 상태입니다.

각 상태는 APP의 생명주기 내에서 특정 시점에 발생하며, 해당 상태에 따라 APP의 동작과 자원 사용을 최적화할 수 있습니다.

**예제 코드:**

```dart
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

final logger = Logger(
  printer: PrettyPrinter(),
);

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gitsunmin Service',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const MyHomePage(title: 'gitsunmin'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with WidgetsBindingObserver {
  @override
  void initState() {
    //앱 상태 변경 이벤트 등록
    WidgetsBinding.instance.addObserver(this);
    super.initState();
  }

  @override
  void dispose() {
    //앱 상태 변경 이벤트 해제
    //문제는 앱 종료시 dispose함수가 호출되지 않아 해당 함수를 실행 할 수가 없다.
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  // 앱 상태 변경시 호출
  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.inactive:
        // 앱이 비활성화 되었을때
        logger.d("inactive");
        break;
      case AppLifecycleState.resumed:
        // 앱이 재개 되었을때
        logger.d("resumed");
        break;
      case AppLifecycleState.paused:
        // 앱이 일시정지 되었을때
        logger.d("paused");
        break;
      case AppLifecycleState.detached:
        // 앱이 종료되었을때
        logger.d("detached");
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: const Center(child: Text("Test WidgetsBindingObserver.")),
    );
  }
}
```

## **Flutter Widget 라이프사이클**

Flutter Widget의 라이프사이클은 Widget의 생성부터 소멸까지의 과정을 설명합니다. 주요 메서드는 다음과 같습니다:

- **createState()**: StatefulWidget이 생성될 때 호출되며, State 객체를 생성합니다.
- **initState()**: State 객체의 초기화가 일어나는 메서드입니다.
- **didChangeDependencies()**: Widget이 부모 Widget으로부터 데이터를 받거나, 외부 데이터 소스와의 연결이 필요할 때 호출됩니다.
- **build()**: Widget을 화면에 그리기 위한 메서드입니다.
- **didUpdateWidget()**: 부모 Widget으로부터 새로운 설정을 받았을 때 호출됩니다.
- **setState()**: 데이터 변경을 통해 UI를 갱신할 필요가 있을 때 호출됩니다. 이 메서드를 호출하면 Widget은 `dirty` 상태가 되어 `build()`가 다시 호출됩니다.
- **deactivate()**: Widget이 위젯 트리에서 제거될 준비가 되면 호출됩니다.
- **dispose()**: Widget의 생명주기가 종료되고 메모리에서 해제될 준비가 되면 호출됩니다.

`dirty`와 `clean` 개념: Widget은 그려질 준비가 되었을 때 `clean` 상태입니다. 하지만 `setState()`를 호출하면 `dirty` 상태가 되어 다시 그려질 필요가 생깁니다. `build()` 메서드가 호출된 후에는 Widget은 다시 `clean` 상태가 됩니다.

**예제 코드:**

```dart
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';

final logger = Logger(
  printer: PrettyPrinter(),
);

class LifecycleWidget extends StatefulWidget {
  const LifecycleWidget({super.key});

  @override
  State<LifecycleWidget> createState() => _LifecycleWidgetState();
}

class _LifecycleWidgetState extends State<LifecycleWidget> {
  @override
  void initState() {
    super.initState();
    logger.d("initState() called");
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    logger.d("didChangeDependencies() called");
  }

  @override
  Widget build(BuildContext context) {
    logger.d("build() called");
    return IconButton(
      icon: const Icon(Icons.add),
      onPressed: () {
        setState(() {
          // Widget becomes dirty
          logger.d("setState() called");
        });
      },
    );
  }

  @override
  void didUpdateWidget(covariant LifecycleWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    logger.d("didUpdateWidget() called");
  }

  @override
  void deactivate() {
    super.deactivate();
    logger.d("deactivate() called");
  }

  @override
  void dispose() {
    super.dispose();
    logger.d("dispose() called");
  }
}
```

# 결론

Flutter의 APP과 Widget 라이프사이클은 앱의 성능과 사용자 경험을 최적화하는 데 중요한 역할을 합니다. 이를 통해 Flutter 앱 개발 시 앱의 동작을 더 잘 이해하고 최적화 할 수 있습니다.

# 참조

- Flutter 공식 문서: [Flutter Docs](https://flutter.dev/docs)
- Flutter App Lifecycles: [Flutter App Lifecycle](https://api.flutter.dev/flutter/dart-ui/AppLifecycleState.html)
- Flutter Widget Lifecycle: [Flutter Widget Lifecycle](https://api.flutter.dev/flutter/widgets/State-class.html)
