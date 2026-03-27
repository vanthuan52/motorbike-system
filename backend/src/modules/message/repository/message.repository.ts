import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { MessageModel } from '../models/message.model';
import { MessageMapper } from '../mappers/message.mapper';
import { Message as PrismaMessage, Prisma } from '@/generated/prisma-client';

@Injectable()
export class MessageRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset({
    where,
    ...params
  }: IPaginationQueryOffsetParams<
    Prisma.MessageSelect,
    Prisma.MessageWhereInput
  >): Promise<IPaginationOffsetReturn<MessageModel>> {
    const paginatedResult = await this.paginationService.offset<PrismaMessage>(
      this.databaseService.message,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          conversation: true,
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => MessageMapper.toDomain(item)),
    };
  }

  async findWithPaginationCursor({
    where,
    ...params
  }: IPaginationQueryCursorParams<
    Prisma.MessageSelect,
    Prisma.MessageWhereInput
  >): Promise<IPaginationCursorReturn<MessageModel>> {
    const paginatedResult = await this.paginationService.cursor<PrismaMessage>(
      this.databaseService.message,
      {
        ...params,
        where: {
          ...where,
        },
        include: {
          conversation: true,
          sender: { select: { id: true, name: true, email: true } },
          receiver: { select: { id: true, name: true, email: true } },
        },
        includeCount: true,
      }
    );

    return {
      ...paginatedResult,
      data: paginatedResult.data.map(item => MessageMapper.toDomain(item)),
    };
  }

  async findOneById(id: string): Promise<MessageModel | null> {
    const result = await this.databaseService.message.findUnique({
      where: { id },
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return result ? MessageMapper.toDomain(result) : null;
  }

  async findOne(where: Prisma.MessageWhereInput): Promise<MessageModel | null> {
    const result = await this.databaseService.message.findFirst({
      where,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return result ? MessageMapper.toDomain(result) : null;
  }

  async create(data: Prisma.MessageCreateInput): Promise<MessageModel> {
    const result = await this.databaseService.message.create({
      data,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return MessageMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.MessageUpdateInput
  ): Promise<MessageModel> {
    const result = await this.databaseService.message.update({
      where: { id },
      data,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return MessageMapper.toDomain(result);
  }

  async delete(id: string): Promise<MessageModel> {
    const result = await this.databaseService.message.delete({
      where: { id },
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return MessageMapper.toDomain(result);
  }

  async count(where: Prisma.MessageWhereInput): Promise<number> {
    return this.databaseService.message.count({
      where,
    });
  }

  async findMany(where: Prisma.MessageWhereInput): Promise<MessageModel[]> {
    const results = await this.databaseService.message.findMany({
      where,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });

    return results.map(item => MessageMapper.toDomain(item));
  }
}
