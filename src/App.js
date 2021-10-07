import Voice from '@react-native-voice/voice';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MicButton from './components/MicButton';
import VideoResults from './components/VideoResults';
import { actions, MIC_STATES, selectors } from './store/reducer';
import findBestMatchOfSpeechText from './utils/findBestMatchOfSpeechText';

const questionsMap = [
  { question: 'show me dogs', keyword: 'dogs' },
  { question: 'i want to see cats', keyword: 'cats' },
  { question: 'show me cats', keyword: 'cats' },
  { question: 'i want to see dogs', keyword: 'dogs' },
];

const questions = questionsMap.map(q => q.question);

const App = () => {
  const dispatch = useDispatch();
  const micState = useSelector(selectors.micStateSelector);

  useEffect(() => {
    Voice.isAvailable().then(isAvailable => {
      dispatch(
        actions.MIC_ACTIVE_STATE_CHANGED({
          newState: isAvailable ? MIC_STATES.READY : MIC_STATES.UNAVAILABLE,
        }),
      );
    });

    const onSpeechResults = e => {
      const value = e.value[0];
      const index = findBestMatchOfSpeechText(value, questions);

      dispatch(actions.MIC_ACTIVE_STATE_CHANGED({ newState: MIC_STATES.READY }));

      if (index === null) {
        Alert.alert('Alert', `No results found for "${value}"`);
        return;
      }
      dispatch(actions.SET_SPEECH_TO_TEXT({ transcript: value, keyword: [questionsMap[index].keyword] }));
    };

    const onSpeechError = e => {
      dispatch(actions.MIC_ACTIVE_STATE_CHANGED({ newState: MIC_STATES.READY }));

      if (e.error.code === '7') {
        // no match found
        return;
      }

      Alert.alert('Error', JSON.stringify(e));
    };

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy();
    };
  }, [dispatch]);

  const handleMicPress = () => {
    dispatch(actions.MIC_ACTIVE_STATE_CHANGED({ newState: MIC_STATES.BUSY }));
    Voice.start('en-IN');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.welcomeText}>Welcome to Video Bot</Text>

      <VideoResults style={StyleSheet.absoluteFill} />

      <MicButton state={micState} onPress={handleMicPress} style={styles.micButton} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
  },

  welcomeText: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: 50,
  },

  micButton: {
    width: '100%',
    position: 'absolute',
    bottom: 100,
  },
});
