import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

const useCheckConnection = () => {
  /** state */
  const [connection, setConnection] = useState(true);
  //
  const { type, isConnected } = useNetInfo();

  useEffect(() => {
    if (isConnected === true) setConnection(isConnected);
    else setConnection(isConnected);
  }, [isConnected]);

  return connection;
};

export default useCheckConnection;
