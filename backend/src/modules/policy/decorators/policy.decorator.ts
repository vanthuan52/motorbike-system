import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { IPolicyAbility } from '../interfaces/policy.interface';
import { PolicyAbilityGuard } from '../guards/policy.ability.guard';
import {
  POLICY_ABILITY_META_KEY,
  POLICY_ROLE_META_KEY,
} from '../constants/policy.constant';
import { ENUM_POLICY_ROLE_TYPE } from '../enums/policy.enum';
import { PolicyRoleGuard } from '../guards/policy.role.guard';

export function PolicyAbilityProtected(
  ...handlers: IPolicyAbility[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(PolicyAbilityGuard),
    SetMetadata(POLICY_ABILITY_META_KEY, handlers),
  );
}

export function PolicyRoleProtected(
  ...roles: ENUM_POLICY_ROLE_TYPE[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(PolicyRoleGuard),
    SetMetadata(POLICY_ROLE_META_KEY, roles),
  );
}
