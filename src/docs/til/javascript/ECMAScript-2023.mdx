# ECMAScript 2023

## toReversed
기존에 주로 사용하였던, Array.prototype.reverse():
```javascript
const arr = [1, 2, 3, 4];

const r_arr = arr.reverse();

console.log(arr);
// [4, 3, 2, 1]
console.log(r_arr);
// [4, 3, 2, 1]
```
`reverse()` method를 사용하였더니, 기존값인 arr의 순서 또한 역전이 되어버렸습니다. 이를 방지하기 위해서 `toReversed`라는 method가 새로 추가 되었습니다.
```javascript
const arr = [1, 2, 3, 4];

const r_arr = arr.toReversed();

console.log(arr);
// [1, 2, 3, 4]
console.log(r_arr);
// [4, 3, 2, 1]
```
`toReversed()`는 기존값은 변경하지 않고, 리턴하는 Array의 순서만 역전되어집니다.

## toSorted
기존에 주로 사용하였던, Array.prototype.sort():
```javascript
const arr = [3, 4, 2, 1];

const s_arr = arr.sort();

console.log(arr);
// [1, 2, 3, 4]
console.log(s_arr);
// [1, 2, 3, 4]
```
이 또한 기존값인 arr의 순서가 정렬이 되어버렸습니다. 이를 방지하기 위해서 `toSorted()`라는 method가 새로 추가되었습니다.
```javascript
const arr = [3, 4, 2, 1];

const s_arr = arr.toSorted();

console.log(arr);
// [3, 4, 2, 1]
console.log(s_arr);
// [1, 2, 3, 4]
```
`toSorted()`는 기존값은 변경하지 않고, 리턴하는 Array의 순서만 정렬이 되어집니다.

## toSpliced
기존에 주로 사용하였던, Array.prototype.splice():
```javascript
const arr = [3, 4, 2, 1];

const s_arr = arr.splice(1,1, 0);

console.log(arr);
// [3, 0, 2, 1]
console.log(s_arr);
// [4]
```
이 또한 기존값인 arr에서 1번쨰 인덱스의 값이 0으로 변경되었습니다. 이를 방지하기 위해서 `toSpliced()`라는 method가 새로 추가되었습니다.
```javascript
const arr = [3, 4, 2, 1];

const s_arr = arr.toSpliced(1,1, 0);

console.log(arr);
// [3, 4, 2, 1]
console.log(s_arr);
// [3, 0, 2, 1]
```
`toSpliced()`는 기존값은 변경하지 않고, 리턴하는 Array의 1번째 인덱스틔 값만 0으로 변경되었습니다.

## with
기존에는 Array의 특정 인덱스의 요소를 변경하기 위해서는 `splice`를 이용하거나 다른 여러가지 복잡한 방법을 사용해야 했습니다. 
```javascript
const arr = [1, 2, 3, 4];

arr.splice(1, 1, 0);

console.log(arr);
// [1, 0 ,3, 4];
```
물론, 다양한 방법이 있지만, 어떤 방법을 쓰더라도 두 개 이상의 method를 사용하거나 `arr.splice()`처럼 많은 인자를 받아서 기존값을 변경해야 했습니다. 이러한 불편함을 해결하기 위해서 `with` method가 새로 추가 되었습니다.

```javascript
const arr = [1, 2, 3, 4];

const w_arr = arr.with(1, 0);

console.log(arr);
// [1, 2, 3, 4]
console.log(w_arr);
// [1, 0, 3, 4]
```
`with` method를 사용하면 위 처럼 기존값은 변경하지 않고 특정 인덱스의 값을 변경할 수 있습니다.

## findLast
기존의 Array.prototype.find():
```javascript
const arr = [3, 4, 2, 1];

const f = arr.find((a) => {
    console.log('a:', a);
    return a === 1;
});
// a: 3
// a: 4
// a: 2
// a: 1

console.log(arr);
// [3, 4, 2, 1]
console.log(f);
// 1
```
로그가 찍힌 것을 보면, 인덱스가 작은 순서부터 탐색을 수행한 것을 알 수 있습니다. 하지만 요소가 많고 인덱스가 높은 곳에 분포되어 있을 것으로 예상되는 요소를 찾는 경우에는 인덱스가 높은 곳부터 탐색을 수행하는 것이 더 효율적입니다. 그렇기 때문에 `find()` method가 새로 추가되었습니다.

```javascript
const arr = [3, 4, 2, 1];

const f = arr.findLast((a) => {
    console.log('a:', a);
    return a === 1;
});

// a: 1

console.log(arr);
// [3, 4, 2, 1]
console.log(f);
// 1
```
로그를 보면, 인덱스가 높은 곳에서 부터 탐색을 하여 한 번의 탐색으로 원하는 결과를 얻었습니다.

## findLastIndex
기존의 Array.prototype.findIndex():
```javascript
const arr = [3, 4, 2, 1];

const f_i = arr.findIndex((a) => {
    console.log('a:', a);
    return a === 1;
});

// a: 3
// a: 4
// a: 2
// a: 1

console.log(arr);
// [3, 4, 2, 1]
console.log(f_i);
// 3
```
이 또한, 로그가 찍힌 것을 보면, 인덱스가 작은 순서부터 탐색을 수행한 것을 알 수 있습니다. 하지만 위 `find()` 같은 이유로 `findLastIndex()` method가 새로 추가되었습니다.

```javascript
const arr = [3, 4, 2, 1];

const f_l_i = arr.findLastIndex((a) => {
    console.log('a:', a);
    return a === 1;
});

// a: 1

console.log(arr);
// [3, 4, 2, 1]
console.log(f_l_i);
// 3
```
로그를 보면, 인덱스가 높은 곳에서 부터 탐색을 하여 한 번의 탐색으로 원하는 결과를 얻었습니다.
