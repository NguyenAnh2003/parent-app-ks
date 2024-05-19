import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
} from 'react-native';
import globalStyle from '../styles/globalStyle';
import { useReducer, useRef, useState } from 'react';
import CustomInput from '../components/CustomInput';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../redux/actions/actions';
import { loginEmail } from '../libs/supabase/auth.services';
import { useFormik } from 'formik';

const styles = StyleSheet.create({});

const validate = (values) => {
  const erros = {};

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.gmail)) {
    erros.gmail = 'Invalid gmail';
  }
  if (!values.gmail) {
    erros.gmail = 'Required';
  }
  if (!values.password) {
    erros.password = 'Required';
  }
  return erros;
};

const LoginScreen = ({ navigation }) => {
  /** */
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      gmail: '',
      password: '',
    },
    enableReinitialize: true,
    validate: validate,
    onSubmit: async (values) => {
      const formData = {
        gmail: values.gmail,
        password: values.password,
      };
      const response = await loginEmail(formData.gmail, formData.password);
      /** session & user */
      const { session, user } = response;
      if (session && user) {
        dispatch(userLogin(JSON.stringify(session)));
      } else {
        /** handle error here */
        console.log('Invalid info');
      }
    },
  });

  return (
    <View
      style={[
        globalStyle.container,
        { paddingTop: 130, paddingHorizontal: 20 },
      ]}
    >
      <Text
        style={{
          color: 'black',
          marginBottom: 20,
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        Welcome Back
      </Text>
      {/** input */}
      <View style={{ flexDirection: 'column', gap: 10 }}>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          {/** email */}
          <CustomInput
            placeHolder="Enter your email"
            type="gmail"
            onChangeText={formik.handleChange('gmail')}
            values={formik.values.gmail}
          />
          {formik.touched.gmail && formik.errors.gmail ? (
            <Text style={{ color: 'red' }}>{formik.errors.gmail}</Text>
          ) : (
            <></>
          )}
          {/** password */}
          <CustomInput
            placeHolder="Your password"
            type="password"
            onChangeText={formik.handleChange('password')}
            values={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <Text style={{ color: 'red' }}>{formik.errors.password}</Text>
          ) : (
            <></>
          )}
        </View>
        {/** forgot password */}
        <TouchableOpacity
          style={{ alignItems: 'flex-end', marginVertical: 12 }}
        >
          <Text style={{ fontSize: 13, color: 'black', fontWeight: 600 }}>
            Forgot password?
          </Text>
        </TouchableOpacity>
        {/** submit handler */}
        <TouchableOpacity
          onPress={formik.handleSubmit}
          style={{
            backgroundColor: 'black',
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              color: '#ffff',
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        {/** navigate to signup */}
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Text style={{ fontSize: 13, color: 'black', fontWeight: 300 }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            style={{}}
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <Text style={{ fontSize: 13, color: 'black', fontWeight: 600 }}>
              Signup Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
