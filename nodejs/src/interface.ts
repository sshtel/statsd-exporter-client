
export interface StatsdMetricMsg {
  host: string | undefined;
  port: number | undefined;
  metricName: string;
  value: number;
  tags: any;
}
