import { useEffect, useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CodeEditor from '@uiw/react-textarea-code-editor';
import style from './index.module.css';

export function Solution({ update, ...rest }) {
    return (
        <div className={style.container}>
            <TextField
                id="filled-basic"
                label="Filled"
                variant="filled"
                size='small'
                value={rest.title}
                onChange={(evn) => {
                    update({
                        ...rest,
                        title: evn.target.value,
                    });
                }}
            />
            <Checkbox defaultChecked />

            <CodeEditor
                value={rest.code}
                language="js"
                placeholder="Please enter JS code."
                onChange={(evn) => update({
                    ...rest,
                    code: evn.target.value,
                })}
                padding={15}
                style={{
                    fontSize: 14,

                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
        </div>
    );
}
