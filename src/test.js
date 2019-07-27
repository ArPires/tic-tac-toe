let arr = [1,2,3];

let cop = arr.reduce(function(pre, cur) {return [cur, ...pre]}, [])

console.log(arr.reverse());
