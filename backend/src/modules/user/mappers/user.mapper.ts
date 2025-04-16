import { User } from '../domain/user';
import { UserEntity } from '../entities/user.entity';
import {
  ENUM_USER_STATUS,
  ENUM_USER_GENDER,
  ENUM_USER_TYPE,
} from '../enums/user.enum';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const user = new User();

    user._id = entity._id;
    user.first_name = entity.first_name;
    user.last_name = entity.last_name;
    user.phone = entity.phone;
    user.email = entity.email;
    user.password = entity.password;
    user.type = entity.type;
    user.ref_id = entity.ref_id;
    user.status = entity.status;
    user.dob = entity.dob;
    user.gender = entity.gender;
    user.address = entity.address;
    user.ward = entity.ward;
    user.district = entity.district;
    user.city = entity.city;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;

    return user;
  }

  static toPersistence(domain: User): UserEntity {
    const entity = new UserEntity();

    entity._id = domain._id;
    entity.first_name = domain.first_name;
    entity.last_name = domain.last_name;
    entity.phone = domain.phone;
    entity.email = domain.email;
    entity.password = domain.password;
    entity.type = domain.type as ENUM_USER_TYPE;
    entity.ref_id = domain.ref_id;
    entity.status = domain.status as ENUM_USER_STATUS;
    entity.dob = domain.dob;
    entity.gender = domain.gender as ENUM_USER_GENDER;
    entity.address = domain.address;
    entity.ward = domain.ward;
    entity.district = domain.district;
    entity.city = domain.city;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }
}
