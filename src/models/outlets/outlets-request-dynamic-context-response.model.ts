export interface OutletsRequestDynamicContextResponse<T> {
  target: string;
  isRootNodeHttps: boolean;
  isConfigurationMode: boolean;
  areDynamicOutletsEnabled: boolean;
  plugins?: any[];
}
