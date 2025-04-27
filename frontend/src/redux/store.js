// Import necessary functions from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Import persistence tools from redux-persist
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

// Import storage engine (uses localStorage for web)
import storage from "redux-persist/lib/storage";

// Import the user slice (reducers and actions)
import state from "./state";

// Configure persist settings
const persistConfig = {
  key: "root",      // Key for localStorage
  version: 1,       // Version of persisted state
  storage,          // Use localStorage (or sessionStorage, depending on setup)
};

// Create a persisted reducer using redux-persist
const persistedReducer = persistReducer(persistConfig, state);

// Create and export the Redux store
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer instead of a plain reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types to prevent serializability warnings
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create and export the persistor (used to persist the store)
export let persistor = persistStore(store);
