# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.16.0] - 2022-09-06

### Added

- added 'data' property to ModalOpenRequest type

### Removed

- removed unused Version1.CLOSE event

## [1.15.7] - 2022-08-24

### Fixed

- isInsideShellModal() method always returning false

## [1.15.6] - 2022-08-03

### Updated

- Make property areDynamicOutletsEnabled from OutletsRequestDynamicContextResponse optional. It will be first removed from outlets package and later from Shell as multi-extension outlets are going to be always enabled.

## [1.15.5] - 2022-05-24

### Added

- Add isScrollbarHidden field as part of modalSettings in payload for MODAL.OPEN event

## [1.15.4] - 2022-05-18

### Added

- Add backdropClickCloseable field as part of modalSettings in payload for MODAL.OPEN event

## [1.15.3] - 2022-01-11

### Fixed

- Validate max depth for OUTLETS.REQUEST_DYNAMIC_CONTEXT event

## [1.15.2] - 2021-12-07

### Added

- outletSettings field in payload for OUTLETS.REQUEST_DYNAMIC_CONTEXT event

## [1.15.1] - 2021-11-19

### Added

- outletSettings field in payload for OUTLETS.REQUEST_CONTEXT event

## [1.15.0] - 2021-11-17

### Added

- Enhance fsm-shell to support dynamic outlets

## [1.14.0] - 2021-10-21

### Added

- Json schemas for event payload validation
- Logic for event payload validation against json schemas

## [1.13.2] - 2021-09-24

### Updated

- Documentation updated to include event versioning guide.

## [1.13.1] - 2021-09-10

### Fixed

- Fixed unit tests

## [1.13.0] - 2021-08-27

### Added

- Messages to handle MODAL open and close event
- Add `isInsideShellModal()` method to know if app is running inside Shell Modal

## [1.12.1] - 2021-08-11

### Fixed

- Context with deploymentId for extensions only works in case the respective outlet has a target (name), which is optional. Execute logic to retrieve deploymentId only in case respective outlet has a target.

## [1.12.0] - 2021-08-02

### Added

- Support context with deploymentId for extensions

## [1.11.2] - 2021-07-23

### Fixed

- Make fsm-shell repository reuse compliant

## [1.11.1] - 2021-06-28

### Fixed

- Update karma to newest version to fix security issue

## [1.11.0] - 2021-06-22

### Added

- Add the possibility to ignore messages from a specific origin

## [1.10.1] - 2021-04-15

### Added

- V1.RESTORE_TITLE event support

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
