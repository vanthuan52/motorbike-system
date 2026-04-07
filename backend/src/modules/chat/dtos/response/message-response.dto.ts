import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { DatabaseDto } from '@/common/database/dtos/database.dto';
import {
  EnumMessageStatus,
  EnumMessageType,
} from '../../enums/message.enum';

export class MessageGetResponseDto extends DatabaseDto {
  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
    description: 'ID của tin nhắn',
  })
  id: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
    description: 'ID của cuộc trò chuyện',
  })
  conversation: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
    description: 'ID người gửi',
  })
  sender: string;

  @ApiProperty({
    required: true,
    example: faker.string.uuid(),
    description: 'ID người nhận',
  })
  receiver: string;

  @ApiProperty({
    required: true,
    example: faker.lorem.sentence(),
    description: 'Nội dung tin nhắn',
  })
  content: string;

  @ApiProperty({
    required: true,
    enum: EnumMessageType,
    example: EnumMessageType.text,
    description: 'Loại tin nhắn (text, image, video, ...)',
  })
  messageType: EnumMessageType;

  @ApiProperty({
    required: true,
    example: faker.date.recent().toISOString(),
    description: 'Thời gian gửi',
  })
  timestamp: Date;

  @ApiProperty({
    required: true,
    enum: EnumMessageStatus,
    example: EnumMessageStatus.sent,
    description: 'Trạng thái tin nhắn (sent, delivered, read, ...)',
  })
  status: EnumMessageStatus;

  @ApiProperty({
    required: true,
    type: [String],
    example: [faker.string.uuid()],
    description: 'Danh sách ID người dùng đã đọc tin nhắn',
  })
  readBy: string[];
}
