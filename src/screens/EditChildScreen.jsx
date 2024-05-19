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
import { useSelector } from 'react-redux';
import { supabase } from '../libs/supabase/supabase';
import SplashScreen from './SplashScreen';
import { getChildInfo, getImageUrl, updateChild } from '../libs';
import { useFormik } from 'formik';

/** reducer
 * @param username
 * @param gmail
 * @param country
 * @param phone
 */
const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_DATA':
      console.log(action.payload.phone);
      /** return fetched data from api */
      return {
        parentId: action.payload.parentId,
        avatar: action.payload.avatarUrl, // ava url
        name: action.payload.kidName, // kidname
        phonetype: action.payload.phoneType, // phonetype
        phone: JSON.stringify(action.payload.phone), // phone
        age: JSON.stringify(action.payload.age), // age
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
  if (!values.phonetype) {
    erros.phonetype = 'Required';
  }
  if (!/^\d+$/.test(values.phone)) {
    erros.phone = 'Phone must contain number';
  }
  if (!values.phone) {
    erros.phone = 'Required';
  }
  if (!/^\d+$/.test(values.age)) {
    erros.age = 'Age must contain number';
  }
  if (!values.age) {
    erros.age = 'Required';
  }
  return erros;
};

const EditChildScreen = ({ navigation, route }) => {
  /** child id */
  const { childId } = route.params;

  useEffect(() => {
    console.log('childId', childId);
  }, [navigation]);

  const currentUserSession = useSelector((state) => state.userReducers?.user);
  const [refresh, setRefresh] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    isFetching: true,
    avatar: '',
    name: '',
    phonetype: '',
    phone: '',
    age: '',
    parentId: '',
  });

  const formik = useFormik({
    initialValues: {
      name: state.name,
      phonetype: state.phonetype,
      phone: state.phone,
      age: state.age,
    },
    enableReinitialize: true,
    validate: validate,
    onSubmit: async (values) => {
      dispatch({ type: 'PROCESSING_UPDATE_DATA' });
      const formData = {
        name: values.name,
        age: parseInt(values.age),
        phonetype: values.phonetype,
        phone: parseInt(values.phone),
        avatar: state.avatar,
      };
      const status = await updateChild(
        childId, // childId
        formData.name, // name
        formData.age, // age
        formData.phone, // phone
        formData.phonetype, // phonetype
        formData.avatar // avatar
      );
      if (status === 204) dispatch({ type: 'UPDATE_COMPLETED' });
    },
  });

  useEffect(() => {
    const fetchDataaa = async () => {
      const data = await getChildInfo(childId);
      if (data) dispatch({ type: 'USER_DATA', payload: data[0] });
    };

    fetchDataaa();
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefresh(true);
    const fetchDataaa = async () => {
      const data = await getChildInfo(childId);
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
          {state && <Text style={[styles.accountName]}>{state.name}</Text>}
        </View>
        {/** from view */}
        <View style={styles.profileInformation}>
          {state && (
            <>
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
              <CustomInput
                defauleVal={formik.initialValues.phonetype}
                type="text"
                values={formik.values.phonetype}
                onChangeText={formik.handleChange('phonetype')}
              />
              {formik.touched.phonetype && formik.errors.phonetype ? (
                <Text style={{ color: 'red' }}>{formik.errors.phonetype}</Text>
              ) : (
                <></>
              )}
              <CustomInput
                defauleVal={formik.initialValues.phone}
                type="text"
                values={formik.values.phone}
                onChangeText={formik.handleChange('phone')}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <Text style={{ color: 'red' }}>{formik.errors.phone}</Text>
              ) : (
                <></>
              )}
              <CustomInput
                defauleVal={formik.initialValues.age}
                type="text"
                values={formik.values.age}
                onChangeText={formik.handleChange('age')}
              />
              {formik.touched.age && formik.errors.age ? (
                <Text style={{ color: 'red' }}>{formik.errors.age}</Text>
              ) : (
                <></>
              )}
            </>
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

export default EditChildScreen;
