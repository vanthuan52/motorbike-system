import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { IPolicyAbility } from '@/modules/policy/interfaces/policy.interface';

export interface IPolicyService {
  validatePolicyGuard(
    request: IRequestApp,
    requiredAbilities: IPolicyAbility[]
  ): Promise<boolean>;
}
