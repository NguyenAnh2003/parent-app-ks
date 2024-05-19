import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import globalStyle from '../styles/globalStyle';
import CustomInput, { InputHandle } from '../components/CustomInput';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../libs/supabase/parent.services';
import { supabase } from '../libs/supabase/supabase';
import SplashScreen from './SplashScreen';
import { getImageUrl } from '../libs';
import getCurrentuserInfo from '../libs/getCurrentUser';
import { useFormik } from 'formik';
import { userLogout } from '../redux/actions/actions';

/** reducer
 * @param username
 * @param gmail
 * @param country
 * @param phone
 */
const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_DATA':
      /** return fetched data from api */
      return {
        avatar: action.payload.avatarUrl,
        username: action.payload.username,
        gmail: action.payload.gmail,
        country: action.payload.country,
        phone: JSON.stringify(action.payload.phone),
        isFetching: false,
      };
    case 'UPLOAD_IMAGE':
      return { ...state, isFetching: true };
    case 'UPLOAD_IMAGE_SUCCESS':
      return { ...state, avatar: action.payload, isFetching: false };
    case 'PROCESSING_UPDATE_DATA':
      return { ...state, isFetching: true };
    case 'UPDATE_COMPLETED':
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

const validate = (values) => {
  const erros = {};

  if (!values.name) {
    erros.name = 'Required';
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.gmail)) {
    erros.gmail = 'Invalid gmail';
  }
  if (!values.gmail) {
    erros.gmail = 'Required';
  }
  if (!/^\d+$/.test(values.phone)) {
    erros.phone = 'Phone must contain number';
  }
  if (!values.phone) {
    erros.phone = 'Required';
  }
  return erros;
};

const AccountScreen = ({ navigation }) => {
  /**
   * @field avatar
   * @field username
   * @field gmail
   * @field country
   * @field phone numer
   */

  const currentUserSession = useSelector((state) => state.userReducers?.user);
  const [refresh, setRefresh] = useState(false);
  const logoutHandler = useDispatch();
  const [state, dispatch] = useReducer(reducer, {
    isFetching: true,
    avatar: '',
    username: '',
    gmail: '',
    country: '',
    phone: '',
  });

  const formik = useFormik({
    initialValues: {
      name: state.username,
      gmail: state.gmail,
      country: state.country,
      phone: state.phone,
    },
    enableReinitialize: true,
    validate: validate,
    onSubmit: async (values) => {
      dispatch({ type: 'PROCESSING_UPDATE_DATA' });
      const userId = JSON.parse(currentUserSession.session).user.id; // userId
      const formData = {
        // formData
        name: values.name,
        country: values.country,
        gmail: values.gmail,
        phone: parseInt(values.phone),
        avatar: state.avatar,
      };
      const status = await updateUserData(
        userId,
        formData.name, // name
        formData.avatar, // avatar
        formData.gmail, // gmail
        formData.country, // country
        formData.phone // phone
      );
      if (status === 204) dispatch({ type: 'UPDATE_COMPLETED' });
    },
  });

  useEffect(() => {
    const fetchDataaa = async () => {
      const data = await getCurrentuserInfo(currentUserSession);
      if (data) dispatch({ type: 'USER_DATA', payload: data[0] });
    };

    fetchDataaa();
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    const fetchDataaa = async () => {
      const data = await getCurrentuserInfo(currentUserSession);
      if (data) dispatch({ type: 'USER_DATA', payload: data[0] });
    };

    fetchDataaa();
    setRefresh(false);
  }, []);

  const uploadImage = async (imageUri) => {
    try {
      dispatch({ type: 'UPLOAD_IMAGE' });
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`public/${Date.now()}.jpg`, {
          uri: imageUri,
        });
      if (data) {
        const avatarUrl = getImageUrl(data.path);
        if (avatarUrl)
          dispatch({ type: 'UPLOAD_IMAGE_SUCCESS', payload: avatarUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const imageHandler = async () => {
    /** options */
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    /** launch lib */
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        uploadImage(imageUri);
      }
    });
  };

  return state.isFetching ? (
    <SplashScreen />
  ) : (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.profileContainer, globalStyle.container]}>
        {/** image view */}
        <View style={[styles.profile]}>
          <View style={[styles.avatar]}>
            {/** image uri read from user info fetch from service */}
            {state && (
              <Image
                style={styles.avatarImage}
                resizeMode="cover"
                /**  */
                source={{
                  uri: state.avatar,
                }}
              />
            )}
            {/** choose image button */}
            <Entypo
              name={'edit'}
              size={20}
              color="black"
              style={styles.avatarEditor}
              onPress={imageHandler}
            />
          </View>
          <Text style={[styles.accountName]}>{state.username}</Text>
        </View>
        {/** from view */}
        <View style={styles.profileInformation}>
          {/** name */}
          <CustomInput
            defauleVal={formik.initialValues.name}
            type="text"
            values={formik.values.name}
            onChangeText={formik.handleChange('name')}
          />
          {formik.touched.name && formik.errors.name ? (
            <Text style={{ color: 'red' }}>{formik.errors.name}</Text>
          ) : (
            <></>
          )}
          {/** gmail */}
          <CustomInput
            defauleVal={formik.initialValues.gmail}
            values={formik.values.gmail}
            onChangeText={formik.handleChange('gmail')}
            type="gmail"
          />
          {formik.touched.gmail && formik.errors.gmail ? (
            <Text style={{ color: 'red' }}>{formik.errors.gmail}</Text>
          ) : (
            <></>
          )}
          {/** country */}
          <CustomInput
            defauleVal={formik.initialValues.country}
            values={formik.values.country}
            onChangeText={formik.handleChange('country')}
            type="text"
          />
          {formik.touched.country && formik.errors.country ? (
            <Text style={{ color: 'red' }}>{formik.errors.country}</Text>
          ) : (
            <></>
          )}
          {/** phone */}
          <CustomInput
            defauleVal={formik.initialValues.phone}
            values={formik.values.phone}
            onChangeText={formik.handleChange('phone')}
            type="text"
          />
          {formik.touched.phone && formik.errors.phone ? (
            <Text style={{ color: 'red' }}>{formik.errors.phone}</Text>
          ) : (
            <></>
          )}
          {/** save button */}
          <TouchableOpacity
            style={{
              backgroundColor: 'black',
              padding: 10,
              alignSelf: 'flex-end',
              borderRadius: 5,
            }}
            onPress={formik.handleSubmit}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              logoutHandler(userLogout());
            }}
          >
            <Text style={{ color: 'black', fontWeight: 700, fontSize: 20 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  alignCenter: {
    display: 'flex',
    flexDirection: 'row',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    position: 'relative',
  },

  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 90,
  },

  avatarEditor: {
    padding: 3,
    paddingLeft: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#333',
  },

  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 20,
    marginBottom: 75,
  },
  profileInformation: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
});

export default AccountScreen;
