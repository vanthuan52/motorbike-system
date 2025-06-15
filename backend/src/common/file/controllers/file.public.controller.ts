import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '@/common/response/decorators/response.decorator';
import { IResponse } from '@/common/response/interfaces/response.interface';
import { AwsS3Service } from '@/modules/aws/services/aws.s3.service';
import { FileAwsS3PresignGetResponseDoc } from '../docs/file.public.doc';
import { FileAwsS3PresignGetRequestDto } from '../dtos/request/file.aws-s3-presign-get.request.dto';
import { IAwsS3Options } from '@/modules/aws/interfaces/aws.interface';
import { AwsS3PresignResponseDto } from '@/modules/aws/dtos/response/aws.s3-presign.response.dto';

@ApiTags('modules.public.file')
@Controller({
  version: '1',
  path: '/file',
})
export class FilePublicController {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @FileAwsS3PresignGetResponseDoc()
  @Response('file.getPresignedUrl')
  @HttpCode(HttpStatus.OK)
  @Get('/get-presigned-url')
  async getFilePresignedUrl(
    @Query() { key, access }: FileAwsS3PresignGetRequestDto,
  ): Promise<IResponse<AwsS3PresignResponseDto>> {
    const aws: AwsS3PresignResponseDto = await this.awsS3Service.presignGetItem(
      key,
      {} as IAwsS3Options,
    );
    return {
      data: aws,
    };
  }
}
