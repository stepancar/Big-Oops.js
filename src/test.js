import { flatten as flattenMinin } from './implementations/flatten-minin.js';
import { flatten as flattenMurich } from './implementations/flatten-murich.js';
import { flatten as flattenMurichToString } from './implementations/flatten-murich-to-string.js';
import { flatten as flattenIterative } from './implementations/flatten-iterative.js'
import { createBenchMarks } from './lib/benchmark.js';
import { generateFlatArray, generatePyramid, generateDeepArray, generateReversdePyramid, generateSquareMatrix } from './generate-test-data.js';

var worker = new Worker('worker.js');
worker.addEventListener('message', function(e) {
    console.log('Worker said: ', e.data);
});
worker.postMessage('return 2'); // Send data to our worker.
function range(from, to, stepsCount = 1) {
    const increment = (to - from) / stepsCount;
    const res = [];
    for (let i = from; i <= to; i += increment) {
        res.push(i);
    }
    return res;
}

const benchmark = createBenchMarks({
    title: 'flatten implementations comparison',
    testCases: [
        // {
        //     title: '1 level flat array',
        //     data: [
        //         ...(range(1000, 10000000, 10).map(n => ({
        //             metadata: {
        //                 n,
        //             },
        //             data: generateFlatArray(n),
        //         })))
        //     ]
        // },
        // {
        //     title: 'n level deep array with 1 element',
        //     data: [
        //         ...(range(100, 20000, 10).map(n => ({
        //             metadata: {
        //                 n,
        //             },
        //             data: generateDeepArray(n),
        //         })))
        //     ]
        // },
        {
            title: 'n square matrix',
            data: [
                ...(range(0, 4000000, 10).map(n => ({
                    metadata: {
                        n,
                    },
                    data: generateSquareMatrix(n),
                })))
            ]
        },
        // {
        //     title: '2 level deep array, each level has one more element',
        //     data: [
        //         ...(range(0, 10000000, 10).map(n => ({
        //             metadata: {
        //                 n,
        //             },
        //             data: generatePyramid(n),
        //         })))
        //     ]
        // },
        // {
        //     title: '2 level deep array, each level has one more element',
        //     data: [
        //         ...(range(0, 4000000, 10).map(n => ({
        //             metadata: {
        //                 n,
        //             },
        //             data: generateReversdePyramid(n),
        //         })))
        //     ]
        // }
    ],

    implementations: [
        // {
        //     name: 'minin',
        //     implementation: (data) => {
        //         return flattenMinin(data);
        //     }
        // },
        // {
        //     name: 'murich to string',
        //     implementation: (data) => {
        //         return flattenMurichToString(data);
        //     }
        // },
        
        {
            name: 'stepan iterative',
            implementation: (data) => {
                return flattenIterative(data);
            }
        },
        {
            name: 'murich recursive shit',
            implementation: (data) => {
                return flattenMurich(data);
            }
        },
    ],
});

const perfResults = []// await benchmark.run();

const testCases = perfResults.reduce((acc, data) => {
    const {testCaseTitle }= data;
    acc[testCaseTitle] = acc[testCaseTitle] || [];
    acc[testCaseTitle].push(data);
    return acc;
}, {});

function groupByImplementationName(testCases) {
    return testCases.reduce((acc, data) => {
        const {implementationName }= data;
        acc[implementationName] = acc[implementationName] || [];
        acc[implementationName].push(data);
        return acc;
    }, {});
}

Object.keys(testCases).forEach((testCaseName) => {
    const testCase = testCases[testCaseName];
    const groupedByImplementationName = groupByImplementationName(testCase);
    const labels = Object.keys(groupedByImplementationName);

    const datasets = labels.map((label) => {
        const data = groupedByImplementationName[label];
        return {
            label,
            data: data.map(({executionTime, metadata }) => ({ executionTime, metadata })),
            parsing: {
                yAxisKey: 'executionTime',
                xAxisKey: 'metadata.n',
            }
        }
    });

    const canvas = document.createElement('canvas');
    document.getElementById('chartsContainer').appendChild(canvas);

    new Chart(canvas, {
        title: testCaseName,
        type: 'line',
        data: {
            datasets,
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
});