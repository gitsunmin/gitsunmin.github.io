---
title: Flutter Import & Part
summary: Flutter의 import와 part keyword에 대해서 알아보았습니다.
description: Flutter의 import와 part keyword에 대해서 알아보았습니다.
date: 2023-08-21 11:20:15
author: 'Gitsunmin'
image: /images/blogs/flutter_thumbnail.jpeg
categories:
  - '2023'
tags:
  - Flutter
---

# 서론

Dart 프로그래밍 언어는 코드의 재사용성과 모듈화를 촉진하기 위해 다양한 문법을 제공합니다. 특히, `import`와 `part` 키워드는 이러한 목적을 위해 핵심적인 역할을 수행합니다. 본 문서에서는 이 두 키워드와 관련된 세부 사항과 사용 예제를 살펴보겠습니다.

# 본론

1. \***\*import 키워드\*\***

- \***\*정의\*\***: 다른 Dart 파일이나 라이브러리를 현재 파일에 가져오기 위해 사용됩니다.
- \***\*사용 예시\*\***:
  위 코드는 Dart의 내장 라이브러리인 `math`를 현재 파일에 포함시킵니다.

```dart
import 'dart:math';
```

- \***\*특별한 사용법\*\***: `show`와 `hide`를 사용하여 특정 부분만 가져올 수 있습니다.

첫 줄은 `math` 라이브러리에서 `max` 함수만 가져오며, 두 번째 줄은 `min` 함수를 제외한 모든 것을 가져옵니다.

```dart
import 'dart:math' show max;
import 'dart:math' hide min;
```

2. \***\*part와 part of\*\***

- \***\*정의\*\***: `part`와 `part of`는 Dart 코드 내에서 동일한 라이브러리를 여러 파일로 나누는 구조를 제공합니다.

- \***\*Private 멤버 접근 예시\*\***: Dart에서 `_` (underscore)로 시작하는 이름은 private으로 간주되며 일반적으로 해당 파일 내에서만 접근이 가능합니다. 그러나 `part`와 `part of`를 사용하면 동일 라이브러리의 다른 파일에서도 이 private 멤버에 접근할 수 있습니다.

- \***\*주 파일:\*\***

```dart
// main.dart
part 'other_file.dart';


class MainClass {

  final _privateData = "This is private data from MainClass.";



  void displayDataFromOtherClass() {

    OtherClass other = OtherClass();

    print(other._privateMessage);  // 접근이 가능!

  }

}

```

- \***\*부분 파일\*\***:

```dart

// other_file.dart

part of 'main.dart';



class OtherClass {

  final _privateMessage = "This is private message from OtherClass.";



  void accessMainClassData() {

    MainClass mainClass = MainClass();

    print(mainClass._privateData);  // 접근이 가능!

  }

}

```

# 결론

Dart의 `import`와 `part` 키워드는 코드의 조직화와 모듈화에 핵심적인 역할을 합니다. `import`는 외부 라이브러리나 파일의 코드를 현재 코드에 쉽게 통합하게 해주며, `part`와 `part of`는 코드를 여러 파일로 분할하면서도 하나의 라이브러리처럼 연결된 상태를 유지할 수 있게 도와줍니다. 특히, `part`와 `part of`를 이용한 private 멤버 접근은 큰 프로젝트에서 코드의 유연성과 조직성을 높이는 데 큰 도움이 됩니다.

# 참조

- [Dart 공식 문서](https://dart.dev/guides): Dart에 대한 전반적인 가이드와 튜토리얼을 제공하는 공식 웹사이트.
- [Dart 패키지 및 라이브러리 구조 가이드](https://dart.dev/guides/libraries/create-library-packages): Dart 라이브러리와 패키지 구조에 관한 공식 가이드.
