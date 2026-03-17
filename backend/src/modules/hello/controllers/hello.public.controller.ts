import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HelloPublicDoc } from '../docs/hello.public.doc';
import { Response } from '@/common/response/decorators/response.decorator';
import { IResponseReturn } from '@/common/response/interfaces/response.interface';
import { HelloResponseDto } from '../dtos/response/hello.response.dto';
import { HelloService } from '../services/hello.service';

@ApiTags('modules.public.hello')
@Controller({
  version: VERSION_NEUTRAL,
  path: '/hello',
})
export class HelloPublicController {
  constructor(private readonly helloService: HelloService) {}

  @HelloPublicDoc()
  @Response('hello.hello', {
    cache: true,
  })
  @Get('/')
  async hello(): Promise<IResponseReturn<HelloResponseDto>> {
    return this.helloService.hello();
  }
}
