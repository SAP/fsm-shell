# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
