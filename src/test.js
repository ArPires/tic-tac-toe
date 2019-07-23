let result = "";
let arr = [];
/* 
for(let i = 0; i < 9; i++) {
    if(i % 3 !== 0) {
        continue;
    }
    arr.push("test");
    arr.push(i);
    arr.push(i + 1);
    arr.push(i + 2);
} */
function loop(n) {
    let arr = [];
    for(let i = n; i < n + 3; i++){
        arr.push("{this.renderSquare(" + i + ")}")
    }
    return arr;
}

[0,3,6].forEach(a => arr.push("<div>" + loop(a) + "</div>"));

console.log(arr);