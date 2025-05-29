import { User } from '../domain/user';
import { ENUM_USER_STATUS } from '../enums/user.enum';

export const mockUsers: User[] = [
  new User({
    id: '507f1f77bcf86cd799439011',
    name: 'John',
    email: 'john@example.com',
    password: 'hashedpassword',
    role: 'USER',
    status: ENUM_USER_STATUS.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

export const mockUser: User = mockUsers[0];
