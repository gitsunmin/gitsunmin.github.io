# Concurrently js

## 배경
React, React Relay, TailwindCSS, Typescript 등을 사용하면서 컴파일 왓치 옵션으로 코드가 수정될 때마다 컴파일 하여 상태를 확인하는 것이 있습니다. 그런데 점차 하나씩 늘어나면서, CLI의 Window가 너무 많아져서, 불편함이 생겨서 관련 라이브러리를 찾던 중에 concurrently 라는 라이브러리를 찾게 되었습니다.

## concurrently

concurrently는 여러개의 명령어를 동시에 실행할 수 있게 해주는 라이브러리입니다. 이를 통해, 하나의 터미널에서 여러개의 명령어를 실행할 수 있게 해줍니다. 또한, 각 명령어의 실행 결과를 색으로 구분하여 볼 수 있게 해줍니다.

> 자세한 옵션은 [공식 문서](https://www.npmjs.com/package/concurrently)를 참고하시면 됩니다.

## 설치
사실 설치를 하지 않아도 사용 가능하지만, 버전별로 호환성이 다르기 때문에, 설치를 권장합니다.

```bash
npm install concurrently --save-dev
# OR
npm install -g concurrently
```

## 사용법
```bash
concurrently "command1 arg" "command2 arg"
```

이렇게 사용하여 여러 개의 명령어를 동시에 실행할 수 있습니다. 위 명령어는 아무런 옵션을 주지 않은 것이고, 명령어 중에 몇 가지만 소개하겠습니다.

### -p, --prefix

명령어를 실행할 때, 각 명령어의 prefix를 지정할 수 있습니다. 이를 통해, 각 명령어의 실행 결과를 구분할 수 있습니다.

```bash
concurrently --prefix "[{time}]" "command1 arg" "command2 arg"
# OR
concurrently --prefix "[{pid}]" "command1 arg" "command2 arg"
# OR
concurrently --prefix "[{command}]" "command1 arg" "command2 arg"
```

### -l, --prefix-length

prefix의 길이를 지정할 수 있습니다. 기본값이 10이기 때문에, 명령어가 짤려서 나올 수 있습니다.

```bash
concurrently --prefix "[{time}]" --prefix-length 20 "command1 arg" "command2 arg"
```

### -c, --prefix-colors

prefix의 색을 지정할 수 있습니다. 기본값은 랜덤입니다. #RRGGBB 형식으로도 지정할 수 있습니다.

```bash
concurrently --prefix "[{time}]" --prefix-colors "red.bold,green.bold,blue.bold" "command1 arg" "command2 arg"
```

### -k, --kill-others

하나의 명령어가 종료되면, 다른 명령어도 종료시킵니다.

```bash
concurrently --kill-others "command1 arg" "command2 arg"
```

### -n, --names

명령어의 이름을 지정할 수 있습니다. 이를 통해, 각 명령어의 실행 결과를 구분할 수 있습니다.

```bash
concurrently --names "command1,command2" "command1 arg" "command2 arg"
```

## Example
    
```bash
concurrently --prefix "[{time}]" --prefix-length 20 --prefix-colors "red.bold,green.bold,blue.bold" --kill-others --names "command1,command2" "command1 arg" "command2 arg"
```