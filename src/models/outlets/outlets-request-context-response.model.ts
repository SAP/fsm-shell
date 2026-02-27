export interface OutletsRequestContextResponse {
  target?: string;
  isRootNodeHttps?: boolean;
  isConfigurationMode: boolean;
  plugin?: PluginForOutlet;
  isPreviewActive: boolean;
}

interface PluginForOutlet {
  name: string;
  url: string;
  optimalHeight?: string;
  useShellSDK?: boolean;
  isActive: boolean;
  sandboxPolicies?: string[];
  assignmentId?: string;
}
