var express = require('express');
var app = express();

var middleA = function (req, res, next) {
    req.useOne = '应用程序经过了 middleA ';
    res.useOne = 'middleA 处理后的数据 middleA';
    req.paramasQuery = 1;
    res.paramasQueryResult = req.paramasQuery + 1;
    // console.log(req.useOne, req.useTwo, req.useThree);
    next();
}

var middleB = function (req, res, next) {
    req.useTwo = '应用程序又经过了 middleB';
    res.useTwo = 'middleB 处理后的数据 middleB';
    req.paramasQuery += 1;
    res.paramasQueryResult = req.paramasQuery + 1;
    console.log(res.useOne, res.useTwo, res.useThree);
    next();
}

var middleC = function (req, res, next) {
    req.useThree = '应用程序又经过了 middleC';
    res.useThree = 'middleC 处理后的数据 middleC';
    req.paramasQuery += 2;
    res.paramasQueryResult = req.paramasQuery + 1;
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
    res.paramasQueryResult = req.paramasQuery + 1;
    res.send('req.paramasQuery 经过不同的中间件处理后的结果是：' + req.paramasQuery + ', res中paramasQueryResult的累计值为：' + res.paramasQueryResult); // 7 8
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