import React from 'react';

interface TextDisplayProps {
  content: string;
  fileName: string;
}

const TextDisplay = ({ content, fileName }: TextDisplayProps) => {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-blue-900 mb-4">
        {fileName || 'No file selected'}
      </h2>
      <div className="max-h-[400px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-sans text-gray-700">
          {content || 'Upload a file to see its contents here'}
        </pre>
      </div>
    </div>
  );
};

export default TextDisplay;