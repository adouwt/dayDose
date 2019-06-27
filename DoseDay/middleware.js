let app = {
    use: function (req, fn) {
        if(req) {
            m = req;
            if(m == 'get' || m == 'GET') {
                console.log('get')
                fn();
                this.next();
            } 
            if(m == 'post' || m == 'POST') {
                console.log('post');
                fn();
                this.next();
            } 
        }
    },
    next: function () {
        // return this.use();
    }
}

app.use('get', function(){
    console.log('get路由被检测到了，要执行get 对应的方法')
})

app.use('post', function(){
    console.log('post路由被检测到了，要执行post 对应的方法')
})