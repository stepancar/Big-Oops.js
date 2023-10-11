export function flatten(array) {
    var res = [];
    var isArray = Array.isArray;

    for (var val of array) {
        if (isArray(val)) {
            res = res.concat(flatten(val));
        }
        else {
            res.push(val);
        }
    }
    return res;
}
