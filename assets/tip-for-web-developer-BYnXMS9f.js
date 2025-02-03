const t=`---
title: 'Flutter를 여행하는 웹 개발자를 위한 안내서'
summary: 웹 개발자가 Flutter를 사용할 때에 유용한 TIP을 소개합니다.
description: 웹 개발자가 Flutter를 사용할 때에 유용한 TIP을 소개합니다.
date: 2023-11-22 11:58:24
image: /images/blogs/flutter_thumbnail.webp
author: 'Gitsunmin'
categories:
  - '2023'
tags:
  - Flutter
---

# 서론

Flutter로 하이브리드 앱 개발 프로젝트를 진행하면서 알게된 내용들을 공유하기 위해서 문서를 작성하였습니다. 다만, 코드 레벨이나 사용법 보다는 개발 과정에서 유용한 TIP이나 추천 사이트 등 위주로 작성하였습니다.

# 본론

## Flutter 여행을 위한 준비물

안전하고 즐거운 여행이 되기 위해서는 꼭 필요한 준비물이니, 케리어에 미리 넣어두세요.

- 언어(Dart)
  - [웹 개발자를 위한 Flutter](https://docs.flutter.dev/get-started/flutter-for/web-devs)
  - [공식 Dart Document](https://dart.dev/guides)
- 코드 편집기
  - 저는 VSCode를 추천드리며, 아래의 Extension을 함께 추천드립니다.
  - [dart & flutter extension](https://dartcode.org/) - Flutter에서 공식적으로 제공하는 Extension입니다.
  - [Dart (Syntax Highlighting Only)](https://marketplace.visualstudio.com/items?itemName=oscarcs.dart-syntax-highlighting-only) - Flutter의 문법에 맞게 텍스트를 하이라이팅 해줍니다.
  - [Flutter Color](https://marketplace.visualstudio.com/items?itemName=circlecodesolution.ccs-flutter-color) - Flutter에서는 웹과는 다른 문법으로도 제공하고 있기 때문에 필요.
  - [Flutter Widget Snippets](https://marketplace.visualstudio.com/items?itemName=alexisvt.flutter-snippets) - Flutter 전용 Snippets를 제공
  - [Gradle Language Support](https://marketplace.visualstudio.com/items?itemName=naco-siren.gradle-language) - Android 개발 시 필요.
  - [Kotlin Language](https://marketplace.visualstudio.com/items?itemName=mathiasfrohlich.Kotlin) - Android 개발 시 필요.
- Flutter
  - [Flutter get started](https://docs.flutter.dev/) - Javascript와는 다르게 문서화가 매우 잘 되어있습니다. 양이 많지만, 한 번 살펴보면 도움이 됩니다.

## Flutter의 문화

Flutter는 우리가 생활하던 웹과는 조금 다른 문화를 가지고 있습니다. 아래의 내용을 숙지하시고, 여행중에 있을 수 있는 문화차이를 예방하시기 바랍니다.

### 설치형 소프트웨어

Flutter로 Web을 개발하는 것이 가능하지만, 데스크탑 앱, 모바일 앱 등 대부분이 설치를 필요로하는 소프트웨어를 개발하게 될 것입니다.

1.**배포 및 인증 프로세스**

“웹”이라는 비교적 자유로운 공간이 아닌, App Store, Play Store 혹은 다른 \\*\\*Store에 배포를 하여 클라이언트의 기기에 설치하는 것이기 때문에, 보안이나 품질 등 다양한 면에서의 검증이 필요합니다. 이러한 검증은 Store에 배포되기 전에 Store 측에서 인증을 해주어야하는데, 짧게는 2시간부터 길게는 일주일까지도 시간이 걸리게 됩니다. 웹에서와 같은 Hotfix 배포는 불가능하다고 생각하고, 좀 더 문제 발생에 대한 대비나 꼼꼼한 테스트가 요구되는 것 같습니다.

2.**버전 다양성 관리**

웹에서도 브라우저가 캐싱이 되어서 클라이언트가 이전 버전을 사용하는 경우가 종종있지만, 설치형 소프트웨어의 경우에는 진짜로 이전 버전의 소프트웨어가 설치되어 있는 것이다보니, 버전의 차이도 많이나고, 따로 설치하지 않는 한, 버전이 변경되지 않습니다. 이를 방지하기 위해서 강제 업데이트를 할 수 있도록 특정 버전의 사용을 막거나 백엔드 및 별도 서비스에서 하위 호환성을 고려하여 테스트 후에 배포 되어야 합니다.

3.**운영체제 권한 관리**

웹에서도 알림같은 경우에는 요청을 하여 권한을 얻어야하지만, 대표적인 설치형 소프트웨어인 모바일 앱에서는 카메라, 파일 등 많은 기능을 지원하기 위해서는 운영체제에 많은 기능의 권한을 요청하고, 또 사용자에게 고지해야합니다. 이러한 이유 때문에, 항상 권한을 얻지 못 한 경우에 대한 로직도 함께 작성해 주어야하는 점이 있습니다.

### 멀티 플랫폼 지원

Flutter는 웹, 앱(IOS, Android), 데스크탑 등 다양한 플랫폼에서 사용가능하며, 하나의 코드로 여러 플랫폼으로의 실행파일로 빌드가 가능합니다. 그렇기 때문에, Flutter 여행을 하기 위해서는 웹 뿐만 아니라 다른 플랫폼의 확장성을 고려하여 여행하는 것이 요구될 수 있습니다.

## Flutter 여행하기 TIP

믿거나말거나 여행사 경력 15년에 빛나는 베스트 가이드의 Flutter 여행 TIP을 공개합니다.

(p.s. 여행사 경력 없습니다. 😒)

### Flutter 여행중 꼭 가봐야 할 곳 Best 4

1. [pub.dev](https://pub.dev/) - 웹 개발에서 npm과 동일한 장소이며, 패키지들을 공유하고 관리합니다.
2. [fluttergems](https://fluttergems.dev/) - Flutter, dart package들을 카테고리화 해두어서 검색하기 좋게 해둔 장소입니다.
3. [flutter repo](https://github.com/flutter/flutter) - Flutter의 Github인데, 최신 버전, 이슈 등 정보를 확인할 수 있습니다.
4. [google code labs](https://codelabs.developers.google.com/?product=flutter) - Google Code Labs에서 Flutter 내용을 다루고 있습니다. 첫 여행자에게는 간단하게 여행을 체험할 수 있는 장소입니다.

### 취향이 독특한 여행자를 위한 TIP

- 개발자라면 CLI를 써야지.
  - 대부분의 가이드에서는 에디터의 디버그를 실행하여 앱을 기동하지만, 에디터의 디버그를 사용할 경우에는 에디터가 종료되었을 때, 앱의 기동이 함꼐 종료됩니다. Flutter의 CLI는 강력하기 때문에, 여러가지 옵션을 활용하면 CLI에서 앱을 기동하는 것도 가능하며, 에러와 인스펙터 등 CLI에서 확인 가능합니다.
    - [https://docs.flutter.dev/reference/flutter-cli](https://docs.flutter.dev/reference/flutter-cli)
- 함수형 프로그래밍 줘.
  - 함수형 TS 개발자라면, [fp-ts](https://gcanti.github.io/fp-ts/)를 알고 계실 것입니다. 이 fp-ts에서 영감을 받은 [fpdart](https://pub.dev/packages/fpdart)도 있으니 사용하시면, Dart로도 함수형 프로그래밍이 가능합니다.

### Flutter 여행을 더 안전하게 즐기는 방법

1. 기본적인 테스트: Flutter/Dart에서는 기본적으로 Unit Test, Widget Test(Component Test) 그리고 Integration Test를 모두 제공하고 있습니다. → [Here](https://docs.flutter.dev/testing/overview)
2. 스토어 배포 전에 테스트: Play Store나 App Store와 같은 곳에 배포를 하기 전에 간편하게 특정 사용자에게 앱을 공개하여 테스트를 진행할 수 있습니다.
   1. [Firebase App Distribution](https://firebase.google.com/docs/app-distribution?authuser=0&hl=ko) : Firebase에서 제공하는 배포 테스트 툴입니다. 사용 방법이 어렵지 않아서 추천합니다.
3. Others
   1. [Firebase Test Lab](https://firebase.google.com/docs/test-lab?hl=ko) : 빌드된 앱을 다양한 기기에서 테스트할 수 있도록 제공해주는 Firebase의 툴입니다.
   2. [Patrol](https://patrol.leancode.co/) : Flutter의 UI 테스팅 프레임워크로서 알림, 웹뷰 등 다양한 케이스를 테스트할 수 있습니다.

# 결론

웹 개발자로서 Flutter로 앱을 개발하는 TIP을 공유했습니다. 조금이나마 길잡이가 되었으면 좋겠습니다.

# 참조

- [https://docs.flutter.dev/](https://docs.flutter.dev/)
- [https://dart.dev/guides](https://dart.dev/guides)
- [https://firebase.google.com/docs/app-distribution?authuser=0&hl=ko](https://firebase.google.com/docs/app-distribution?authuser=0&hl=ko)
- [https://pub.dev/](https://pub.dev/)
- [https://fluttergems.dev/](https://fluttergems.dev/)
- [https://github.com/flutter/flutter](https://github.com/flutter/flutter)
- [https://codelabs.developers.google.com/?product=flutter](https://codelabs.developers.google.com/?product=flutter)
- [https://gcanti.github.io/fp-ts/](https://gcanti.github.io/fp-ts/)
- [https://pub.dev/packages/fpdart](https://pub.dev/packages/fpdart)
- [https://firebase.google.com/docs/test-lab?hl=ko](https://firebase.google.com/docs/test-lab?hl=ko)
- [https://patrol.leancode.co/](https://patrol.leancode.co/)
`;export{t as default};
