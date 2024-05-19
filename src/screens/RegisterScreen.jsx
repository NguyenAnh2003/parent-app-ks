import * as React from 'react';
import { Text, View, Alert, TouchableOpacity } from 'react-native';
import globalStyle from '../styles/globalStyle';
import { supabase } from '../libs/supabase/supabase';
import CustomInput from '../components/CustomInput';
import { registerEmail } from '../libs/supabase/auth.services';
import { useFormik } from 'formik';

const validate = (values) => {
  const erros = {};
  if (!values.name) {
    erros.name = 'Required';
  }
  if (!values.country) {
    erros.country = 'Required';
  }
  if (!values.phone) {
    erros.phone = 'Required';
  }
  if (!/^\d+$/.test(values.phone)) {
    erros.phone = 'Must contains number';
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.gmail)) {
    erros.gmail = 'Invalid gmail';
  }
  if (!values.gmail) {
    erros.gmail = 'Required';
  }
  if (!values.password) {
    erros.password = 'Required';
  }
  if (values.password !== values.confirmpassword) {
    erros.confirmpassword = 'Not matching';
  }
  return erros;
};

const RegisterScreen = ({ navigation }) => {

  const formik = useFormik({
    initialValues: {
      gmail: '',
      name: '',
      country: '',
      phone: '',
      password: '',
      confirmpassword: '',
    },
    enableReinitialize: true,
    validate: validate,
    onSubmit: async (values) => {
      try {
        // formData
        const formData = {
          name: values.name,
          country: values.country,
          gmail: values.gmail,
          phone: parseInt(values.phone),
          password: values.password,
        };

        /** call api */
        const { session, user } = await registerEmail(
          formData.gmail,
          formData.password
        );
        /** ccc */
        if (!session && !user) {
          const alertPedning = async () => {
            Alert.alert(
              'Confirmation',
              'Please check your inbox for email verification!',
              [
                {
                  text: 'ok',
                  onPress: () => {
                    navigation.navigate('SignIn');
                  },
                },
              ]
            );
          };
          await alertPedning();
        }
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  return (
    <>
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
          Create ur account
        </Text>
        {/** input */}
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <View style={{ flexDirection: 'column', gap: 10 }}>
            <CustomInput
              placeHolder="Enter your name"
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
              placeHolder="Your country"
              type="text"
              values={formik.values.country}
              onChangeText={formik.handleChange('country')}
            />
            {formik.touched.country && formik.errors.country ? (
              <Text style={{ color: 'red' }}>{formik.errors.country}</Text>
            ) : (
              <></>
            )}
            <CustomInput
              placeHolder="Your phone number"
              type="text"
              values={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <Text style={{ color: 'red' }}>{formik.errors.phone}</Text>
            ) : (
              <></>
            )}
            {/** email */}
            <CustomInput
              placeHolder="Enter your gmail"
              type="gmail"
              values={formik.values.gmail}
              onChangeText={formik.handleChange('gmail')}
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
              values={formik.values.password}
              onChangeText={formik.handleChange('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <Text style={{ color: 'red' }}>{formik.errors.password}</Text>
            ) : (
              <></>
            )}
            {/** password */}
            <CustomInput
              placeHolder="Confirm ur password"
              type="password"
              values={formik.values.confirmpassword}
              onChangeText={formik.handleChange('confirmpassword')}
            />
            {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <Text style={{ color: 'red' }}>
                {formik.errors.confirmpassword}
              </Text>
            ) : (
              <></>
            )}
          </View>
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
              Register
            </Text>
          </TouchableOpacity>
          {/** navigate to signup */}
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <Text style={{ fontSize: 13, color: 'black', fontWeight: 300 }}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            >
              <Text style={{ fontSize: 13, color: 'black', fontWeight: 600 }}>
                Login Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default RegisterScreen;
