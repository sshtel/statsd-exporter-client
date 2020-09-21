// const statsd = require('statsd-exporter-client')
const statsd = require('../dist')

const statsdObj = new statsd.UdpDogStatsD({ host: 'localhost', port: 9125 })

statsdObj.sendGauge({
  metricName: 'metric',
  value: 1,
  tags: {
    tag1: '1',
    tag2: 'b'
  }
})

statsdObj.close()
