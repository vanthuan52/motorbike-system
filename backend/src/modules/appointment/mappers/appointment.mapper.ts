import { AppointmentModel } from '../models/appointment.model';
import { EnumAppointmentStatus } from '../enums/appointment.enum';
import { UserMapper } from '@/modules/user/mappers/user.mapper';
import { UserVehicleMapper } from '@/modules/user-vehicle/mappers/user-vehicle.mapper';
import { VehicleModelMapper } from '@/modules/vehicle-model/mappers/vehicle-model.mapper';
import { VehicleServiceMapper } from '@/modules/vehicle-service/mappers/vehicle-service.mapper';
import { Appointment as PrismaAppointment } from '@/generated/prisma-client';

export class AppointmentMapper {
  static toDomain(prismaAppointment: PrismaAppointment): AppointmentModel {
    const model = new AppointmentModel();
    model.id = prismaAppointment.id;
    model.name = prismaAppointment.name;
    model.phone = prismaAppointment.phone;
    model.licensePlateNumber = prismaAppointment.licensePlateNumber;
    model.address = prismaAppointment.address;
    model.customerRequests = prismaAppointment.customerRequests;
    model.note = prismaAppointment.note;
    model.appointmentDate = prismaAppointment.appointmentDate;
    const statusMap: Record<string, EnumAppointmentStatus> = {
      PENDING: EnumAppointmentStatus.pending,
      SCHEDULED: EnumAppointmentStatus.scheduled,
      IN_PROGRESS: EnumAppointmentStatus.inProgress,
      COMPLETED: EnumAppointmentStatus.completed,
      CANCELED: EnumAppointmentStatus.canceled,
      MISSED: EnumAppointmentStatus.missed,
    };
    model.status =
      statusMap[prismaAppointment.status] || EnumAppointmentStatus.pending;
    model.userId = prismaAppointment.userId;
    model.userVehicleId = prismaAppointment.userVehicleId;
    model.vehicleModelId = prismaAppointment.vehicleModelId;

    model.createdAt = prismaAppointment.createdAt;
    model.updatedAt = prismaAppointment.updatedAt;
    model.deletedAt = prismaAppointment.deletedAt;
    model.createdBy = prismaAppointment.createdBy;
    model.updatedBy = prismaAppointment.updatedBy;
    model.deletedBy = prismaAppointment.deletedBy;

    if (prismaAppointment.user) {
      model.user = UserMapper.toDomain(prismaAppointment.user);
    }
    if (prismaAppointment.userVehicle) {
      model.userVehicle = UserVehicleMapper.toDomain(
        prismaAppointment.userVehicle
      );
    }
    if (prismaAppointment.vehicleModel) {
      model.vehicleModel = VehicleModelMapper.toDomain(
        prismaAppointment.vehicleModel
      );
    }
    if (
      prismaAppointment.vehicleServices &&
      Array.isArray(prismaAppointment.vehicleServices)
    ) {
      model.vehicleServices = prismaAppointment.vehicleServices.map((vs: any) =>
        VehicleServiceMapper.toDomain(vs)
      );
    }

    return model;
  }
}
