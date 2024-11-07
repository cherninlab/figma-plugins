export type DataTypes =
  | 'bar'
  | 'network'
  | 'tree'
  | 'wordcloud'
  | 'pie'
  | 'donut'
  | 'legend'
  | 'pattern'
  | 'text';

export interface DataItem {
  label?: string;
  value: number;
}

export interface ChartData {
  type: DataTypes;
  data: number[] | DataItem[];
}

export interface FileUploadState {
  fileName: string | null;
  error: string | null;
  chartData: ChartData | null;
}
