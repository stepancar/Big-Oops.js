import logo from './logo.svg';


import './App.css';
import { useEffect, useRef, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { flatten as flattenMinin } from './implementations/flatten-minin';
import { flatten as flattenMurich } from './implementations/flatten-murich.js';
import { flatten as flattenMurichToString } from './implementations/flatten-murich-to-string.js';
import { flatten as flattenIterative } from './implementations/flatten-iterative.js'
import { createBenchMarks } from './lib/benchmark.js';
import { generateFlatArray, generatePyramid, generateDeepArray, generateReversdePyramid, generateSquareMatrix } from './generate-test-data'
import { TestCase } from './components/testCase'
import { Solution } from './components/solution'

import { ComparisionChart } from './components/comparisonChart'

function validateFunctionBody(code) {
  if (!code.includes('return')) {
    return false;
  }

  return true;
}

function range(from, to, stepsCount = 1) {
  const increment = (to - from) / stepsCount;
  const res = [];
  for (let i = from; i <= to; i += increment) {
    res.push(i);
  }
  return res;
}

function testRunner(testCases, solutions) {
  return {
    async run(callback) {
      const results = [];
      for (let testCase of testCases) {
        const generateDataCodeFunction = new Function(testCase.generateDataCode);

        const dataSizes = range(testCase.minInputSize, testCase.maxInputSize, testCase.stepsCount);

        const testCaseFunction = new Function(testCase.code);
        for (let dataSize of dataSizes) {
          const data = generateDataCodeFunction()({ n: dataSize });

          for (let solution of solutions) {

            const solutionFunction = new Function(solution.code);

            const startTime = performance.now();
            const result = testCaseFunction()(solutionFunction(), data);
            console.log(typeof result);
            const endTime = performance.now();

            const perfResult = {
              solutionId: solution.id,
              testCaseId: testCase.id,
              dataSize,
              executionTime: endTime - startTime,
            };

            results.push(perfResult);

            callback([...results]);

            await new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 1);
            })
          }
        }
      }
    }
  }
}

function getDataForTestCase(testCase, results, solutions) {
  const groupedBySolution = results.filter(({ testCaseId }) => testCase.id === testCaseId).reduce((acc, result) => {
    acc[result.solutionId] = acc[result.solutionId] || [];
    acc[result.solutionId].push(result);
    return acc;
  }, {});

  return {
    title: testCase.title,
    datasets: Object.entries(groupedBySolution).map(([solutionId, data]) => {
      const solution = solutions.find(({ id }) => id === solutionId);

      return {
        label: solution.title,
        data: data.map(({ executionTime, dataSize }) => ({ executionTime, dataSize })),
        parsing: {
          yAxisKey: 'executionTime',
          xAxisKey: 'dataSize',
        }
      }
    })
  }
}


function App() {
  const [solutions, setSolutions] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [results, setResults] = useState([]);


  async function handlePlayClick() {
    testRunner(testCases, solutions).run((results) => {
      setResults(results);
    });
  }


  function addSolution() {
    solutions.push({
      id: Date.now().toString() + Math.random().toString(),
      code: `return (arr) => {}`,
      title: `solution ${solutions.length + 1}`,
    });

    setSolutions([...solutions]);
  }

  function setSolution({ id, code, title }, index) {
    solutions[index] = {
      id,
      code,
      title,
    };

    setSolutions([...solutions]);
  }

  function addTestCase() {
    testCases.push({
      id: Date.now().toString() + Math.random().toString(),
      code: 'return (fn, { arr }) => fn(arr)',
      generateDataCode: 'return ({n}) => ({ arr: Array.from({length: n}, (_, i) => i) })',
      title: `test case ${testCases.length + 1}`,
      minInputSize: 0,
      maxInputSize: 1000,
      stepsCount: 10,
    });
    setTestCases([...testCases]);
  }

  function setTestCase({ id, code, title, minInputSize, maxInputSize, generateDataCode, stepsCount }, index) {
    testCases[index] = {
      id,
      code,
      generateDataCode,
      title,
      minInputSize,
      maxInputSize,
      stepsCount,
    };
    setTestCases([...testCases]);
  }

  function onRemoveTestCaseClick(index) {
    testCases.splice(index, 1);
    setTestCases([...testCases]);
  }

  useEffect(() => {
    setTimeout(() => {
      const str = JSON.stringify({
        solutions,
        testCases,
      });
      localStorage.setItem('code', str);
      window.location.hash = `#code/${encodeURIComponent(str)}`;
    }, 100);
  }, [solutions, testCases])

  useEffect(() => {
    // read parameter code from url  play?#code/PTAEHUFM
    const str = window.location.hash.split('/')[1];
    if (!str) {
      if (localStorage.getItem('code')) {
        const data = JSON.parse(localStorage.getItem('code'))

        setSolutions(data.solutions);
        setTestCases(data.testCases);
      }
      return;
    }
    const data = JSON.parse(decodeURIComponent(str));

    setSolutions(data.solutions);
    setTestCases(data.testCases);
  }, []);



  useEffect(() => {


    // const benchmark = createBenchMarks({
    //   title: 'flatten implementations comparison',
    //   testCases: [
    //     {
    //       title: '1 level flat array',
    //       data: [
    //         ...(range(1000, 2000000, 10).map(n => ({
    //           metadata: {
    //             n,
    //           },
    //           data: generateFlatArray(n),
    //         })))
    //       ]
    //     },
    //     // {
    //     //     title: 'n level deep array with 1 element',
    //     //     data: [
    //     //         ...(range(100, 20000, 10).map(n => ({
    //     //             metadata: {
    //     //                 n,
    //     //             },
    //     //             data: generateDeepArray(n),
    //     //         })))
    //     //     ]
    //     // },
    //     {
    //       title: 'n square matrix',
    //       data: [
    //         ...(range(0, 200000, 10).map(n => ({
    //           metadata: {
    //             n,
    //           },
    //           data: generateSquareMatrix(n),
    //         })))
    //       ]
    //     },
    //     {
    //       title: '2 level deep array, each level has one more element',
    //       data: [
    //         ...(range(0, 200000, 10).map(n => ({
    //           metadata: {
    //             n,
    //           },
    //           data: generatePyramid(n),
    //         })))
    //       ]
    //     },
    //     // {
    //     //     title: '2 level deep array, each level has one more element',
    //     //     data: [
    //     //         ...(range(0, 4000000, 10).map(n => ({
    //     //             metadata: {
    //     //                 n,
    //     //             },
    //     //             data: generateReversdePyramid(n),
    //     //         })))
    //     //     ]
    //     // }
    //   ],

    //   implementations: [
    //     {
    //       name: 'minin',
    //       implementation: (data) => {
    //         return flattenMinin(data);
    //       }
    //     },
    //     {
    //       name: 'murich to string',
    //       implementation: (data) => {
    //         return flattenMurichToString(data);
    //       }
    //     },
    //     {
    //       name: 'stepan iterative',
    //       implementation: (data) => {
    //         return flattenIterative(data);
    //       }
    //     },
    //     {
    //       name: 'murich recursive shit',
    //       implementation: (data) => {
    //         return flattenMurich(data);
    //       }
    //     },
    //   ],
    // });

  });

  return (
    <div className="App">
      <button onClick={() => addSolution('function a() {}', 'new one')}>Add solution</button>

      <div>
        <Fab variant="extended"
          onClick={handlePlayClick}
        >
          <PlayCircleIcon sx={{ mr: 1 }} />
          Run
        </Fab>

        <Fab variant="extended">
          <ShareIcon sx={{ mr: 1 }} />
          Share
        </Fab>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={10} md={8} lg={7}>
            <div className='solutions'>
              {solutions.map((solution, index) => (
                <Solution
                  key={solution.id}
                  {...solution}
                  update={(solution) => setSolution(solution, index)}
                />
              ))}
            </div>
          </Grid>

        </Grid>

        <Grid container spacing={2}>

          <Grid item xs={12} sm={12} md={12} lg={12}>

            <div className='testCases'>
              {testCases.map((testCase, index) => (
                <div>
                  <Grid item xs={12} sm={10} md={8} lg={7} direction={'row'} >
                    <TestCase
                      key={testCase.id}
                      {...testCase}
                      update={(testCase) => setTestCase(testCase, index)}
                    />
                    <Grid item alignSelf={'center'} justifySelf={'center'}>
                      <Fab
                        onClick={() => onRemoveTestCaseClick(index)}
                      >
                        <DeleteIcon />
                      </Fab>

                      <Fab
                        onClick={() => handlePlayClick(index)}
                      >
                        <PlayCircleIcon />
                      </Fab>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={10} md={8} lg={7}>
                    <ComparisionChart
                      title={testCase.title}
                      datasets={[...getDataForTestCase(testCase, results, solutions).datasets]}
                    />
                  </Grid>
                </div>
              ))}
            </div>
          </Grid>

          <Fab variant="extended"
            onClick={addTestCase}
          >
            <PlayCircleIcon sx={{ mr: 1 }} />
            Add test case
        </Fab>
        </Grid>
      </div>
    </div >
  );
}

export default App;



// export default ({n}) => ({
//   arr: generatePyramid(n),
// })


// function flatten(array) {
//   const res = [];
//   for (let i = 0; i < array.length; i++) {
//       if (Array.isArray(array[i])) {
//           const flat = flatten(array[i]);
//           for (let j = 0; j < flat.length; j++) {
//               res.push(flat[i]);
//           }
//       }
//       else {
//           res.push(array[i]);
//       }
//   }
//   return res;
// }

// return (arr) => {
//   return flatten(arr)
// }



// function generatePyramid(n) {
//   let pyramid = [];
//   let count = 1;
//   let level = 1;
//   while (count <= n) {
//       let row = [];
//       for (let j = 1; j <= level; j++) {
//           if (count > n) {
//               break;
//           }
//           row.push(count);
//           count++;
//       }
//       pyramid.push(row);
//       level++;
//   }
//   return pyramid;
// }

// return ({n}) => ({
//   arr: generatePyramid(n),
// })

// return (fn, { arr }) => {
//   return fn(arr);
// }