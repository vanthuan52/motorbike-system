import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PolicyRequiredAbilityMetaKey } from '@/modules/policy/constants/policy.constant';
import { PolicyAbilityGuard } from '@/modules/policy/guards/policy.ability.guard';
import { IPolicyAbility } from '@/modules/policy/interfaces/policy.interface';

/**
 * Method decorator that applies policy ability-based protection guards.
 * @param requiredAbilities - List of { subject, action[] } required for access
 * @returns Combined decorators for policy ability validation
 */
export function PolicyAbilityProtected(
  ...requiredAbilities: IPolicyAbility[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(PolicyAbilityGuard),
    SetMetadata(PolicyRequiredAbilityMetaKey, requiredAbilities)
  );
}
