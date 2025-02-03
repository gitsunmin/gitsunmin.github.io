const n=`# Add Flavor

## 서론
Flutter 개발을 하면서 같은 코드로 여러 환경을 지원하기 위한 방법으로 Flavor를 사용할 수 있습니다. 이 글에서 Flavor를 사용하는 방법에 대해서 알아보겠습니다.

## 본론

### Flavor를 사용하는 이유

Flutter에서는 iOS와 Android를 동시에 개발할 수 있습니다. 그리고 iOS와 Android에서는 각각 다른 환경을 지원해야 합니다. 예를 들어, iOS에서는 개발, 스테이지, 프로덕션 환경을 지원해야 합니다. 그리고 Android에서는 개발, 스테이지, 프로덕션, QA 환경을 지원해야 합니다. 이렇게 여러 환경을 지원하기 위해서는 각 환경별로 다른 설정을 해야 합니다. 이때, Flavor를 사용하면 각 환경별로 다른 설정을 할 수 있습니다.

사용 툴
- macOS
- flutter: 3.16.1
- vscode: 1.84.2
  - flutter extension: 3.76.0

### Flavor를 사용하는 방법

저는 예시로서 TEST와 PRODUCTION 환경을 지원하는 Flavor를 만들어 보겠습니다.

#### iOS에서 Flavor 적용하기
iOS에 Flavor을 적용하기 위해서는 Xcode를 사용해서 설정하는 것이 가장 쉽기 때문에 Xcode를 사용해서 설정하겠습니다.

아래의 Flutter 구조에서 ios 폴더를 우클릭하여 \`opne in Xcode\`를 클릭합니다.
\`\`\`
.
├── README.md
├── android
├── ios
├── lib
├── pubspec.lock
├── pubspec.yaml
└── test
\`\`\`
Xcode에서의 동작들은 설명하겠습니다.

##### Configurations 추가하기
1. Xcode가 열리면, 왼쪽의 네비게이션에서 Runner와 Pods가 있을텐데, Runner를 클릭해주세요.
2. Runner를 클릭하면, 중앙 상단에 탭중에서 info 탭을 클릭해주세요.
3. info 탭에서 Configurations를 클릭해주세요.
4. Debug와 Release 그리고 Profile이 있을텐데, + 버튼을 클릭하여 새로운 Configuration을 추가해주세요. 추가하실 때, 각 Configuration의 Based Configuration은 Debug, Release, Profile로 설정해주세요.
5. 각 Configuration의 이름은 \`Debug-TEST\`, \`Debug-PRODUCTION\`, \`Release-TEST\`, \`Release-PRODUCTION\`, \`Profile-TEST\`, \`Profile-PRODUCTION\`으로 설정해주세요.
  

##### Schemes 추가하기
1. Xcode의 메뉴바에서 Product > Scheme > Edit Scheme...을 클릭해주세요.
2. Runner를 클릭하고, 팝업의 하단에 \`Duplicate Scheme\` 버튼을 클릭해주세요.
3. 새로운 Scheme의 이름을 \`TEST\`, \`PRODUCTION\`으로 설정해주세요.

##### Build Settings 추가하기
1. \`Configurations 추가하기\`에서 Runner를 클릭하고, PROJECT와 TARGETS 중에 TARGETS에 있는 Runner를 클릭해주세요.
2. 중앙 상단에 탭중에서 Build Settings 탭을 클릭해주세요.
3. 오른쪽 상단에 검색창에 \`Product Bundle Identifier\`를 검색해주세요.
4. 각 Configuration의 Product Bundle Identifier를 설정해주세요.
  - ex)
  - Debug-TEST: com.example.flutter.flavor.test
  - Debug-PRODUCTION: com.example.flutter.flavor.production
  - Release-TEST: com.example.flutter.flavor.test
  - Release-PRODUCTION: com.example.flutter.flavor.production
  - Profile-TEST: com.example.flutter.flavor.test
  - Profile-PRODUCTION: com.example.flutter.flavor.production

##### Info.plist 추가하기
1. \`Build Settings 추가하기\`를 마친 후에 같은 메뉴 탭에서 오른쪽 상단에 + 버튼을 클릭해주세요.
2. \`Add User-Defined Setting\`을 클릭해주세요.
3. 변수명은 자유이지만, 에시로서 저는 \`APP_FLAVOR\`, \`APP_NAME\`을 등록했습니다.
   - \`APP_FLAVOR\`: Flovor의 이름을 설정합니다.
   - \`APP_NAME\`: 모바일에서 보여질 앱의 이름을 설정합니다.
4. \`APP_FLAVOR\`의 값은 각 Configuration의 이름과 동일하게 설정해주세요.
   - ex)
   - Debug-TEST: TEST
   - Debug-PRODUCTION: PRODUCTION
   - Release-TEST: TEST
   - Release-PRODUCTION: PRODUCTION
   - Profile-TEST: TEST
   - Profile-PRODUCTION: PRODUCTION
   - 이렇게 설정하면, 각 Configuration의 이름에 따라서 \`APP_FLAVOR\`의 값이 변경됩니다.
5. \`APP_NAME\`의 값은 이렇게 했습니다.
   - ex)
   - Debug-TEST: TEST
   - Debug-PRODUCTION: PRODUCTION
   - Release-TEST: TEST
   - Release-PRODUCTION: PRODUCTION
   - Profile-TEST: TEST
   - Profile-PRODUCTION: PRODUCTION
   - 이렇게 설정하면, 각 Configuration의 이름에 따라서 \`APP_NAME\`의 값이 변경됩니다.
6. info탭을 눌러주세요.
8. \`Bundle display name\`을 \`$(APP_NAME)\`으로 설정해주세요.
9. \`Flvaor\`이라는 키를 추가하고, \`$(APP_FLAVOR)\`로 설정해주세요.


#### Android에서 Flavor 적용하기

##### build.gradle 를 설정
1. /android/app/src/build.gradle 파일을 열어주세요.
2. \`buildTypes\`에 아래의 코드를 추가해주세요.
\`\`\`groovy
flavorDimensions "default"
productFlavors {
    TEST {
        dimension "default"
        applicationIdSuffix ".test" // 원하는 suffix를 설정해주세요.
        versionNameSuffix "-TEST"
        resValue "string", "app_name", "TEST" // 원하는 앱 이름을 설정해주세요.
    }
    PRODUCTION {
        dimension "default"
        applicationIdSuffix ".production" // 원하는 suffix를 설정해주세요.
        versionNameSuffix "-PRODUCTION"
        resValue "string", "app_name", "PRODUCTION" // 원하는 앱 이름을 설정해주세요.
    }
}
\`\`\`
##### AndroidManifest.xml 설정
1. /android/app/src/main/AndroidManifest.xml 파일을 열어주세요.
2. <application android:label="@string/app_name" ...>를 정의해주세요.

#### Flutter에서 Flavor 사용하기

##### Native와 소통하기
- ios
  1. \`ios/Runner/AppDelegate.swift\` 파일을 열어주세요.
  2. \`didFinishLaunchingWithOptions\` 메소드에서 \`GeneratedPluginRegistrant.register(with: self)\` 위에 아래의 코드를 추가해주세요.
  \`\`\`swift
  let channel = FlutterMethodChannel(name: "flavor", binaryMessenger: controller.binaryMessenger)
  channel.setMethodCallHandler({
          (call: FlutterMethodCall, result: @escaping FlutterResult) -> Void in

          if (call.method == "getFlavor") {
            result(Bundle.main.infoDictionary?["Flavor"])
          } else {
            result("notImplemented")
          }
        })
  \`\`\`
- android
  1. \`android/app/src/main/kotlin/.../flavor/MainActivity.kt\` 파일을 열어주세요.
  2. 아래의 코드를 작성해 주세요.
  \`\`\`kotlin
  package com.example.flavor_example  
  
  
  import androidx.annotation.NonNull;  
  import io.flutter.embedding.android.FlutterActivity  
  import io.flutter.embedding.engine.FlutterEngine  
  import io.flutter.plugin.common.MethodChannel  
  import io.flutter.plugins.GeneratedPluginRegistrant  

  class MainActivity: FlutterActivity() {  
    override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {  
        GeneratedPluginRegistrant.registerWith(flutterEngine);  

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "flavor").setMethodCallHandler {  
                call, result -> result.success(BuildConfig.FLAVOR)  
        }  
    }
  }
  \`\`\`

- flutter
  1. \`lib/main.dart\` 파일을 열어주세요.
  2. 아래의 함수를 작성해서 사용해주세요.
  \`\`\`dart
  import 'package:flutter/material.dart';
  import 'package:flutter/services.dart';

  Future<String> _getFlavorFromNative() async {
    const platform = MethodChannel('flavor');
    try {
      final String flavor = await platform.invokeMethod('getFlavor');
      return flavor;
    } on PlatformException catch (e) {
      return "Failed to get flavor: '\${e.message}'.";
    }
  }
  \`\`\`
  3. 그리고 \`flutter run --flavor TEST\` 또는 \`flutter run --flavor PRODUCTION\`을 실행해주세요.
  4. 각 네이티브에서 설정한 \`FLAVOR\`의 값을 가져올 수 있습니다.

이렇게 받아온 값을 이용하여 분기를 할 수 있습니다. 또한 앱에 각 환경에 맞는 라벨이 보이도록 할 수 있습니다. 이 패키지를 사용해 보시길 추천합니다. -> [flutter_flavor](https://pub.dev/packages/flutter_flavor)

## 결론

이렇게 각 환경별로 로직이나 화면을 분리하는 작업을 하는 방법을 알아 보았습니다. 이를 응용하면 여러가지 가능한 기능들이 많으니, 참고하시길 바랍니다.`;export{n as default};
