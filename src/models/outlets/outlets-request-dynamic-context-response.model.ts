export interface OutletsRequestDynamicContextResponse {
  target?: string;
  isRootNodeHttps?: boolean;
  isConfigurationMode?: boolean;
  areDynamicOutletsEnabled?: boolean;
  plugins?: PluginForDynamicOutlet[];
  isPreviewActive: boolean;
}

interface PluginForDynamicOutlet {
  name: string;
  url: string;
  optimalHeight?: string;
  useShellSDK?: boolean;
  isActive: boolean;
  sandboxPolicies?: string[];
  assignmentId: string;
}
