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

// 对象的方式
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