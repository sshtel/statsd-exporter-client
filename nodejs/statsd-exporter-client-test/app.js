const statsd = require('statsd-exporter-client')

statsd.sendUdpGaugeDogStatsD({
  metricName: 'metric',
  value: 1,
  tags: {
    tag1: '1',
    tag2: 'b'
  }
})

statsd.closeUdpDogStatsD()
