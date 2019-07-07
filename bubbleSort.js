// 冒泡 for 循环两个 内循环次数 外循环趟数
let arr = [2,6,1,7,12,56,5,8];
function bubbleSort(arr) {
    let temp = null;
    let length = arr.length;
    for(let i = 0;i<length-1;i++) {
        for(let j=0;j< length - i -1;j++ ) {
            if(arr[j]>arr[j+1]) {
                temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp
            }
        }
    }

    return arr;
}
console.log(bubbleSort(arr))// 



// 找基准 分左右两边 递归调用
let arr2 = [2,6,1,7,12,56,5,8];
function quicklySort(arr) {
    if(arr.length <= 1) {
        return arr;
    }
    let leftArr = [];
    let rightArr = [];
    let middleNumber = Math.floor(arr.length/2);
    let middleValue = arr.splice(middleNumber, 1)[0];
    for(let i = 0; i<arr.length;i++) {
        if(arr[i]>=middleValue) {
            rightArr.push(arr[i])
        } else {
            leftArr.push(arr[i])
        }
    }
    return quicklySort(leftArr).concat([middleValue], quicklySort(rightArr))
}

console.log(quicklySort(arr2))// 


// 