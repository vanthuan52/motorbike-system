import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { Conversation, Prisma } from '@/generated/prisma-client';

@Injectable()
export class ConversationRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOneById(id: string): Promise<Conversation | null> {
    return this.databaseService.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async findOne(
    where: Prisma.ConversationWhereInput
  ): Promise<Conversation | null> {
    return this.databaseService.conversation.findFirst({
      where,
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async findMany(
    where: Prisma.ConversationWhereInput
  ): Promise<Conversation[]> {
    return this.databaseService.conversation.findMany({
      where,
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async create(data: Prisma.ConversationCreateInput): Promise<Conversation> {
    return this.databaseService.conversation.create({
      data,
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ConversationUpdateInput
  ): Promise<Conversation> {
    return this.databaseService.conversation.update({
      where: { id },
      data,
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Conversation> {
    return this.databaseService.conversation.delete({
      where: { id },
      include: {
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }
}
