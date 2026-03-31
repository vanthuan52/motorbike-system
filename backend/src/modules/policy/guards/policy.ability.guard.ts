import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { PolicyRequiredAbilityMetaKey } from '@/modules/policy/constants/policy.constant';
import { PolicyService } from '@/modules/policy/services/policy.service';
import { IPolicyAbility } from '@/modules/policy/interfaces/policy.interface';

/**
 * Guard that validates user access based on policy abilities and permissions.
 */
@Injectable()
export class PolicyAbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyService: PolicyService
  ) {}

  /**
   * Validates if the current user has the required abilities to access the resource.
   * @param context - NestJS execution context containing request information
   * @returns Promise that resolves to true if user has required abilities
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAbilities =
      this.reflector.get<IPolicyAbility[]>(
        PolicyRequiredAbilityMetaKey,
        context.getHandler()
      ) ?? [];

    const request = context.switchToHttp().getRequest<IRequestApp>();
    return this.policyService.validatePolicyGuard(request, requiredAbilities);
  }
}
