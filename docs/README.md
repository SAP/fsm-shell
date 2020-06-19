# Client library for applications rendered in FSM shell host

[![Build Status](https://travis-ci.com/SAP/fsm-shell.svg?branch=master)](https://travis-ci.com/SAP/fsm-shell)
[![Coverage Status](https://coveralls.io/repos/github/SAP/fsm-shell/badge.svg?branch=master)](https://coveralls.io/github/SAP/fsm-shell?branch=master)
[![npm version](https://badge.fury.io/js/fsm-shell.svg)](https://badge.fury.io/js/fsm-shell)

## Description

SAP FSM (Field Service Management) shell is an extendable Web-Application. FSM shell _host_ is the extendable part of the Web-Application and a FSM shell _client_ is the extension. For more information regarding SAP FSM, check out the [SAP Field Service Management Help Portal](https://docs.coresystems.net/).

FSM-SHELL is a library which is designed to be used in FSM shell clients' applications
and plugins to communicate with the shell host by using set of predefined events and api described
below in [API Documentation](#API-Documentation).

## Requirements

Minimal supported JavaScript version: ES5

## Responsibilities

- communication to host (ask for data from the host, see events section)
- receive data publish by the host
- manage communication with plugins

## Support

In case you need further help, check out the [SAP Field Service Management Help Portal](https://docs.coresystems.net/) or report and incident in [SAP Support Portal](https://support.sap.com) with the component "CEC-SRV-FSM".

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE](./LICENSE) file.
