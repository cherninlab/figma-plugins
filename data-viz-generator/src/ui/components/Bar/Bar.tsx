import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Bar as VisxBar } from '@visx/shape';
import { forwardRef } from 'react';

interface Dimensions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

interface BarProps {
  data: number[] | { label?: string; value: number }[];
  dimensions: Dimensions;
  color: string;
}

export const Bar = forwardRef<SVGSVGElement, BarProps>(({ data, dimensions, color }, ref) => {
  // Convert data to consistent format
  const normalizedData = Array.isArray(data)
    ? data.map((value, i) => (typeof value === 'number' ? { value, label: `${i}` } : value))
    : data;

  // Derived dimensions
  const innerWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  const innerHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // Scales
  const xScale = scaleBand({
    range: [0, innerWidth],
    domain: normalizedData.map((d) => d.label || ''),
    padding: 0.4,
  });

  const yScale = scaleLinear({
    range: [innerHeight, 0],
    domain: [0, Math.max(...normalizedData.map((d) => d.value)) * 1.1], // Add 10% padding
    nice: true,
  });

  return (
    <svg
      ref={ref}
      width={dimensions.width}
      height={dimensions.height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Group left={dimensions.margin.left} top={dimensions.margin.top}>
        {/* Background grid */}
        <GridRows
          scale={yScale}
          width={innerWidth}
          height={innerHeight}
          stroke="#E0E0E0"
          strokeWidth={1}
          strokeOpacity={0.2}
        />

        {/* Bars */}
        {normalizedData.map((d, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = innerHeight - yScale(d.value);
          const x = xScale(d.label || '');
          const y = yScale(d.value);

          return <VisxBar key={i} x={x} y={y} width={barWidth} height={barHeight} fill={color} />;
        })}
      </Group>
    </svg>
  );
});

Bar.displayName = 'Bar';
