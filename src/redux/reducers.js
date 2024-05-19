import appConstants from './actions/constants';

const initState = {
  item: { name: '' },
  user: {
    /**
     * @param accessToken
     * @param refreshToken
     * @param username
     * @param user gmail
     */
    session: {},
    userData: {},
  },
  loading: false,
};

export const itemReducders = (state = initState.item, action) => {
  /** item reducer
   * reducer can be used for single object
   */
  switch (action.type) {
    case appConstants.ADD_ITEM:
      console.log('description', action.payload);
      return { item: { name: action.payload } };
    default:
      return state;
  }
};

export const userReducers = (state = initState.user, action) => {
  /** user reducers temp */
  switch (action.type) {
    case appConstants.USER_ACTIVITY:
      return { ...state };
    case appConstants.USER_LOGIN:
      return { ...state, user: { session: action.payload } };
    case appConstants.USER_LOGOUT:
      return { ...state, user: { session: null } };
    default:
      return state;
  }
};