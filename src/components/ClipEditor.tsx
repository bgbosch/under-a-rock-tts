import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import TimeInputs from './TimeInputs';
import ClipActions from './ClipActions';
import { handleSpeechSynthesis, downloadAudioFile, downloadTextFile } from '@/utils/audioUtils';

interface ClipEditorProps {
  id: string;
  initialText: string;
  startTime?: string;
  endTime?: string;
  onTextChange: (id: string, newText: string) => void;
  onTimeChange: (id: string, startTime: string, endTime: string) => void;
  onPlay: (text: string) => void;
}

const ClipEditor = ({
  id,
  initialText,
  startTime = "00:00:00,000",
  endTime = "00:00:00,000",
  onTextChange,
  onTimeChange,
  onPlay,
}: ClipEditorProps) => {
  const [text, setText] = useState(initialText);
  const [currentStartTime, setCurrentStartTime] = useState(startTime);
  const [currentEndTime, setCurrentEndTime] = useState(endTime);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(id, newText);
  };

  const handleStartTimeChange = (newTime: string) => {
    setCurrentStartTime(newTime);
    onTimeChange(id, newTime, currentEndTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    setCurrentEndTime(newTime);
    onTimeChange(id, currentStartTime, newTime);
  };

  const handleDownloadAudio = async () => {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = 0;
      
      const destination = audioContext.createMediaStreamDestination();
      gainNode.connect(destination);
      
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        downloadAudioFile(audioBlob, `clip_${id}.wav`);
        audioContext.close();
      };

      mediaRecorder.start();
      oscillator.start();

      const utterance = handleSpeechSynthesis(text);
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        oscillator.stop();
        mediaRecorder.stop();
      };
    } catch (error) {
      console.error('Error during audio download:', error);
    }
  };

  const handleDownloadText = () => {
    const content = `${id}\n${currentStartTime} --> ${currentEndTime}\n${text}\n\n`;
    downloadTextFile(content, `clip_${id}.srt`);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <TimeInputs
        startTime={currentStartTime}
        endTime={currentEndTime}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
      />
      <Textarea
        value={text}
        onChange={handleTextChange}
        className="mb-3"
        rows={3}
      />
      <ClipActions
        onPlay={() => onPlay(text)}
        onDownloadAudio={handleDownloadAudio}
        onDownloadText={handleDownloadText}
      />
    </div>
  );
};

export default ClipEditor;