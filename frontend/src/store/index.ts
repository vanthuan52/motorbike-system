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
import { categoriesReducer } from "@/features/category/store";
import storage from "@/utils/ssr-safe-storage";
import { notificationReducer } from "@/features/notification/store";
import { hiringReducer } from "@/features/hiring/store";

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
  categories: categoriesReducer,
  hiring: hiringReducer,
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
