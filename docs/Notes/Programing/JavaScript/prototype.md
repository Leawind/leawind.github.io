# 原型

::: code-group

```js [new]
class Dad {}
class Son extends Dad {}
class Gon extends Son {}
const dad = new Dad();
const son = new Son();
const gon = new Gon();
const obj = {};
const funct = new Function();
function fun() {}
const f = new fun();
const lam = () => {};
```

```js [old]
function Dad() {}
function Son() {}
Son.__;
```

:::

| ``                      | `arr`             | `Object`                      | `funct`          | `Function`           | `obj`              | `fun`                | `f`                    | `lam`                | `Dad`                | `Son`           | `Gon`           | `dad`           | `son`           | `gon`           |
| ----------------------- | ----------------- | ----------------------------- | ---------------- | -------------------- | ------------------ | -------------------- | ---------------------- | -------------------- | -------------------- | --------------- | --------------- | --------------- | --------------- | --------------- |
| Expression              | `[]`              | `Object`                      | `new Function()` | `Function`           | `{}`               | `function(){}`       | `new (function(){})()` | `()=>{}`             | `class Dad{}`        | `class Son{}`   | `class Gon{}`   | `new Dad()`     | `new Son()`     | `new Gon()`     |
| `x.__proto__`           | `Array.prototype` | `Function.__proto__`          | ``               | `Function.prototype` | `Object.prototype` | `Function.prototype` | `fun.prototype`        | `Function.prototype` | `Function.prototype` | `Dad`           | `Son`           | `Dad.prototype` | `Son.prototype` | `Gon.prototype` |
| `x.prototype`           | `undefined`       | `[Object: null prototype] {}` | ``               | `Function.__proto__` | `undefined`        | `{}`                 | `undefined`            | `undefined`          | `{}`                 | `Dad {}`        | `Son {}`        | `undefined`     | `undefined`     | `undefined`     |
| `x.prototype.__proto__` | ``                | ``                            | ``               | `Object.prototype`   | ``                 | `Object.prototype`   | ``                     | ``                   | `Object.prototype`   | `Dad.prototype` | `Son.prototype` | ``              | ``              | ``              |
| `x.prototype.prototype` | ``                | `undefined`                   | ``               | `undefined`          | ``                 | ``                   | ``                     | ``                   | `undefined`          | `undefined`     | `undefined`     | ``              | ``              | ``              |
| ``                      | ``                | ``                            | ``               | ``                   | ``                 | ``                   | ``                     | ``                   | ``                   | ``              | ``              | ``              | ``              | ``              |

## Usage
