import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface SpeechControlsProps {
  text: string;
  isTextLoaded: boolean;
}

const SpeechControls = ({ text, isTextLoaded }: SpeechControlsProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
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
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

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

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Volume2 className="text-blue-900" size={24} />
        <select
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
        >
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
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