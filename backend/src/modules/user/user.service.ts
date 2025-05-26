// import {
//   ConflictException,
//   Injectable,
//   Logger,
//   NotFoundException,
// } from '@nestjs/common';
// import * as bcryptjs from 'bcryptjs';
// import { UserRepository } from './repository/user.repository';
// import { CreateUserDto } from './dtos/create-user.dto';
// import { UpdateUserDto } from './dtos/update-user.dto';
// import { User } from './domain/user';
// import { ENUM_USER_STATUS } from './enums/user.enum';
// import { USER_INTIAL_PASSWORD } from './constants/user.constant';
// import { FilterUserDto, SortUserDto } from './dtos/query-user.dto';
// import { PaginationOption } from '@/app/types/pagination-option.type';
// import { NullableType } from '@/app/types/nullable.type';

// class UserService {
//   private readonly logger = new Logger(UserService.name);

//   constructor(private readonly userRepository: UserRepository) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const userObject = await this.userRepository.findByEmail(
//       createUserDto.email,
//     );
//     if (userObject) {
//       throw new ConflictException('Email is already existed');
//     }

//     let password = USER_INTIAL_PASSWORD;
//     if (createUserDto.password) {
//       password = createUserDto.password;
//     }
//     const salt = await bcryptjs.genSalt(10);
//     const hashPassword = await bcryptjs.hash(createUserDto.password, salt);

//     let status: ENUM_USER_STATUS = ENUM_USER_STATUS.ACTIVE;
//     if (createUserDto.status) {
//       status = createUserDto.status as ENUM_USER_STATUS;
//     }

//     this.logger.log('Hello');
//     const user = new User();
//     user.email = createUserDto.email;
//     user.password = hashPassword;
//     user.status = status;
//     user.createdAt = new Date();
//     user.updatedAt = new Date();

//     return this.userRepository.create(user);
//   }

//   async update(
//     id: string,
//     updateUserDto: UpdateUserDto,
//   ): Promise<NullableType<User>> {
//     const user = await this.userRepository.findById(id);
//     if (!user) throw new NotFoundException(`User with ID ${id} not found`);

//     if (updateUserDto.email && updateUserDto.email !== user.email) {
//       const existingUser = await this.userRepository.findByEmail(
//         updateUserDto.email,
//       );
//       if (existingUser) {
//         throw new ConflictException(
//           `Username "${updateUserDto.email}" already exists`,
//         );
//       }
//     }

//     Object.assign(user, updateUserDto);
//     user.updatedAt = new Date();

//     return this.userRepository.updateById(id, user);
//   }

//   async deleteById(id: User['id']): Promise<void> {
//     const user = await this.userRepository.findById(id);
//     if (!user) throw new NotFoundException(`User with ID ${id} not found`);

//     await this.userRepository.deleteById(id);
//     return;
//   }

//   async findById(id: User['id']): Promise<User> {
//     const user = await this.userRepository.findById(id);
//     if (!user) throw new NotFoundException(`User with ID ${id} not found`);

//     return user;
//   }

//   async findAll(): Promise<User[]> {
//     return this.userRepository.findAll();
//   }

//   async findAllWithPagination({
//     filterOptions,
//     sortOptions,
//     paginationOptions,
//   }: {
//     filterOptions?: FilterUserDto | null;
//     sortOptions?: SortUserDto[] | null;
//     paginationOptions: PaginationOption;
//   }): Promise<void> {
//     return;
//   }
// }
