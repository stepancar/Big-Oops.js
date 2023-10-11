export function flatten(array) {
    var res = [];
    var isArray = Array.isArray;

    var top = new NestedIterator(null, array);

    while (top) {
        if (top.hasNext()) {
            var val = top.next();
            if (isArray(val)) {
                var newTop = new NestedIterator(top, val);
                top = newTop;
            } else {
                res.push(val);
            }
        } else {
            top = top.prev;
        }
    }

    return res;
}

class NestedIterator {
    constructor(prev, list) {
        this.index = -1;
        this.list = list;
        this.prev = prev;
    }

    hasNext() {
        return this.index < this.list.length - 1;
    }

    next() {
        const val = this.list[++this.index];
        return val;
    }
}