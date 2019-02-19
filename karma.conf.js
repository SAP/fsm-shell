
const tsconfig = {
  "compilerOptions": {
    "lib": [
      "es2015",
      "dom"
    ]
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
      require('karma-coverage-istanbul-reporter'),
      require('karma-bamboo-reporter'),
      require('karma-mocha-reporter'),
      require('karma-coverage')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 70,
        lines: 70,
        branches: 65,
        functions: 70
      }
    },
    random: false,
    port: 9876,
    colors: true,
    reporters: ['coverage', 'mocha', 'bamboo', 'karma-typescript'],
    coverageReporter: {
      reporters: [
        {
          type: 'json',
          dir: 'coverage',
          subdir: 'json'
        }
      ]
    },
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
    singleRun: false,
    autoWatch: true,
    concurrency: Infinity, // how many browser should be started simultanous
    browserNoActivityTimeout: 100000,
    browserDisconnectTolerance: 2
  });
};
