import { InferSubjects, MongoAbility } from '@casl/ability';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

export type IPolicyAbilitySubject = InferSubjects<EnumPolicySubject> | 'all';

export type IPolicyAbilityRule = MongoAbility<
  [EnumPolicyAction, IPolicyAbilitySubject]
>;

/**
 * Represents an ability entry used to build CASL rules.
 * Derived from Permission entities or request abilities.
 */
export interface IPolicyAbilityInput {
  subject: string;
  action: string[];
}

export interface IPolicyAbility {
  subject: string;
  action: string[];
}
