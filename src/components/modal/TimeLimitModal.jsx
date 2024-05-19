import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
import { createTimeLim } from '../../libs';

const TimeLimitModal = ({ modalVisible, setModalVisible, childId }) => {
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);

  const handleSetUsageLimit = async () => {
    console.log({ selectedHour, selectedMinute, childId });
    try {
      const status = await createTimeLim(childId, selectedHour, selectedMinute);
      console.log({ status });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Time Limit</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedHour}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedHour(itemValue)}
            >
              {[...Array(24).keys()].map((hour) => (
                <Picker.Item key={hour} label={`${hour} hours`} value={hour} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedMinute}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMinute(itemValue)}
            >
              {[...Array(60).keys()].map((minute) => (
                <Picker.Item
                  key={minute}
                  label={`${minute} minutes`}
                  value={minute}
                />
              ))}
            </Picker>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <TouchableOpacity
              onPress={handleSetUsageLimit}
              style={{ padding: 10, backgroundColor: '#fdf6e2', width: 80 }}
            >
              <Text
                style={{ color: '#000', textAlign: 'center', fontWeight: 600 }}
              >
                Set
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ padding: 10, backgroundColor: '#fdf6e2', width: 80 }}
            >
              <Text
                style={{ color: '#000', textAlign: 'center', fontWeight: 600 }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin: {
    margin: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  picker: {
    width: 140,
    height: 10,
    backgroundColor: '#000',
  },
});

export default TimeLimitModal;
