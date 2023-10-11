import React, { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';

import style from './index.module.css';


function valuetext(value) {
  return `${value}°C`;
}

export function InputSize({ update, ...rest }) {

  const [value1, setValue1] = useState([rest.min, rest.max]);

  const [value2, setValue2] = useState(rest.stepsCount);

  const minDistance = 1;

  const handleChange1 = (
    event,
    newValue,
    activeThumb,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }

    update({
      ...rest,
      min: newValue[0],
      max: newValue[1],
    });
  };

  const handleChange2 = (
    event,
    newValue,
    activeThumb,
  ) => {
    debugger
    setValue2(newValue);

    update({
      ...rest,
      stepsCount: newValue,
    });
  };


  function calculateValue(value) {
    return ((10) ** (Math.floor(value / 9))) * (value % 9 === 0 ? 1 : ((value % 9) + 1));
  }


  return (
    <div className={style.container} >
      <Checkbox />
      <div class={style.controls}>
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={value1}
          onChange={handleChange1}
          valueLabelDisplay="auto"

          step={1}
          scale={calculateValue}
          min={1}
          max={63}
          getAriaValueText={valuetext}
          disableSwap
        />

        <div>
          <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={value2}
            onChange={handleChange2}
            valueLabelDisplay="auto"
            step={1}
            min={1}
            max={100}
            getAriaValueText={valuetext}
            disableSwap
          />
        </div>
      </div>
    </div>
  );
}
