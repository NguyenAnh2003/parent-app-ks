import { StyleSheet, TextInput } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
  input: {
    color: 'black',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 16,
    paddingLeft: 15,
    backgroundColor: '#fffdfd',
  },
});

const CustomInput = ({
  placeHolder,
  type,
  defauleVal,
  values,
  onChangeText,
}) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      placeholderTextColor={'black'}
      type={type}
      secureTextEntry={type === 'password' ? true : false}
      defaultValue={defauleVal}
      value={values}
      style={styles.input}
      placeholder={placeHolder}
    />
  );
};

export default CustomInput;
