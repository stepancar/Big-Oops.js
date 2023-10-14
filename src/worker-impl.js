console.log('Worker loaded');
 // listen meesage from main thread

onmessage = function (e) {

    const solutionFunction = new Function(e.data.solutionCode);

    const testCaseFunction = new Function(e.data.testCaseCode);

    try {
    const startTime = performance.now();
    const result = testCaseFunction()(solutionFunction(), e.data.data)
    const executionTime = performance.now() - startTime;
    this.postMessage({
        executionTime,
    })
    console.log(typeof result);
    } catch (e) {
        console.log(e);

        this.postMessage({
            executionTime: 0,
            error: e.message
        })
    }
};

// send message to main thread
postMessage('Worker ready');