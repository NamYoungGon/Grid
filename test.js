function sort(list, fn) {  
  return [].concat(list).sort(fn);
}
var sortBy = rightCurry(sort);  // right curried version 

function comparator(fn) {  
    return function(a,b) {
        return fn(a,b) ? -1
            : fn(b,a) ? 1
            : 0;
    };
}

var numbers = [5,1,3,2,4],  
    names = ['River','Zoë','Wash','Mal','Jayne','Book','Kaylee','Inara','Simon'];

function lessThan(a,b) { return a < b; }


var asc = comparator(lessThan);

sortBy(asc)(numbers);  
sortBy(asc)(names);  