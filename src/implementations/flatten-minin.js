export function flatten(array) {
    const res = [];
    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i])) {
            const flat = flatten(array[i]);
            for (let j = 0; j < flat.length; j++) {
                res.push(flat[j]);
            }
        }
        else {
            res.push(array[i]);
        }
    }
    return res;
}

