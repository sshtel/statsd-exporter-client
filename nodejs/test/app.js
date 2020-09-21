const statsd = require('../dist/index')

statsd.sendUdpGaugeDogStatsD({
  metricName: 'metric',
  value: 1,
  tags: {
    tag1: '1',
    tag2: 'b'
  }
})

statsd.closeUdpDogStatsD()
