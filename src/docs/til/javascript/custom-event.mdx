# Custom Event

`onclick`, `oninput`과 같이 DOM에 이벤트를 listen하는 것처럼, custom event를 listen할 수 있습니다.

```javascript
const pizzaEvent = new CustomEvent('gitsunmin', {
  detail: {
    name: 'sunmin',
  },
});

window.addEventListener('gitsunmin', (e) => console.log(e.detail.name));
window.dispatchEvent(pizzaEvent); // -> 'sunmin'
```

혹은 이를 이용하여 EventTarget을 상속받은 클래스에서 직접 이벤트를 발생시킬 수 있습니다.

```javascript
class Gitsunmin extends EventTarget {
  constructor() {
    super();
  }
  addTil(flavor) {
    // 클래스에서 직접 이벤트를 발생시킵니다.
    this.dispatchEvent(
      new CustomEvent('til-added', {
        detail: {
          pizza: flavor,
        },
      })
    );
  }
}

const gitsunmin = new Gitsunmin();

gitsunmin.addEventListener('til-added', (e) =>
  console.log('added til:', e.detail.pizza)
);
gitsunmin.addTil('custom event'); // -> 'added til: custom event'
```
