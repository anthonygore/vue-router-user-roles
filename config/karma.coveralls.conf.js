const base = require('./karma.base.conf')

module.exports = config => {
  const options = Object.assign(base, {
    browsers: ['ChromeHeadless'],
    reporters: ['coverage', 'coveralls'],
    coverageReporter: {
      reporters: [{
        type: 'lcov', dir: '../coverage', subdir: '.'
      }]
    },
    singleRun: true
  })

  config.set(options)
}
