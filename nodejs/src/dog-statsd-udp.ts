import * as dgram from 'dgram';
import * as xinston from 'xinston';
import { StatsdMetricMsg } from './interface';

export class UdpDogStatsD {

  private logger;
  private client: dgram.Socket | undefined = undefined;
  private host: string;
  private port: number;
  constructor(param: { host: string, port: number } | undefined) {
    this.logger = xinston.Logger.get();
    this.host = param && param.host || 'localhost';
    this.port = param && param.port || 9125;
    this.client = dgram.createSocket('udp4', err => {
      console.error(err);
    });
  }

  public async sendGauge(msg: StatsdMetricMsg) {
    const tagStr = this.getTagStr(msg);
    const msgStr = Buffer.from(`${msg.metricName}:${msg.value}|g|${tagStr}`, 'utf-8');
    this.logger.debug(`[DEBUG] - ${this.host}:${this.port} - ${msgStr.toString()}`);
    try {
      if (this.client) await this.client.send(msgStr, this.port, this.host);
    } catch (e) {
      this.logger.error(e);
    }
  }

  public async sendCountInc(msg: StatsdMetricMsg) {
    const tagStr = this.getTagStr(msg);
    const msgStr = Buffer.from(`${msg.metricName}:${msg.value}|c|${tagStr}`, 'utf-8');
    this.logger.debug(`[DEBUG] - ${this.host}:${this.port} - ${msgStr.toString()}`);
    this.client = dgram.createSocket('udp4', err => {
      console.error(err);
    });
    try {
      if (this.client) await this.client.send(msgStr, this.port, this.host);
    } catch (e) {
      this.logger.error(e);
    }
  }

  public close() {
    if (this.client) this.client.close();
  }
  private getTagStr(msg: StatsdMetricMsg) {
    const tags: string[] = [];
    Object.keys(msg.tags).forEach((key: string, idx: number) => {
      if (typeof msg.tags[key] === 'string') {
        tags.push(`${key}:${msg.tags[key]}`);
      }
    });
    return '#' + tags.join(',');
  }

}
