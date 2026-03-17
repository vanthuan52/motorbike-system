import { DatabaseEntityBase } from '@/common/database/bases/database.entity';
import {
  DatabaseEntity,
  DatabaseProp,
  DatabaseSchema,
} from '@/common/database/decorators/database.decorator';
import { EnumRoleType } from '@/modules/policy/enums/policy.enum';
import { RoleAbilityEntity, RoleAbilitySchema } from './role.ability.entity';
import { IDatabaseDocument } from '@/common/database/interfaces/database.interface';

export const RoleTableName = 'roles';

@DatabaseEntity({ collection: RoleTableName })
export class RoleEntity extends DatabaseEntityBase {
  @DatabaseProp({
    required: true,
    index: true,
    unique: true,
    trim: true,
    maxlength: 30,
    type: String,
  })
  name: string;

  @DatabaseProp({
    required: false,
    trim: true,
    type: String,
    maxLength: 500,
  })
  description?: string;

  @DatabaseProp({
    required: true,
    default: true,
    index: true,
    type: Boolean,
  })
  isActive: boolean;

  @DatabaseProp({
    required: true,
    enum: EnumRoleType,
    index: true,
    type: String,
  })
  type: EnumRoleType;

  @DatabaseProp([RoleAbilitySchema])
  abilities: RoleAbilityEntity[];
}

export const RoleSchema = DatabaseSchema(RoleEntity);
export type RoleDoc = IDatabaseDocument<RoleEntity>;
