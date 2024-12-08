import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Download, FileText } from 'lucide-react';

interface ClipActionsProps {
  onPlay: () => void;
  onDownloadAudio: () => void;
  onDownloadText: () => void;
}

const ClipActions = ({ onPlay, onDownloadAudio, onDownloadText }: ClipActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPlay}
      >
        <Play className="w-4 h-4 mr-2" />
        Play
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownloadAudio}
      >
        <Download className="w-4 h-4 mr-2" />
        Download Audio
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownloadText}
      >
        <FileText className="w-4 h-4 mr-2" />
        Download Text
      </Button>
    </div>
  );
};

export default ClipActions;