import React, { useEffect, useRef, useReducer, useState } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import globalStyle from '../styles/globalStyle';
import CustomInput from '../components/CustomInput';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { createChild } from '../libs/supabase/child.services';
import { supabase } from '../libs/supabase/supabase';
import { getImageUrl } from '../libs';
import SplashScreen from './SplashScreen';
import { useFormik } from 'formik';
import { TextInput } from 'react-native-gesture-handler';

const reducer = (state, action) => {
  switch (action.type) {
    case 'PROCESSING_ADDING':
      return { ...state, isFetching: true };
    case 'ADD_COMPLETE':
      return {
        isFetching: false,
      };
    case 'UPLOAD_IMAGE':
      return { ...state, isFetching: true };
    case 'UPLOAD_IMAGE_SUCCESS':
      return { ...state, avatar: action.payload, isFetching: false };
    default:
      return state;
  }
};

const tempUrl =
  'https://scontent.fdad4-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeG9i1qn6l43gkgamWlIFfcBso2H55p0AlGyjYfnmnQCUWkluqxxNCGvGVG1PVYHXNR6aK5qtqLm_qilNbC_bMV0&_nc_ohc=cTJO8eTdhaEAb6zAot4&_nc_ht=scontent.fdad4-1.fna&oh=00_AfCRgXUDKFeVvmf0ySWAAXBsxuRyRoGjZzO5UJiRIJgbDQ&oe=66549EF8';

const validate = (values) => {
  const erros = {};

  if (!values.name) {
    erros.name = 'Required';
  }
  if (!values.phonetype) {
    erros.phonetype = 'Required';
  }
  if (/^\d+$/.test(values.phonetype)) {
    erros.phonetype = 'Phone type cannot contain number';
  }
  if (!values.phone) {
    erros.phone = 'Required';
  }
  if (!/^\d+$/.test(values.phone)) {
    erros.phone = 'Phone must contain number';
  }
  if (!values.age) {
    erros.age = 'Required';
  }
  if (!/^\d+$/.test(values.age)) {
    erros.age = 'Age must contain number';
  }
  return erros;
};

const AddChild = ({ navigation }) => {
  /** current session */
  const currentUserSession = useSelector((state) => state.userReducers?.user);
  /** state & dispatch */
  const [state, dispatch] = useReducer(reducer, {
    isFetching: false,
    avatar: tempUrl,
  });

  /** formik */
  const formik = useFormik({
    initialValues: {
      name: '',
      phonetype: '',
      phone: '',
      age: '',
    },
    validate: validate,
    onSubmit: async (values) => {
      /**
       * @field avatar
       * @field username
       * @field gmail
       * @field age
       * @field phone numer
       */
      try {
        const parentId = JSON.parse(currentUserSession.session).user.id; // parentId
        /** form data */
        const formData = {
          name: values.name,
          age: parseInt(values.age),
          phonetype: values.phonetype,
          phone: parseInt(values.phone),
        };
        const avatarUrl = state.avatar; // ava
        if (parentId && formData && avatarUrl) {
          dispatch({ type: 'PROCESSING_ADDING' });
          const status = await createChild(
            parentId,
            formData.name, // name
            formData.age, // age
            formData.phone, // phone
            formData.phonetype, // phone type
            avatarUrl // ava url
          );
          if (status === 201) {
            dispatch({ type: 'ADD_COMPLETE' });
            navigation.goBack();
          }
        } else {
          console.log('something not be filled');
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  /** upload image */
  const uploadImage = async (imageUri) => {
    dispatch({ type: 'UPLOAD_IMAGE' });
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`public/${Date.now()}.jpg`, {
          uri: imageUri,
        });
      if (data) {
        const avatarUrl = getImageUrl(data.path);
        dispatch({ type: 'UPLOAD_IMAGE_SUCCESS', payload: avatarUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  /** select image handler */
  const imageHandler = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
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
    <View style={[styles.profileContainer, globalStyle.container]}>
      {/** image view */}
      <View style={[styles.profile]}>
        <View style={[styles.avatar]}>
          {/** image uri read from user info fetch from service */}
          <Image
            style={styles.avatarImage}
            resizeMode="cover"
            // source={require('../assets/avatar.png')}
            source={{ uri: state.avatar ? state.avatar : tempUrl }}
          />
          {/** choose image button */}
          <Entypo
            name={'edit'}
            size={20}
            color="black"
            style={styles.avatarEditor}
            onPress={imageHandler}
          />
        </View>
      </View>
      {/** from view */}
      <View style={styles.profileInformation}>
        <CustomInput
          values={formik.values.name}
          onChangeText={formik.handleChange('name')}
          type="text"
          placeHolder="Your child's name"
        />
        {/** validate name */}
        {formik.touched.name && formik.errors.name ? (
          <Text style={{ color: 'red' }}>{formik.errors.name}</Text>
        ) : (
          <></>
        )}
        <CustomInput
          values={formik.values.phonetype}
          onChangeText={formik.handleChange('phonetype')}
          placeHolder="Enter phone type"
          type="text"
        />
        {/** validate phonetype */}
        {formik.touched.phonetype && formik.errors.phonetype ? (
          <Text style={{ color: 'red' }}>{formik.errors.phonetype}</Text>
        ) : (
          <></>
        )}
        <CustomInput
          values={formik.values.phone}
          onChangeText={formik.handleChange('phone')}
          type="phone"
          placeHolder="Your child's phone"
        />
        {/** validate phone */}
        {formik.touched.phone && formik.errors.phone ? (
          <Text style={{ color: 'red' }}>{formik.errors.phone}</Text>
        ) : (
          <></>
        )}
        <CustomInput
          values={formik.values.age}
          onChangeText={formik.handleChange('age')}
          type="text"
          placeHolder="Your child's age"
        />
        {/** validate age */}
        {formik.touched.age && formik.errors.age ? (
          <Text style={{ color: 'red' }}>{formik.errors.age}</Text>
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
            Create
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 20,
  },
  profileInformation: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
});

export default AddChild;
