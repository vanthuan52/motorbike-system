import { all } from "redux-saga/effects";
import { authSaga } from "../features/auth/store/auth-saga";
import { partTypeRootSaga } from "../features/part-type/store/part-type-saga";
import { hiringRootSaga } from "@/features/hiring/store/hiring-saga";
import { vehicleBrandSaga } from "@/features/vehicle-brand/store/vehicle-brand-saga";
import { vehicleModelSaga } from "@/features/vehicle-model/store/vehicle-model-saga";
import { serviceCategorySaga } from "@/features/service-category/store/service-category-saga";
import { appointmentSaga } from "@/features/appointment/store/appointment-saga";
import { vehicleServiceSaga } from "@/features/vehicle-service/store/vehicle-service-saga";

export default function* rootSaga() {
  yield all([
    authSaga(),
    partTypeRootSaga(),
    hiringRootSaga(),
    vehicleBrandSaga(),
    vehicleModelSaga(),
    serviceCategorySaga(),
    vehicleServiceSaga(),
    appointmentSaga(),
  ]);
}
