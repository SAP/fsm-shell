import { authRequest_v1_schema } from './authentication/auth-request.v1.schema';
import { authResponse_v1_schema } from './authentication/auth-response.v1.schema';
import { requireContextRequest_v1_schema } from './require-context/require-context-request.v1.schema';

import { getItemRequest_v1_schema } from './cloud-storage/get-item-request.v1.schema';
import { getItemRequest_v2_schema } from './cloud-storage/get-item-request.v2.schema';
import { getItemResponse_v1_schema } from './cloud-storage/get-item-response.v1.schema';
import { getItemResponse_v2_schema } from './cloud-storage/get-item-response.v2.schema';
import { setItemRequest_v1_schema } from './cloud-storage/set-item-request.v1.schema';

import { getFeatureFlagRequest_v1_schema } from './feature-flag/get-feature-flag-request.v1.schema';
import { getFeatureFlagResponse_v1_schema } from './feature-flag/get-feature-flag-response.v1.schema';

import { setTitleRequest_v1_schema } from './generic/set-title-request.v1.schema';

import { modalOpenRequest_v1_schema } from './modal/modal-open-request.v1.schema';
import { modalCloseRequest_v1_schema } from './modal/modal-close-request.v1.schema';

import { getPermissionsRequest_v1_schema } from './permissions/get-permissions-request.v1.schema';
import { getPermissionsRequest_v2_schema } from './permissions/get-permissions-request.v2.schema';
import { getPermissionsResponse_v1_schema } from './permissions/get-permissions-response.v1.schema';
import { getPermissionsResponse_v2_schema } from './permissions/get-permissions-response.v2.schema';

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

import { SHELL_EVENTS } from '../../ShellEvents';

import { PayloadValidationFunction } from '../interfaces/payload-validator';

export interface PayloadValidationConfiguration {
  schema: object;
  validationFunction: PayloadValidationFunction | null;
}

export interface EventValidationConfiguration {
  [eventType: string]: {
    request?: PayloadValidationConfiguration;
    response?: PayloadValidationConfiguration;
  };
}

export const getEventValidationConfiguration =
  (): EventValidationConfiguration => ({
    [SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION]: {
      request: {
        schema: authRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: authResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.REQUIRE_CONTEXT]: {
      request: {
        schema: requireContextRequest_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.GET_STORAGE_ITEM]: {
      request: {
        schema: getItemRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: getItemResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version2.GET_STORAGE_ITEM]: {
      request: {
        schema: getItemRequest_v2_schema,
        validationFunction: null,
      },
      response: {
        schema: getItemResponse_v2_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.SET_STORAGE_ITEM]: {
      request: {
        schema: setItemRequest_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.GET_FEATURE_FLAG]: {
      request: {
        schema: getFeatureFlagRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: getFeatureFlagResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.SET_TITLE]: {
      request: {
        schema: setTitleRequest_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.MODAL.OPEN]: {
      request: {
        schema: modalOpenRequest_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.MODAL.CLOSE]: {
      request: {
        schema: modalCloseRequest_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.GET_PERMISSIONS]: {
      request: {
        schema: getPermissionsRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: getPermissionsResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version2.GET_PERMISSIONS]: {
      request: {
        schema: getPermissionsRequest_v2_schema,
        validationFunction: null,
      },
      response: {
        schema: getPermissionsResponse_v2_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.GET_SETTINGS]: {
      request: {
        schema: getSettingsRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: getSettingsResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.SET_VIEW_STATE]: {
      request: {
        schema: setViewStateRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: setViewStateResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.OUTLET.REQUEST_CONTEXT]: {
      request: {
        schema: outletsRequestContextRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: outletsRequestContextResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.OUTLET.REQUEST_DYNAMIC_CONTEXT]: {
      request: {
        schema: outletsRequestDynamicContextRequest_v1_schema,
        validationFunction: null,
      },
      response: {
        schema: outletsRequestDynamicContextResponse_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.OUTLET.ADD_PLUGIN]: {
      request: {
        schema: outletsAddPluginRequest_v1_schema,
        validationFunction: null,
      },
    },

    [SHELL_EVENTS.Version1.OUTLET.REMOVE_PLUGIN]: {
      request: {
        schema: outletsRemovePluginRequest_v1_schema,
        validationFunction: null,
      },
    },
  });
