export function createBenchMarks({ title: benchmarkTitle, testCases, implementations}) {
    return {
        async run() {
            const result = [];
            for (let {title: testCaseTitle, data} of testCases) {
                for (let {implementation, name: implementationName} of implementations) {
                    for (let {metadata, data: testData } of data) {

                        const startTime = performance.now();
                        let error = null;
                        try {
                            const r = implementation(testData);
                        } catch (e) {
                            error = e;
                            console.log(e);
                        }

                        const executionTime = performance.now() - startTime;

                        result.push({
                            testCaseTitle,
                            metadata,
                            implementationName,
                            executionTime,
                            error,
                        });
                    }
                }
            }
            
            return result;
        }
    }
}