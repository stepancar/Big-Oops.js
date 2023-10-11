import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto'

export function ComparisionChart({ title, datasets }) {
    const canvasRef = useRef();

    useEffect(() => {
        if (datasets.length === 0) {
            return null;
        }
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
                }
            }
        });

        return () => {
            chart.destroy();
        }

    }, [canvasRef, datasets]);
    return (
        <div>
            <h2>{title}</h2>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}
