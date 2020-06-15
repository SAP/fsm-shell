# API Documentation

- [SHELL-SDK Version1 events](#SHELL-SDK-Version1-events)
  - [V1.REQUIRE_CONTEXT](#V1REQUIRE_CONTEXT)
  - [V1.GET_PERMISSIONS](#V1GET_PERMISSIONS)
  - [V1.GET_SETTINGS](#V1GET_SETTINGS)
  - [V2.GET_STORAGE_ITEM](#V2GET_STORAGE_ITEM)
  - [V1.GET_STORAGE_ITEM](#V1GET_STORAGE_ITEM)
  - [V1.SET_STORAGE_ITEM](#V1SET_STORAGE_ITEM)
- [PLUGIN SPECIFIC API](#plugin-specific-api)
  - [V1.TO_APP](#V1TO_APP)
  - [VIEW STATE](VIEW_STATE)
- [Generic events](#generic-events)
  - [ERROR](#error)
- [Library usage sample](#library-usage-sample)
  - [Library initialization](#library-initialization)
  - [Get library version](#get-library-version-or-build-timestamp)
  - [Sending event to the shell host](#sending-event-to-the-shell-host-application)
  - [Subscribing to event coming from shell host application](#subscribing-to-event-coming-from-shell-host-application)
  - [Unsubscribing from event](#unsubscribing-from-event)
  - [Reactive approach to subscribe for shell host events](#reactive-approach-to-subscribe-for-shell-host-events)
- [Debugging postMessage API events](#debugging-postmessage-api-events)
- [Security](#security)
- [Support](#support)
- [License](#license)

* ### V1.REQUIRE_CONTEXT

  Must be sent on application startup to get initial application context from the shell

  - Request payload

    type: object

    ```typescript
    {
      clientIdentifier: string;
      clientSecret: string;
      cloudStorageKeys?: CloudStorageKey[];
    }
    ```

* Response payload

  type: object

  ```typescript
  {
    authToken?: string;
    cloudHost: string;
    account: string;
    accountId: string;
    company: string;
    companyId: string;
    selectedLocale: string;
    user: string;
    userId: string;
    userAccountFeatureFlagsEnabled: boolean;
    userAccountFeatureFlagsUserId: string;
    erpType: string;
    erpUserId: string;
  }
  ```

  The property `authToken` can only be accessed by applications and will not be exposed to plugins.

  REQUIRE_CONTEXT will first return the response payload, then trigger individual ViewState object as describe in the ViewState section.

* ### V1.GET_PERMISSIONS

  Request permissions for specified object from the shell

  - Request payload

    type: PermissionRequest

    ```typescript
    {
      objectName: string;
      owners?: string[];
    }
    ```

  - Response payload

    type: Permission

    ```typescript
    {
      CREATE: boolean;
      READ: boolean;
      UPDATE: boolean;
      DELETE: boolean;
      UI_PERMISSIONS: number[];
    }
    ```

* ### V1.GET_SETTINGS

  Request settings value for specific key from the shell

  - Request payload

    type: string  
    Key to read settings from

  - Response payload

    type: SettingsResponse\<T\>  
    settings value which was read from requested key

    ```typescript
    {
      key: string;
      value: T;
    }
    ```

  - Listenner

    ```typescript
    sdk.on(SHELL_EVENTS.Version2.GET_STORAGE_ITEM, (value) => {
      console.log(`item is now ${value}`);
    });
    ```

* ### V2.GET_STORAGE_ITEM

  Request value stored under specified key in cloud storage

  - Request payload

    type: string  
    Key to read value from

  - Response payload

    type: GetItemResponse\<T\>  
    object containing key name and value which was read from requested key

    ```typescript
    {
      key: string;
      value: T;
    }
    ```

  - Listenner

    ```typescript
    sdk.on(SHELL_EVENTS.Version2.GET_STORAGE_ITEM, (response) => {
      console.log(`${response.key} is now ${response.value}`);
    });
    ```

* ### V1.GET_STORAGE_ITEM (deprecated for v2)

  Request value stored under specified key in cloud storage

  - Request payload

    type: string  
    Key to read value from

  - Response payload
    ```typescript
    {
      value: T;
    }
    ```

* ### V1.SET_STORAGE_ITEM

  Save value in cloud staorage under specified key

  - Request payload

    type: SetItemRequest\<T\>  
    object containing key name and value to store under that key

    ```typescript
    {
      key: string;
      value: T;
    }
    ```

  - Response payload

    type: boolean
    flag indicating if value was saved successfully

## PLUGIN SPECIFIC API

ShellSdk provide a set of features which are specifically designed to allow communications with plugins running inside an application as part of the extention feature.

- ### VIEW STATE : an all instance synced data object

  You might need to share between your application and plugins a general context to provide consistent UI. ShellSdk let applications share any `{ key: value }` object through the ViewState entity. You can update the using the `setViewState(key, value)` method. ViewState is not persistent and will be deleted when user navigate outside of the application. ViewState is not allowed to use in a plugin for security reason, and will throw generic error object.

  ```typescript
  this.sdk.setViewState('TECHNICIAN', id);
  ```

  To listen on modification event, use the listenner `onViewState` with the expected key.

  ```typescript
  this.sdk.onViewState('TECHNICIAN', id => {
      this.selectedId = id;
  }))
  ```

  To initialise your ViewState, make sure all `.onViewState` listenners are initialise when first emitting the `REQUEST_CONTEXT` event. ShellSdk will first trigger `.on(SHELL_EVENTS.Version1.REQUEST_CONTEXT` to initialize the general context, then individually receive events on `onViewState` listenners.

- ### V1.TO_APP event

  You can send any data from any plugin to the main application using the `TO_APP` event.

  ```
  this.sdk.emit(SHELL_EVENTS.Version1.TO_APP, {
      message: 'test'
  });
  ```

  To listen in application, use the generic `on` method.

  ```typescript
  this.sdk.on(SHELL_EVENTS.Version1.TO_APP, (content) => {
    console.log(content.message); // print test in console
  });
  ```

## Generic events

- ### ERROR

  Will be emitted in response to any of request events in case if error occurs during handling the event.

  ```typescript
  shellSdk.on(SHELL_EVENTS.ERROR, (error) => {});
  ```
