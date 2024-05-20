import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { humanReadableMillis } from '../../libs';

const styles = StyleSheet.create({
  pImage: {
    borderRadius: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  timeUsedText: {
    color: '#a5a5a5',
  },
  dateUsedText: {
    color: '#a5a5a5',
  },
  pName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'black',
  },
  topBox: {
    flexDirection: 'row',
    gap: 10,
  },
});

const ActivityCard = React.memo(
  ({ packageName, packageImage, packageTimeUsed, packageDateUsed }) => {
    /**
     * @param package name
     * @param package image - url
     * @param package time used
     * @param package date used
     */

    return (
      <View style={styles.container}>
        <View style={styles.topBox}>
          <Image
            style={styles.pImage}
            source={{
              uri: `data:image/png;base64,${packageImage}`,
              width: 50,
              height: 50,
            }}
          />
          <View style={{ flexDirection: 'column', gap: 3 }}>
            <Text style={styles.pName}>{packageName}</Text>
            <Text style={styles.dateUsedText}>{packageDateUsed}</Text>
          </View>
        </View>
        {/** time used */}
        <Text style={styles.timeUsedText}>
          {humanReadableMillis(packageTimeUsed)}
        </Text>
      </View>
    );
  }
);

export default ActivityCard;
