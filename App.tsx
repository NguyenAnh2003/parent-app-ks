/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { configStore, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import PushNotification from 'react-native-push-notification';
import { LogBox } from 'react-native';

// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs();//Ignore all log notifications

// Configure Push Notifications
PushNotification.configure({
  onRegister: function(token) {
    console.log("TOKEN:", token);
  },
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },
  popInitialNotification: true
});


PushNotification.createChannel(
  {
    channelId: "channel-timelimit", // ensure this ID is unique for each channel
    channelName: "Time Limit Channel", // the human-readable name of the channel
    channelDescription: "A default channel for time limit notifications", // optional description
    soundName: "default", // if you have a custom sound, specify its name
    importance: 4, // specify the importance level
    vibrate: true, // whether to vibrate
  },
  (created) => console.log(`CreateChannel returned '${created}'`), // callback returns whether the channel was created or not
);



function App(): React.JSX.Element {

  return (
    <Provider store={configStore}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
export default App;