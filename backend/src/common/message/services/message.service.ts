import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MessageService {
  private messages: { [key: string]: string };

  constructor() {
    this.loadMessages();
  }

  private loadMessages() {
    const messagesFilePath = path.join(
      __dirname,
      '../../languages/messages.json',
    );
    this.messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
  }

  public getMessage(key: string): string {
    return this.messages[key] || 'Message not found';
  }
}
