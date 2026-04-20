export interface OrgLevel {
  id: string;
  externalId: string | null;
  name: string;
  shortDescription: string | null;
  longDescription: string | null;
  validFrom: string | null;
  validTo: string | null;
  status: 'ENABLED' | 'DISABLED';
  subLevels?: OrgLevel[];
}

export type OrgLevelAllocationRole = 'MEMBER' | 'MANAGER';

export interface OrgLevelAllocation {
  id: string;
  externalId: string | null;
  level: Omit<OrgLevel, 'subLevels'>;
  role: OrgLevelAllocationRole;
  unifiedPersonId: string;
}
