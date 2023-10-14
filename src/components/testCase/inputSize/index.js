import React from 'react';
import Input from '@mui/material/Input';

import style from './index.module.css';


export function InputSize({ update, ...rest }) {
  
  const handleChangeMin = (event) => {
    if (event.target.value === '') {
      return;
    }
    const newVal = Number(event.target.value);

    update({
      ...rest,
      min: newVal,
    });
  }

  const handleChangeMax = (event) => {
    if (event.target.value === '') {
      return;
    }
    const newVal = Number(event.target.value);

    update({
      ...rest,
      max: newVal,
    });
  }


  const handleChangeStepsCount = (event) => {
    if (event.target.value === '') {
      return;
    }
    const newVal = Number(event.target.value);

    update({
      ...rest,
      stepsCount: newVal,
    });
  }

  return (
    <div className={style.container} >
      <div class={style.controls}>
        <Input type='number' defaultValue={rest.min} onChange={ handleChangeMin } />
        <Input type='number' defaultValue={rest.max} onChange={ handleChangeMax } />
        <Input type='number' defaultValue={rest.stepsCount} onChange={ handleChangeStepsCount } />
      </div>
    </div>
  );
}
