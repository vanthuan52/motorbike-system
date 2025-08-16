import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./root-saga";
import { authReducer } from "@/modules/auth/store";
import { productsReducer } from "@/modules/products/store";
import { notificationReducer } from "@/modules/notification/store";
import { partTypesReducer } from "@/modules/part-types/store";
import { employeesReducer } from "@/modules/employees/store";
import { vehicleBrandReducer } from "@/modules/vehicle-brand/store";
import { hiringReducer } from "@/modules/hiring/store";
import { customerReducer } from "@/modules/customer-management/store";
import { candidateReducer } from "@/modules/candidates/store";
import { storesReducer } from "@/modules/stores/store";
import { serviceCategoryReducer } from "@/modules/service-category/store";
import { vehicleServiceReducer } from "@/modules/vehicle-service/store";
import { vehicleModelReducer } from "@/modules/vehicle-model/store";
import { servicePriceReducer } from "@/modules/service-price/store";
import { vehiclePartReducer } from "@/modules/vehicle-parts/store";
import { serviceChecklistReducer } from "@/modules/service-checklist/store";
import { appointmentReducer } from "@/modules/appointment/store";
import { userVehicleReducer } from "@/modules/user-vehicle/store";
import { careRecordReducer } from "@/modules/care-record/store";
import { careRecordCheckListReducer } from "@/modules/care-record-checklist/store";
import { chatReducer } from "@/modules/chat/store";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    products: productsReducer,
    partTypes: partTypesReducer,
    employees: employeesReducer,
    hiring: hiringReducer,
    customer: customerReducer,
    candidates: candidateReducer,
    stores: storesReducer,
    serviceCategory: serviceCategoryReducer,
    vehicleService: vehicleServiceReducer,
    serviceChecklist: serviceChecklistReducer,
    vehicleBrand: vehicleBrandReducer,
    vehicleModel: vehicleModelReducer,
    servicePrice: servicePriceReducer,
    vehicleParts: vehiclePartReducer,
    appointments: appointmentReducer,
    userVehicle: userVehicleReducer,
    careRecords: careRecordReducer,
    careRecordChecklists: careRecordCheckListReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
