### throttle 节流
#### 任务频繁触发，任务触发的间隔超过指定间隔的时候任务才执行；   
### 简单方法：
> function throttle(fn, time = 300) {
>    if(typeof fn !== "Function") {
>       return
>  }
> let canRun = true;
    >return function(){
     >   if(!canRun) { return};
      >  canRun = false;
       > setTimeout(function(){
        >    fn.call(this, ...argumnets);
        >   canRun = true;
        >}, time)
    >}
>}


### debounce 防抖

#### 指定间隔内 只执行一次， 如： fn 再一定时间内 只执行一次，而不是连续执行

function Debounce(fn, time = 500) {
    if(typeof fn !== "Function" ) {
        return;
    }
    return function(){
        let timeOut = setTimeOut(function(){
            fn.call(this, ...arguments);
            clearTimeout(timeOut)
        }, time)
    }
}

debounce(function(){$.post('url',{},function(res){
    console.log(res)
})
