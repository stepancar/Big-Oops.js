import './App.css';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import ShareIcon from '@mui/icons-material/Share';
import { TestCase } from './components/testCase'
import { Solution } from './components/solution'

import { ComparisionChart } from './components/comparisonChart'
import { executeTestInMainThread, generateTestDataInMainThread } from './executors'
import worker from 'workerize-loader!./worker'; // eslint-disable-line import/no-webpack-loader-syntax
import implWorker from 'workerize-loader!./worker-impl'; // eslint-disable-line import/no-webpack-loader-syntax

const testDataWorkerInstance = worker()
const testRunnerWorkerInstance = implWorker()

const iterationCount = 1;

function range(from, to, stepsCount = 1) {
  const increment = (to - from) / stepsCount;
  const res = [];
  for (let i = from; i <= to; i += increment) {
    res.push(i);
  }
  return res;
}

/**
 * Generates test data in a web worker in order to prevent affecting main thread
 */
async function generateData(implementationCode, data) {
  return generateTestDataInMainThread({ implementationCode, data })
  // return testDataWorkerInstance.generateTestData({ implementationCode, data });
}


async function runTestForSolution(solutionCode, testCaseCode, data) {
  return executeTestInMainThread({ solutionCode, testCaseCode, data })
  // return testRunnerWorkerInstance.executeTest({
  //   solutionCode,
  //   testCaseCode,
  //   data
  // });
}

function testRunner(testCases, solutions) {
  return {
    async run(callback) {
      const results = [];
      for (let testCase of testCases) {

        const dataSizes = range(testCase.minInputSize, testCase.maxInputSize, testCase.stepsCount);

        for (let dataSize of dataSizes) {

          const data = await generateData(testCase.generateDataCode, { n: dataSize });

          for (let solution of solutions) {

            await new Promise((resolve) => {
              setTimeout(() => {
                resolve();
              }, 10);
            })
            try {

              let error = null;
              let executionTime = 0;
              for (let i = 0; i < iterationCount; i++) {
                const result = await runTestForSolution(solution.code, testCase.code, data);
                error = result.error;
                executionTime += result.executionTime;
              }

              executionTime /= iterationCount;

              const perfResult = {
                solutionId: solution.id,
                testCaseId: testCase.id,
                dataSize,
                executionTime,
                error
              };

              results.push(perfResult);

              callback([...results]);
            } catch (e) {
              console.log(e);
            }
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
      const firstResultWithError = data.find(({ error }) => error);

      return {
        label: solution.title + (firstResultWithError ? ` (${firstResultWithError.error}) after  ${firstResultWithError.dataSize}` : ''),
        data: data.filter(({ error }) => !error).map(({ executionTime, dataSize }) => ({ executionTime, dataSize })),
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


  async function runTest(ids) {
    testRunner(
      testCases.filter(({ id }) => ids.includes(id)),
      solutions.filter(({ include }) => include)
    ).run((newResults) => {
      setResults([...results.filter(({ testCaseId }) => !ids.includes(testCaseId)), ...newResults]);
    });
  }

  function addSolution(index) {
    solutions.splice(index, 0, {
      id: Date.now().toString() + Math.random().toString(),
      code: `// define your solution here\nfunction fn(arr) {\n  console.log(arr)\n}\n\nreturn (arr) => {\n  return fn(arr)\n}`,
      title: `solution ${solutions.length + 1}`,
      include: true,
    });

    setSolutions([...solutions]);
  }

  function shareLink() {
    const url = window.location.href
    navigator.clipboard.writeText(url);
  }

  function setSolution({ id, code, title, include }, index) {
    solutions[index] = {
      id,
      code,
      title,
      include,
    };

    setSolutions([...solutions]);
  }

  function addTestCase(index) {
    testCases.splice(index, 0, {
      id: Date.now().toString() + Math.random().toString(),
      code: '// pass test data into solution\n\nreturn (solution, { arr }) => solution(arr)',
      generateDataCode: '// generate test data for input size\n\nreturn ({n}) => ({ arr: Array.from({length: n}, (_, i) => i) })',
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

  function onRemoveTestCaseClick(testCaseId) {
    setTestCases(testCases.filter(({ id }) => id !== testCaseId));
    setResults(results.filter((r) => r.testCaseId !== testCaseId));
  }

  function onRemoveSolutionClick(solutionId) {
    setSolutions(solutions.filter(({ id }) => id !== solutionId));
    setResults(results.filter((r) => r.solutionId !== solutionId));
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

  return (
    <div >
      <header className='header'>
        <h1>Big O(ops.js)</h1>
        <span><i>aka Балабол js</i></span>
      </header>
      <div className='App'>
        <div className='shareButton'>
          <Fab variant="extended" onClick={shareLink}>
            <ShareIcon sx={{ mr: 1 }} />
            Share Comparison
          </Fab>
        </div>

        <Grid container wrap={'wrap'} direction={'column'} xl={11} lg={11} >
          <h2>Solutions to compare</h2>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className='solutions'>
                {solutions.map((solution, index) => (
                  <div className='solutionContainer'>
                    <Solution
                      key={solution.id}
                      {...solution}
                      update={(solution) => setSolution(solution, index)}
                      onRemoveSolutionClick={() => onRemoveSolutionClick(solution.id)}
                    />
                    <div>
                      <button onClick={() => addSolution(index + 1)}>
                        add new solution
                      </button>
                    </div>
                  </div>
                ))}
                {solutions.length === 0 && (
                  <div>
                    <button onClick={() => addSolution(1)}>
                      add new solution
                    </button>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>

          <h2>Test cases</h2>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className='testCases'>
                {testCases.map((testCase, index) => (
                  <div>
                    <TestCase
                      key={testCase.id}
                      {...testCase}
                      runTest={() => runTest([testCase.id])}
                      onRemoveTestCaseClick={() => onRemoveTestCaseClick(testCase.id)}
                      update={(testCase) => setTestCase(testCase, index)}
                    >
                      <ComparisionChart
                        title={testCase.title}
                        datasets={[...getDataForTestCase(testCase, results, solutions).datasets]}
                      />
                    </TestCase>
                    <div>
                      <button onClick={() => addTestCase(index + 1)}>
                        add new test case
                      </button>
                    </div>
                  </div>
                ))}
                {testCases.length === 0 && (
                  <div>
                    <button onClick={() => addTestCase(1)}>
                      add new test case
                    </button>
                  </div>
                )}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className='footer'>
        <div className='footerText'>
          <p>Created by <a href='https://github.com/stepancar' target='_blank'>Stepan Mikhailiuk</a></p>
        </div>
      </div>
    </div >
  );
}

export default App;
