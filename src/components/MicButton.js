import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { MIC_STATES } from '../store/reducer';

const MicButton = ({ onPress, style, state }) => {
  let message, color, disabled;

  if (state === MIC_STATES.READY) {
    color = 'red';
    message = 'Tap on mic to speak';
    disabled = false;
  } else if (state === MIC_STATES.UNAVAILABLE) {
    color = 'grey';
    message = 'Mic is not available';
    disabled = true;
  } else if (state === MIC_STATES.BUSY) {
    color = 'green';
    message = 'Listening...';
    disabled = true;
  }

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.message}>{message}</Text>
      <TouchableWithoutFeedback disabled={disabled} onPress={onPress}>
        <View style={[styles.micButton, { backgroundColor: color }]}>
          <FeatherIcon name="mic" size={24} color="#fff" />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default MicButton;

const styles = StyleSheet.create({
  container: { alignItems: 'center' },

  micButton: {
    width: 70,
    height: 70,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
});
