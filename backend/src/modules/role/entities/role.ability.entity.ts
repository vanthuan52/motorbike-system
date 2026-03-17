import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import {
  EnumPolicyAction,
  EnumPolicySubject,
} from '@/modules/policy/enums/policy.enum';

@DatabaseEntity({ timestamps: false, _id: false })
export class RoleAbilityEntity {
  @DatabaseProp({
    required: true,
    type: String,
    enum: EnumPolicySubject,
  })
  subject: EnumPolicySubject;

  @DatabaseProp({
    required: true,
    type: [String],
    enum: EnumPolicyAction,
    default: [],
    isArray: true,
  })
  action: EnumPolicyAction[];
}

export const RoleAbilitySchema = DatabaseSchema(RoleAbilityEntity);
