import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchVideos as searchVideosApi } from '../api/videos';

const MIC_STATES = {
  UNAVAILABLE: 'UNAVAILABLE',
  BUSY: 'BUSY',
  READY: 'READY',
};

const SEARCH_VIDEOS = createAsyncThunk('root/SEARCH_VIDEOS', ({ query }) => {
  return searchVideosApi(query);
});

const rootSlice = createSlice({
  name: 'root',

  initialState: {
    micState: MIC_STATES.UNAVAILABLE,
    speechToText: { transcript: '', keyword: '' },
    videoSearchResults: [],
    loading: false,
    error: '',
  },

  // @reduxjs/toolkit internally use immer to manage immutability.
  // So that user can easily change the state without caring about immutability.

  reducers: {
    MIC_ACTIVE_STATE_CHANGED: (state, action) => {
      state.micState = action.payload.newState;
    },

    SET_SPEECH_TO_TEXT: (state, action) => {
      state.speechToText.transcript = action.payload.transcript;
      state.speechToText.keyword = action.payload.keyword;
    },

    SET_VIDEO_SEARCH_RESULTS: (state, action) => {
      state.videoSearchResults = action.payload.results;
    },
  },

  extraReducers: {
    [SEARCH_VIDEOS.pending]: state => {
      state.loading = true;
    },

    [SEARCH_VIDEOS.fulfilled]: (state, action) => {
      state.loading = false;
      state.videoSearchResults = action.payload;
    },

    [SEARCH_VIDEOS.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
  },
});

const micStateSelector = state => state.micState;

const videoSearchResultsSelector = state => state.videoSearchResults;

const speechToTextValueSelector = state => state.speechToText;

const actions = { ...rootSlice.actions, SEARCH_VIDEOS };

const selectors = {
  micStateSelector,
  videoSearchResultsSelector,
  speechToTextValueSelector,
};

export default rootSlice.reducer;

export { actions, selectors, MIC_STATES };
