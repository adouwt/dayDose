下列代码：
```
async function async1() {
  console.log('async1 start',2);
  await async2();
  console.log('async1 end', 6);
}
async function async2() {
  console.log('async2',3);
}
console.log('script start', 1);
setTimeout(function() {
  console.log('setTimeout', 8);
}, 0);
async1();
new Promise(function(resolve) {
  console.log('promise1', 4);
  resolve();
}).then(function() {
  console.log('promise2', 7);
});
console.log('script end', 5);

```

```
const p1 = new Promise((resolve, reject) => {
  console.log('promise1', 1);
  resolve();
})
  .then(() => {
    console.log('then11', 3);
    new Promise((resolve, reject) => {
      console.log('promise2', 4);
      resolve();
    })
      .then(() => {
        console.log('then21', 6);
      })
      .then(() => {
        console.log('then23', 8);
      });
  })
  .then(() => {
    console.log('then12', 7);
  });

const p2 = new Promise((resolve, reject) => {
  console.log('promise3', 2);
  resolve();
}).then(() => {
  console.log('then31', 5);
});

```

```
const p1 = new Promise((resolve, reject) => {
  console.log('promise1', 1);
  resolve();
})
  .then(() => {
    console.log('then11', 2); 
    return new Promise((resolve, reject) => {
      console.log('promise2',3); // 
      resolve();
    })
      .then(() => {
        console.log('then21', 4); // 
      })
      .then(() => {
        console.log('then23', 5); // 
      });
  })
  .then(() => {
    console.log('then12', 6); //
  });
```
### 事件循环
1. js 是单线程的
2. 执行栈
3. 任务队列， 宏任务 微任务

    - 调用方法时候，js会生成这个方法的一个执行环境，这个执行环境包括作用域，上层作用域，参数方法，变量，this 指向等，因为js 是单线程的，要顺序执行这些东西，顺序放置这些对象的东西就是 执行栈。
    - 调用方法时候，先判断是同步的还是异步的，同步的放进执行栈中执行，异步（执行的结果）放进任务队列中；当执行栈为空的时候，就会从
    任务队列中，拿取任务放进执行栈中执行
    - 反复 将任务队列中的内容放进执行栈中执行，这一个反复循环操作，就是事件循环


宏任务： setTimeout  setInterval io http
微任务： promise.then（） process.nextTick (Node.js)