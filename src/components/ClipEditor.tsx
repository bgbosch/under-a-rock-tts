import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Play, Download, FileText } from 'lucide-react';

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

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setCurrentStartTime(newTime);
    onTimeChange(id, newTime, currentEndTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setCurrentEndTime(newTime);
    onTimeChange(id, currentStartTime, newTime);
  };

  const handleDownloadAudio = async () => {
    try {
      // Create an audio context and destination node
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
      
      // Create an oscillator node (this will be our audio source)
      const oscillator = audioContext.createOscillator();
      oscillator.connect(destination);
      
      // Create media recorder with the destination stream
      const mediaRecorder = new MediaRecorder(destination.stream);
      const audioChunks: BlobPart[] = [];

      // Set up media recorder event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clip_${id}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        audioContext.close();
      };

      // Start recording
      mediaRecorder.start();

      // Create and configure utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get the stored voice preference
      const selectedVoiceName = sessionStorage.getItem('selectedVoice');
      if (selectedVoiceName) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) utterance.voice = voice;
      }

      // Start oscillator and speak
      oscillator.start();
      window.speechSynthesis.speak(utterance);

      // Stop recording when speech ends
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
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clip_${id}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="text-sm text-gray-500">Start Time</label>
          <Input
            type="text"
            value={currentStartTime}
            onChange={handleStartTimeChange}
            placeholder="00:00:00,000"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">End Time</label>
          <Input
            type="text"
            value={currentEndTime}
            onChange={handleEndTimeChange}
            placeholder="00:00:00,000"
            className="mt-1"
          />
        </div>
      </div>
      <Textarea
        value={text}
        onChange={handleTextChange}
        className="mb-3"
        rows={3}
      />
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPlay(text)}
        >
          <Play className="w-4 h-4 mr-2" />
          Play
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadAudio}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Audio
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadText}
        >
          <FileText className="w-4 h-4 mr-2" />
          Download Text
        </Button>
      </div>
    </div>
  );
};

export default ClipEditor;