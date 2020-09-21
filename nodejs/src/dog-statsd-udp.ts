import * as dgram from 'dgram';
import * as xinston from 'xinston';
import { StatsdMetricMsg } from './interface';

const logger = xinston.Logger.get();

const STATSD_EXPORTER_PORT = parseInt(process.env.STATSD_EXPORTER_PORT || '9125', 10);
const STATSD_EXPORTER_HOST = process.env.STATSD_EXPORTER_HOST || 'localhost';
const client = dgram.createSocket('udp4');

const getTagStr = (msg: StatsdMetricMsg) => {
  const tags: string[] = [];
  Object.keys(msg.tags).forEach((key: string, idx: number) => {
    if (typeof msg.tags[key] === 'string') {
      tags.push(`${key}:${msg.tags[key]}`);
    }
  });
  return '#' + tags.join(',');
};

export const sendUdpGaugeDogStatsD = (msg: StatsdMetricMsg) => {
  const tagStr = getTagStr(msg);
  const msgStr = Buffer.from(`${msg.metricName}:${msg.value}|g|${tagStr}`, 'utf-8');
  logger.debug(`[DEBUG] - statsd metric: ${msgStr.toString()}`);
  client.send(msgStr, 0, msgStr.length, msg.port || STATSD_EXPORTER_PORT, msg.host || STATSD_EXPORTER_HOST,
    (err: Error) => {
      if (err) {
        logger.error('[ERR] - could not send metric data to statsd-exporter');
        logger.error(err);
      }
    });
};

export const closeUdpDogStatsD = () => {
  client.close();
};
