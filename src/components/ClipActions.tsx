import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';

interface ClipActionsProps {
  onPlay: () => void;
}

const ClipActions = ({ onPlay }: ClipActionsProps) => {
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
    </div>
  );
};

export default ClipActions;