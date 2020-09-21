const statsd = require('statsd-exporter-client')
// const statsd = require('../dist')

const statsdObj = new statsd.UdpDogStatsD({ host: 'localhost', port: 9125 })


setInterval(async () => {

  statsdObj.sendGauge({
    metricName: 'my_metric_gauge',
    value: Math.random() * 100,
    tags: {
      tag1: '1',
      tag2: 'b'
    }
  })

  statsdObj.sendCountInc({
    metricName: 'my_metric_count',
    value: 10,
    tags: {
      tag1: '1',
      tag2: 'b'
    }
  })

}, 1000)
