import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import useTimer from '../hooks/useTimer';
import useUpdateEffect from '../hooks/useUpdateEffect';
import { actions, selectors } from '../store/reducer';

const { videoSearchResultsSelector, speechToTextValueSelector } = selectors;

const VideoResults = ({ style }) => {
  const dispatch = useDispatch();

  const videos = useSelector(videoSearchResultsSelector);
  const speechToText = useSelector(speechToTextValueSelector);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const {
    remainingTime,
    isRunning: isTimerRunning,
    stop: stopTimer,
    restart: restartTimer,
  } = useTimer({
    seconds: 5,
    onExpiry: () => {
      if (videos.length - 1 === currentVideoIndex) {
        setCurrentVideoIndex(0);
      } else {
        setCurrentVideoIndex(c => c + 1);
      }
    },
  });

  useUpdateEffect(() => {
    setCurrentVideoIndex(0);
    if (isTimerRunning) {
      stopTimer();
    }

    dispatch(actions.SEARCH_VIDEOS({ query: speechToText.keyword }));
  }, [speechToText, dispatch]);

  const handleVideoEnd = () => {
    restartTimer();
  };

  if (videos.length === 0) {
    return null;
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <View style={style}>
      <Text>Showing results for "{speechToText.transcript}"</Text>
      <Video
        source={{
          uri: currentVideo.uri,
        }}
        resizeMode="cover"
        onEnd={handleVideoEnd}
        style={styles.videoPlayer}
      />
      {isTimerRunning && <Text style={styles.overlayText}>{`Playing next video in ${remainingTime}s`}</Text>}
    </View>
  );
};

export default VideoResults;

const styles = StyleSheet.create({
  videoPlayer: {
    width: '100%',
    height: '100%',
  },

  overlayText: {
    top: 30,
    fontSize: 18,
    color: '#fff',
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
  },
});
