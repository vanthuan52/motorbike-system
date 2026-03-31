import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { EnumPolicyAction } from '@/modules/policy/enums/policy.enum';
import {
  IPolicyAbilityRule,
  IPolicyAbilitySubject,
  IPolicyAbilityInput,
} from '@/modules/policy/interfaces/policy.interface';
import { IPolicyAbility } from '@/modules/policy/interfaces/policy.interface';

/**
 * Factory class for creating and handling policy abilities using CASL library.
 * Builds CASL ability rules from permission-based abilities.
 */
@Injectable()
export class PolicyAbilityFactory {
  /**
   * Creates CASL ability rules from user's permission-based abilities.
   * @param abilities - Array of { subject, action[] } derived from Permission entities
   * @returns CASL ability rule object for the user
   */
  createForUser(abilities: IPolicyAbility[]): IPolicyAbilityRule {
    const { can, build } = new AbilityBuilder<IPolicyAbilityRule>(
      createMongoAbility
    );

    for (const ability of abilities) {
      for (const action of ability.action) {
        can(
          action as EnumPolicyAction,
          ability.subject as IPolicyAbilitySubject
        );
      }
    }

    return build({
      detectSubjectType: (item: {
        constructor: ExtractSubjectType<IPolicyAbilitySubject>;
      }) => item.constructor,
    });
  }

  /**
   * Validates if user abilities satisfy the required abilities for access control.
   * @param userAbilities - User's current CASL ability rules
   * @param requiredAbilities - Required abilities to check against
   * @returns True if user has all required abilities, false otherwise
   */
  handlerAbilities(
    userAbilities: IPolicyAbilityRule,
    requiredAbilities: IPolicyAbility[]
  ): boolean {
    return requiredAbilities.every((ability: IPolicyAbility) =>
      ability.action.every((action: string) =>
        userAbilities.can(
          action as EnumPolicyAction,
          ability.subject as IPolicyAbilitySubject
        )
      )
    );
  }
}
