import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import {
  IPaginationQueryOffsetParams,
  IPaginationQueryCursorParams,
  IPaginationOffsetReturn,
  IPaginationCursorReturn,
} from '@/common/pagination/interfaces/pagination.interface';
import { PaginationService } from '@/common/pagination/services/pagination.service';
import { Message, Prisma, User } from '@/generated/prisma-client';

@Injectable()
export class MessageRepository {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paginationService: PaginationService
  ) {}

  async findWithPaginationOffset(
    {
      where,
      ...params
    }: IPaginationQueryOffsetParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >
  ): Promise<IPaginationOffsetReturn<Message>> {
    return this.paginationService.offset<Message>(
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
  }

  async findWithPaginationCursor(
    {
      where,
      ...params
    }: IPaginationQueryCursorParams<
      Prisma.MessageSelect,
      Prisma.MessageWhereInput
    >
  ): Promise<IPaginationCursorReturn<Message>> {
    return this.paginationService.cursor<Message>(
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
  }

  async findOneById(id: string): Promise<Message | null> {
    return this.databaseService.message.findUnique({
      where: { id },
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findOne(
    where: Prisma.MessageWhereInput
  ): Promise<Message | null> {
    return this.databaseService.message.findFirst({
      where,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(data: Prisma.MessageCreateInput): Promise<Message> {
    return this.databaseService.message.create({
      data,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.MessageUpdateInput
  ): Promise<Message> {
    return this.databaseService.message.update({
      where: { id },
      data,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<Message> {
    return this.databaseService.message.delete({
      where: { id },
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async count(where: Prisma.MessageWhereInput): Promise<number> {
    return this.databaseService.message.count({
      where,
    });
  }

  async findMany(
    where: Prisma.MessageWhereInput
  ): Promise<Message[]> {
    return this.databaseService.message.findMany({
      where,
      include: {
        conversation: true,
        sender: { select: { id: true, name: true, email: true } },
        receiver: { select: { id: true, name: true, email: true } },
      },
    });
  }
}

