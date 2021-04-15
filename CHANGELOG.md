# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.10.0] - 2021-04-15

### Added

- V1.SET_TITLE event support

## [1.9.2] - 2021-02-25

### Fixed

- Update dependencies to fix vulnerabilities

## [1.9.1] - 2021-02-03

### Update

- Dependencies to fix security vulnerability

## [1.9.0] - 2021-01-28

### Update

- REQUIRE_CONTEXT event enhanced to support extension authenticatiopn

### Added

- REQUIRE_AUTHENTICATION event for extension authentication support

## [1.8.0] - 2021-01-19

### Update

- Validate iFrame origing against postMessage event origin when proxing events from outlets
- Added ability to dynamically add/remove allowed origins

## [1.7.3] - 2020-12-11

### Update

- Update dependencies to fix potential security vulnerabilities

## [1.7.2] - 2020-11-24

### Update

- Downgrade fsm-shell dependency typescript to make it compatible with the current outlet package

## [1.7.1] - 2020-10-14

### Fixed

- Replace error message for the usage of V1.SET_VIEW_STATE event to a warning

## [1.7.0] - 2020-09-02

### Added

- Support V1.GET_FEATURE_FLAG event

## [1.6.2] - 2020-09-02

### Fixed

- Cypress compatibility issue for isInsideShell method

## [1.6.1] - 2020-08-06

### Fixed

- Update dependencies to fix security breach

## [1.6.0] - 2020-08-04

### Added

- Allow `OutletsRequestContextRequest` message to show/hide mocks on `V1.OUTLET.ADD_PLUGIN` event

## [1.5.1] - 2020-06-17

### Added

- `getTarget()` method to access ShellSdk target object
- Nested page within fsm-shell documentation

## [1.5.0] - 2020-06-05

### Added

- Implement V2.GET_PERMISSIONS

## [1.4.0] - 2020-05-15

### Added

- Implement V2.GET_STORAGE_ITEM
- Restore V1.GET_STORAGE_ITEM as cockpit use none shellSdk interface and need same syntax

## [1.3.2] - 2020-05-15

### Bugfix

- Fix `.join` crash on `GET_STORAGE_ITEM` event. from shell-host

## [1.3.1] - 2020-05-11

### Added

- Special rule to expose `key` value on `GET_STORAGE_ITEM` event, with legacy support.

## [1.3.0] - 2020-05-06

### Added

- `setAllowedOrigins()` method now allows to filter events based on its origin.

## [1.2.8] - 2020-04-22

### Added

- New ErrorType `OUTLET_HTTPS_ERROR`.
- Add `isRootNodeHttps` in `OutletsRequestContextResponse` interface.

## [1.2.7] - 2020-04-21

### Added

- Return `SHELL_EVENTS.Version1.OUTLET.LOADING_FAIL` if reached maximum depth

## [1.2.6] - 2020-04-21

### Added

- Add `ShellSdk.isInsideShell()` to verified if an application is running with or without Shell

## [1.2.5] - 2020-04-17

### Added

- New `OutletsDeleteAssignmentRequest` and `OutletsDeleteAssignmentResponse` models for messages
- Propagate `SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT` to all outlets if only update configurationmode state

## [1.2.4] - 2020-04-09

### Added

- Implement CI with travis, badges, and coveralls

## [1.2.3] - 2020-04-07

### Fixed

- Specify typescript version as dependency to avoid fix conflict

## [1.2.2] - 2020-04-07

### Fixed

- Remove alert security by updating all dependencies

## [1.2.1] - 2020-04-03

### Added

- Block `setViewState` from plugins

## [1.0.0] - 2020-03-16

### Added

- Outlet feature
- `setViewState` and `onViewState` methods
- `TO_APP` and `REQUIRE_CONTEXT_DONE` events
- Changelog file

### Removed

- FLOW APIs have been removed
