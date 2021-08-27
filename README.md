[![Build Status](https://travis-ci.com/SAP/fsm-shell.svg?branch=master)](https://travis-ci.com/SAP/fsm-shell)
[![Coverage Status](https://coveralls.io/repos/github/SAP/fsm-shell/badge.svg?branch=master)](https://coveralls.io/github/SAP/fsm-shell?branch=master)
[![npm version](https://badge.fury.io/js/fsm-shell.svg)](https://badge.fury.io/js/fsm-shell)
[![REUSE status](https://api.reuse.software/badge/github.com/Sap/fsm-shell)](https://api.reuse.software/info/github.com/Sap/fsm-shell)

# Client library for applications rendered in FSM shell host

## How to use ShellSdk

Full documentation can be found online: https://sap.github.io/fsm-shell/.

## About this repository

### Install dev dependencies

First step should be to install locally all dependencies running `npm install`

### Build library

Package can be build with `npm run build`. Generated files are located within the `release` folder.

You can link the `release` folder to your project using `npm link` to run a local instance of ShellSdk.  
This process does not include yet hot reload and need to be manually rebuild on each modification.

### Test

Running karma using `npm run test`.

### Documentation

Documentation can be run using `npm run docs` and generated using [doscify](https://docsify.js.org/#/).

Current instance also use [mermaid](https://mermaidjs.github.io/#/) for diagrams, [docsify-tabs](https://jhildenbiddle.github.io/docsify-tabs/#/) and [docsify-example-panel](https://github.com/VagnerDomingues/docsify-example-panels) for content enhancement.

### e2e tests on documentation

End to end tests can be runned on docsify documentation using `npm run docs` then `npm run e2e`.

Documentation server will start before tests running `npm run e2e:ci`

## Support

In case you need further help, check out the [SAP Field Service Management Help Portal](https://help.sap.com/viewer/product/SAP_FIELD_SERVICE_MANAGEMENT/Cloud/en-US) or report and incident in [SAP Support Portal](https://support.sap.com) with the component "CEC-SRV-FSM".

## License

Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](./LICENSES/Apache-2.0.txt) file.
