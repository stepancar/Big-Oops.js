import React from 'react';

import Fab from '@mui/material/Fab';
import CopyIcon from '@mui/icons-material/CopyAll';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';


import Checkbox from '@mui/material/Checkbox';
import CodeEditor from '@uiw/react-textarea-code-editor';
import style from './index.module.css';

export function Solution({ update, onRemoveSolutionClick, ...rest }) {
    function handleCopyClick() {
        navigator.clipboard.writeText(rest.code);
    }
    return (
        <div className={style.container}>
            <div className={style.toolbox}>
                <Fab
                    title='delete'
                    onClick={onRemoveSolutionClick}
                >
                    <DeleteIcon />
                </Fab>

                <Fab
                    title='copy'
                    onClick={handleCopyClick}
                >
                    <CopyIcon />
                </Fab>
                <Fab
                    title='include to comparison'
                >
                    <Checkbox
                        title='include'
                        checked={rest.include}
                        onChange={() => update({
                            ...rest,
                            include: !rest.include,
                        })}
                    />
                </Fab>
            </div>
            <div className={style.main}>
                <TextField
                    id="filled-basic"
                    label="solution title"
                    variant="filled"
                    size='small'
                    fullWidth
                    value={rest.title}
                    onChange={(evn) => {
                        update({
                            ...rest,
                            title: evn.target.value,
                        });
                    }}
                />

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
        </div>
    );
}
