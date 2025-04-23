# React Native

## Installation
```shell
npx create-expo-app@latest
```


## Core Components and Native Components

React Native의 UI 컴포넌트는 크게 Core Component와 Native Component로 구분됩니다.
Core Components는 React Native에서 제공하는 기본 UI 컴포넌트들이며, 빌드 시 각 타깃에 맞는 Native Component로 변환됩니다.
즉, Native Component는 각 플랫폼에서 사용되는 Swift, Java 혹은 Kotlin 코드로 만들어진 컴포넌트입니다.
또한, React Native에서는 필요에 따라 네이티브 모듈을 작성하여 Core Component와 통합된 Native Component를 만들 수 있습니다.

컴포넌트의 구조는 아래와 같이 표현할 수 있습니다.

======================== React Component =========================
= ------------------- React Native Component ------------------- =
= -                                                            - =
= -                Community Components                        - =
= -                Core Components                             - =
= -                Native Components                           - =
= -                                                            - =
= -------------------------------------------------------------- =
==================================================================

대부분의 UI Component는 React와 Props의 이름이 다를 뿐 이벤트 혹은 기본 Style등 비슷해 보입니다.

## Platform-Specific Components

Flutter를 하면서 느낀 것은, "Multi Platform인데도 불과하고, 분기를 계속 쳐주는 것이 불편하다." 였습니다. 그런데, React Native에서는 해당 Class가 정말 유용하게 사용될 것 같다는 생각이 들었습니다.

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```
이런식으로 OS별로 다른 Style 객체를 만들 수 있을 뿐만아니라, `Select` Method를 사용하면,

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
      },
      android: {
        backgroundColor: 'green',
      },
      default: {
        // other platforms, web for example
        backgroundColor: 'blue',
      },
    }),
  },
});
```
처럼 OS 별로 간편하게 분기를 할 수 있습니다.

## UI Components

### View

View는 가장 기본적인 컨테이너 컴포넌트로, 다른 컴포넌트를 그룹화하고 레이아웃을 구성하는 데 사용됩니다.

```tsx
import React from 'react';
import { View } from 'react-native';

const App = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Hello World</Text>
  </View>
);
```

### Text

Text는 텍스트를 렌더링하는 컴포넌트입니다. iOS와 Android에서 각각 네이티브의 텍스트 렌더링 방식을 사용합니다.

```tsx
import React from 'react';
import { Text } from 'react-native';

const App = () => (
  <Text style={{ fontSize: 20, color: 'blue' }}>Welcome to React Native!</Text>
);
```

### TextInput

TextInput은 사용자가 텍스트를 입력할 수 있는 컴포넌트입니다.


```tsx
import React, { useState } from 'react';
import { TextInput } from 'react-native';

const App = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => setValue(text)}
      value={value}
      placeholder="Enter text"
    />
  );
};
```

### ScrollView

ScrollView는 자식 컴포넌트를 스크롤할 수 있게 해주는 컨테이너입니다. 스크롤 가능한 콘텐츠가 많을 때 유용합니다.

```tsx
import React from 'react';
import { ScrollView, Text } from 'react-native';

const App = () => (
  <ScrollView>
    <Text>Content 1</Text>
    <Text>Content 2</Text>
    {/* 많은 텍스트들 */}
  </ScrollView>
);
```

### FlatList

FlatList는 많은 데이터 항목을 효율적으로 렌더링하는 컴포넌트로, 가상화된 목록을 생성합니다.

```tsx
import React from 'react';
import { FlatList, Text } from 'react-native';

const data = [{ key: '1', value: 'Item 1' }, { key: '2', value: 'Item 2' }];

const App = () => (
  <FlatList
    data={data}
    renderItem={({ item }) => <Text>{item.value}</Text>}
    keyExtractor={item => item.key}
  />
);
```

### Button

Button은 네이티브의 버튼 UI를 감싸는 컴포넌트입니다.

```tsx
import React from 'react';
import { Button } from 'react-native';

const App = () => (
  <Button
    onPress={() => alert('Button pressed!')}
    title="Press Me"
    color="#841584"
  />
);
```

### TouchableOpacity

TouchableOpacity는 사용자가 클릭할 수 있는 터치 가능한 영역을 제공하며, 클릭 시 불투명도를 조정하는 애니메이션 효과가 적용됩니다.

```tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const App = () => (
  <TouchableOpacity onPress={() => alert('TouchableOpacity pressed!')}>
    <Text>Press Me</Text>
  </TouchableOpacity>
);
```



## Style

다행스러운 점은 기본적으로 React를 사용할 때 처럼 카멜케이스로 style prop에 주입해주면 바로 사용가능합니다.

다만, 아래와 같은 방식을 권장하는 듯 합니다. 테마 적용이나 스타일을 관리하기 위해서는 아래의 방법이 더 좋아 보이긴 합니다.

```tsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const LotsOfStyles = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.red}>just red</Text>
      <Text style={styles.bigBlue}>just bigBlue</Text>
      <Text style={[styles.bigBlue, styles.red]}>bigBlue, then red</Text>
      <Text style={[styles.red, styles.bigBlue]}>red, then bigBlue</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});

export default LotsOfStyles;
```

+ Tailwind CSS 처럼 사용할 수 있는 [NativeWind](https://www.nativewind.dev/)도 있습니다.


## Images

이미지를 사용하는 경우 아래와 같이 사용할 수 있습니다.

```tsx
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

const ImageExample = () => {
  return (
    <View style={styles.container}> 
      <Image
        source={require('./image.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Hello World!</Text>
    </View>
  );
};
```

다만, 주의해서 사용해야할 부분이 있다.

```tsx
// GOOD
<Image source={require('./my-icon.png')} />;

// BAD
const icon = this.props.active
  ? 'my-icon-active'
  : 'my-icon-inactive';
<Image source={require('./' + icon + '.png')} />;

// GOOD
const icon = this.props.active
  ? require('./my-icon-active.png')
  : require('./my-icon-inactive.png');
<Image source={icon} />;
```

React Native에서는 위 BAD 형태를 권장하지 않습니다. require를 통해서 해당 경로를 미리 알고 있는 것이 좋은 패턴으로 판단하고 있습니다.

### Network Images

```tsx
// GOOD
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />

// BAD
<Image source={{uri: 'https://reactjs.org/logo-og.png'}} />

```
외부 자원인 경우에는 width와 height를 지정하여 사용해야합니다.

```tsx
<Image
  source={{
    uri: 'https://reactjs.org/logo-og.png',
    method: 'POST',
    headers: {
      Pragma: 'no-cache',
    },
    cache: 'only-if-cached',
    body: 'Your Body goes here',
  }}
  style={{width: 400, height: 400}}
/>
```

uri를 설정할 때에, 간단한 Network 설정들을 조작할 수 있습니다.

참고로 cache 정책은 아래와 같습니다.
default: Use the native platforms default strategy.
reload: The data for the URL will be loaded from the originating source. No existing cache data should be used to satisfy a URL load request.
force-cache: The existing cached data will be used to satisfy the request, regardless of its age or expiration date. If there is no existing data in the cache corresponding the request, the data is loaded from the originating source.
only-if-cached: The existing cache data will be used to satisfy a request, regardless of its age or expiration date. If there is no existing data in the cache corresponding to a URL load request, no attempt is made to load the data from the originating source, and the load is considered to have failed.


## Bundling

React Native는 Metro Bundler라는 번들러를 사용하고 있습니다.
자세한 내용은 [Metro](./metro.md)을 참고하시기 바랍니다.
