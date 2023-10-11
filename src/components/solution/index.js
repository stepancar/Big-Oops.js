import { useEffect, useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import CodeEditor from '@uiw/react-textarea-code-editor';
import style from './index.module.css';

export function Solution({ title, code, update }) {
    return (
        <div className={style.container}>
            
            
                    <TextField
                        id="filled-basic"
                        label="Filled"
                        variant="filled"
                        size='small'
                        value={title}
                        onChange={(evn) => {
                            update(code, evn.target.value)
                            
                        }}
                    />
                    <Checkbox defaultChecked />
                
                    <CodeEditor
                        value={code}
                        language="js"
                        placeholder="Please enter JS code."
                        onChange={(evn) => update(evn.target.value, title)}
                        padding={15}
                        style={{
                            fontSize: 14,
                            
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
        </div>
    );
}
