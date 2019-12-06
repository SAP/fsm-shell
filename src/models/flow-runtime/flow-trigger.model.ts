
import { ParameterDefinition } from './parameter-definition.model';

export interface FlowTrigger {
  name: string;
  description: string | undefined | null;
  help: string | undefined | null;
  trigger: string;
  icon: string | undefined | null;
  parameters: ParameterDefinition[];
}