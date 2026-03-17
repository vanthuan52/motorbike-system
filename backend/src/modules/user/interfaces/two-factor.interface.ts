import { TwoFactorEntity } from '../entities/two-factor.entity';

export interface ITwoFactorEntity extends Omit<TwoFactorEntity, 'userId'> {
  userId: string;
}

export interface ITwoFactorDoc extends Omit<TwoFactorEntity, 'userId'> {
  userId: string;
}
