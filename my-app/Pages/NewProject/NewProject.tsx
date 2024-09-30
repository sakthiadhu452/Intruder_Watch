import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import UploadBoard from '@/Components/UploadBoard/UploadBoard';
// import ProcessVideo from '@/Components/ProcessVideo/ProcessVideo';

import BackGround from '@/Components/BackGround/BackGround.';

const NewProject = () => {
 
  const [videoUri, setVideoUri] = useState(true); // Corrected typo here

  return (
    <View>
      <UploadBoard videoUri={videoUri}/>
      <BackGround/>
    </View>
  );
};



export default NewProject;
