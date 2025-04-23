# React Navigation

React Native에서 가장 많이 사용하는 Navigation 라이브러리입니다.

## 지원하는 Navigation
- Stack Navigation
- Drawer Navigation
- Bottom Tab Navigation
- Material Top Tab Navigation

### Stack Navigation

- 화면을 쌓아올리는 형태의 Navigation입니다.
- 화면을 전환할 때 애니메이션 효과를 줄 수 있습니다.
- 화면을 쌓아올리기 때문에 뒤로가기 버튼을 눌렀을 때 이전 화면으로 돌아갈 수 있습니다.

#### 예시
```typescript
// App.tsx
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

### Drawer Navigation

- 화면을 좌우로 슬라이드하여 메뉴를 열 수 있는 Navigation입니다.
- 화면을 전환할 때 애니메이션 효과를 줄 수 있습니다.

#### 예시
```typescript
// App.tsx
import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

### Bottom Tab Navigation

- 화면 하단에 Tab Bar를 추가하여 화면을 전환할 수 있는 Navigation입니다.
- 화면을 전환할 때 애니메이션 효과를 줄 수 있습니다.

#### 예시
```typescript
// App.tsx
import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    );
};
export default App;
```

### Material Top Tab Navigation

- 화면 상단에 Tab Bar를 추가하여 화면을 전환할 수 있는 Navigation입니다.
- 화면을 전환할 때 애니메이션 효과를 줄 수 있습니다.
#### 예시
```typescript
// App.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createMaterialTopTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
```


## 지원하는 다양한 Hooks

- useNavigation
- useRoute
- useNavigationState
- useFocusEffect
- useIsFocused
- usePreventRemove
- useRoutePath
- useLinkTo
- useLinkProps
- useLinkBuilder
- useScrollToTop
- useTheme

### useNavigation

useNavigation은 navigation 객체에 접근할 수 있는 hook입니다. 이 hook은 navigation 객체를 컴포넌트에 직접 prop으로 전달할 수 없거나, 깊게 중첩된 자식 컴포넌트에 전달하고 싶지 않을 때 유용합니다.

```typescript
import { useNavigation } from '@react-navigation/native';

function MyBackButton() {
  const navigation = useNavigation();

  return (
    <Button
      onPress={() => {
        navigation.goBack();
      }}
    >
      Back
    </Button>
  );
}
```

### useRoute

useRoute은 현재 선택된 화면의 route 객체를 가져올 수 있는 hook입니다.
```typescript
import { useRoute } from '@react-navigation/native';

function MyText() {
  const route = useRoute();

  return <Text>{route.params.caption}</Text>;
}
```

### useNavigationState

useNavigationState은 현재 선택된 화면의 route 객체와 navigation 객체를 가져올 수 있는 hook입니다.

```typescript
import { useNavigationState } from '@react-navigation/native';

function useIsFirstRouteInParent() {
  const route = useRoute();
  const isFirstRouteInParent = useNavigationState(
    (state) => state.routes[0].key === route.key
  );

  return isFirstRouteInParent;
}

function usePreviousRouteName() {
  return useNavigationState((state) =>
    state.routes[state.index - 1]?.name
      ? state.routes[state.index - 1].name
      : 'None'
  );
}
```

### useFocusEffect

화면이 집중되어 있을 때 사이드 이펙트를 실행하고 싶을 때가 있습니다. 부수 효과에는 이벤트 리스너 추가, 데이터 가져오기, 문서 제목 업데이트 등과 같은 것들이 포함될 수 있습니다. 포커스 및 흐림 이벤트를 사용하면 이러한 작업을 수행할 수 있지만 인체공학적으로 좋지 않습니다...

```typescript
import { useFocusEffect } from '@react-navigation/native';

function MyText() {
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen gains focus
    }, [])
  );

  return <Text>Hello</Text>;
}
```

### useIsFocused

화면의 현재 포커스 상태에 따라 다른 콘텐츠를 렌더링하고 싶을 수 있습니다. 라이브러리는 이를 쉽게 하기 위해 useIsFocused hook을 내보냅니다:
```typescript
import { useIsFocused } from '@react-navigation/native';

function ProfileScreen() {
  // This hook returns `true` if the screen is focused, `false` otherwise
  const isFocused = useIsFocused();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{isFocused ? 'focused' : 'unfocused'}</Text>
    </View>
  );
}
```

### usePreventRemove

usePreventRemove 훅을 사용하면 사용자가 화면을 떠나지 못하도록 할 수 있습니다. 예를 들어 저장되지 않은 변경사항이 있는 경우 사용자가 이동하기 전에 확인 대화 상자를 표시하고 싶을 수 있습니다.

```typescript
const EditTextScreen = () => {
  const [text, setText] = React.useState('');
  const navigation = useNavigation();

  const hasUnsavedChanges = Boolean(text);

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    if (Platform.OS === 'web') {
      const discard = confirm(
        'You have unsaved changes. Discard them and leave the screen?'
      );

      if (discard) {
        navigation.dispatch(data.action);
      }
    } else {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Discard them and leave the screen?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(data.action),
          },
        ]
      );
    }
  });

  return (
    <View style={styles.content}>
      <TextInput
        autoFocus
        style={styles.input}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
    </View>
  );
};
```

### useRoutePath

useRoutePath 훅을 사용하면 현재 화면의 경로를 가져올 수 있습니다.
```typescript
import { useRoutePath } from '@react-navigation/native';

function MyComponent() {
  const path = useRoutePath();

  // Construct a URL using the path and app's base URL
  const url = new URL(path, 'https://example.com');

  return <Text>Shareable URL: {url.href}</Text>;
}
```

### useLinkTo

useLinkTo 훅을 사용하면 연결 옵션에 따라 화면 이름 대신 경로를 사용하여 화면으로 이동할 수 있습니다. 탐색할 경로를 수신하는 함수를 반환합니다.
```typescript
import { useLinkTo } from '@react-navigation/native';

// ...

function Home() {
  const linkTo = useLinkTo();

  return (
    <Button onPress={() => linkTo('/profile/jane')}>
      Go to Jane's profile
    </Button>
  );
}
```

### useLinkProps

useLinkProps 훅은 커스텀 링크 컴포넌트를 만들 수 있도록 도와줍니다. 이 링크 컴포넌트는 화면으로 이동하기 위한 버튼으로 사용할 수 있습니다. 웹에서는 `<a>` 태그로 렌더링되며, `href` 속성을 포함하여 링크의 접근성 기능을 모두 유지합니다. 예를 들어, "오른쪽 클릭 -> 새 탭에서 링크 열기", Ctrl+클릭/⌘+클릭 등의 기능을 사용할 수 있습니다.

```typescript
import { useLinkProps } from '@react-navigation/native';

// ...

const LinkButton = ({ screen, params, action, href, children, ...rest }) => {
  const props = useLinkProps({ screen, params, action, href });

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Pressable {...props} {...rest}>
      <Text>{children}</Text>
    </Pressable>
  );
};
```

### useLinkBuilder

useLinkBuilder 훅은 링크 설정에 따라 href 또는 action을 생성하는 데 도움이 되는 헬퍼를 반환합니다. 이 훅은 다음과 같은 속성을 포함한 객체를 반환합니다:

- buildHref  
- buildAction

#### buildHref


```typescript
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';

// ...

function DrawerContent({ state, descriptors, navigation }) {
  const { buildHref } = useLinkBuilder();

  return state.routes((route) => (
    <PlatformPressable
      href={buildHref(route.name, route.params)}
      onPress={() => navigation.navigate(route.name, route.params)}
    >
      {descriptors[route.key].options.title}
    </PlatformPressable>
  ));
}
```

#### buildAction


```typescript
import { Link, CommonActions, useLinkBuilder } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';

// ...

function MyComponent() {
  const { buildAction } = useLinkBuilder();

  return (
    <Button onPress={() => navigation.dispatch(buildAction('/users/jane'))}>
      Go to Jane's profile
    </Button>
  );
}
```

### useScrollToTop
스크롤 가능한 컴포넌트의 기본 동작은 네이티브 탭 바에서 기대할 수 있듯이 활성 탭을 탭할 때 상단으로 스크롤되는 이벤트에 반응하는 것입니다.
이를 구현하기 위해 ScrollView나 FlatList와 같은 스크롤 가능한 컴포넌트의 ref를 받아들이는 useScrollToTop을 제공합니다.

```typescript
import { ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

function Albums() {
  const ref = React.useRef(null);

  useScrollToTop(ref);

  return (
    <ScrollView ref={ref}>
      {/* content */}
    </ScrollView>
  );
}
```


### useTheme
useTheme 훅을 사용하면 현재 활성화된 테마에 접근할 수 있습니다. 이 훅을 사용하여 테마 변경에 반응하는 컴포넌트를 만들 수 있습니다.

```typescript
import { useTheme } from '@react-navigation/native';

function MyButton() {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ backgroundColor: colors.card }}>
      <Text style={{ color: colors.text }}>Button!</Text>
    </TouchableOpacity>
  );
}
```

## Reference
- [React Navigation](https://reactnavigation.org/)