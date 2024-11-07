import { useRef, useState } from 'react';
import { Bar as BarChart } from '../Bar/Bar';
import { Donut } from '../Donut/Donut';
import { Legend } from '../Legend/Legend';
import { Network } from '../Network/Network';
import { Pattern } from '../Pattern/Pattern';
import { Pie } from '../Pie/Pie';
import { Text } from '../Text/Text';
import { Tree } from '../Tree/Tree';
import { Wordcloud } from '../Wordcloud/Wordcloud';
import styles from './App.module.css';
import { ChartData, DataTypes, FileUploadState } from './types';

const defaultData: ChartData = {
  type: 'bar',
  data: [120, 80, 100, 70, 90],
};

const chartComponents = {
  bar: BarChart,
  pie: Pie,
  network: Network,
  tree: Tree,
  wordcloud: Wordcloud,
  donut: Donut,
  legend: Legend,
  pattern: Pattern,
  text: Text,
};

export function App() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [fileState, setFileState] = useState<FileUploadState>({
    fileName: null,
    error: null,
    chartData: null,
  });

  const [dimensions, setDimensions] = useState({
    width: 300,
    height: 300,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
  });

  const [chartColor, setChartColor] = useState('#18A0FB');
  const [selectedType, setSelectedType] = useState<DataTypes>('bar');

  const handleFileUpload = (file: File) => {
    setFileState({
      fileName: file.name,
      error: null,
      chartData: null,
    });

    if (!file.name.endsWith('.json')) {
      setFileState((prev) => ({
        ...prev,
        error: 'Please upload a JSON file',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);

        // Validate data structure
        if (!jsonData.type || !jsonData.data) {
          throw new Error('Invalid data format. Must include "type" and "data" fields');
        }

        if (!Object.keys(chartComponents).includes(jsonData.type)) {
          throw new Error(`Unsupported chart type: ${jsonData.type}`);
        }

        setFileState((prev) => ({
          ...prev,
          chartData: jsonData,
        }));
        setSelectedType(jsonData.type);
      } catch (error) {
        setFileState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Invalid JSON format',
        }));
      }
    };

    reader.onerror = () => {
      setFileState((prev) => ({
        ...prev,
        error: 'Error reading file',
      }));
    };

    reader.readAsText(file);
  };

  const currentData = fileState.chartData || defaultData;
  const ChartComponent = chartComponents[selectedType];

  const createChart = () => {
    if (!svgRef.current) return;
    const svgContent = svgRef.current.outerHTML;
    parent.postMessage(
      {
        pluginMessage: {
          type: 'create-chart',
          svg: svgContent,
        },
      },
      '*',
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Data</h2>
      <p>
        <a href="/docs" className={styles.link}>
          Look at the docs
        </a>{' '}
        how to format your data
      </p>

      <div
        className={styles.dropzone}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const file = e.dataTransfer.files[0];
          if (file) handleFileUpload(file);
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFileUpload(file);
          };
          input.click();
        }}
      >
        {fileState.fileName ? (
          <p>Loaded: {fileState.fileName}</p>
        ) : (
          <p>Drop your JSON file here or click to upload</p>
        )}
      </div>

      {fileState.error && <p style={{ color: 'red', marginTop: '8px' }}>{fileState.error}</p>}

      <h2 className={styles.title}>Settings</h2>
      <div className={styles.settings}>
        <label className={styles.inputWrapper}>
          <span>Type</span>
          <select
            className={styles.select}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as DataTypes)}
          >
            {Object.keys(chartComponents).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.inputWrapper}>
          <span>W</span>
          <input
            className={styles.input}
            type="number"
            value={dimensions.width}
            onChange={(e) =>
              setDimensions((prev) => ({
                ...prev,
                width: parseInt(e.target.value) || 300,
              }))
            }
          />
        </label>
        <label className={styles.inputWrapper}>
          <span>H</span>
          <input
            className={styles.input}
            type="number"
            value={dimensions.height}
            onChange={(e) =>
              setDimensions((prev) => ({
                ...prev,
                height: parseInt(e.target.value) || 300,
              }))
            }
          />
        </label>
        <label className={styles.inputWrapper}>
          <span>Color</span>
          <select
            className={styles.select}
            value={chartColor}
            onChange={(e) => setChartColor(e.target.value)}
          >
            <option value="#18A0FB">Blue</option>
            <option value="#000000">Black</option>
            <option value="#FFFFFF">White</option>
          </select>
        </label>
      </div>

      <h2 className={styles.title}>Render</h2>
      <div className={styles.chart}>
        {ChartComponent && (
          <ChartComponent
            ref={svgRef}
            data={currentData.data}
            dimensions={dimensions}
            color={chartColor}
          />
        )}
      </div>

      <button onClick={createChart} className={styles.button}>
        Add to Figma
      </button>
    </div>
  );
}
