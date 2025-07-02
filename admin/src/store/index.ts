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
import { serviceCategoryReducer } from "@/modules/service-category/store";
import { vehicleServiceReducer } from "@/modules/vehicle-service/store";
import { vehicleModelReducer } from "@/modules/vehicle-model/store";

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
    serviceCategory: serviceCategoryReducer,
    vehicleService: vehicleServiceReducer,
    vehicleBrand: vehicleBrandReducer,
    vehicleModel: vehicleModelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
