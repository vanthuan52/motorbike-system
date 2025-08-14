import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import rootSaga from "./root-saga";
import { authReducer } from "@/features/auth/store";
import { cartReducer } from "@/features/cart/store";
import { partTypeReducer } from "@/features/part-type/store";
import storage from "@/utils/ssr-safe-storage";
import { notificationReducer } from "@/features/notification/store";
import { hiringReducer } from "@/features/hiring/store";
import { vehicleBrandReducer } from "@/features/vehicle-brand/store";
import { vehicleModelReducer } from "@/features/vehicle-model/store";
import { serviceCategoryReducer } from "@/features/service-category/store";
import { appointmentReducer } from "@/features/appointment/store";
import { vehicleServiceReducer } from "@/features/vehicle-service/store";
import { chatReducer } from "@/features/chat/store";
import { userReducer } from "@/features/user/store";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
  blacklist: [""],
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  notification: notificationReducer,
  partType: partTypeReducer,
  hiring: hiringReducer,
  vehicleBrand: vehicleBrandReducer,
  vehicleModel: vehicleModelReducer,
  serviceCategory: serviceCategoryReducer,
  vehicleService: vehicleServiceReducer,
  appointment: appointmentReducer,
  chat: chatReducer,
  users: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
