console.log('Worker loaded');
 // listen meesage from main thread

onmessage = function (e) {
    const f = new Function(e.data.implementationCode);

    this.postMessage(f()(e.data.data))
};

// send message to main thread
postMessage('Worker ready');