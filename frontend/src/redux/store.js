import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js'
import themeReducer from './theme/themeSlice.js'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({ 
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  //reducer: { user: userReducer},
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);