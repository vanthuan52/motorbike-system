import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserEntity } from './entities/user.entity';
import { User } from './domain/user';
import { UserMapper } from './mappers/user.mapper';
import { NullableType } from '@/app/types/nullable.type';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(data);
    const newEntity = await this.userModel.create(persistenceModel);
    return UserMapper.toDomain(newEntity);
  }

  async findByEmail(email: string): Promise<NullableType<User>> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<NullableType<User>> {
    return await this.userModel.findById(id).exec();
  }

  async updateById(
    id: string,
    update: Partial<UserEntity>,
  ): Promise<NullableType<User>> {
    return await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
