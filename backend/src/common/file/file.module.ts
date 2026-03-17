import { Global, Module } from '@nestjs/common';
import { FileService } from './services/file.service';

/**
 * Global module providing file handling services.
 * Exports FileService for use in other modules requiring file operations.
 */
@Global()
@Module({
  providers: [FileService],
  exports: [FileService],
  imports: [],
  controllers: [],
})
export class FileModule {}
