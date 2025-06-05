import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { SessionService } from '../services/session.service';
import { SessionDoc } from '../entities/session.entity';
import { ENUM_SESSION_STATUS_CODE_ERROR } from '../enums/session.status-code.enum';
import { IRequestApp } from '@/common/request/interfaces/request.interface';

@Injectable()
export class SessionActiveParsePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: IRequestApp,
    private readonly sessionService: SessionService,
  ) {}

  async transform(value: string): Promise<SessionDoc> {
    const session = await this.sessionService.findOneActiveById(value);
    if (!session) {
      throw new NotFoundException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    return session;
  }
}

@Injectable({ scope: Scope.REQUEST })
export class SessionActiveByUserParsePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: IRequestApp,
    private readonly sessionService: SessionService,
  ) {}

  async transform(value: string): Promise<SessionDoc> {
    const { user } = this.request;

    const session = await this.sessionService.findOneActiveByIdAndUser(
      value,
      user!.user,
    );
    if (!session) {
      throw new NotFoundException({
        statusCode: ENUM_SESSION_STATUS_CODE_ERROR.NOT_FOUND,
        message: 'session.error.notFound',
      });
    }

    return session;
  }
}
