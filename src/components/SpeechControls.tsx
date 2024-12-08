import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Volume2, Globe2 } from 'lucide-react';

interface SpeechControlsProps {
  text: string;
  isTextLoaded: boolean;
}

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  languageCode: string;
  languageName: string;
}

const SpeechControls = ({ text, isTextLoaded }: SpeechControlsProps) => {
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const voiceOptions = availableVoices.map(voice => {
        let languageName = voice.lang;
        try {
          const displayNames = new Intl.DisplayNames([navigator.language], { 
            type: 'language',
            style: 'long',
            languageDisplay: 'standard'
          });
          
          const [langCode, countryCode] = voice.lang.split('-');
          const baseLangName = displayNames.of(langCode) || langCode;
          
          if (countryCode) {
            const regionNames = new Intl.DisplayNames([navigator.language], { type: 'region' });
            const countryName = regionNames.of(countryCode);
            languageName = `${baseLangName} (${countryName})`;
          } else {
            languageName = baseLangName;
          }
        } catch (error) {
          console.log('Error getting language name:', error);
          languageName = voice.lang;
        }
        
        return {
          voice: voice,
          languageCode: voice.lang,
          languageName: languageName
        };
      });
      
      setVoices(voiceOptions);
      
      // Get the last used voice from localStorage
      const lastUsedVoice = localStorage.getItem('selectedVoice');
      const lastUsedLanguage = localStorage.getItem('selectedLanguage');
      
      // If there's a last used voice and it's available, use it
      if (lastUsedVoice && voiceOptions.some(v => v.voice.name === lastUsedVoice)) {
        setSelectedVoice(lastUsedVoice);
        if (lastUsedLanguage) {
          setSelectedLanguage(lastUsedLanguage);
        }
      } else {
        // Otherwise, try to use browser's default voice
        const defaultVoice = availableVoices.find(voice => voice.default);
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
          setSelectedLanguage(defaultVoice.lang);
        } else if (voiceOptions.length > 0) {
          // Fallback to first available voice
          setSelectedVoice(voiceOptions[0].voice.name);
          setSelectedLanguage(voiceOptions[0].languageCode);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voice.name === selectedVoice)?.voice;
    if (voice) {
      utterance.voice = voice;
      // Store the selected voice in localStorage
      localStorage.setItem('selectedVoice', voice.name);
      localStorage.setItem('selectedLanguage', voice.lang);
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const uniqueLanguages = Array.from(new Set(voices.map(v => v.languageCode))).sort();

  const filteredVoices = voices.filter(v => v.languageCode === selectedLanguage);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Globe2 className="text-blue-900" size={24} />
          <select
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              const firstVoiceInLanguage = voices.find(v => v.languageCode === e.target.value);
              if (firstVoiceInLanguage) {
                setSelectedVoice(firstVoiceInLanguage.voice.name);
              }
            }}
          >
            {uniqueLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {voices.find(v => v.languageCode === lang)?.languageName || lang}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <Volume2 className="text-blue-900" size={24} />
          <select
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {filteredVoices.map((voiceOption) => (
              <option key={voiceOption.voice.name} value={voiceOption.voice.name}>
                {voiceOption.voice.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {isPlaying ? (
          <button
            onClick={pause}
            className="p-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors"
            disabled={!isTextLoaded}
          >
            <Pause size={24} />
          </button>
        ) : (
          <button
            onClick={speak}
            className="p-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors"
            disabled={!isTextLoaded}
          >
            <Play size={24} />
          </button>
        )}
        <button
          onClick={stop}
          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          disabled={!isTextLoaded}
        >
          <Square size={24} />
        </button>
      </div>
    </div>
  );
};

export default SpeechControls;
