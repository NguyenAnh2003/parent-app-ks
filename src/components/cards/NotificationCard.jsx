import { View, Text, Image } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { convertTimestamp } from '../../libs/utils';

const NotificationCard = ({ id, childData, date, description }) => {
  const formatedDate = useMemo(() => {
    const rs = convertTimestamp(date);
    return rs;
  }, [id, childData, date, description]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 5,
        paddingVertical: 13,
        flexDirection: 'row',
        alignContent: 'center',
        gap: 10,
      }}
    >
      <Image
        source={{ uri: childData.avatarUrl }}
        style={{ width: 50, height: 50, borderRadius: 50 }}
      />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: '#000',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          {childData.kidName}
        </Text>
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ color: '#000', fontSize: 12 }}>{description}</Text>
          <Text style={{ color: '#000', fontSize: 12 }}>
            {formatedDate.toString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;
