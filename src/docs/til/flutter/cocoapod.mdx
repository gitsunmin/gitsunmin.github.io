# Cocoapod

CocoaPods는 Swift 및 Objective-C의 프로젝트의 패키지 관리자입니다. 저는 Flutter에서 ios 빌드를 하기 위해서 학습하였습니다.

## 설치

```bash
$ sudo gem install cocoapods
```

## 사용법

```bash
$ pod init
```

위 명령어를 실행하면 Podfile이 생성됩니다. Podfile에는 아래와 같이 작성합니다.

```ruby
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'SomeProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

end

```

그리고 아래 명령어를 실행합니다.

```bash
$ pod install
```

`pod install`을 실행하면 Podfile에 작성된 내용을 바탕으로 CocoaPods가 필요한 라이브러리를 설치합니다.

그러면 
- Pods
- Podfile.lock
- SomeProject.xcodeproj
- SomeProject.xcworkspace

이렇게 파일 및 폴더가 생성됩니다.

각 역할을 설명하자면,

- Pods: CocoaPods가 설치한 라이브러리가 저장되는 폴더입니다.
- Podfile.lock: CocoaPods가 설치한 라이브러리의 버전을 저장합니다.
- SomeProject.xcodeproj: xcode에서 사용하는 프로젝트 파일로서 프로젝트의 설정을 담고 있습니다.
- SomeProject.xcworkspace: SomeProject.xcodeproj와 Pods를 통합하여 프로젝트를 관리하는 폴더입니다.

## cocoapods 사용하기

Podfile에 라이브러리를 추가하고 싶다면 아래와 같이 작성합니다.

```ruby
# Uncomment the next line to define a global platform for your project
platform :ios, '9.0'

target 'SomeProject' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for SomeProject
  pod '라이브러리 이름 1', '~> 4.7'
  pod '라이브러리 이름 2', '~> 4.0'
end

```
각 문법을 설명하자면,

- `platform`: 프로젝트에서 사용할 플랫폼의 버전을 설정합니다. 이 설정을 하지 않으면 최신 버전으로 설정됩니다.
- `target`: 프로젝트의 타겟을 설정합니다. 이 타겟은 xcode에서 설정하는 타겟이며, 빌드가 될 때 해당 타겟의 설정을 따릅니다.
- `do`: 타겟의 설정을 시작합니다.
- `use_frameworks!`: 프레임워크를 사용하겠다는 의미입니다. 이 설정을 하지 않으면 라이브러리를 사용할 수 없습니다. `!`는 반드시 사용하겠다는 의미입니다.
- `pod '라이브러리 이름 1', '~> 4.7'`: `라이브러리 이름 1`을 설치하고 버전은 4.7 이상 5.0 미만으로 설치합니다.
- `pod '라이브러리 이름 2', '~> 4.0'`: `라이브러리 이름 2`을 설치하고 버전은 4.0 이상 5.0 미만으로 설치합니다.
- `end`: 타겟의 설정을 종료합니다.

추가적으로 많이 사용하는 문법으로는 아래와 같은 것들이 있습니다.

- `post_install`: 라이브러리 설치 후 실행할 스크립트를 작성합니다. 이 스크립트는 `pod install`을 실행할 때 실행됩니다.
  - ex.
    ```ruby
    post_install do |installer|
      installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
          config.build_settings['ENABLE_BITCODE'] = 'NO'
        end
      end
    end
    ```
    - `post_install`: 라이브러리 설치 후 실행할 스크립트를 작성합니다.
    - `installer`: CocoaPods의 설치 정보를 담고 있습니다.
    - `installer.pods_project`: CocoaPods의 설치 정보 중 프로젝트 정보를 담고 있습니다.
    - `installer.pods_project.targets`: CocoaPods의 설치 정보 중 프로젝트의 타겟 정보를 담고 있습니다.
    - `target.build_configurations`: CocoaPods의 설치 정보 중 프로젝트의 타겟의 빌드 설정 정보를 담고 있습니다.
    - `config.build_settings`: CocoaPods의 설치 시 설정한 빌드 설정 정보를 담고 있으며 Map에 접근하는 형태로 사용합니다. 위에서는 `ENABLE_BITCODE`를 `NO`로 설정하였습니다.
    위 스크립트는 라이브러리 설치 후 `ENABLE_BITCODE`를 `NO`로 설정하며, .each 문을 통해 모든 타겟의 빌드 설정을 변경합니다. |blahblah|는 파이프라인으로서 앞의 결과를 뒤의 함수의 인자로 전달합니다.
- 라이브러리의 버전은 아래와 같이 설정할 수 있습니다.
  - `pod '라이브러리 이름', '~> 4.7'`: `라이브러리 이름`을 설치하고 버전은 4.7 이상 5.0 미만으로 설치합니다.
  - `pod '라이브러리 이름', '~> 4.7.1'`: `라이브러리 이름`을 설치하고 버전은 4.7.1 이상 4.8 미만으로 설치합니다.
  - `pod '라이브러리 이름', '> 4.7'`: `라이브러리 이름`을 설치하고 버전은 4.7 이상으로 설치합니다.
  - `pod '라이브러리 이름', '>= 4.7'`: `라이브러리 이름`을 설치하고 버전은 4.7 이상으로 설치합니다.
  - `pod '라이브러리 이름', '< 4.7'`: `라이브러리 이름`을 설치하고 버전은 4.7 미만으로 설치합니다.
  - `pod '라이브러리 이름', '<= 4.7'`: `라이브러리 이름`을 설치하고 버전은 4.7 이하로 설치합니다.

## 참고

- [CocoaPods](https://cocoapods.org/)
- [Flutter - Cocoapods](https://flutter.dev/docs/development/ios-project-migration)
- [CocoaPods - Getting Started](https://guides.cocoapods.org/using/getting-started.html)
