import React from 'react';

const TimelineItem = ({ status, date, label, color, isLast }) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        {!isLast && (
          <div
            className="w-0.5 flex-1 mt-1"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', minHeight: '24px' }}
          />
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="text-white font-medium text-sm">{label}</div>
        <div className="text-white/60 text-xs mt-0.5">{date}</div>
      </div>
    </div>
  );
};

export default TimelineItem;