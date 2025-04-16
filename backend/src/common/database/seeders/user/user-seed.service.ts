import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { EmployeeEntity } from '@/modules/employee/entities/employee.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
    @InjectModel(EmployeeEntity.name)
    private readonly employeeModel: Model<EmployeeEntity>,
  ) {}

  async run() {
    const admin = await this.userModel.findOne({
      email: 'admin@example.com',
    });

    const employee_admin = await this.employeeModel.findOne({
      role: 'ADMIN',
    });

    if (!admin) {
      let employee = employee_admin;
      if (!employee_admin) {
        // create an employee admin
        employee = new this.employeeModel({
          employee_code: 'SUPERADMIN',
          position: 'CTO',
          start_date: new Date(),
          role: 'ADMIN',
        });

        await employee.save();
      }

      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash('secret', salt);

      const data = new this.userModel({
        first_name: 'Admin',
        last_name: 'Super',
        email: 'admin@example.com',
        password: hashPassword,
        ref_id: employee?._id,
      });

      await data.save();
    }
  }
}
