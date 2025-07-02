import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";
import { productsRootSaga } from "@/modules/products/store/products-saga";
import { partTypesRootSaga } from "@/modules/part-types/store/part-types-saga";
import { employeesRootSaga } from "@/modules/employees/store/employees-saga";
import { vehicleBrandSaga } from "@/modules/vehicle-brand/store/vehicle-brand-saga";
import { notificationSaga } from "@/modules/notification/store/notification-saga";
import { hiringRootSaga } from "@/modules/hiring/store/hiring-saga";
import { customerSaga } from "@/modules/customer-management/store/customer-saga";
import { candidateSaga } from "@/modules/candidates/store/candidate-saga";
import { serviceCategorySaga } from "@/modules/service-category/store/service-category-saga";
import { vehicleServiceSaga } from "@/modules/vehicle-service/store/vehicle-service-saga";
import { VehicleModelSaga } from "@/modules/vehicle-model/store/vehicle-model-saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    notificationSaga(),
    productsRootSaga(),
    partTypesRootSaga(),
    employeesRootSaga(),
    hiringRootSaga(),
    customerSaga(),
    candidateSaga(),
    serviceCategorySaga(),
    vehicleServiceSaga(),
    vehicleBrandSaga(),
    VehicleModelSaga(),
  ]);
}
