# Client library for applications rendered in FSM shell host

## Description

  SAP FSM (Field Service Management) shell is an extendable Web-Application. FSM shell *host* is the extendable part of the Web-Application and a FSM shell *client* is the extension. For more information regarding SAP FSM, check out the [SAP Field Service Management Help Portal](https://docs.coresystems.net/).

  FSM-SHELL is a library which is designed to be used in FSM shell clients' applications
  to communicate with the shell host by using set of predefined events described
  below in [API Documentation](#API-Documentation).

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
  - [V1.FLOWS_TRIGGERS](#V1FLOWS_TRIGGERS)  
  - [V1.START_FLOW](#V1START_FLOW)
  - [V1.FLOW_ENDED](#V1FLOW_ENDED)
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
- [Debugging postMessage API events](#debugging-postmessage-api-events)



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

- #### V1.FLOWS_TRIGGERS
  List all available flows triggers

  - Request payload

    type: void

  - Response payload

    type: Array of FlowTrigger   
    each object containing flow trigger name, description, trigger id and a list of parameters
    ```typescript
    {
       name: string;
       description: string;
       help: string;
       trigger: string;
       icon: string;
       parameters?: [
         {
            name: string;
            type: string;
            description: string;
            required: boolean;
         }
       ];
    }
    ```

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

    type: StartFlowResponse  
    object containing id of the new flow instance
    ```typescript
    {
      flowInstaneId: string;
    }
    ```

- #### V1.FLOW_ENDED
  indicate that flow was finished

  - Request payload

    type: FlowEndedRequest  
    object id of the finished flow instance  
    ```typescript
    {
      flowInstanceId: string;
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

    to subscribe on shell host event *on* method from *ShellSdk* should be used.  
    handler must be a function which receive 2 parameters:
      - context - payload which was sent with the event
      - origin - origin of the sender which should be validated inside the handler
    ```typescript
    const handler = (context, origin) => {
      // validate sender origin and handle received context
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
      handler => this.shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, payload => handler(payload)),
      handler => this.shellSdk.off(SHELL_EVENTS.Version1.REQUIRE_CONTEXT, handler)
    );

    ctxStream$.subscribe(context => {
      // handle received context
    });
    ```

### Debugging postMessage API events

FSM-SHELL library includes ability to debug events going thru postMessage API on
shell host side or on a client application side.

#### Enable debugging

to enable postMessage API debugging perform following steps:
- open in the browser shell application which should be debugged
- open browser developer tools
- in developer tools go to `Application` tab and open `LocalStorage` item
- click on the origin of the app and add under it key `cs.fsm-shell.debug`
- set id of the component to be debugged as value for that key, it is possible to list
  multiple ids separated by commas. For example to debug messages going thru both shell-host
  and flow-runtime set value to `shell-host,flow-runtime`
- reload application

Following components' ids currently supported to debug postMessage API:
- `shell-host` - shell core to communicate between shell host and client application loaded
  into the main shell iframe
- `flow-runtime` - flow-runtime package which used to communicate between shell host and
  flow step application loaded into iframe rendered by flow-runtime package

#### Fetching and filtering list of tracked postMessage events

When debugging enabled for some component(s) all postMessage events going thru it will
be logged into the browser console. 

List of previously tracked events can be accessed using MessageLogger object which is
available under `fsmShellMessageLogger` property of the window object. For example,
to get list of all prevously tracked events type in the console following command:
`window.fsmShellMessageLogger.all()`
also all events can be printed in table format by typing command:
`window.fsmShellMessageLogger.allTable()`

Message logger also provides ability to filter list of tracked events and includes 2 methods
for that:
- `filter` - to get filtered list of tracked events
- `filterTable` - to print table containing filtered list of tracked events

both methods expecting 1 argument containing filtering options object

Filtering options object may include following keys:
| Key name | type | possible values | description |
|----------|------|-----------------|-------------|
| type | string or string[] | any fsm shell event identifier | include only specific fsm-shell event types |
| direction | string | `incoming`, `outgoing` | include only received or sent events |
| component | string | `fsm-shell`, `flow-runtime` | include only events going thru specific component |
| handled | boolean | `true` or `false` | include only events handled by component (component may have no handlers set for specific event type and ignore some events) |
| from | Date | valid Date object | include only events tracked since spcified moment in time |
| to | Date | valid Date object | include only events tracked before spcified moment in time |

##### Example
To get list of all incoming events of types `V1.FLOWS.CAN_CONTINUE` or `V1.FLOWS.ON_CONTINUE` tracked by `flow-runtime` component type in console following command:
```javascript
window.fsmShellMessageLogger.filterTable({
  type: [
    'V1.FLOWS.CAN_CONTINUE',
    'V1.FLOWS.ON_CONTINUE'
  ],
  component: 'flow-runtime',
  direction: 'incoming'
})
```

## Support

In case you need further help, check out the [SAP Field Service Management Help Portal](https://docs.coresystems.net/) or report and incident in [SAP Support Portal](https://support.sap.com) with the component "CEC-SRV-FSM".

## License

Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE](./LICENSE) file.
