import * as Speech from 'expo-speech';

/**
 * Read text aloud. Pre-readers (Grade R-3) rely on this.
 * Never throws: if the device has no voice, the app simply stays silent.
 */
export function speak(text: string, language = 'en-ZA') {
  try {
    Speech.stop();
    Speech.speak(text, { language, rate: 0.9 });
  } catch {
    // no voice available on this device
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
