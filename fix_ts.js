const fs = require('fs');
const filepath = 'e:/code/application/nodejs/projects/motorbike_system/backend/src/modules/user/services/user.service.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Replace standard returns
content = content.replace(/return user;/g, 'return user as IUser;');
content = content.replace(/return userModel;/g, 'return userModel as IUser;');

// Replace specific repository calls returning Promise
content = content.replace(/return this\.userRepository\.createBySocial\(([\s\S]*?)\);/, 'return this.userRepository.createBySocial() as unknown as Promise<IUser>;');
content = content.replace(/return this\.userRepository\.createWithNestedRelations\(([\s\S]*?)\);/, 'return this.userRepository.createWithNestedRelations() as unknown as Promise<IUser>;');
content = content.replace(/return this\.userRepository\.findOneLatestByForgotPassword\(userId\);/, 'return this.userRepository.findOneLatestByForgotPassword(userId) as unknown as Promise<IUser | null>;');

fs.writeFileSync(filepath, content);
