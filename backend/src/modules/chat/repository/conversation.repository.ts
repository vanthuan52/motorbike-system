import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { IDatabaseOptions } from '@/common/database/interfaces/database.interface';
import { ConversationModel } from '../models/conversation.model';
import { ConversationMapper } from '../mappers/conversation.mapper';
import {
  Prisma,
  Conversation as PrismaConversation,
} from '@/generated/prisma-client';

@Injectable()
export class ConversationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOneById(
    id: string,
    options?: IDatabaseOptions
  ): Promise<ConversationModel | null> {
    const db = options?.tx || this.databaseService;
    const result = await db.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return result ? ConversationMapper.toDomain(result) : null;
  }

  async findOne(
    where: Prisma.ConversationWhereInput,
    options?: IDatabaseOptions
  ): Promise<ConversationModel | null> {
    const db = options?.tx || this.databaseService;
    const result = await db.conversation.findFirst({
      where: {
        ...where,
        deletedAt: null,
      },
    });

    return result ? ConversationMapper.toDomain(result) : null;
  }

  async findMany(
    where: Prisma.ConversationWhereInput,
    options?: IDatabaseOptions
  ): Promise<ConversationModel[]> {
    const db = options?.tx || this.databaseService;
    const results = await db.conversation.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return results.map((item: PrismaConversation) =>
      ConversationMapper.toDomain(item)
    );
  }

  async create(
    data: Prisma.ConversationCreateInput,
    options?: IDatabaseOptions
  ): Promise<ConversationModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.conversation.create({
      data,
    });

    return ConversationMapper.toDomain(result);
  }

  async update(
    id: string,
    data: Prisma.ConversationUpdateInput,
    options?: IDatabaseOptions
  ): Promise<ConversationModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.conversation.update({
      where: { id },
      data,
    });

    return ConversationMapper.toDomain(result);
  }

  async softDelete(
    id: string,
    deletedBy: string,
    options?: IDatabaseOptions
  ): Promise<ConversationModel> {
    const db = options?.tx || this.databaseService;
    const result = await db.conversation.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy,
      },
    });

    return ConversationMapper.toDomain(result);
  }
}
