import React from "react";

const Loading = () => {
  return (
  
      <div className="flex space-x-2">
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce200"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce400"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
      </div>

  );
};

export default Loading;
