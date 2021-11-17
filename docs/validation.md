# Events Payload Validation

## Overview

For fsm-shell library it is possible to enable events payload validation, which is optional and disabled by default. Validation will be performed against JSON schemas which provided within fsm-shell library to make
sure that payload structure for an event is consistent with payload type defined for that specific event.
This should help to prevent situation when event with invalid payload structure will be sent to the host
application.

In order to keep moderate size of fsm-shell package it doesn't include any library for JSON schema validation
and consuming application must provide it to fsm-shell library when validation need to be enabled. Next chapter
contains detailed instructions on how validation should be enabled and how to provide external library  
for JSON schema validation to fsm-shell.

When validation enabled it will be executed for each outgoing event when `shellSdk.emit` method called. In
case if validation passed successfully, event will be sent to the host application. If validation fails then
exception will be raised and event to the host application will not be sent.

## Providing validation library

Application consuming fsm shell library can provide validation logic based on external JSON schema
validation library by service which implements `PayloadValidator` interface defined in fsm-shell

`PayloadValidator` interface has following definition

```javascript
interface PayloadValidator {
  getValidationFunction(schema: object): PayloadValidationFunction;
}
```

The only method defined in that interface is `getValidationFunction` which should define 1 argument in
which JSON schema object will be provided. That schema should be used for further payload validation.
The method must return validation function with signature as following:

```javascript
type PayloadValidationFunction = (data: any) => PayloadValidationResponse;
```

Validation function will take payload from `data` argument and should validate it against JSON schema, provided
in `getValidationFunction` method call. Typically validation will be done by using 3-rd party library for
JSON schema validation. Validation function should return validation result of `PayloadValidationResponse` type
which shown below:

```javascript
interface PayloadValidationResponse {
  isValid: boolean;
  error?: any;
}
```

where:

- isValid: boolean value indicating if payload match to the JSON schema
- error: optional field which in case if payload doesn't match to JSON schema may contain additional
  details describing validation error. It is up to consuming application which additional information
  include in this property.

## Enabling validation

To enable validation the consumer of fsm-shell library should call `setValidator` method on ShellSdk instance.
Instance of the service which implements `PayloadValidator` interface must be passed as argument to this call.
It is recommended to call `setValidator` method right after initializing ShellSdk instance by calling `ShellSdk.init`.

Below shown sample code snippet for enabling validation:

```javascript
import { ShellSdk } from 'fsm-shell';
...
const shellSdk = ShellSdk.init(parent, '*');
shellSdk.setValidator(payloadValidationService);
```

## Validation errors: catching and handling

Validation if enabled will be triggered each time when outgoing event will be emitted with
`shellSdk.emit` method. If payload validation failed, exception will be raised. To catch the exception call to `shellSdk.emit` method should be wrapped to `try... catch` block and `catch` section should
contain code to handle the validation error.

```javascript
try {
  shellSdk.emit(event, payload);
} catch (error) {
  if (error instanceof PayloadValidationError) {
    console.log('Payload validation failed: ', error.message);
    console.log('Details: ', error.detail);
  }
}
```

Additional error information can be accessed via `error.detail` property.

## PayloadValidator service with Angular and Ajv validator example

Below sample implementation of payload validation service which using Ajv validator 3rd party library
for validating payload aginst JSON schema provided by fsm-shell.

```javascript
import { Injectable } from '@angular/core';
import { PayloadValidator, PayloadValidationFunction } from 'fsm-shell';
import * as Ajv from 'ajv';

@Injectable()
export class ShellPayloadValidationService implements PayloadValidator {

  private ajv = new Ajv();

  public getValidationFunction(schema: object): PayloadValidationFunction {
    const validationFunction = this.ajv.compile(schema);
    return (data: any) => {
      const isValid = validationFunction(data);
      if (!!isValid) {
        return { isValid: true };
      }
      return {
        isValid: false,
        error: validationFunction.errors
      };
    };
  }

}
```
