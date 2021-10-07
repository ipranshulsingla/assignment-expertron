import { findBestMatch } from 'string-similarity';

export default function findBestMatchOfSpeechText(speechText, against) {
  const { bestMatchIndex, bestMatch } = findBestMatch(speechText.toLowerCase(), against);
  if (bestMatch.rating < 0.8) {
    return null;
  }

  return bestMatchIndex;
}
