import React, { useState, useCallback } from 'react';
import FileUpload from '@/components/FileUpload';
import TextDisplay from '@/components/TextDisplay';
import SpeechControls from '@/components/SpeechControls';
import ClipEditor from '@/components/ClipEditor';
import { parseContent } from '@/utils/textParser';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Clip {
  id: string;
  text: string;
  startTime?: string;
  endTime?: string;
}

const Index = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [clips, setClips] = useState<Clip[]>([]);

  const handleFileSelect = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
    const parsedClips = parseContent(content, name);
    setClips(parsedClips);
  };

  const handleClipTextChange = (id: string, newText: string) => {
    setClips(prevClips =>
      prevClips.map(clip =>
        clip.id === id ? { ...clip, text: newText } : clip
      )
    );
  };

  const handlePlayClip = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleDownloadAll = () => {
    const content = clips.map(clip => {
      if (clip.startTime && clip.endTime) {
        return `${clip.id}\n${clip.startTime} --> ${clip.endTime}\n${clip.text}\n\n`;
      }
      return `${clip.text}\n\n`;
    }).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_clips_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
          Offline Text-to-Speech Reader
        </h1>
        
        <FileUpload onFileSelect={handleFileSelect} />
        <TextDisplay content={fileContent} fileName={fileName} />
        <SpeechControls text={fileContent} isTextLoaded={!!fileContent} />

        {clips.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-900">
                Text Clips
              </h2>
              <Button
                variant="outline"
                onClick={handleDownloadAll}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="space-y-4">
              {clips.map((clip) => (
                <ClipEditor
                  key={clip.id}
                  id={clip.id}
                  initialText={clip.text}
                  startTime={clip.startTime}
                  endTime={clip.endTime}
                  onTextChange={handleClipTextChange}
                  onPlay={handlePlayClip}
                />
              ))}
            </div>
          </div>
        )}
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          Works completely offline with your system's text-to-speech voices
        </footer>
      </div>
    </div>
  );
};

export default Index;