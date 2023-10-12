import React, { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';

import style from './index.module.css';


export function InputSize({ update, ...rest }) {

  const [min, setMin] = useState(rest.min);
  const [max, setMax] = useState(rest.max);
  const [stepsCount, setStepsCount] = useState(rest.stepsCount);
  
  const handleChangeMin = (event) => {
    const newVal = Number(event.target.value);
    setMin(newVal);
    update({
      ...rest,
      min: newVal,
    });
  }

  const handleChangeMax = (event) => {
    const newVal = Number(event.target.value);
    setMax(newVal);
    update({
      ...rest,
      max: newVal,
    });
  }


  const handleChangeStepsCount = (event) => {
    const newVal = Number(event.target.value);
    setStepsCount(newVal);
    update({
      ...rest,
      stepsCount: newVal,
    });
  }

  return (
    <div className={style.container} >
      <div class={style.controls}>
        <Input type='number' value={min} onChange={ handleChangeMin } />
        <Input type='number' value={max} onChange={ handleChangeMax } />
        <Input type='number' value={stepsCount} onChange={ handleChangeStepsCount } />
      </div>
    </div>
  );
}
