import { OrgDataFilterKey } from './org-data-filter-key.enum';
import { OrgLevel, OrgLevelAllocation } from './org-level.model';

export interface GetOrgDataResponse {
  key: OrgDataFilterKey;
  data: OrgLevel | OrgLevelAllocation[];
}
