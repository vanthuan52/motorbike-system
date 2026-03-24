import { ApiKeyModel } from '../models/api-key.model';

export interface IApiKey extends ApiKeyModel {}

export interface IApiKeyGenerateCredential {
  key: string;
  secret: string;
  hash: string;
}
