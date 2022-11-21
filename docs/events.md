# API Documentation

## Events

- ### REQUIRE_CONTEXT

```
SHELL_EVENTS.Version1.REQUIRE_CONTEXT
```

Must be sent on application startup to get initial application context from the shell

- Request payload

  type: object

  ```typescript
  {
    clientIdentifier: string;
    clientSecret: string;
    cloudStorageKeys?: CloudStorageKey[];
    auth?: {
      response_type: 'token'
    }
    targetOutletName?: string;
  }
  ```

  The property `targetOutletName` is added automatically by the FSM-Shell in case the request is sent by an extension inside an outlet. It should not be added by the extension itself.

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
    auth?: {
      access_token: string,
      token_type: string,
      expires_in: number
    },
    extension?: {
      deploymentId: string;
    }
  }
  ```

  The property `authToken` can only be accessed by applications and will not be exposed to extensions. Extensions should require an access*token using the auth value. \_Also see [REQUIRE_AUTHENTICATION](#REQUIRE_AUTHENTICATION) event*

  The property `extension` is only exposed to extensions. It contains information about the requesting extension. Currently, it only contains the property `deploymentId`.

  REQUIRE_CONTEXT will first return the response payload, then trigger individual ViewState object as describe in the ViewState section.

- ### REQUIRE_AUTHENTICATION

```
SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION
```

Request restricted token for using by an extension

- Request payload

  type: object

  ```typescript
  {
    response_type: 'token';
  }
  ```

* Response payload

  type: object

  ```typescript
  {
    access_token: string,
    token_type: string,
    expires_in: number
  }
  ```

- ### GET_PERMISSIONS

  With this event you can get permission objects. You can find the available permission object types in the FSM admin page in "User Groups -> select an item -> Permissions -> Object Type". [Here](https://help.sap.com/viewer/fsm_admin/Cloud/en-US/permissions-objects.html) you can also find more information about the permission objects.

<!-- tabs:start -->

#### **Version 2**

```
SHELL_EVENTS.Version2.GET_PERMISSIONS
```

Request permissions for specified object from the shell

- Request payload

  type: PermissionRequest

  ```typescript
  {
    objectName: string; // permission object type
    owners?: string[]; // person Ids
  }
  ```

- Response payload

  type: PermissionResponse

  ```typescript
  {
    objectName: string;
    owners?: string[];
    permission: {
      CREATE: boolean;
      READ: boolean;
      UPDATE: boolean;
      DELETE: boolean;
      UI_PERMISSIONS: number[];
    };
  }

  ```

#### **Version 1 (deprecated)**

```
SHELL_EVENTS.Version1.GET_PERMISSIONS
```

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

<!-- tabs:end -->

> Note: Below in the table you can see some common object types.

| objectName  | Description                                              |
| ----------- | -------------------------------------------------------- |
| ACTIVITY    | Permissions about the business data object "Activity"    |
| SERVICECALL | Permissions about the business data object "ServiceCall" |

- ### GET_SETTINGS

  With this event you can get company specific settings. You can find the available settings in the FSM admin page in "Companies -> select a company -> Company Settings". Here you can create your own settings and fetch them with this event. You can also fetch the existing settings, but consider that many of them are more specific to FSM applications and have a internal mapping. Therefore, you can not fetch them with the key of the company settings from the admin page. In case you need some of these settings, then please contact us. [Here](https://help.sap.com/viewer/fsm_admin/Cloud/en-US/companies.html) you can find more information about companies.

  ```
  SHELL_EVENTS.Version1.GET_SETTINGS
  ```

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
    sdk.on(SHELL_EVENTS.Version1.GET_SETTINGS, (value) => {
      console.log(`item is now ${value}`);
    });
    ```

> Note: Below in the table you can see some common keys.

| Key                               | value type | Description                                                                                                                  |
| --------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| userPerson                        | object     | User specific information like name, mail and crowdType                                                                      |
| CoreSystems.FSM.StandaloneCompany | boolean    | [Here](https://help.sap.com/viewer/fsm_admin/Cloud/en-US/companies.html) you can find information about standalone companies |

- ### GET_STORAGE_ITEM

With this event you can get user specific settings. You can find the available settings in the FSM admin page in "Users -> select a user -> User Settings". [Here](https://help.sap.com/viewer/fsm_admin/Cloud/en-US/users.html) you can find more information about users.

<!-- tabs:start -->

#### **Version 2**

```
SHELL_EVENTS.Version2.GET_STORAGE_ITEM
```

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

#### **Version 1 (deprecated)**

```
SHELL_EVENTS.Version1.GET_STORAGE_ITEM
```

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

<!-- tabs:end -->

> Note: Below in the table you can see some common keys.

| Key                         | value type | Description                          |
| --------------------------- | ---------- | ------------------------------------ |
| Cockpit_SelectedCompanyName | string     | Name of the current selected company |
| Cockpit_SelectedLocale      | string     | Current selected locale              |

- ### SET_STORAGE_ITEM

  ```
  SHELL_EVENTS.Version1.SET_STORAGE_ITEM
  ```

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

- ### GET_FEATURE_FLAG

  Feature flags are in internally used flags in FSM to control some new features when the preview mode is off.

  ```
  SHELL_EVENTS.Version1.GET_FEATURE_FLAG
  ```

  Request feature flag value from shell host

- Request payload

  type: GetFeatureFlagRequest  
  object containing key name and default value for feature flag to get

  ```typescript
  {
    key: string;
    defaultValue: boolean;
  }
  ```

- Response payload

  type: GetFeatureFlagResponse  
  object containing key name and value for feature flag

  ```typescript
  {
    key: string;
    value: boolean;
  }
  ```

- Listenner

  ```typescript
  sdk.on(SHELL_EVENTS.Version1.GET_FEATURE_FLAG, (response) => {
    console.log(`${response.key} is now ${response.value}`);
  });
  ```

- ### SET_TITLE

  ```
  SHELL_EVENTS.Version1.SET_TITLE
  ```

  Set title of the shell browser window to value provided in payload.
  Previous title will be internally stored in the shell host application.

  - Request payload

    type: SetTitleRequest  
    object containing `title` key which holds value to set title to

    ```typescript
    {
      title: string;
    }
    ```

  - No response will be sent

- ### RESTORE_TITLE

  ```
  SHELL_EVENTS.Version1.RESTORE_TITLE
  ```

  Restore document title to the value internally stored during previous SET_TITLE
  event handling. If no stored title found, handling this event will do nothing.

  - No request payload need to be provided

  - No response will be sent

## Modal specific events

Applciations can request do display a modal with a specified URL. Events include opening and closing. You can also use the function `isInsideShellModal()` to know if your application run inside a Shell modal.

- ### MODAL.OPEN

  Open a modal using `SHELL_EVENTS.Version1.MODAL.OPEN` event from your application. You can specify `modalSettings` like a title or the modal size.
  Additionally, you can provide identification data using the `data` property, and you will receive it back on a subsequent `Version1.MODAL.CLOSE` event when the modal closes.

  ```
  this.sdk.emit(SHELL_EVENTS.Version1.MODAL.OPEN, {
    url: 'https://example.com',
    modalSettings: {
      title: 'My title',
      size: 'l'| 'm' | 's',
    },
    data: { id: 'bc251c53-a71f-4924-bf3b-b265be96b71b' } // no schema, you can pass anything as 'data'
  });
  ```

- ### MODAL.CLOSE

  Request closing of the open modal using `SHELL_EVENTS.Version1.MODAL.CLOSE` from your application or the opened modal. An object can be passed as parameter to be send back to the application which opened the modal.

  ```typescript
  this.sdk.emit(SHELL_EVENTS.Version1.MODAL.CLOSE);
  ```

  An application can listen to the same event to trigger code on closing. This event is only received if the application emited the OPEN event.

  ```typescript
  this.sdk.on(SHELL_EVENTS.Version1.MODAL.CLOSE, (data) => {
    // React to the closing of the modal
    // If MODAL.OPEN was passed an argument, it will be provided here.
  });
  ```

## Extension specific events

ShellSdk provide a set of features which are specifically designed to allow communications with extensions running inside an application.

- ### VIEW STATE

  View State event provide a shared context between all local instance.

  As you might need to share between your application and extensions a general context to provide consistent UI, ShellSdk let applications share any `{ key: value }` object through the ViewState entity. You can update the using the `setViewState(key, value)` method. ViewState is not persistent and will be deleted when user navigate outside of the application. ViewState is not allowed to use in an extension for security reason, and will throw generic error object.

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

- ### TO_APP

  ```
  SHELL_EVENTS.Version1.TO_APP
  ```

  You can send any data from any extension to the main application using the `TO_APP` event.

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

## Events versioning

Event name includes version part which allow to keep back compatibility when data formats in request or
response payload needs to be changed.

Below sample event name for the event which has version 2:

```
SHELL_EVENTS.Version2.GET_PERMISSIONS
```

Events supporting new data formats will be published under next
version, while previous data formats still available under previous version number. This way application
able to keep using previous event version without immediate need to switch to the new data formats. Switch
to the next event version can be done later when particular application ready for new payload data format.

Whilst previous event versions can be used in alredy developed applications for back compatibility, it is
recommended to use latest event versions when building new applications which using fsm-shell library.
