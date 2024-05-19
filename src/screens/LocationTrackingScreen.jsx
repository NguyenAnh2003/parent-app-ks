import React, { useEffect, useState } from 'react';
import globalStyle from '../styles/globalStyle';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request } from 'react-native-permissions';
import io from 'socket.io-client';
const socket = io.connect('http://192.168.1.13:3001/');

const LocationTracking = ({ navigation, route }) => {
  const { childId } = route.params;
  console.log(childId);
  const [region, setRegion] = useState(null);

  // useEffect(() => {
  //   // Request location permission
  //   const requestLocationPermission = async () => {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           {
  //             title: 'Location Permission',
  //             message: 'This app needs access to your location.',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //           },
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         // If permission granted, get current location
  //         Geolocation.getCurrentPosition(
  //           (position) => {
  //             const { latitude, longitude } = position.coords;
  //             console.log(position.coords);
  //             setRegion({
  //               latitude:1,
  //               longitude:2,
  //               latitudeDelta: 0.0922,
  //               longitudeDelta: 0.0421,
  //             });

  //             // socket.emit('location', { latitude, longitude });
  //           },
  //           (error) => console.error(error),
  //           { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //         );
  //       } else {
  //         Alert.alert("Location permission denied","Kiểm tra trong cài đặt")
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   };

  //   requestLocationPermission();

  //   // cleanup function
  //   return () => {
  //     // clear watch position if any
  //     Geolocation.clearWatch();
  //   };
  // }, []);

  // set location when change child id
  useEffect(() => {
    console.log('Child ID:', route.params.childId);
    // tại đây code 1 hàm để lấy vị trí của đứa con khi đã có id
    // socket.on('location',(test)=>{

    // })
    socket.emit('requestLocation', route.params.childId);

    var a = 10;
    var b = 12;
    // if(route.params.childId=="id1"){
    //   a=10
    // }
    // if(route.params.childId=="id2"){
    //   a=15
    // }
    socket.on('locationUpdateToClient', (locationChild) => {
      console.log('Location client received:', locationChild);
      a = locationChild.latitude;
      b = locationChild.longitude;
      setRegion(locationChild);
    });

    navigation.setOptions({
      headerTitle: () => (
        <>
          <Text style={{ color: '#000', fontSize: 17, fontWeight: 600, marginLeft: -22 }}>
            Location
          </Text>
        </>
      ),
    });

    // setRegion({
    //   latitude:a,
    //   longitude:12,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // });
  }, [route.params.childId]);

  return (
    <View style={globalStyle.container}>
      <Text style={globalStyle.h1}>Map</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        region={region}
      >
        {region && (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="Current Location"
          />
        )}
      </MapView>
    </View>
  );
};

export default LocationTracking;
