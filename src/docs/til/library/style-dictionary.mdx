# Style Dictionary

디자인 토큰(Design Tokens)을 코드로 관리하고, 여러 플랫폼(iOS, Android, Web 등)에 맞춰 변환해주는 오픈소스 도구입니다. 디자인 시스템을 구축하거나 운영하는 팀에서 **디자인의 일관성**과 **자동화된 유지관리**를 위해 널리 사용됩니다.

---

## 주요 개념

### 디자인 토큰(Design Token)이란?
디자인 토큰은 색상, 폰트, 간격, 그림자 등 UI 구성 요소의 **기본 속성값**을 의미합니다.  
예:  

```json
{
  "color": {
    "primary": {
      "value": "#FF5733"
    }
  },
  "spacing": {
    "sm": {
      "value": "8px"
    },
    "md": {
      "value": "16px"
    }
  }
}



⸻

Style Dictionary 설치 및 초기화

npm install --save-dev style-dictionary
npx style-dictionary init

초기화하면 다음 구조의 폴더가 생성됩니다:

├── tokens/
│   └── color.json
├── config.json



⸻

설정 파일(config.json) 예시

{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "variables.css",
          "format": "css/variables"
        }
      ]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [
        {
          "destination": "_variables.scss",
          "format": "scss/variables"
        }
      ]
    },
    "js": {
      "transformGroup": "js",
      "buildPath": "build/js/",
      "files": [
        {
          "destination": "tokens.js",
          "format": "javascript/es6"
        }
      ]
    }
  }
}



⸻

변환 결과 예시

입력 (tokens/color.json)

{
  "color": {
    "primary": {
      "value": "#FF5733"
    },
    "secondary": {
      "value": "#33C1FF"
    }
  }
}

출력

1. CSS 변수 (build/css/variables.css)

:root {
  --color-primary: #FF5733;
  --color-secondary: #33C1FF;
}

2. SCSS 변수 (build/scss/_variables.scss)

$color-primary: #FF5733;
$color-secondary: #33C1FF;

3. JS 객체 (build/js/tokens.js)

export const color = {
  primary: "#FF5733",
  secondary: "#33C1FF"
};



⸻

확장 기능
- Custom Transform: 새로운 형식으로 변환 정의 가능
- Custom Format: 출력 파일 포맷 직접 정의
- Custom Action: 빌드 시 후처리 작업 추가 가능 (예: 파일 복사, 알림 등)

⸻

사용 시 이점

이점	설명
일관된 UI 유지	색상, 간격 등의 속성을 하나로 관리 가능
협업 효율 향상	디자이너와 개발자가 같은 토큰 기준으로 작업
자동화	모든 플랫폼에 맞는 파일 자동 생성
확장성	테마 분기, 다국어 적용 등 커스터마이징 가능



⸻

실제 프로젝트 적용 팁
- Figma 플러그인으로 디자인 토큰을 추출 후 Style Dictionary 포맷으로 변환 가능
- CI/CD 파이프라인에 Style Dictionary 빌드 포함하여 자동 반영
- 다양한 테마(light, dark)를 theme-light.json, theme-dark.json 식으로 분리 가능

⸻

📚 참고 자료
- GitHub 저장소: https://github.com/amzn/style-dictionary
