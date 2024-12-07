import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.txt') && !file.name.toLowerCase().endsWith('.srt')) {
      console.error('Invalid file type');
      return;
    }

    const text = await file.text();
    onFileSelect(text, file.name);
  };

  return (
    <div
      className="border-2 border-dashed border-blue-900 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        type="file"
        id="file-input"
        className="hidden"
        accept=".txt,.srt"
        onChange={handleFileInput}
      />
      <Upload className="mx-auto mb-4 text-blue-900" size={32} />
      <p className="text-blue-900">
        Drag and drop a file here or click to select
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Supported formats: .txt, .srt
      </p>
    </div>
  );
};

export default FileUpload;