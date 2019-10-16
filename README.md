# Client library for applications rendered in FSM shell host

## Description

  FSM-SHELL is a library which is designed to be used in FSM shell clients' applications
  to communicate with the shell host by using set of predefined events described
  below in [API Documentation](#API-Documentation)

## Requirements

  Minimal supported JavaScript version: ES5

## Responsibilities

- communication to host (ask for data from the host, see events section)
- receive data publish by the host

## Install dev dependencies and build library:

- `npm install`
- `npm run build`

## API Documentation

- [SHELL-SDK Version1 events](#SHELL-SDK-Version1-events)
  - [V1.REQUIRE_CONTEXT](#V1REQUIRE_CONTEXT)
  - [V1.GET_PERMISSIONS](#V1GET_PERMISSIONS)
  - [V1.GET_SETTINGS](#V1GET_SETTINGS)
  - [V1.GET_STORAGE_ITEM](#V1GET_STORAGE_ITEM)
  - [V1.SET_STORAGE_ITEM](#V1SET_STORAGE_ITEM)
  - [V1.START_FLOW](#V1START_FLOW)
- [FLOW-RUNTIME Version1 events](#FLOW-RUNTIME-Version1-events)
  - [V1.FLOWS.REQUIRE_CONTEXT](#V1FLOWSREQUIRE_CONTEXT)
  - [V1.FLOWS.CAN_CONTINUE](#V1FLOWSCAN_CONTINUE)
  - [V1.FLOWS.ON_CONTINUE](#V1FLOWSON_CONTINUE)
- [Generic events](#generic-events)
  - [ERROR](#error)
- [Library usage sample](#library-usage-sample)
  - [Library initialization](#library-initialization)
  - [Get library version](#get-library-version-or-build-timestamp)    
  - [Sending event to the shell host](#sending-event-to-the-shell-host-application)
  - [Subscribing to event coming from shell host application](#subscribing-to-event-coming-from-shell-host-application)
  - [Unsubscribing from event](#unsubscribing-from-event)
  - [Reactive approach to subscribe for shell host events](#reactive-approach-to-subscribe-for-shell-host-events)



### SHELL-SDK Version1 events

- #### V1.REQUIRE_CONTEXT  
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

  - Response payload

    type: object
    ```typescript
    {
      authToken: string;
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

- #### V1.GET_PERMISSIONS  
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

- #### V1.GET_SETTINGS  
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

- #### V1.GET_STORAGE_ITEM
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

- #### V1.SET_STORAGE_ITEM
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

- #### V1.START_FLOW
  trigger flow

  - Request payload

    type: StartFlowRequest  
    object containing flow trigger id and initial context  
    ```typescript
    {
      triggerId: string;
      initialContext?: [
        {
          name: string;
          value: any;
        }
      ];
    }
    ```

  - Response payload

    type: void

### FLOW-RUNTIME Version1 events

- #### V1.FLOWS.REQUIRE_CONTEXT  
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

  - Response payload

    type: object
    ```typescript
    {
      authToken: string;
      cloudHost: string;
      account: string;
      accountId: string;
      company: string;
      companyId: string;
      selectedLocale: string;
      user: string;
      userId: string;
      initialContext: [
        {
          name: string;
          type: string;
          value: any;
        }
      ];
      screenConfiguration: Object | null;
    }
    ```

- #### V1.FLOWS.CAN_CONTINUE  
  Used to indicate if current flow step ready to continue to the next step. Shell host will
  block switching to the next step until this event sent with true value in payload. If data
  at some point becames invalid again, this event with false value in payload can be sent
  in order to block switching to next step again.

  - Request payload

    type: boolean

  - Response not needed

- #### V1.FLOWS.ON_CONTINUE
  Will be sent from the shell host to flow app when user continue to the next flow step. Flow app should save(if needed) it's data, prepare output variables and send it in response to this event.

  - Request payload

    type: void

  - Response payload

    type: object
    ```typescript
    {
      output: [
        {
          name: string;
          value: any;
        }
      ]
    }
    ```

  ### Generic events

  - #### ERROR  
    Will be emitted in response to any of request events in case if error occurs during handling the event.

    - Payload  Event to the shell host can be sent by using *emit* method from *ShellSdk*
    ```typescript
    this.shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, {
      clientIdentifier: '<your-app-client-identifier>',
      clientSecret: '<your-app-client-secret>'
    });
    ```


      type: string  
      string representation of the error object

  ### Library usage sample

  - #### Library initialization  

    import library and available events from *fsm-shell* package
    ```typescript
    import { ShellSdk, SHELL_EVENTS } from 'fsm-shell';
    ```

    initialize the library
    ```typescript
    const shellSdk = ShellSdk.init(parent, origin);
    ```
    where
      - *parent* - reference to the parent window (window.parent) containing shell host application
      - *origin* - origin for the shell host which loading your microfrontend

  - #### Get Library version or build timestamp  

    get the semantic version number of the shell library or the build timestamp.        
    ```typescript  
    console.log(ShellSdk.VERSION);  
    console.log(ShellSdk.BUILD_TS);  
    ```  

  - #### Sending event to the shell host application

    event to the shell host should be sent by using *emit* method from *ShellSdk*
    ```typescript
    shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, {
      clientIdentifier: '<your-app-client-identifier>',
      cleintSecret: '<your-app-client-secret>'
    });
    ```

  - #### Subscribing to event coming from shell host application

    to subscribe on shell host event *on* method from *ShellSdk* should be used
    ```typescript
    const handler = context => {
      // handle received context
    };
    shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler);
    ```

  - #### Unsubscribing from event

    to unsibscribe use *off* method from *ShellSdk*
    ```typescript
    shellSdk.off(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler);
    ```

  - #### Reactive approach to subscribe for shell host events

    rxjs *fromEventPattern* method can be used to create reactive stream from events coming from the ShellSdk.
    ```typescript
    import { fromEventPattern } from 'rxjs';
    ...
    const ctxStream$ = fromEventPattern<string>(
      handler => this.shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler),
      handler => this.shellSdk.off(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler)
    );

    ctxStream$.subscribe(context => {
      // handle received context
    });
    ```
    

## Support

In case you need further help, check out the [SAP Field Service Management Help Portal](https://docs.coresystems.net/) or report and incident in [SAP Support Portal](https://support.sap.com) with the component "CEC-SRV-FSM".

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE](./LICENSE) file.
