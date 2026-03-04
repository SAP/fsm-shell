export interface GetFeatureFlagRequest {
  key: string;
  defaultValue: boolean;
}

export interface GetFeatureFlagsRequest extends Array<GetFeatureFlagRequest>{}