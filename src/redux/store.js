import { createStore, combineReducers, applyMiddleware } from 'redux';
import { itemReducders, userReducers } from './reducers';
import { persistReducer, persistStore } from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import { thunk } from 'redux-thunk';

/**
 * @access https://jscrambler.com/blog/how-to-use-redux-persist-in-react-native-with-asyncstorage
 * @access https://www.youtube.com/watch?v=p38wfGgQZ9c
 * @access https://blog.logrocket.com/use-redux-persist-react-native/
 */

const persistConfig = {
  key: 'root',
  storage,
};

/** persisted reducer */
const rootReducer = combineReducers({
  /** combine each reducers
   * each one have its own responsibility (offline, online)
   */
  userReducers: persistReducer(persistConfig, userReducers),
});

export const configStore = createStore(rootReducer);
// persistor
export const persistor = persistStore(configStore);
