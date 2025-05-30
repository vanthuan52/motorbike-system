import { ENUM_USER_STATUS } from '../enums/user.enum';

export const mockUsers: any[] = [
  {
    id: '507f1f77bcf86cd799439011',
    name: 'John',
    email: 'john@example.com',
    password: 'hashedpassword',
    role: 'USER',
    status: ENUM_USER_STATUS.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUser = mockUsers[0];
