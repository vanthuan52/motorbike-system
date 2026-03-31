import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { EnumAuthStatusCodeError } from '@/modules/auth/enums/auth.status-code.enum';
import { EnumPolicyStatusCodeError } from '@/modules/policy/enums/policy.status-code.enum';
import { PolicyAbilityFactory } from '@/modules/policy/factories/policy.factory';
import { IPolicyService } from '@/modules/policy/interfaces/policy.service.interface';
import { IPolicyAbility } from '@/modules/policy/interfaces/policy.interface';

@Injectable()
export class PolicyService implements IPolicyService {
  constructor(private readonly policyAbilityFactory: PolicyAbilityFactory) {}

  async validatePolicyGuard(
    request: IRequestApp,
    requiredAbilities: IPolicyAbility[]
  ): Promise<boolean> {
    const { __user, user, __abilities } = request;

    if (!__user || !user) {
      throw new ForbiddenException({
        statusCode: EnumAuthStatusCodeError.jwtAccessTokenInvalid,
        message: 'auth.error.accessTokenUnauthorized',
      });
    }

    if (requiredAbilities.length === 0) {
      throw new InternalServerErrorException({
        statusCode: EnumPolicyStatusCodeError.predefinedNotFound,
        message: 'policy.error.predefinedNotFound',
      });
    }

    const userAbilities = this.policyAbilityFactory.createForUser(
      __abilities ?? []
    );
    const policyHandler = this.policyAbilityFactory.handlerAbilities(
      userAbilities,
      requiredAbilities
    );
    if (!policyHandler) {
      throw new ForbiddenException({
        statusCode: EnumPolicyStatusCodeError.forbidden,
        message: 'policy.error.forbidden',
      });
    }

    return true;
  }
}
