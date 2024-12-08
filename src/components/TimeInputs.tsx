import React from 'react';
import { Input } from "@/components/ui/input";

interface TimeInputsProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const TimeInputs = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: TimeInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-3">
      <div>
        <label className="text-sm text-gray-500">Start Time</label>
        <Input
          type="text"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          placeholder="00:00:00,000"
          className="mt-1"
        />
      </div>
      <div>
        <label className="text-sm text-gray-500">End Time</label>
        <Input
          type="text"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          placeholder="00:00:00,000"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default TimeInputs;