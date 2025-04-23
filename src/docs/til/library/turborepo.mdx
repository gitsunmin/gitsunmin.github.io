# Turborepo

## Turborepo 소개

Turborepo는 JavaScript 및 TypeScript 모노레포를 위한 고성능 빌드 시스템으로, 작업을 병렬로 실행하고 캐싱하여 빌드 시간을 단축합니다. 이를 통해 대규모 코드베이스에서도 효율적인 개발 환경을 구축할 수 있습니다.

## 프로젝트 구조 설계

모노레포에서는 일반적으로 애플리케이션과 패키지를 별도의 디렉토리에 분리하여 관리합니다. 예를 들어, apps/ 디렉토리에는 배포 가능한 애플리케이션을, packages/ 디렉토리에는 공유 라이브러리나 설정을 위치시킵니다.  ￼

프로젝트 구조 예시:

```shell
my-turborepo/
├── apps/
│   ├── web/
│   └── docs/
└── packages/
    ├── ui/
    ├── eslint-config-custom/
    └── tsconfig/
```

## Turborepo 초기 설정

Turborepo는 create-turbo 명령어를 통해 빠르게 초기 설정을 할 수 있습니다. 이 명령어는 기본적인 모노레포 구조를 자동으로 생성해 줍니다. ￼

```shell
npx create-turbo@latest
```

명령어 실행 후, 사용할 패키지 매니저를 선택하면 기본적인 폴더 구조와 설정 파일이 생성됩니다.

## 애플리케이션 및 패키지 생성

이제 두 개의 Next.js 애플리케이션과 하나의 공유 UI 라이브러리를 생성해 보겠습니다.

### Next.js 애플리케이션 생성

각 애플리케이션은 apps/ 디렉토리에 위치하며, Next.js를 기반으로 합니다.

#### web 애플리케이션 생성
```shell
npx create-next-app apps/web
```

#### docs 애플리케이션 생성
```shell
npx create-next-app apps/docs
```

### 공유 UI 라이브러리 생성

공유 UI 컴포넌트는 packages/ui 디렉토리에 위치하며, 다른 애플리케이션에서 재사용할 수 있습니다. ￼

```shell
mkdir packages/ui
```

packages/ui 디렉토리에 package.json 파일을 생성하고 다음과 같이 설정합니다:
```shell
{
  "name": "@myorg/ui",
  "version": "0.1.0",
  "main": "index.js"
}
```

이제 packages/ui 디렉토리에 공유할 컴포넌트를 추가하고, 이를 apps/web 및 apps/docs에서 사용할 수 있도록 설정합니다. ￼

## 의존성 관리 및 빌드 설정

각 애플리케이션과 패키지의 package.json 파일에서 의존성을 설정하고, Turborepo의 캐싱 및 병렬 실행 기능을 활용하여 빌드 시간을 단축할 수 있습니다.

예를 들어, turbo.json 파일을 다음과 같이 설정하여 빌드 파이프라인을 정의할 수 있습니다:

```shell
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "test": {}
  }
}
```

이러한 설정을 통해 Turborepo는 각 작업을 효율적으로 실행하고, 변경된 부분만을 다시 빌드하여 개발 속도를 향상시킵니다.

## 개발 서버 실행

모든 설정이 완료되면, 다음 명령어로 모든 애플리케이션과 패키지를 동시에 개발 모드로 실행할 수 있습니다:

```shell
npm run dev
```

이렇게 하면 `apps/web`과 `apps/docs` 애플리케이션이 동시에 실행되며, `packages/ui`의 변경 사항도 실시간으로 반영됩니다.

