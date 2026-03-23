import { AppointmentModel } from '../models/appointment.model';
import { EnumAppointmentStatus } from '../enums/appointment.enum';

export class AppointmentMapper {
  static toDomain(prismaAppointment: any): AppointmentModel {
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
    model.status = statusMap[prismaAppointment.status] || EnumAppointmentStatus.pending;
    model.userId = prismaAppointment.userId;
    model.userVehicleId = prismaAppointment.userVehicleId;
    model.vehicleModelId = prismaAppointment.vehicleModelId;

    model.createdAt = prismaAppointment.createdAt;
    model.updatedAt = prismaAppointment.updatedAt;
    model.deletedAt = prismaAppointment.deletedAt;
    model.createdBy = prismaAppointment.createdBy;
    model.updatedBy = prismaAppointment.updatedBy;
    model.deletedBy = prismaAppointment.deletedBy;

    return model;
  }
}
