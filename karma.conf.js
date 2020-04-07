
const tsconfig = {
  "compilerOptions": {
    "lib": [
      "es2015",
      "dom"
    ]
  },
  "reports": {
    "html": "coverage",
    "lcovonly": "coverage"
  }
};

module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      'src/**/*.ts'
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    frameworks: ['jasmine', 'karma-typescript'],
    karmaTypescriptConfig: tsconfig,
    plugins: [
      require('karma-typescript'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-bamboo-reporter'),
      require('karma-mocha-reporter')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    random: false,
    port: 9876,
    colors: true,
    reporters: ['progress', 'mocha', 'bamboo', 'karma-typescript'],
    bambooReporter: {
      filename: 'mocha.json'
    },
    browsers: ['MyChromeHeadless'], // use Chrome to see UI, available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    customLaunchers: {
      MyChromeHeadless: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    singleRun: false,
    autoWatch: true,
    concurrency: Infinity, // how many browser should be started simultanous
    browserNoActivityTimeout: 100000,
    browserDisconnectTolerance: 2
  });
};
