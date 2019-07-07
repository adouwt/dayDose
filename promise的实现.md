new promise((resolve, reject) => {
    resolve(1);
    reject(2);
})
.then()
.catch()
.done()

状态： pending fulfilled rejected
方法： resolve() reject() then() catch() 

class MyPromise{
    constructor(fn) {
        this.resolveQue = [];
        this.rejectQue = [];
        this.state = "PENDDING";
        this.value = '';
        fn(this.resolve.bind(this), this.reject.bind(this));
    }

    resolve(value){
        if(this.state == "PEDDING") {
            this.state = "FULFILLED";
            this.value = value;
            this.resolveQue.forEach(cb => cb());
        }
    }

    reject(value){
        if(this.state == "PEDDING") {
            this.state = "REJECTED";
            this.value = value;
            this.rejectQue.forEach(cb => cb());
        }
    }

    then(resolve = function(){}, reject = function(){}){
        if(this.state == "PEDDING") {
            this.resolveQue.push(resolve);
            this.rejectQue.push(reject);
        }

        if(this.state == "FULLFILED") {
            resolve(this.value);
        }
        if(this.state == "REJECTED"){
            reject(this.value);
        }
    }
}

new MyPromise((resolve, reject)=>{
    resolve(22)
}).then(res => {
    console.log(res);// 22
})


