import { User } from '../domain/user';
import { UserEntity } from '../entities/user.entity';
import { ENUM_USER_STATUS, ENUM_USER_ROLE } from '../enums/user.enum';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const user = new User();

    user.id = entity._id;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.phone = entity.phone;
    user.email = entity.email;
    user.password = entity.password;
    user.role = entity.role;
    user.status = entity.status;
    user.deleted = entity.deleted;
    user.createdBy = entity.createdBy;
    user.updatedBy = entity.updatedBy;
    user.deletedBy = entity.deletedBy;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    user.deletedAt = entity.deletedAt;
    return user;
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();

    entity._id = domain.id;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.phone = domain.phone;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.role = domain.role as ENUM_USER_ROLE;
    entity.status = domain.status as ENUM_USER_STATUS;
    entity.deleted = domain.deleted || false;
    entity.createdBy = domain.createdBy;
    entity.updatedBy = domain.updatedBy;
    entity.deletedBy = domain.deletedBy;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;

    return entity;
  }
}
