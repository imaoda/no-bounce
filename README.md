## 简介

移除 ios 内部 div 滚动到头后无法回滚的问题 

## ios bug 描述

问题复现步骤：

1. 内部 div 滚动 *(带丝滑滚动属性 `-webkit-overflow-scrolling: touch;`)*
2. 滚动到头，停 2s 不操作
3. 继续向下拉扯，扯出顶部的橡皮筋后，立即反向拉扯，此时滚轮失效，而是直接拉的整个页面

## 使用

```js
import noBounce from 'no-bounce'
// 判断 UA 为 ios 则执行即可
noBounce()
```

## 解决原理

1. 在 body 上绑定触摸事件
2. touchstart 时，判断 e.target 以及递归其所有父元素，是否存在向上滚动的空间，如果没有，则阻止向上 touchmove 的默认行为

> 由于只在 touchstart 里递归判断，对性能影响很小

> 注：在一次 touchstart 到 touchend 的周期中，一开始 preventDefault 后面想恢复也不可以，不能精细到每一次 event