import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";
import { productsRootSaga } from "@/modules/products/store/products-saga";
import { partTypesRootSaga } from "@/modules/part-types/store/part-types-saga";
import { employeesRootSaga } from "@/modules/employees/store/employees-saga";
import { vehicleCompanyRootSaga } from "@/modules/vehicle-company/store/vehicleCompany-saga";
import { notificationSaga } from "@/modules/notification/store/notification-saga";
import { hiringRootSaga } from "@/modules/hiring/store/hiring-saga";
import { customerSaga } from "@/modules/customer-management/store/customer-saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    notificationSaga(),
    productsRootSaga(),
    partTypesRootSaga(),
    employeesRootSaga(),
    vehicleCompanyRootSaga(),
    hiringRootSaga(),
    customerSaga(),
  ]);
}
