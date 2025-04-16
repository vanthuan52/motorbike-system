import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseEntityBase } from '@/common/database/bases/database.entity';

export type EmplopyeeDocument = EmployeeEntity & Document;

export const EmplopyeeTableName = 'employees';

@Schema({ collection: EmplopyeeTableName })
export class EmployeeEntity extends DatabaseEntityBase {
  @Prop({ required: true, trim: true, maxlength: 10 })
  employee_code: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  position: string;

  @Prop({
    required: true,
    type: Date,
  })
  start_date: Date;

  @Prop({
    required: true,
    type: String,
  })
  role: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(EmployeeEntity);
