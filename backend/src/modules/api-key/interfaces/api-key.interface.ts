import { ApiKeyDoc, ApiKeyEntity } from '../entities/api-key.entity';

export interface IApiKeyEntity extends Omit<ApiKeyEntity, 'createdBy'> {}

export interface IApiKeyDoc extends Omit<ApiKeyDoc, 'createdBy'> {}

export interface IApiKeyGenerateCredential {
  key: string;
  secret: string;
  hash: string;
}
