console.log('Worker loaded');
 // listen meesage from main thread

onmessage = function (e) {
    const f = new Function(e.data);
    //
    setTimeout(() => {
        this.postMessage('Worker said: ' + 'echo' + f())
    }, 1000)
};

// send message to main thread
postMessage('Worker ready');