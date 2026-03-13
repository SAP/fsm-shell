import * as Ajv from 'ajv';
import * as draft6MetaSchema from 'ajv/lib/refs/json-schema-draft-06.json';
import * as draft4MetaSchema from 'ajv/lib/refs/json-schema-draft-04.json';

import { authRequest_v1_schema } from './authentication/auth-request.v1.schema';
import { authResponse_v1_schema } from './authentication/auth-response.v1.schema';

import { getItemRequest_v1_schema } from './cloud-storage/get-item-request.v1.schema';
import { getItemRequest_v2_schema } from './cloud-storage/get-item-request.v2.schema';
import { getItemResponse_v1_schema } from './cloud-storage/get-item-response.v1.schema';
import { getItemResponse_v2_schema } from './cloud-storage/get-item-response.v2.schema';
import { setItemRequest_v1_schema } from './cloud-storage/set-item-request.v1.schema';

import { getFeatureFlagRequest_v1_schema } from './feature-flag/get-feature-flag-request.v1.schema';
import { getFeatureFlagResponse_v1_schema } from './feature-flag/get-feature-flag-response.v1.schema';

import { setTitleRequest_v1_schema } from './generic/set-title-request.v1.schema';

import { modalOpenRequest_v1_schema } from './modal/modal-open-request.v1.schema';
import { modalOpenRequest_v2_schema } from './modal/modal-open-request.v2.schema';
import { modalCloseRequest_v1_schema } from './modal/modal-close-request.v1.schema';

import { getPermissionsRequest_v1_schema } from './permissions/get-permissions-request.v1.schema';
import { getPermissionsRequest_v2_schema } from './permissions/get-permissions-request.v2.schema';
import { getPermissionsRequest_v3_schema } from './permissions/get-permissions-request.v3.schema';
import { getPermissionsResponse_v1_schema } from './permissions/get-permissions-response.v1.schema';
import { getPermissionsResponse_v2_schema } from './permissions/get-permissions-response.v2.schema';
import { getPermissionsResponse_v3_schema } from './permissions/get-permissions-response.v3.schema';

import { requireContextRequest_v1_schema } from './require-context/require-context-request.v1.schema';

import { getSettingsRequest_v1_schema } from './settings/get-settings-request.v1.schema';
import { getSettingsResponse_v1_schema } from './settings/get-settings-response.v1.schema';

import { setViewStateRequest_v1_schema } from './view-state/set-view-state-request.v1.schema';
import { setViewStateResponse_v1_schema } from './view-state/set-view-state-response.v1.schema';

import { outletsRequestContextRequest_v1_schema } from './outlets/outlets-request-context-request.v1.schema';
import { outletsRequestContextResponse_v1_schema } from './outlets/outlets-request-context-response.v1.schema';
import { outletsAddPluginRequest_v1_schema } from './outlets/outlets-add-plugin-request.v1.schema';
import { outletsRemovePluginRequest_v1_schema } from './outlets/outlets-remove-plugin-request.v1.schema';
import { outletsRequestDynamicContextRequest_v1_schema } from './outlets/outlets-request-dynamic-context-request.v1.schema';
import { outletsRequestDynamicContextResponse_v1_schema } from './outlets/outlets-request-dynamic-context-response.v1.schema';

// Valid objects for each schema
export const validAuthRequest_v1 = { response_type: 'token' };
export const validAuthResponse_v1 = { access_token: 'string', expires_in: 123, token_type: 'string' };
export const validGetItemRequest_v1 = 'string';
export const validGetItemRequest_v2 = 'string';
export const validGetItemResponse_v2 = { key: 'string', value: {} };
export const validSetItemRequest_v1 = { key: 'string', value: {} };
export const validGetFeatureFlagRequest_v1_subschema_1 = { key: 'string', defaultValue: true };
export const validGetFeatureFlagRequest_v1_subschema_2 = [{ key: 'string', defaultValue: true }];
export const validGetFeatureFlagResponse_v1 = { key: 'string', value: true };
export const validSetTitleRequest_v1 = { title: 'string' };
export const validModalOpenRequest_v1 = { url: 'string', modalSettings: { title: 'string', size: 'l', backdropClickCloseable: true, isScrollbarHidden: true }, data: {} };
export const validModalOpenRequest_v2 = {
  url: 'string',
  modalSettings: {
    title: 'string',
    showTitleHeader: true,
    hasBackdrop: true,
    backdropClickCloseable: true,
    escKeyCloseable: true,
    focusTrapped: true,
    fullScreen: true,
    mobile: true,
    mobileOuterSpacing: true,
    draggable: true,
    resizable: true,
    width: 'string',
    height: 'string',
    minHeight: 'string',
    maxHeight: 'string',
    minWidth: 'string',
    maxWidth: 'string',
    isScrollbarHidden: true
  },
  data: {},
  sandboxPolicies: ['allow-scripts', 'allow-same-origin']
};
export const validModalCloseRequest_v1 = {};
export const validGetPermissionsRequest_v1 = { objectName: 'string', owners: ['string'] };
export const validGetPermissionsRequest_v2 = { objectName: 'string', owners: ['string'] };
export const validGetPermissionsRequest_v3 = { objectName: 'string' };
export const validGetPermissionsResponse_v1 = { CREATE: true, READ: true, UPDATE: true, DELETE: true, UI_PERMISSIONS: [1] };
export const validGetPermissionsResponse_v2 = { objectName: 'string', owners: ['string'], permission: validGetPermissionsResponse_v1 };
export const validGetPermissionsResponse_v3 = { objectName: 'string', permission: validGetPermissionsResponse_v1 };
export const validRequireContextRequest_v1 = {
  clientIdentifier: 'string',
  clientSecret: 'string',
  cloudStorageKeys: ['string'],
  auth: validAuthRequest_v1,
  targetOutletName: 'string',
  targetExtensionAssignmentId: 'string'
};
export const validGetSettingsRequest_v1_subschema_1 = 'string';
export const validGetSettingsRequest_v1_subschema_2 = ['string'];
export const validGetSettingsRequest_v1_subschema_3 = [['string']];
export const validGetSettingsRequest_v1_subschema_4 = ['string', ['string']];
export const validGetSettingsResponse_v1 = { key: 'string', value: {} };
export const validSetViewStateRequest_v1 = { key: 'string', value: {} };
export const validSetViewStateResponse_v1 = { key: 'string', value: {} };
export const validOutletsRequestContextRequest_v1 = { target: 'string', assignmentId: 'string', showMocks: true, outletSettings: {} };
export const validOutletsRequestContextResponse_v1 = {
  target: 'string',
  isRootNodeHttps: true,
  isConfigurationMode: true,
  isPreviewActive: true,
  plugin: {
    name: 'string',
    url: 'string',
    optimalHeight: 'string',
    useShellSDK: true,
    isActive: true,
    sandboxPolicies: ['string'],
    assignmentId: 'string'
  }
};
export const validOutletsAddPluginRequest_v1 = { target: 'string' };
export const validOutletsRemovePluginRequest_v1 = { target: 'string' };
export const validOutletsRequestDynamicContextRequest_v1 = { target: 'string', outletSettings: {} };
export const validOutletsRequestDynamicContextResponse_v1 = {
  target: 'string',
  isRootNodeHttps: true,
  isConfigurationMode: true,
  areDynamicOutletsEnabled: true,
  isPreviewActive: true,
  plugins: [{
    name: 'string',
    url: 'string',
    optimalHeight: 'string',
    useShellSDK: true,
    isActive: true,
    sandboxPolicies: ['string'],
    assignmentId: 'string'
  }]
};

// Invalid objects for each schema
export const invalidAuthRequest_v1 = { response_type: 123 };
export const invalidAuthResponse_v1 = { access_token: 123, expires_in: 'not-a-number', token_type: false };
export const invalidGetItemRequest_v1 = 123;
export const invalidGetItemRequest_v2 = false;
export const invalidGetItemResponse_v2 = { key: 123 };
export const invalidSetItemRequest_v1 = { key: 123 };
export const invalidGetFeatureFlagRequest_v1 = [{ key: 123, defaultValue: 'not-bool' }];
export const invalidGetFeatureFlagResponse_v1 = { key: 123, value: 'not-bool' };
export const invalidSetTitleRequest_v1 = { title: 123 };
export const invalidModalOpenRequest_v1 = { url: 123, modalSettings: { title: 123, size: 'x', backdropClickCloseable: 'no', isScrollbarHidden: 'no' }, data: 123 };
export const invalidModalOpenRequest_v2 = {
  url: 123,
  modalSettings: {
    title: 123,
    showTitleHeader: 'no',
    hasBackdrop: 'no',
    backdropClickCloseable: 'no',
    escKeyCloseable: 'no',
    focusTrapped: 'no',
    fullScreen: 'no',
    mobile: 'no',
    mobileOuterSpacing: 'no',
    draggable: 'no',
    resizable: 'no',
    width: 123,
    height: 123,
    minHeight: 123,
    maxHeight: 123,
    minWidth: 123,
    maxWidth: 123,
    isScrollbarHidden: 'no'
  },
  data: 123,
  sandboxPolicies: [123, 456]
};
export const invalidModalCloseRequest_v1 = [];
export const invalidGetPermissionsRequest_v1 = { objectName: 123, owners: 'not-array' };
export const invalidGetPermissionsRequest_v2 = { objectName: 123, owners: [123] };
export const invalidGetPermissionsRequest_v3 = { objectName: 123 };
export const invalidGetPermissionsResponse_v1 = { CREATE: 'yes', READ: 'yes', UPDATE: 'yes', DELETE: 'yes', UI_PERMISSIONS: ['not-number'] };
export const invalidGetPermissionsResponse_v2 = { objectName: 123, owners: 'not-array', permission: {} };
export const invalidGetPermissionsResponse_v3 = { objectName: 123, permission: {} };
export const invalidRequireContextRequest_v1 = {
  clientIdentifier: 123,
  clientSecret: 123,
  cloudStorageKeys: 'not-array',
  auth: {},
  targetOutletName: 123,
  targetExtensionAssignmentId: 123
};
export const invalidGetSettingsRequest_v1 = 123;
export const invalidGetSettingsResponse_v1 = { key: 123, value: undefined };
export const invalidSetViewStateRequest_v1 = { key: 123 };
export const invalidSetViewStateResponse_v1 = { key: 123 };
export const invalidOutletsRequestContextRequest_v1 = { target: 123, assignmentId: 123, showMocks: 'yes', outletSettings: 123 };
export const invalidOutletsRequestContextResponse_v1 = { 
  target: 123,
  isRootNodeHttps: 'yes',
  isConfigurationMode: 'yes',
  isPreviewActive: 'yes',
  plugin: {
    name: 123,
    url: 123,
    optimalHeight: 123,
    useShellSDK: 'yes',
    isActive: 'yes',
    sandboxPolicies: [123],
    assignmentId: 123
  }
};
export const invalidOutletsAddPluginRequest_v1 = { target: 123 };
export const invalidOutletsRemovePluginRequest_v1 = { target: 123 };
export const invalidOutletsRequestDynamicContextRequest_v1 = { target: 123, outletSettings: 123 };
export const invalidOutletsRequestDynamicContextResponse_v1 = {
  target: 123,
  isRootNodeHttps: 'yes',
  isConfigurationMode: 'yes',
  areDynamicOutletsEnabled: 'yes',
  isPreviewActive: 'yes',
  plugins: [{
    name: 123,
    url: 123,
    optimalHeight: 123,
    useShellSDK: 'yes',
    isActive: 'yes',
    sandboxPolicies: [123],
    assignmentId: 123
  }]
};

describe('Schemas', () => {

  let ajv07 = new Ajv(); // Ajv v6 supports draft-07 by default
  let ajv06 = new Ajv({ meta: draft6MetaSchema });

  (draft4MetaSchema as any).$id = 'http://json-schema.org/draft-04/schema#';
  let ajv04 = new Ajv({ meta: draft4MetaSchema });

  function validateSchemaHelper(ajv: Ajv.Ajv, schemaName: string, schema: object) {
    const isValid = ajv.validateSchema(schema);
    // If the schema is invalid, throw an error with the validation errors from Ajv. This will help us identify and fix any issues with the schemas.
    if (isValid === false) {
      const errorObject = {
        schemaName,
        errors: { ...ajv.errors }
      };
      throw new Error(JSON.stringify(errorObject, null, 2));
    } else {
      expect(isValid).toBeTrue();
    }
  }

  function validateSchemasSupporting04and06and07(ajv: Ajv.Ajv) {
    validateSchemaHelper(ajv, 'authRequest_v1_schema', authRequest_v1_schema);
    validateSchemaHelper(ajv, 'authResponse_v1_schema', authResponse_v1_schema);
    validateSchemaHelper(ajv, 'getItemRequest_v1_schema', getItemRequest_v1_schema);
    validateSchemaHelper(ajv, 'getItemRequest_v2_schema', getItemRequest_v2_schema);
    validateSchemaHelper(ajv, 'getItemResponse_v1_schema', getItemResponse_v1_schema);
    validateSchemaHelper(ajv, 'getItemResponse_v2_schema', getItemResponse_v2_schema);
    validateSchemaHelper(ajv, 'setItemRequest_v1_schema', setItemRequest_v1_schema);
    validateSchemaHelper(ajv, 'getFeatureFlagRequest_v1_schema', getFeatureFlagRequest_v1_schema);
    validateSchemaHelper(ajv, 'getFeatureFlagResponse_v1_schema', getFeatureFlagResponse_v1_schema);
    validateSchemaHelper(ajv, 'setTitleRequest_v1_schema', setTitleRequest_v1_schema);
    validateSchemaHelper(ajv, 'modalOpenRequest_v1_schema', modalOpenRequest_v1_schema);
    validateSchemaHelper(ajv, 'modalOpenRequest_v2_schema', modalOpenRequest_v2_schema);
    validateSchemaHelper(ajv, 'modalCloseRequest_v1_schema', modalCloseRequest_v1_schema);
    validateSchemaHelper(ajv, 'getPermissionsRequest_v1_schema', getPermissionsRequest_v1_schema);
    validateSchemaHelper(ajv, 'getPermissionsRequest_v2_schema', getPermissionsRequest_v2_schema);
    validateSchemaHelper(ajv, 'getPermissionsRequest_v3_schema', getPermissionsRequest_v3_schema);
    validateSchemaHelper(ajv, 'getPermissionsResponse_v1_schema', getPermissionsResponse_v1_schema);
    validateSchemaHelper(ajv, 'getPermissionsResponse_v2_schema', getPermissionsResponse_v2_schema);
    validateSchemaHelper(ajv, 'getPermissionsResponse_v3_schema', getPermissionsResponse_v3_schema);
    validateSchemaHelper(ajv, 'requireContextRequest_v1_schema', requireContextRequest_v1_schema);
    validateSchemaHelper(ajv, 'getSettingsRequest_v1_schema', getSettingsRequest_v1_schema);
    validateSchemaHelper(ajv, 'getSettingsResponse_v1_schema', getSettingsResponse_v1_schema);
    validateSchemaHelper(ajv, 'setViewStateRequest_v1_schema', setViewStateRequest_v1_schema);
    validateSchemaHelper(ajv, 'setViewStateResponse_v1_schema', setViewStateResponse_v1_schema);
    validateSchemaHelper(ajv, 'outletsRequestContextRequest_v1_schema', outletsRequestContextRequest_v1_schema);
    validateSchemaHelper(ajv, 'outletsRequestContextResponse_v1_schema', outletsRequestContextResponse_v1_schema);
    validateSchemaHelper(ajv, 'outletsAddPluginRequest_v1_schema', outletsAddPluginRequest_v1_schema);
    validateSchemaHelper(ajv, 'outletsRemovePluginRequest_v1_schema', outletsRemovePluginRequest_v1_schema);
    validateSchemaHelper(ajv, 'outletsRequestDynamicContextRequest_v1_schema', outletsRequestDynamicContextRequest_v1_schema);
  }

  function validateSchemasSupportingOnly06and07(ajv: Ajv.Ajv) {
    // outletsRequestDynamicContextResponse_v1_schema has an optional array property called "plugins",
    // which contains objects with an optional array property called "sandboxPolicies". Draft-04 does not
    // support this "optional array" inside "optional array", while draft-06 and draft-07 do.
    validateSchemaHelper(ajv, 'outletsRequestDynamicContextResponse_v1_schema', outletsRequestDynamicContextResponse_v1_schema);
  }

  function validateValidDataAgainstSchemaHelper(ajv: Ajv.Ajv, schemaName: string, schema: object, data: any) {
    const validationFunction = ajv.compile(schema);
    const isValid = validationFunction(data);
    // If the data is invalid, throw an error with the validation errors from Ajv. This will help us identify and fix any issues with the schemas or the test data.
    if (isValid === false) {
      const errorObject = {
        schemaName,
        errors: { ...validationFunction.errors }
      };
      throw new Error(JSON.stringify(errorObject, null, 2));
    } else {
      expect(isValid).toBeTrue();
    }
  }

  /**
   * getItemResponse_v1_schema is an empty schema, which means that any data (valid or invalid) would pass validation against it.
   * Therefore, we are not including it in the valid data tests since it would not be meaningful.
   */
  function validateValidDataAgainstSchemaSupporting04and06and07(ajv: Ajv.Ajv) {
    validateValidDataAgainstSchemaHelper(ajv, 'authRequest_v1_schema', authRequest_v1_schema, validAuthRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'authResponse_v1_schema', authResponse_v1_schema, validAuthResponse_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getItemRequest_v1_schema', getItemRequest_v1_schema, validGetItemRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getItemRequest_v2_schema', getItemRequest_v2_schema, validGetItemRequest_v2);
    validateValidDataAgainstSchemaHelper(ajv, 'getItemResponse_v2_schema', getItemResponse_v2_schema, validGetItemResponse_v2);
    validateValidDataAgainstSchemaHelper(ajv, 'setItemRequest_v1_schema', setItemRequest_v1_schema, validSetItemRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getFeatureFlagRequest_v1_schema', getFeatureFlagRequest_v1_schema, validGetFeatureFlagRequest_v1_subschema_1);
    validateValidDataAgainstSchemaHelper(ajv, 'getFeatureFlagRequest_v1_schema', getFeatureFlagRequest_v1_schema, validGetFeatureFlagRequest_v1_subschema_2);
    validateValidDataAgainstSchemaHelper(ajv, 'getFeatureFlagResponse_v1_schema', getFeatureFlagResponse_v1_schema, validGetFeatureFlagResponse_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'setTitleRequest_v1_schema', setTitleRequest_v1_schema, validSetTitleRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'modalOpenRequest_v1_schema', modalOpenRequest_v1_schema, validModalOpenRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'modalOpenRequest_v2_schema', modalOpenRequest_v2_schema, validModalOpenRequest_v2);
    validateValidDataAgainstSchemaHelper(ajv, 'modalCloseRequest_v1_schema', modalCloseRequest_v1_schema, validModalCloseRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getPermissionsRequest_v1_schema', getPermissionsRequest_v1_schema, validGetPermissionsRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getPermissionsRequest_v2_schema', getPermissionsRequest_v2_schema, validGetPermissionsRequest_v2);
    validateValidDataAgainstSchemaHelper(ajv, 'getPermissionsRequest_v3_schema', getPermissionsRequest_v3_schema, validGetPermissionsRequest_v3);
    validateValidDataAgainstSchemaHelper(ajv, 'getPermissionsResponse_v1_schema', getPermissionsResponse_v1_schema, validGetPermissionsResponse_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getPermissionsResponse_v2_schema', getPermissionsResponse_v2_schema, validGetPermissionsResponse_v2);
    validateValidDataAgainstSchemaHelper(ajv, 'getPermissionsResponse_v3_schema', getPermissionsResponse_v3_schema, validGetPermissionsResponse_v3);
    validateValidDataAgainstSchemaHelper(ajv, 'requireContextRequest_v1_schema', requireContextRequest_v1_schema, validRequireContextRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'getSettingsRequest_v1_schema', getSettingsRequest_v1_schema, validGetSettingsRequest_v1_subschema_1);
    validateValidDataAgainstSchemaHelper(ajv, 'getSettingsRequest_v1_schema', getSettingsRequest_v1_schema, validGetSettingsRequest_v1_subschema_2);
    validateValidDataAgainstSchemaHelper(ajv, 'getSettingsRequest_v1_schema', getSettingsRequest_v1_schema, validGetSettingsRequest_v1_subschema_3);
    validateValidDataAgainstSchemaHelper(ajv, 'getSettingsRequest_v1_schema', getSettingsRequest_v1_schema, validGetSettingsRequest_v1_subschema_4);
    validateValidDataAgainstSchemaHelper(ajv, 'getSettingsResponse_v1_schema', getSettingsResponse_v1_schema, validGetSettingsResponse_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'setViewStateRequest_v1_schema', setViewStateRequest_v1_schema, validSetViewStateRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'setViewStateResponse_v1_schema', setViewStateResponse_v1_schema, validSetViewStateResponse_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'outletsRequestContextRequest_v1_schema', outletsRequestContextRequest_v1_schema, validOutletsRequestContextRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'outletsRequestContextResponse_v1_schema', outletsRequestContextResponse_v1_schema, validOutletsRequestContextResponse_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'outletsAddPluginRequest_v1_schema', outletsAddPluginRequest_v1_schema, validOutletsAddPluginRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'outletsRemovePluginRequest_v1_schema', outletsRemovePluginRequest_v1_schema, validOutletsRemovePluginRequest_v1);
    validateValidDataAgainstSchemaHelper(ajv, 'outletsRequestDynamicContextRequest_v1_schema', outletsRequestDynamicContextRequest_v1_schema, validOutletsRequestDynamicContextRequest_v1);
  }

  function validateValidDataAgainstSchemaSupportingOnly06and07(ajv: Ajv.Ajv) {
    // outletsRequestDynamicContextResponse_v1_schema has an optional array property called "plugins",
    // which contains objects with an optional array property called "sandboxPolicies". Draft-04 does not
    // support this "optional array" inside "optional array", while draft-06 and draft-07 do.
    validateValidDataAgainstSchemaHelper(ajv, 'outletsRequestDynamicContextResponse_v1_schema', outletsRequestDynamicContextResponse_v1_schema, validOutletsRequestDynamicContextResponse_v1);
  }

  function validateInvalidDataAgainstSchemaHelper(ajv: Ajv.Ajv, schemaName: string, schema: object, data: any) {
    const validationFunction = ajv.compile(schema);
    const isValid = validationFunction(data);
    // If the data is valid even if it is expected to be invalid, throw an error with the schema name to indicate the test failure.
    if (isValid === true) {
      throw new Error(`Expected validation to fail for schema: ${schemaName}`);
    } else {
      expect(isValid).toBeFalse();
    }
  }

  /**
   * getItemResponse_v1_schema is an empty schema, which means that any data (valid or invalid) would pass validation against it.
   * Therefore, we are not including it in the invalid data tests since it would not be meaningful.
   */
  function validateInvalidDataAgainstSchemaSupporting04and06and07(ajv: Ajv.Ajv) {
    validateInvalidDataAgainstSchemaHelper(ajv, 'authRequest_v1_schema', authRequest_v1_schema, invalidAuthRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'authResponse_v1_schema', authResponse_v1_schema, invalidAuthResponse_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getItemRequest_v1_schema', getItemRequest_v1_schema, invalidGetItemRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getItemRequest_v2_schema', getItemRequest_v2_schema, invalidGetItemRequest_v2);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getItemResponse_v2_schema', getItemResponse_v2_schema, invalidGetItemResponse_v2);
    validateInvalidDataAgainstSchemaHelper(ajv, 'setItemRequest_v1_schema', setItemRequest_v1_schema, invalidSetItemRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getFeatureFlagRequest_v1_schema', getFeatureFlagRequest_v1_schema, invalidGetFeatureFlagRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getFeatureFlagResponse_v1_schema', getFeatureFlagResponse_v1_schema, invalidGetFeatureFlagResponse_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'setTitleRequest_v1_schema', setTitleRequest_v1_schema, invalidSetTitleRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'modalOpenRequest_v1_schema', modalOpenRequest_v1_schema, invalidModalOpenRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'modalOpenRequest_v2_schema', modalOpenRequest_v2_schema, invalidModalOpenRequest_v2);
    validateInvalidDataAgainstSchemaHelper(ajv, 'modalCloseRequest_v1_schema', modalCloseRequest_v1_schema, invalidModalCloseRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getPermissionsRequest_v1_schema', getPermissionsRequest_v1_schema, invalidGetPermissionsRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getPermissionsRequest_v2_schema', getPermissionsRequest_v2_schema, invalidGetPermissionsRequest_v2);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getPermissionsRequest_v3_schema', getPermissionsRequest_v3_schema, invalidGetPermissionsRequest_v3);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getPermissionsResponse_v1_schema', getPermissionsResponse_v1_schema, invalidGetPermissionsResponse_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getPermissionsResponse_v2_schema', getPermissionsResponse_v2_schema, invalidGetPermissionsResponse_v2);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getPermissionsResponse_v3_schema', getPermissionsResponse_v3_schema, invalidGetPermissionsResponse_v3);
    validateInvalidDataAgainstSchemaHelper(ajv, 'requireContextRequest_v1_schema', requireContextRequest_v1_schema, invalidRequireContextRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getSettingsRequest_v1_schema', getSettingsRequest_v1_schema, invalidGetSettingsRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'getSettingsResponse_v1_schema', getSettingsResponse_v1_schema, invalidGetSettingsResponse_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'setViewStateRequest_v1_schema', setViewStateRequest_v1_schema, invalidSetViewStateRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'setViewStateResponse_v1_schema', setViewStateResponse_v1_schema, invalidSetViewStateResponse_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'outletsRequestContextRequest_v1_schema', outletsRequestContextRequest_v1_schema, invalidOutletsRequestContextRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'outletsRequestContextResponse_v1_schema', outletsRequestContextResponse_v1_schema, invalidOutletsRequestContextResponse_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'outletsAddPluginRequest_v1_schema', outletsAddPluginRequest_v1_schema, invalidOutletsAddPluginRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'outletsRemovePluginRequest_v1_schema', outletsRemovePluginRequest_v1_schema, invalidOutletsRemovePluginRequest_v1);
    validateInvalidDataAgainstSchemaHelper(ajv, 'outletsRequestDynamicContextRequest_v1_schema', outletsRequestDynamicContextRequest_v1_schema, invalidOutletsRequestDynamicContextRequest_v1);
  }

  function validateInvalidDataAgainstSchemaSupportingOnly06and07(ajv: Ajv.Ajv) {
    // outletsRequestDynamicContextResponse_v1_schema has an optional array property called "plugins",
    // which contains objects with an optional array property called "sandboxPolicies". Draft-04 does not
    // support this "optional array" inside "optional array", while draft-06 and draft-07 do.
    validateInvalidDataAgainstSchemaHelper(ajv, 'outletsRequestDynamicContextResponse_v1_schema', outletsRequestDynamicContextResponse_v1_schema, invalidOutletsRequestDynamicContextResponse_v1);
  }

  it('should be valid draft-04 JSON schemas', () => {
    validateSchemasSupporting04and06and07(ajv04);
  });

  it('should be valid draft-06 JSON schemas', () => {
    validateSchemasSupporting04and06and07(ajv06);
    validateSchemasSupportingOnly06and07(ajv06);
  });

  it('should be valid draft-07 JSON schemas', () => {
    validateSchemasSupporting04and06and07(ajv07);
    validateSchemasSupportingOnly06and07(ajv07);
  });

  it('should validate valid data as correct - draft-04 JSON schemas', () => {
    validateValidDataAgainstSchemaSupporting04and06and07(ajv04);
  });

  it('should validate valid data as correct - draft-06 JSON schemas', () => {
    validateValidDataAgainstSchemaSupporting04and06and07(ajv06);
    validateValidDataAgainstSchemaSupportingOnly06and07(ajv06);
  });

  it('should validate valid data as correct - draft-07 JSON schemas', () => {
    validateValidDataAgainstSchemaSupporting04and06and07(ajv07);
    validateValidDataAgainstSchemaSupportingOnly06and07(ajv07);
  });

  it('should validate invalid data as incorrect - draft-04 JSON schemas', () => {
    validateInvalidDataAgainstSchemaSupporting04and06and07(ajv04);
  });

  it('should validate invalid data as incorrect - draft-06 JSON schemas', () => {
    validateInvalidDataAgainstSchemaSupporting04and06and07(ajv06);
    validateInvalidDataAgainstSchemaSupportingOnly06and07(ajv06);
  });

  it('should validate invalid data as incorrect - draft-07 JSON schemas', () => {
    validateInvalidDataAgainstSchemaSupporting04and06and07(ajv07);
    validateInvalidDataAgainstSchemaSupportingOnly06and07(ajv07);
  });
});
