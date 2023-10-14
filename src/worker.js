console.log('Worker loaded');
 // listen meesage from main thread


export async function generateTestData({ implementationCode, data }) {
    const f = new Function(implementationCode);

    return f()(data);
}
