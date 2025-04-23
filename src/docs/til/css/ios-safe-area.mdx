# iOS Safe Area

iOS 기기에 대응하기 위해서는 Safe Area를 사용하는 방법이 있습니다. Safe Area는 원래 TV 디바이스에서 TV 별로 화면의 비율이 다름에 따라서 화면에서 항상 보여지는 영역을 정의한 용어입니다. 모바일 환경에서도 기기가 점점 다양해짐에 따라, 모바일 디바이스에서도 Safe Area가 필요하게 되었고, CSS를 사용해서 이 Safe Area를 보장하는 방법도 생겨나게 되었습니다.

## iOS에서 Safe Area
iOS X 버전 이후의 디바이스들을 살펴보면, 디바이스 자체의 모서리가 굴곡이 있거나, 노치와 같이 화면을 가리는 영역이 존재하는 경우가 있습니다. 이러한 경우에 사용자에게 제공하려고 하는 화면이 제대로 보여지지 않고, 가려지는 현상이 나타납니다. 만약 이 굴곡지거나 노치가 있는 부분을 미리 알 수 있다면, 화면 자체를 해당 부분에 영향을 받지 않는 영역으로 내려버리는 결정을 할 수 있습니다. 이 영향을 받지 않는 영역을 Safe Area라고 합니다.

Safe Area는 화면의 가시성을 높여 사용자 경험을 개선하며, 특히 다음과 같은 경우에 유용합니다:
- 노치 디자인이 있는 기기에서 상단의 알림 바가 가려지지 않도록 하는 경우
- 둥근 모서리를 가진 기기에서 콘텐츠가 잘리거나 왜곡되지 않도록 하는 경우
- 홈 인디케이터가 있는 하단 영역이 콘텐츠와 겹치지 않도록 하는 경우

## Safe Area 사용 예시

기기별로 다양한 방법을 사용해야 할 것 같지만, CSS를 사용하면 간단하게 Safe Area를 정의할 수 있습니다. 이를 위해 CSS의 `env()` 함수를 사용하여 기기의 Safe Area Insets를 가져와 활용할 수 있습니다. Safe Area Insets는 각 기기의 상단, 우측, 하단, 좌측의 안전 영역을 나타내며, 다음과 같은 CSS 변수로 접근할 수 있습니다:

- `safe-area-inset-top`
- `safe-area-inset-right`
- `safe-area-inset-bottom`
- `safe-area-inset-left`

이 변수들은 `env()` 함수로 사용되며, 이를 통해 Safe Area를 정의할 수 있습니다. 예를 들어, 다음과 같은 CSS 코드를 통해 Safe Area를 보장할 수 있습니다:

```css
body {
    padding-top: env(safe-area-inset-top);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
}

.header {
    padding-top: calc(20px + env(safe-area-inset-top));
}

.footer {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
}
```

이 코드는 Safe Area를 고려하여 상하좌우에 패딩을 적용함으로써, 콘텐츠가 기기의 노치나 둥근 모서리에 가려지지 않도록 합니다. `env()` 함수는 기기의 Safe Area Insets 값을 반환하여 각 영역에 적절한 여백을 추가할 수 있게 합니다.

또한, 미디어 쿼리를 통해 특정 기기에서만 Safe Area를 적용할 수도 있습니다:

```css
@media (orientation: portrait) {
    .container {
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
    }
}

@media (orientation: landscape) {
    .container {
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
    }
}
```

이와 같이 Safe Area를 활용하면 다양한 기기에서 일관된 사용자 경험을 제공할 수 있습니다. Safe Area를 고려하여 디자인함으로써 사용자에게 최적의 화면을 제공하고, 기기의 특성에 따른 불편함을 최소화할 수 있습니다.