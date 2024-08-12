import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


const getLabel = (value: number) => {
    return `${value} Kč/g`;
}

const minDistance = 10;

export const SliderISA = ({min, max, domain, setDomain, stepLabel, stepMark}: any) => {

    const handleChange1 = (
        event: Event,
        newValue: number | number[],
        activeThumb: number,
    ) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setDomain([Math.min(newValue[0], domain[1] - minDistance), domain[1]]);
        } else {
            setDomain([domain[0], Math.max(newValue[1], domain[0] + minDistance)]);
        }
    };

    return (
        <Box sx={{ width: 0.94, ml: '4rem' }}>
            <Slider
                getAriaLabel={() => 'Minimum distance'}
                value={domain}
                onChange={handleChange1}
                valueLabelDisplay="auto"
                getAriaValueText={getLabel}
                marks={Array.from({ length: Math.floor((max - min) / stepLabel) + 1 }, (_, i) => min + i * stepLabel).map(
                    x => {
                        return {
                            value: x,
                            label: getLabel(x)
                    }}
                )}
                min={min}
                max={max}
                step={stepMark}
                disableSwap
            />
        </Box>
    );
}