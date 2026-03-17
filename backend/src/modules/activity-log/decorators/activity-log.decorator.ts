import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';
import { ActivityLogMetadataMetaKey } from '../constants/activity-log.constant';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { EnumActivityLogAction } from '../enums/activity-log.enum';
import { IActivityLogMetadata } from '../interfaces/activity-log.interface';

/**
 * Decorator that enables activity logging for controller methods.
 * Automatically tracks user actions with optional metadata for audit trail purposes.
 *
 * @param {string} action - The activity action to be logged
 * @param {IActivityLogMetadata} metadata - Optional metadata to include with the activity log
 * @returns {MethodDecorator} Method decorator function
 */
export function ActivityLog(
  action: string,
  metadata?: IActivityLogMetadata,
): MethodDecorator {
  // TODO: Implement bidirectional logging support, and record when failed attempts occur
  return applyDecorators(
    UseInterceptors(ActivityLogInterceptor),
    SetMetadata(EnumActivityLogAction, action),
    SetMetadata(ActivityLogMetadataMetaKey, metadata),
  );
}
