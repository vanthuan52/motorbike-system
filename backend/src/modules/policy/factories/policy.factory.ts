import { Injectable } from '@nestjs/common';
import {
  IPolicyAbility,
  IPolicyAbilityRule,
  IPolicyAbilitySubject,
} from '../interfaces/policy.interface';
import { RolePermissionEntity } from '@/modules/role/entities/role.permission.entity';

import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
} from '@casl/ability';
import { ENUM_POLICY_ACTION } from '../enums/policy.enum';

@Injectable()
export class PolicyAbilityFactory {
  createForUser(permissions: RolePermissionEntity[]): IPolicyAbilityRule {
    const { can, build } = new AbilityBuilder<IPolicyAbilityRule>(
      createMongoAbility,
    );

    for (const permission of permissions) {
      can(permission.action, permission.subject);
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<IPolicyAbilitySubject>,
    });
  }

  handlerAbilities(
    userAbilities: IPolicyAbilityRule,
    abilities: IPolicyAbility[],
  ): boolean {
    return abilities.every((ability: IPolicyAbility) =>
      ability.action.every((action: ENUM_POLICY_ACTION) =>
        userAbilities.can(action, ability.subject),
      ),
    );
  }
}
