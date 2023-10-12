import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'

export function ComparisionChart({ title, datasets }) {
    const canvasRef = useRef();
    const chartRef = useRef();

    useEffect(() => {
        const chart = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                datasets,
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    }
                },
                animation: false,
            },
            
        });

        chartRef.current = chart;
       

        return () => {
            chart.destroy();
        }

    }, [canvasRef]);

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }

        chartRef.current.data.datasets = datasets;
        chartRef.current.update()
    }, [datasets]);
    return (
        <div>
            <h2>{title}</h2>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
