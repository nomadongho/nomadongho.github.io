/* audio.js - Speech Synthesis wrapper for Korean Explorer */

const AudioManager = (() => {
  const synth = window.speechSynthesis;
  let koreanVoice = null;
  let englishVoice = null;
  let voicesLoaded = false;

  function loadVoices() {
    const voices = synth.getVoices();
    koreanVoice  = voices.find(v => v.lang === 'ko-KR') ||
                   voices.find(v => v.lang.startsWith('ko')) || null;
    englishVoice = voices.find(v => v.lang === 'en-US') ||
                   voices.find(v => v.lang.startsWith('en')) || null;
    voicesLoaded = true;
  }

  // Voices may load asynchronously
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
  loadVoices();

  function speak(text, lang = 'ko', rate = 0.85, pitch = 1.1) {
    if (!synth) return;
    synth.cancel();

    if (!voicesLoaded) loadVoices();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate  = rate;
    utter.pitch = pitch;

    if (lang === 'ko' && koreanVoice) {
      utter.voice = koreanVoice;
      utter.lang  = 'ko-KR';
    } else if (lang === 'en' && englishVoice) {
      utter.voice = englishVoice;
      utter.lang  = 'en-US';
    } else {
      utter.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
    }

    synth.speak(utter);
    return utter;
  }

  function speakKorean(text, rate = 0.8) {
    return speak(text, 'ko', rate, 1.1);
  }

  function speakEnglish(text, rate = 0.9) {
    return speak(text, 'en', rate, 1.15);
  }

  function cancel() {
    synth.cancel();
  }

  return { speakKorean, speakEnglish, speak, cancel };
})();
