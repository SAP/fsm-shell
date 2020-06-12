# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2020-06-05

### Added

- Implement V2.GET_PERMISSIONS

## [1.4.0] - 2020-05-15

### Added

- Implement V2.GET_STORAGE_ITEM
- Restore V1.GET_STORAGE_ITEM as cockpit use none shellSdk interface and need same syntax

## [1.3.2] - 2020-05-15

### Bugfix

- Fix `.join` crash on  `GET_STORAGE_ITEM` event. from shell-host

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

## [1.2.5] - 2020-04-17

### Added

- New `OutletsDeleteAssignmentRequest` and `OutletsDeleteAssignmentResponse` models for messages
- Propagate `SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT` to all outlets if only update configurationmode state

## [1.2.0] - 2020-03-31

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
