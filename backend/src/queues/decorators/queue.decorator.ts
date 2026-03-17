import { Processor } from '@nestjs/bullmq';
import { NestWorkerOptions } from '@nestjs/bullmq/dist/interfaces/worker-options.interface';
import { QueueProcessorConfigKey } from '@/queues/constants/queue.constant';
import { EnumQueue } from '@/queues/enums/queue.enum';

export function QueueProcessor(
  name: EnumQueue,
  options?: Omit<NestWorkerOptions, 'name'>,
): ClassDecorator {
  // @note: currently there is no way to inject ConfigService into decorators
  return Processor(
    {
      name,
      configKey: QueueProcessorConfigKey,
    },
    {
      name: `${process.env.APP_NAME}-${process.env.NODE_ENV}:${name}:consumer`,
      ...options,
    },
  );
}
