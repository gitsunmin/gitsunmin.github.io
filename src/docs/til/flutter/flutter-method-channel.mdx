# FlutterMethodChannel

## FlutterMethodChannel 이란?
Flutter의 MethodChannel은 Flutter 앱과 호스트(안드로이드 또는 iOS) 플랫폼 간의 통신을 가능하게 하는 메커니즘입니다. 이를 사용하여 Flutter에서 네이티브 플랫폼의 코드를 호출하거나 반대로 네이티브 플랫폼에서 Flutter 코드를 호출할 수 있습니다. 이러한 방식은 Flutter에서 제공하지 않는 플랫폼별 기능을 구현하는 데 유용합니다.

## FlutterMethodChannel 사용하기

### Flutter에서 네이티브 플랫폼의 코드 호출하기
Flutter에서 네이티브 플랫폼의 코드를 호출하려면 MethodChannel을 사용하여 네이티브 플랫폼의 코드를 호출하고 결과를 받아올 수 있습니다. 아래는 Flutter에서 네이티브 플랫폼의 코드를 호출하는 예제입니다.

```dart
// Flutter
static const platform = const MethodChannel('com.example.flutter_method_channel_example');

Future<void> _getBatteryLevel() async {
  String batteryLevel;
  try {
    final int result = await platform.invokeMethod('getBatteryLevel');
    batteryLevel = 'Battery level at $result % .';
  } on PlatformException catch (e) {
    batteryLevel = "Failed to get battery level: '${e.message}'.";
  }
}
```
먼저 Dart 코드에서 `MethodChannel`을 호출하고, 파라미터로 네임스페이스를 지정합니다. 이 네임스페이스는 네이티브 플랫폼의 코드에서 사용됩니다. 그리고 `invokeMethod`를 사용하여 네이티브 플랫폼의 코드를 호출합니다. 이때 `invokeMethod`의 파라미터로는 네이티브 플랫폼의 코드에서 사용할 메소드의 이름을 지정합니다. 그리고 `invokeMethod`의 결과로는 `Future`를 반환합니다. 이 `Future`는 네이티브 플랫폼의 코드가 실행되고 결과를 반환하면 완료됩니다. 이때 `Future`의 결과는 네이티브 플랫폼의 코드에서 반환한 값입니다.

이것이 Flutter에서 네이티브 플랫폼의 코드를 호출하는 방법입니다. 이제 네이티브 플랫폼의 코드에서 Flutter 코드를 호출하는 방법을 알아보겠습니다.

```kotlin
// Android (MainActivity.kt)

class MainActivity : FlutterActivity() {
  private val CHANNEL = "com.example.flutter_method_channel_example"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    GeneratedPluginRegistrant.registerWith(this)

    MethodChannel(flutterView, CHANNEL).setMethodCallHandler { call, result ->
      if (call.method == "getBatteryLevel") {
        val batteryLevel = getBatteryLevel()

        if (batteryLevel != -1) {
          result.success(batteryLevel)
        } else {
          result.error("UNAVAILABLE", "Battery level not available.", null)
        }
      } else {
        result.notImplemented()
      }
    }
  }

  private fun getBatteryLevel(): Int {
    val batteryLevel: Int
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      val batteryManager = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
      batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    } else {
      val intent = ContextWrapper(applicationContext).registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
      batteryLevel = intent!!.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) * 100 / intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1)
    }

    return batteryLevel
  }
}
```

`Android`(kotlin)에서는 위와 같이 `onCreate` 라이프사이클에서 `MethodChannel`을 생성하고, `setMethodCallHandler`를 사용하여 Flutter에서 호출한 메소드를 처리합니다. 이때 `setMethodCallHandler`의 파라미터로는 `MethodCall`과 `Result`를 파라미터로 받는 람다식을 지정합니다. `MethodCall`은 Flutter에서 호출한 메소드의 이름과 파라미터를 가지고 있습니다. 그리고 `Result`는 Flutter에 결과를 반환하는 메소드를 가지고 있습니다. 이때 `Result`의 `success` 메소드는 Flutter에 성공적으로 결과를 반환할 때 사용합니다. 그리고 `Result`의 `error` 메소드는 Flutter에 에러가 발생했을 때 사용합니다. 마지막으로 `Result`의 `notImplemented` 메소드는 Flutter에서 호출한 메소드가 구현되지 않았을 때 사용합니다.

```swift

// iOS (AppDelegate.swift)

import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  private let CHANNEL = "com.example.flutter_method_channel_example"

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)

    let controller : FlutterViewController = window?.rootViewController as! FlutterViewController
    let batteryChannel = FlutterMethodChannel(name: CHANNEL, binaryMessenger: controller)

    batteryChannel.setMethodCallHandler({
      (call: FlutterMethodCall, result: FlutterResult) -> Void in
      if ("getBatteryLevel" == call.method) {
        let batteryLevel = self.getBatteryLevel()

        if (batteryLevel != -1) {
          result(batteryLevel)
        } else {
          result(FlutterError(code: "UNAVAILABLE", message: "Battery level not available.", details: nil))
        }
      } else {
        result(FlutterMethodNotImplemented)
      }
    })

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  private func getBatteryLevel() -> Int {
    let device = UIDevice.current
    device.isBatteryMonitoringEnabled = true
    if (device.batteryState == UIDeviceBatteryState.unknown) {
      return -1
    } else {
      return Int(device.batteryLevel * 100)
    }
  }
}
```

`iOS`에서는 위와 같이 `application` 라이프사이클에서 `FlutterMethodChannel`을 생성하고, `setMethodCallHandler`를 사용하여 Flutter에서 호출한 메소드를 처리합니다. 이때 `setMethodCallHandler`의 파라미터로는 `FlutterMethodCall`과 `FlutterResult`를 파라미터로 받는 클로저를 지정합니다. `FlutterMethodCall`은 Flutter에서 호출한 메소드의 이름과 파라미터를 가지고 있습니다. 그리고 `FlutterResult`는 Flutter에 결과를 반환하는 메소드를 가지고 있습니다. 이때 `FlutterResult`의 `success` 메소드는 Flutter에 성공적으로 결과를 반환할 때 사용합니다. 그리고 `FlutterResult`의 `error` 메소드는 Flutter에 에러가 발생했을 때 사용합니다. 마지막으로 `FlutterResult`의 `notImplemented` 메소드는 Flutter에서 호출한 메소드가 구현되지 않았을 때 사용합니다.

위 예시에서는 베터리량을 반환하는 메소드를 구현하였지만, 이렇게 구현한 메소드는 Flutter에서 호출한 메소드의 이름과 파라미터를 확인하여 해당하는 메소드를 구현하면 됩니다.