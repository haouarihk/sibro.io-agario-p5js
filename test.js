class Example {
    constructor(i){
        this.value=i;
    }

    incr(){
        this.value +=10;
    }

}

let arr=[]
for (let index = 0; index <10; index++) {
    arr.push(new Example(index))
}

arr.forEach(e=>e.value+=10)

console.log(arr)