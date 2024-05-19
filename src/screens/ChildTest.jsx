import React, { useEffect, useState } from 'react';
import globalStyle from '../styles/globalStyle';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { View, StyleSheet, Text, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, request } from 'react-native-permissions';
import io from 'socket.io-client';
const socket = io.connect('http://192.168.1.13:3001/');


// đây là file giả làm app thằng kid t bỏ đây tạm
// phải mount file này trước khi chọn map, kh là sẽ kh chạy được
// hiện tại mới chỉ foreground, để cho file này chạy background t bị lỗi mãi k làm đc

function getChildIdFromDtb(){
  return "7ce14780-1a03-438a-9596-973d81725fa7";
}

const ChildTest = () => {
  const [region, setRegion] = useState(null);
  const [childIdState, setChildId] = useState(null);
  const [checkUpdate, setCheckUpdate] = useState(null);
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // If permission granted, get current location
          Geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              // console.log(position.coords);
              setRegion({
                latitude, 
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              setCheckUpdate(false)
            },
            (error) => console.error(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );
        } else {
          Alert.alert("Location permission denied","Kiểm tra trong cài đặt")
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    // cleanup function
    return () => {
      // clear watch position if any
      Geolocation.clearWatch();
    };
  }, []);



    useEffect(()=>{
      if(checkUpdate==true){
        socket.emit('locationChild',region,childIdState)
      }
      else{
        console.log("childtest trong hook:" ,region);
        socket.on('requestLocationToSpecificDevice',(childId)=>{
          console.log(childId+" may child");

          // lưu ý đoạn này, bây giờ đang fix cứng là id bằng 1 hoặc bằng 2
          // sau này sẽ xóa cái else if kia đi
          // và ở điều kiện cái if, tha cái "id1" = id hiện tại của thằng child
          if(childId==getChildIdFromDtb()){
            socket.emit('locationChild',region,childId)
          }
          else if(childId=="1baf7534-f582-403f-a5ef-f09464b5733e"){
            const testregion={
              latitude:10, 
              longitude:10,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            socket.emit('locationChild',testregion,"1baf7534-f582-403f-a5ef-f09464b5733e")
            
          }
          else if(childId=="7ce14780-1a03-438a-9596-973d81725fa0"){
            const testregion={
              latitude:40, 
              longitude:20,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            };
            socket.emit('locationChild',testregion,"7ce14780-1a03-438a-9596-973d81725fa0")
          }
          setCheckUpdate(true)
          setChildId(childId)
        });
      }
    }, [region])
  return (
    <View style={globalStyle.container}>
      <Text style={globalStyle.h1}>Đọc được dòng ni thì máy thằng kid bật r đó, qua mà check location</Text>
    </View>
  );
};

export default ChildTest;