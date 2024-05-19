import { View, Text, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import globalStyle from '../styles/globalStyle';
import notifications from '../mock/notifi';
import NotificationCard from '../components/cards/NotificationCard';
import { getAllNotfications } from '../libs';
import { useSelector } from 'react-redux';
import SplashScreen from './SplashScreen';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      /** return fetched data from api */
      return {
        notifications: action.payload,
        isFetching: false,
      };
    default:
      return { ...state };
  }
};

const NotificationScreen = () => {
  /** refresh */
  const [refresh, setRefresh] = useState(false);
  // current session
  const currentUserSession = useSelector((state) => state.userReducers?.user);

  /** */
  const [state, dispatch] = useReducer(reducer, {
    notifications: [],
    isFetching: true,
  });

  const fetchNotifications = async () => {
    try {
      const userId = JSON.parse(currentUserSession.session).user.id; // userId
      const data = await getAllNotfications(userId);
      console.log(data);
      if (data) dispatch({ type: 'FETCH_DATA', payload: data });
    } catch (error) {}
  };

  useEffect(() => {
    /** func call */
    fetchNotifications();
  }, []);

  /** onRefresh */
  const onRefresh = useCallback(() => {
    setRefresh(true);
    fetchNotifications().finally(() => setRefresh(false));
  }, []);

  return state.isFetching ? (
    <SplashScreen />
  ) : (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <View style={[globalStyle.container, { paddingHorizontal: 15, gap: 10 }]}>
        {state.notifications.map((i, idx) => (
          <NotificationCard
            key={idx}
            id={i.id}
            childData={i.children}
            description={i.description}
            date={i.date}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;
