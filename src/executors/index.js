export async function executeTestInMainThread({ solutionCode, testCaseCode, data }) {
    const solutionFunction = new Function(solutionCode);

    const testCaseFunction = new Function(testCaseCode);

    try {
        const startTime = performance.now();
        const result = testCaseFunction()(solutionFunction(), data)
        const executionTime = performance.now() - startTime;
        console.log(typeof result);
        return {
            executionTime,
        }
    } catch (e) {
        console.log(e);

        return {
            executionTime: 0,
            error: e.message
        }
    }
}

export async function generateTestDataInMainThread({ implementationCode, data }) {
    const f = new Function(implementationCode);

    return f()(data);
}
