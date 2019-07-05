## nodejs(这指express） 中间件  
https://www.jianshu.com/p/797a4e38fe77
https://juejin.im/post/5aa345116fb9a028e52d7217

*铺垫*：
一个请求发送到服务器，要经历一个生命周期，服务端要： 监听请求-解析请求-响应请求，服务器在处理这一过程的时候，有时候就很复杂了，将这些复杂的业务拆开成一个个子部分，子部分就是一个个中间件。对于处理请求来说，在响应发出之前，可以对请求和该级响应做一些操作，并且可以将这个处理结果传递给下一个处理步骤   
*express 这样描述中间件的:*
> 执行任何代码。   
> 修改请求和响应对象。  
> 终结请求-响应循环。  
> 调用堆栈中的下一个中间件   

*分类*：
> 应用级中间件  
> 路由级中间件  
> 错误处理中间件  
> 内置中间件  
> 第三方中间件   

举例：
```
 var express = require('express');
 var app = express();
 app.get('/', function(req, res, next) {
    // req 修改请求
    // res 响应对象
    next(); // 当前中间件函数没有结束请求/响应循环， 调用next(), 
           // 将控制权传递给下一个中间件函数继续往下处理，否则页面到此会被挂起
 });
app.get('/end', function(req, res) {
    res.send('程序到我这里就结束了，没有next方法');
})
app.listen(3000);
```
**上面next()的说明: next()函数不是nodejs或者express的函数，而是传递中间件函数的第三变量，它是一个统称，可以为任意名称，为了名称统一，不造成混淆，约定为next()，调用它之后会将调用应用程序中的下一个中间件程序**   

*中间件的使用说明：*

```
 var express = require('express');
 var app = express();
 app.use(requestTime); // 
 var requestTime = function(req,res, next) {
    req.requestTime = new Date().getTime();
    next();
 }

 app.get('/time', function(req, res, next) {
    var timeText = '当前时间为：';
    timeText = timeText + req.requestTime; // 这里的req.requestTime 是上一个中间件函数传递过来的，
    // 一个业务处理流程，多个中间件函数对请求 req进行修改处理，并且通过next() 传递给下一个中间件函数，
    // 这样下面的中间件函数都能拿到上一个中间件函数处理的结果
    res.send(timeText);
 });
app.get('/end', function(req, res) {
    res.send('程序到我这里就结束了，没有next方法');
})
app.listen(3000);

```

下面是多个中间件函数，在各自函数中处理请求和响应的例子：
```
var express = require('express');
var app = express();

var middleA = function (req, res, next) {
    req.useOne = '应用程序经过了 middleA ';
    res.useOne = 'middleA 处理后的数据 middleA';
    req.paramasQuery = 1
    // console.log(req.useOne, req.useTwo, req.useThree);
    next();
}

var middleB = function (req, res, next) {
    req.useTwo = '应用程序又经过了 middleB';
    res.useTwo = 'middleB 处理后的数据 middleB';
    req.paramasQuery += 1;
    console.log(res.useOne, res.useTwo, res.useThree);
    next();
}

var middleC = function (req, res, next) {
    req.useThree = '应用程序又经过了 middleC';
    res.useThree = 'middleC 处理后的数据 middleC';
    req.paramasQuery += 2;
    console.log(res.useOne, res.useTwo, res.useThree);
    console.log(req.paramasQuery);
    next();
}
app.use(middleA);
app.use(middleB);
app.use(middleC);

app.get('/', function(req, res, next) {
    console.log(req.useOne, req.useTwo, req.useThree);
    // 应用程序经过了 middleA  应用程序又经过了 middleB 应用程序又经过了 middleC
    // 上面的req里面的参数就是在 不同的中间件函数中处理出来的
    console.log(res.useOne, res.useTwo, res.useThree);
    // middleA 处理后的数据 middleA middleB 处理后的数据 middleB middleC 处理后的数据 middleC
    // 上面的res的响应参数也是在上面一个个中间件的响应res中逐步处理 累加而得
    req.paramasQuery += 3;
    // req中paramasQuery的参数经过中间不同的中间件函数处理，已经累加到7，
    // 同理对于res 采用相同的处理方式，也可以达到这样的效果
    // 我们以此可以推出，如果处理一个很复杂的程序时，我们一个中间件函数只处理一个步骤，
    // 并且可以把该步骤处理后的结果，传递给下一个中间件函数处理，
    // 一种流水线的处理方式，职责专一，效率很快
    res.send('req.paramasQuery 经过不同的中间件处理后的结果是：' + req.paramasQuery); // 7
})

app.get('/two', function(req,res, next){
    console.log('two a');
    req.pathFirstMiddel = 'function of two middle'
    next();
}, function(req,res, next){
    console.log('two b');
    console.log(req.pathFirstMiddel);
    next();
})

// app.use 全局引入中间件函数， app.get(path, fn,fn); 局部路径引入中间件函数
app.listen(5000, function() {
    console.log('5000 端口启动了')
})

```
总结：
    express 中间件函数，帮助拆解主程序的业务逻辑，并且每一个的中间件函数处理的结果都会传递给下一个中间件函数。想象一下工厂上流水线工人，在清洗一个箱子的一个场景。
    第一个人清洗侧面，第二个人清洗底面，第三个人清洗顶面，。。。，这条流水线结束后，箱子也就清洗干净了。
    各做各的，不相互影响，又彼此协作。
