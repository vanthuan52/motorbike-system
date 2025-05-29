import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { DatabaseService } from '@/common/database/services/database.service';
import { UserService } from '@/modules/user/services/user.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '@/common/message/services/message.service';
import { AuthSignInRequestDto } from '../dtos/request/auth.sign-in.request.dto';
import { IRequestApp } from '@/common/request/interfaces/request.interface';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { AuthSignInResponseDto } from '../dtos/response/auth.sign-in.response.dto';
import { UserDoc } from '@/modules/user/entities/user.entity';

@ApiTags('modules.public.auth')
@Controller({
  version: '1',
  path: '/auth',
})
export class AUthPublicController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signInWithCredential(
    @Body() { email, password }: AuthSignInRequestDto,
    @Req() request: IRequestApp,
  ) {}
}
