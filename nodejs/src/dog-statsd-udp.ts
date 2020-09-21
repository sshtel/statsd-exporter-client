import * as dgram from 'dgram';
import * as xinston from 'xinston';
import { StatsdMetricMsg } from './interface';

export class UdpDogStatsD {

  private logger;
  private client;
  private host: string;
  private port: number;
  constructor(param: { host: string, port: number } | undefined) {
    this.logger = xinston.Logger.get();
    this.host = param && param.host || 'localhost';
    this.port = param && param.port || 9125;
    this.client = dgram.createSocket('udp4');

  }

  getTagStr = (msg: StatsdMetricMsg) => {
    const tags: string[] = [];
    Object.keys(msg.tags).forEach((key: string, idx: number) => {
      if (typeof msg.tags[key] === 'string') {
        tags.push(`${key}:${msg.tags[key]}`);
      }
    });
    return '#' + tags.join(',');
  }

  sendGauge = (msg: StatsdMetricMsg) => {
    const tagStr = this.getTagStr(msg);
    const msgStr = Buffer.from(`${msg.metricName}:${msg.value}|g|${tagStr}`, 'utf-8');
    this.logger.debug(`[DEBUG] - ${this.host}:${this.port} - ${msgStr.toString()}`);
    this.client.send(msgStr, 0, msgStr.length, this.port, this.host,
      (err: Error) => {
        if (err) {
          this.logger.error('[ERR] - could not send metric data to statsd-exporter');
          this.logger.error(err);
        }
      });
  }

  sendCount = (msg: StatsdMetricMsg) => {
    const tagStr = this.getTagStr(msg);
    const msgStr = Buffer.from(`${msg.metricName}:${msg.value}|c|${tagStr}`, 'utf-8');
    this.logger.debug(`[DEBUG] - ${this.host}:${this.port} - ${msgStr.toString()}`);
    this.client.send(msgStr, 0, msgStr.length, this.port, this.host,
      (err: Error) => {
        if (err) {
          this.logger.error('[ERR] - could not send metric data to statsd-exporter');
          this.logger.error(err);
        }
      });
  }

  close = () => {
    this.client.close();
  }

}
