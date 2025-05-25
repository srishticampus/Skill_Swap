import React from 'react';

const Timeline = ({ updates }) => {
  return (
    <div className="flex items-center justify-between relative">
      {updates.map((update, index) => (
        <div key={index} className="flex flex-col items-center relative">
          <div className={`rounded-full ${index < updates.length - 1 ? "bg-gray-400" : "bg-primary"} w-8 h-8 flex items-center justify-center z-10`}>
            <span className="text-white">{index + 1}</span>
          </div>
          <div className="text-center mt-2">
            <h3 className="font-semibold text-sm">{update.title}</h3>
            <p className="text-gray-600 text-xs">{update.date}</p>
          </div>
          {index < updates.length - 1 && (
            <div className="absolute top-4 w-full h-0.5 bg-gray-300 left-1/2 transform -translate-x-1/2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeline;