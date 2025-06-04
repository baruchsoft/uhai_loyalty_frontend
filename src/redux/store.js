import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import authReducer from "../features/auth/authSlice";
import countryReducer from "../features/country/countrySlice";
import userReducer from "../features/user/userSlice";
import roleReducer from "../features/role/roleSlice";
import countyReducer from "../features/county/countySlice";
import constituencyReducer from "../features/constituency/constituencySlice";
import wardReducer from "../features/ward/wardSlice";
import subLocationReducer from "../features/subLocation/subLocationSlice";
import universityReducer from "../features/university/universitySlice";
import campusReducer from "../features/campus/campusSlice";
import villageReducer from "../features/village/villageSlice";
import customerReducer from "../features/customer/customerSlice"
import posTypeReducer from "../features/posTypes/posTypeSlice";
import posReducer from "../features/pos/posSlice";
import locationReducer from "../features/location/locationSlice";
import merchantReducer from "../features/loans/merhcantSlice";
import loanReducer from "../features/loans/loanSlice";
import accountReducer from "../features/loans/accountSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  country: countryReducer,
  user: userReducer,
  role: roleReducer,
  county: countyReducer,
  constituency: constituencyReducer,
  ward: wardReducer,
  subLocation: subLocationReducer,
  university: universityReducer,
  campus: campusReducer,
  village: villageReducer,
  posType: posTypeReducer,
  pos: posReducer,
  location: locationReducer,
  merchant: merchantReducer,
  loan: loanReducer,
  account: accountReducer,
  customer: customerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: import.meta.env.VITE_APP_NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
