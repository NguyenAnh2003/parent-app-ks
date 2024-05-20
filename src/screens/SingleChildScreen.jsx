import {
  View,
  Text,
  Image,
  StyleSheet,
  NativeModules,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import globalStyle from '../styles/globalStyle';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import ActivityCard from '../components/cards/ActivityCard';
import UsageChart from '../components/UsageChart';
import StickyButton from '../components/buttons/StickyButton';
import { deleteChild, getAllActivities } from '../libs';
import { c, packageList } from '../mock/activities';
import TimeLimitModal from '../components/modal/TimeLimitModal';
import SplashScreen from './SplashScreen';

const styles = StyleSheet.create({
  /** container */
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fafafa',
    paddingHorizontal: 8,
    paddingVertical: 15,
  },
  /** name */
  textHeading: {
    fontSize: 17,
    color: 'black',
  },
  /** flexbox for name and image */
  topBox: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
    paddingBottom: 5,
  },
  avatarChild: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});

const numDay = 1;
const numWeek = 2;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ACTIVITIES':
      return { activities: action.payload, isFetching: false };
    default:
      return { ...state };
  }
};

const SingleChildScreen = ({ route, navigation }) => {
  /**
   * @param childId
   * @param childName
   * @param childImage (avatar)
   * @param activities ? (com.package.name, timeUsed, date)
   */

  /** expand */
  const [expand, setExpand] = useState(false);

  /** modal */
  const [modalVisible, setModalVisible] = useState(false);

  /** reducer */
  const [state, dispatch] = useReducer(reducer, {
    activities: [],
    isFetching: true,
  });

  /** native module */
  const { AppPackaging } = NativeModules;
  /** childId -> fetchDataByChildId */
  const { childId, childName, childImage, phoneType } = route.params;
  /** option */
  const [option, setOption] = useState('recent');
  const options = ['recent', '5 days'];

  /** state */
  const [activities, setActivities] = useState(packageList);
  const [refresh, setRefresh] = useState(false);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    /** fetch data again */
    setRefresh(false);
  }, []);

  const dataBasedonTime = useMemo(() => {
    if (state.activities) {
      if (option === 'recent') {
        const today = new Date();
        const today2 = new Date(today);
        today2.setDate(today.getDate() - 1);

        const todayUsage = state.activities.filter((item) => {
          const itemDate = new Date(item.dateUsed);
          // Compare timestamps of itemDate and previousDay
          return (
            itemDate.getTime() >= today2.getTime() &&
            itemDate.getTime() < today.getTime()
          );
        });

        return todayUsage;
      }
      if (option === '5 days') {
        const today = new Date();

        const previousWeek = new Date(today);
        previousWeek.setDate(today.getDate() - 7 * numWeek);

        // Filter data for the previous day
        const previousWeekData = state.activities.filter((item) => {
          const itemDate = new Date(item.dateUsed);
          // Compare timestamps of itemDate and previousWeek
          return itemDate >= previousWeek && itemDate < today;
        });

        return previousWeekData;
      }
    }
  }, [option]);

  useEffect(() => {
    /** */
    const fetchData = async () => {
      const processedPackage = await AppPackaging.preprocessAppPackageInfo(
        dataBasedonTime
      );

      if (processedPackage) {
        dispatch({ type: 'FETCH_ACTIVITIES', payload: processedPackage });
      }
    };

    fetchData();
  }, [dataBasedonTime, option]);

  /** setup header when nav & childId change */
  useEffect(() => {
    /** setup header when (childId, navigation) change */
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            width: '100%',
          }}
        >
          <View
            style={{ flexDirection: 'row', alignContent: 'center', gap: 10 }}
          >
            <Image
              source={{ uri: childImage, width: 30, height: 30 }}
              style={{ marginLeft: -20, borderRadius: 10 }}
            />
            <Text style={{ color: '#333', fontSize: 15, fontWeight: '600' }}>
              {childName}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="account-edit-outline"
            size={24}
            color={'black'}
            onPress={() =>
              navigation.navigate('EditChild', {
                childId: childId,
              })
            }
          />
        </View>
      ),
    });

    /** fetch child data by childId */
    const fetchActivities = async () => {
      const activities = await getAllActivities(childId);

      console.log({ activities });

      if (activities) {
        const processedActivities = c.map((i) => {
          const processedDateUsed = i.dateUsed.split('T')[0];
          const currentTimestamp = Number(i.timeUsed);
          const id = i.id.toString();
          return {
            ...i,
            id: id,
            dateUsed: processedDateUsed,
            timeUsed: currentTimestamp,
          };
        });
        dispatch({ type: 'FETCH_ACTIVITIES', payload: processedActivities });
      }
    };

    fetchActivities();

    /** remove data */
    return () => {};
  }, [childId, navigation]);

  return state.isFetching ? (
    <SplashScreen />
  ) : (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
      }
    >
      <View
        style={[globalStyle.container, { paddingTop: 20, paddingBottom: 0 }]}
      >
        {/** child info container */}
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {/** child view */}
            <View
              style={[
                styles.topBox,
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  paddingRight: 10,
                  borderBottomWidth: 1,
                  borderColor: '#f2f2f2',
                },
              ]}
            >
              <View style={styles.topBox}>
                <Image
                  source={{ uri: childImage }}
                  style={styles.avatarChild}
                />
                {/** */}
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.textHeading}>{childName}</Text>
                  <Text style={{ color: '#a5a5a5' }}>{phoneType}</Text>
                </View>
              </View>

              <MaterialCommunityIcons
                name="delete"
                color={'black'}
                size={24}
                onPress={() => {
                  Alert.alert(
                    'Confirm',
                    'Do you really want to delete this child?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          deleteChild(childId);
                          navigation.goBack();
                        },
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              />
            </View>
            {/** activities view */}
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
              }}
            >
              {options.map((i, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ padding: 10, backgroundColor: '#000', minWidth: 80 }}
                  onPress={() => setOption(i)}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {i.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text
              style={{
                color: 'black',
                marginTop: 15,
                marginLeft: 5,
                fontSize: 20,
                fontWeight: '700',
              }}
            >
              Activities in {option.toUpperCase()}
            </Text>
            {/** block activities today */}
            <View style={{ maxHeight: 200 }}>
              {state.activities?.length !== 0 ? (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <View
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 15,
                      backgroundColor: '#fff',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {state.activities?.map((i, index) => (
                      <ActivityCard
                        key={index}
                        packageName={i.appName}
                        packageImage={i.icon}
                        packageTimeUsed={i.timeUsed}
                        packageDateUsed={i.dateUsed}
                      />
                    ))}
                  </View>
                </ScrollView>
              ) : (
                <Text
                  style={{
                    color: 'red',
                    marginTop: 95,
                    marginLeft: 5,
                    fontSize: 20,
                    fontWeight: '500',
                    textAlign: 'center',
                  }}
                >
                  There is no activities in recent
                </Text>
              )}
            </View>
            {/** activities last week view */}
            {activities?.length !== 0 ? (
              <>
                <Text
                  style={{
                    color: 'black',
                    marginLeft: 5,
                    fontSize: 20,
                    fontWeight: '600',
                  }}
                >
                  Usage Chart
                </Text>
                {state.activities && <UsageChart activities={state.activities} />}
              </>
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
        <StickyButton
          onPress={() => setExpand(true)}
          icon={<Feather name="info" size={24} color={'black'} />}
        />
        {expand && (
          <>
            {/** collapsing panel */}
            <StickyButton
              onPress={() => setExpand(false)}
              icon={<Entypo name="cross" size={24} color={'black'} />}
            />
            <View>
              {/** Map button */}
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  backgroundColor: '#fdf6e2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: 35,
                  right: 90,
                  alignSelf: 'flex-end',
                }}
                onPress={() =>
                  navigation.navigate('LocationTracking', {
                    childId: childId,
                  })
                }
              >
                <MaterialCommunityIcons
                  name="google-maps"
                  size={24}
                  color={'black'}
                />
              </TouchableOpacity>
              {/** Time limit button */}
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  backgroundColor: '#fdf6e2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  bottom: 35,
                  right: 160,
                  alignSelf: 'flex-end',
                }}
                onPress={() => setModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="clock-time-seven"
                  size={24}
                  color={'black'}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
        {/** modal */}
        {modalVisible && (
          <TimeLimitModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            childId={childId}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default SingleChildScreen;
