# Style 가이드

스타일은 대표적으로 2가지 방법을 사용하실 수 있습니다.

## pure `CSS` 사용하기

```html
<link rel="stylesheet" href="./style/[이름].css" />
```

모든 렌더링을 담당하는 `index.html` 파일에서 stylesheet를 import 해줍니다.

## `CSS module` 사용하기

다음은 자바스크립트 파일에서 `css`를 불러올 수 있는 `css module`방법이 있습니다.

```js
import boxStyle from "./box.module.css"

const box = document.querySlector(".box")
box.classList.add(boxStyle.box)
```

공식 `vitejs` 문서에서 `CSS` 방법론에 대해 알아볼 수 있습니다

[vite js CSS 알아보기](https://vitejs-kr.github.io/guide/features.html#css)

다양한 방식을 적극적으로 활용해보세요!
