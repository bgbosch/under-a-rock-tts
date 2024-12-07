import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TextDisplay from '@/components/TextDisplay';
import SpeechControls from '@/components/SpeechControls';

const Index = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileSelect = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
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
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          Works completely offline with your system's text-to-speech voices
        </footer>
      </div>
    </div>
  );
};

export default Index;