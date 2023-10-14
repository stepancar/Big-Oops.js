import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CodeEditor from '@uiw/react-textarea-code-editor';
import style from './index.module.css';
import { InputSize } from './inputSize'

export function TestCase({ update, onRemoveTestCaseClick, runTest, children, ...rest }) {
    const testCase = {
        ...rest
    };

    return (
        <div className={style.container}>
            <div className={style.toolbox}>
                <Fab
                    onClick={onRemoveTestCaseClick}
                >
                    <DeleteIcon />
                </Fab>

                <Fab
                    onClick={runTest}
                >
                    <PlayCircleIcon />
                </Fab>
            </div>


            <div className={style.main}>
                <Grid container direction={'row'} justifyContent={'space-between'} >
                    <TextField
                        id="filled-basic"
                        label="test case title"
                        variant="filled"
                        size='medium'
                        fullWidth
                        value={testCase.title}
                        onClick={(evn) => evn.stopPropagation()}
                        onChange={(evn) => {
                            update({
                                ...testCase,
                                title: evn.target.value,
                            })
                            evn.stopPropagation();
                        }}
                    />

                    <InputSize
                        min={testCase.minInputSize}
                        max={testCase.maxInputSize}
                        stepsCount={testCase.stepsCount}
                        update={(value) => update({
                            ...testCase,
                            minInputSize: value.min,
                            maxInputSize: value.max,
                            stepsCount: value.stepsCount,
                        })}
                    />

                </Grid>
                <CodeEditor
                    value={testCase.generateDataCode}
                    language="js"
                    placeholder="Please enter JS code."
                    onChange={(evn) => update({
                        ...testCase,
                        generateDataCode: evn.target.value
                    })}
                    padding={15}
                    style={{
                        fontSize: 14,
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                />

                <CodeEditor
                    value={testCase.code}
                    language="js"
                    placeholder="Please enter JS code."
                    onChange={(evn) => update({
                        ...testCase,
                        code: evn.target.value
                    })}
                    padding={15}
                    style={{
                        fontSize: 14,

                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
                />

                {children}
            </div>
        </div>
    );
}
