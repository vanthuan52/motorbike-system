import { all } from "redux-saga/effects";
import { authSaga } from "@/modules/auth/store/auth-saga";
import { productsRootSaga } from "@/modules/products/store/products-saga";
import { categoriesRootSaga } from "@/modules/category/store/categories-saga";
import { employeesRootSaga } from "@/modules/employees/store/employees-saga";
import { vehicleCompanyRootSaga } from "@/modules/vehicle-company/store/vehicleCompany-saga";
import { notificationSaga } from "@/modules/notification/store/notification-saga";
import { hiringRootSaga } from "@/modules/hiring/store/hiring-saga";
import { customersRootSaga } from "@/modules/customer-management/store/customers-saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    notificationSaga(),
    productsRootSaga(),
    categoriesRootSaga(),
    employeesRootSaga(),
    vehicleCompanyRootSaga(),
    hiringRootSaga(),
    customersRootSaga(),
  ]);
}
