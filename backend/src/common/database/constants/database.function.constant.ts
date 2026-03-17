import { Types } from 'mongoose';
import { v7 as uuidV7 } from 'uuid';

export const DatabaseDefaultUUID = uuidV7;

export const DatabaseDefaultObjectId = () => new Types.ObjectId();
