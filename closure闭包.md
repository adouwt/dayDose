### 闭包
作用域 作用域链

- 函数和创建这个函数的词法环境， 这个词法环境是这个闭包函数能能访问所有的局部变量
- 外在表现： 函数外部可以拿到函数内部的变量

如何创建一个closure 函数？   
创建一个函数A，这个函数A返回一个函数B，函数B 返回一个变量，这个变量就是我们在外面需要访问的内部变量：
创建一个累加器：
```
// 构造函数的方式
function closureA () {
    var count = 0;
    return function(){
        return ++count;
    }
}

var firstUse = closureA();
console.log(firstUse()); //1
console.log(firstUse()); // 2

// 对象原型的方式
function closureB (age=4) {
    this.age = age;
}
closureB.prototype.add = function(){
    return ++ this.age;
}
var a = new closureB();
console.log(a.add()); // 5
console.log(a.add()); // 6


// es6 class static
class closure {
    static countAdd(n=8) {
        return ++n;
    }

    add(count) {
        return ++count;
    }
}
closure.countAdd();
console.log(closure.countAdd(), '1次'); // 9
console.log(closure.countAdd(), '2次'); // 9

var add = new closure();

console.log('count is '+add.add(1)) // 2
console.log('count is '+add.add(2)) // 3

```

