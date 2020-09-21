import * as dgram from 'dgram';

const STATSD_EXPORTER_PORT = parseInt(process.env.STATSD_EXPORTER_PORT || '9125', 10);
const STATSD_EXPORTER_HOST = process.env.STATSD_EXPORTER_HOST || 'localhost';
const client = dgram.createSocket('udp4');

export interface StatsdMetricMsg {
  metricName: string;
  value: number;
  tags: any;
}

const getTagStr = (msg: StatsdMetricMsg) => {
  const tags: string[] = [];
  Object.keys(msg.tags).forEach((key: string, idx: number) => {
    if (typeof msg.tags[key] === 'string') {
      tags.push(`${key}:${msg.tags[key]}`);
    }
  });
  return '#' + tags.join(',');
};

export const sendGaugeDogStatsD = (msg: StatsdMetricMsg) => {
  const tagStr = getTagStr(msg);
  const msgStr = Buffer.from(`${msg.metricName}:${msg.value}|g|${tagStr}`, 'utf-8');
  if (process.env.STATSD_EXPORTER_METRICS_DEBUG) console.log(`[DEBUG] - statsd metric: ${msgStr.toString()}`);
  client.send(msgStr, 0, msgStr.length, STATSD_EXPORTER_PORT, STATSD_EXPORTER_HOST, (err, bytes) => {
    if (err) {
      console.error('[ERR] - could not send metric data to statsd-exporter');
      console.error(err);
    }
  });
};
