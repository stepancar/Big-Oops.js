
/**
 * [1, 2, 3, 4, 5, 6, 7, 8, 9, n]
 */
export function generateFlatArray(n) {
    return Array.from({length: n}, (_, i) => i);
}


/**
 * Generate test data for flatten implementations comparison
 * [
 * [1],
 * [2, 3],
 * [4, 5, 6],
 * [7, 8, 9, 10],
 * [11, 12, 13, n]
 * ]
 */
export function generatePyramid(n) {
    let pyramid = [];
    let count = 1;
    let level = 1;
    while (count <= n) {
        let row = [];
        for (let j = 1; j <= level; j++) {
            if (count > n) {
                break;
            }
            row.push(count);
            count++;
        }
        pyramid.push(row);
        level++;
    }
    return pyramid;
}

/**
 * [
 * [11, 12, 13, n],
 * [7, 8, 9, 10],
 * [4, 5, 6],
 * [2, 3],
 * [1],
 * ]
 */
export function generateReversdePyramid(n) {
    return generatePyramid(n).reverse();
}


/**
 * [
 * [[[[[[[[[[[[[[[1]]]]]]]]]]]]]]],
 * ]
 */
export function generateDeepArray(depth) {
    let res = [];
    for (let i = 0; i < depth; i++) {
        res = [res];
    }
    return res;
}

/**
 * [
 * [0, 1, 2, 3, 4, 5],
 * [1, 2, 3, 4, 5, 6],
 * [2, 3, 4, 5, 6, 7],
 * [3, 4, 5, 6, 7, 8],
 * [4, 5, 6, 7, 8, 9],
 * [5, 6, 7, 8, 9, 10],
 * ]
 */
export function generateSquareMatrix(n) {
    const a = Math.sqrt(n);
    return Array.from({length: a}, (_, i) => Array.from({length: a}, (_, j) => i+j));
}