import { createClient } from 'pexels';

const API_KEY = '563492ad6f9170000100000145d3a4a86b05471ea391b80eea6ad156';

const client = createClient(API_KEY);

export const searchVideos = async query => {
  try {
    const response = await client.videos.search({
      query,
      per_page: 10,
      max_duration: 30,
      size: 'medium',
      orientation: 'portrait',
    });

    return response.videos.map(({ video_files, video_pictures }) => {
      return { uri: video_files[0].link, picture: video_pictures[0].picture };
    });
  } catch (error) {
    return Promise.reject('Something went wrong!');
  }
};
