import React, { createContext, useState } from 'react';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videoUri, setVideoUri] = useState(null);

  return (
    <VideoContext.Provider value={{ videoUri, setVideoUri }}>
      {children}
    </VideoContext.Provider>
  );
};
