# Basic Yarn Berry

기존 yarn v1에서는 사용되는 모든 패키지들이 마치 javascript에서의 호이스팅처럼 package.json에 명시하지도 않은 패키지를 import하여 사용할 수 있는 유령 의존성(Phantom Dependency)을 갖는 문제가 있었습니다.

yarn berry(Yarn v2)는 패키지들과 그 패키지들이 의존하는 모든 패키지들의 관계를 정의하였고, 그로인하여 생긴 방대한 module들은 `.zip` 파일로 관리하여 패키지 용량을 최소화 하였습니다.

yarn berry는 아래와 같은 방식을 사용합니다.

- `node_modules`를 생성하지 않고, `.yarn/cache` 라는 폴더에 `.pnp.cjs`라는 파일로 각 패키지의 의존 관계를 명확히 정의합니다.
- 모든 패키지들은 `.yarn/cashe` 폴더에 `.zip` 파일로 관리합니다.
- node에서 사용되는 `require` 함수를 오버라이딩 하여 `.zip` 파일을 이용할 수 있도록합니다.
- 패키지들을 상대적으로 용량이 적은 `.zip` 파일로 관리하기 때문에, git repository에 함께 올려서 zero install을 가능하게 합니다.