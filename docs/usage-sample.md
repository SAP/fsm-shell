# Library usage sample

- ## Library initialization

  import library and available events from _fsm-shell_ package

  ```typescript
  import { ShellSdk, SHELL_EVENTS } from 'fsm-shell';
  ```

  initialize the library

  ```typescript
  const shellSdk = ShellSdk.init(parent, origin);
  ```

  where

  - _parent_ - reference to the parent window (window.parent) containing shell host application
  - _origin_ - origin for the shell host which loading your microfrontend

- ## Get Library version or build timestamp

  get the semantic version number of the shell library or the build timestamp.

  ```typescript
  console.log(ShellSdk.VERSION); // 1.2.8
  console.log(ShellSdk.BUILD_TS); // 2020-04-23T12:10:43.070Z
  ```

- ## Determine if an app runs inside Shell or not

  using the static function isInsideShell you can check at runtime

  ```typescript
  // ShellSdk.isInsideShell static class function
  console.log(ShellSdk.isInsideShell()); // true/false
  ```

  since: `1.2.6`

- ## Determine if an app runs inside Shell's modal or not

  using the function isInsideShellModal you can check at runtime

  ```typescript
  // shellSdk is an instance of ShellSdk
  console.log(shellSdk.isInsideShellModal()); // true/false
  ```

  added in `1.10.0`, fixed in `1.15.7`

- ## Sending event to the shell host application

  event to the shell host should be sent by using _emit_ method from _ShellSdk_

  ```typescript
  shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, {
    clientIdentifier: '<your-app-client-identifier>',
    clientSecret: '<your-app-client-secret>',
  });
  ```

  ```mermaid
  sequenceDiagram
      participant Shell
      participant Application
      Application->>Shell: SHELL_EVENTS.Version1.REQUIRE_CONTEXT
  ```

- ## Subscribing to event coming from shell host application

  to subscribe on shell host event _on_ method from _ShellSdk_ should be used.  
  handler must be a function which receive 2 parameters:

  - context - payload which was sent with the event
  - origin - origin of the sender which should be validated inside the handler

  ```typescript
  const handler = (context, origin) => {
    // validate sender origin and handle received context
  };
  shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler);
  ```

  ```mermaid
  sequenceDiagram
    participant Shell
    participant Application
    Shell->>Application: SHELL_EVENTS.Version1.REQUIRE_CONTEXT
  ```

- ## Unsubscribing from event

  to unsibscribe use _off_ method from _ShellSdk_

  ```typescript
  shellSdk.off(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler);
  ```

- ## Reactive approach to subscribe for shell host events

  rxjs _fromEventPattern_ method can be used to create reactive stream from events coming from the ShellSdk.

  ```typescript
  import { fromEventPattern } from 'rxjs';
  ...
  const ctxStream$ = fromEventPattern<string>(
    handler => this.shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, payload => handler(payload)),
    handler => this.shellSdk.off(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler)
  );

  ctxStream$.subscribe(context => {
    // handle received context
  });
  ```
