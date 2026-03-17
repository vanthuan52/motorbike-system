import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DatabaseDefaultUUID } from '../constants/database.function.constant';

/**
 * Database utility service providing common database operations.
 *
 * This injectable service provides utility methods for database-related operations,
 * including ID generation using BSON ObjectID format. The generated IDs are
 * compatible with MongoDB ObjectID format and provide unique identifiers
 * for database records.
 *
 * @class DatabaseUtil
 * @injectable
 */
@Injectable()
export class DatabaseUtil {
  /**
   * Checks if the provided ID string is a valid BSON ObjectID.
   *
   * Utilizes the BSON ObjectID library's isValid method to determine
   * if the given string conforms to the ObjectID format.
   *
   * @param {string} id - The ID string to validate
   * @returns {boolean} True if the ID is a valid ObjectID, false otherwise
   */
  checkIdIsValid(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  /**
   * Creates a new unique identifier using BSON ObjectID.
   *
   * Generates a new ObjectID and converts it to a hexadecimal string format.
   * The generated ID is unique and follows the BSON ObjectID specification,
   * making it suitable for use as primary keys in database records.
   *
   * @returns {string} A 24-character hexadecimal string representing the ObjectID
   */
  createObjectId(): string {
    return new Types.ObjectId().toHexString();
  }

  /**
   * Creates a new unique identifier using UUID v7.
   *
   * Generates a new UUID v7 which is time-sortable.
   *
   * @returns {string} A UUID v7 string
   */
  createUUID(): string {
    return DatabaseDefaultUUID();
  }

  /**
   * Converts data to a plain object.
   *
   * @param {T} data - The data to convert to plain object
   * @returns {Record<string, any>} Plain object representation of the data
   */
  toPlainObject<T>(data: T): Record<string, any> {
    return structuredClone(data) as unknown as Record<string, any>;
  }

  /**
   * Converts data to a plain array.
   *
   * @param {T} data - The data to convert to plain array
   * @returns {Record<string, any>[]} Plain array representation of the data
   */
  toPlainArray<T>(data: T): Record<string, any>[] {
    return structuredClone(data) as unknown as Record<string, any>[];
  }
}
