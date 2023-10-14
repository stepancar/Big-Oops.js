function flatten(array) {
    var res = [];
    var isArray = Array.isArray;

    var stack = [array[Symbol.iterator]()];

    while (stack.length) {
        var top = stack.pop()
        for (var val of top) {
            if (isArray(val)) {
                stack.push(top);
                stack.push(val[Symbol.iterator]());
                break
            } else {
                res.push(val);
            }
        }
    }

    return res;
}