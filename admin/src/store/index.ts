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
import { categoriesReducer } from "@/modules/category/store";
import { notificationReducer } from "@/modules/notification/store";
import { employeesReducer } from "@/modules/employees/store";
import { vehicleCompanyReducer } from "@/modules/vehicle-company/store";
import { hiringReducer } from "@/modules/hiring/store";
import { customersReducer } from "@/modules/customer-management/store";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
    products: productsReducer,
    categories: categoriesReducer,
    employees: employeesReducer,
    vehicleCompany: vehicleCompanyReducer,
    hiring: hiringReducer,
    customers: customersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
