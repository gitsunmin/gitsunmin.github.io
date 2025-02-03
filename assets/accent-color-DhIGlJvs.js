const n=`# Accent Color

- accent-color는 특정 요소에 색상을 지정할 때 사용된다.
- accent라는 말처럼 브랜드 컬러처럼 강조 색상을 요소에 적용할 때 유용하다.
- accent-color는 prefers-color-scheme와 같이 사용하면, 라이트&다크모드를 모두 지정할 수 있다.

accent-color는 아래 요소에 적용된다.

‘’’html
<input type=“checkbox”> <!—체크박스—>
<input type=“radio”>    <!—라디오버튼—>
<input type=“range”>    <!—범위—>
<progress></progress>   <!—진행도—>
‘’’

‘’’css
@media (prefers-color-scheme: dark) {
  :root {
    accent-color: red;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    accent-color: blue;
  }
}
‘’’

이렇게 적용하면 체크박스, 라디오버튼, range의 프로그래스 바의 색상이 시스템의 다크모드일 때는 빨간색, 라이트모드일 때에는 파란색으로 보여지게 됩니다.
`;export{n as default};
