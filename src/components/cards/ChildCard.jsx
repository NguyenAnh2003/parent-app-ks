import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyle from '../../styles/globalStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const componentStyles = StyleSheet.create({
  /** container */
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  /** name */
  textHeading: {
    fontSize: 20,
    color: 'black',
  },
  /** flexbox for name and image */
  topBox: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  avatarChild: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  /** bottom box */
  bottomBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  /** phone icon */
  phoneIcon: {},
});

const ChildCard = React.memo(
  ({ childId, childName, childPhoneNumber, childAvatar, phoneType }) => {
    /**
     * @param childId
     * @param childName
     * @param childPhoneNumber
     * @param phoneType (Sam Sung)
     * @param childAvatar
     */

    return (
      <View style={componentStyles.container}>
        {/** heading block */}
        <View style={componentStyles.topBox}>
          <Image
            source={{ uri: childAvatar }}
            style={componentStyles.avatarChild}
          />
          {/** */}
          <View style={{ flexDirection: 'column' }}>
            <Text style={componentStyles.textHeading}>{childName}</Text>
            <Text style={{ color: '#a5a5a5' }}>{phoneType}</Text>
          </View>
        </View>
        {/** bottom block */}
        <View style={componentStyles.bottomBox}>
          <FontAwesome
            style={componentStyles.phoneIcon}
            size={30}
            name="phone-square"
            color={'green'}
          />
          <Text style={globalStyle.text}>{childPhoneNumber}</Text>
        </View>
      </View>
    );
  }
);

export default ChildCard;
