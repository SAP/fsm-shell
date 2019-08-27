# Client library for applications rendered in FSM shell host

## Responsibilities:

- communication to host (ask for data from the host, see events section)
- receive data publish by the host 

## Install dev dependencies and build library:

- `npm install`
- `npm run build`

## API Documentation

- [SHELL-SDK Version1 events](#SHELL-SDK-Version1-events)
  - [V1.REQUIRE_CONTEXT](#V1.REQUIRE.CONTEXT)
  - [V1.GET_PERMISSIONS](#V1.GET.PERMISSIONS)
  - [V1.GET_SETTINGS](#V1.GET.SETTINGS)
  - [V1.GET_STORAGE_ITEM](#V1.GET.STORAGE.ITEM)
  - [V1.SET_STORAGE_ITEM](#V1.SET.STORAGE.ITEM)
  - [V1.START_FLOW](#V1.START.FLOW)
- [FLOW-RUNTIME Version1 events](#FLOW-RUNTIME-Version1-events)
  - [V1.FLOWS.REQUIRE_CONTEXT](#V1.FLOWS.REQUIRE.CONTEXT)
- [Generic events](#generic-events)
  - [ERROR](#error)

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
      userAccountFeatureFlagsEnabled: boolean;
      userAccountFeatureFlagsUserId: string;
      initialContext?: [
        {
          name: string;
          value: any;
        }
      ];
    }
    ```
  
  ### Generic events

  - #### ERROR  
    Will be emitted in response to any of request events in case if error occurs during handling the event.

    - Payload

      type: string  
      string representation of the error object
