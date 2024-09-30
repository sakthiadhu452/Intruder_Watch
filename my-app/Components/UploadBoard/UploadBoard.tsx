import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import LocalVideo from '@/Components/LocalVideo/LocalVideo';
import CameraIp from '@/Components/CamerIp/CamerIp';

const UploadBoard = ({ videoUri }) => {
  const [localVideo, setLocalVideo] = useState(false);

  return (
    <View style={styles.newProjectContainer}>
      <View style={styles.toggleMode}>
        <TouchableOpacity
          style={[{ backgroundColor: localVideo ? '' : '#15152F' }, styles.cameraIP]}
          onPress={() => setLocalVideo(false)}
        >
          <Text style={{ color: localVideo ? '' : 'white' }}>Camera IP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[{ backgroundColor: localVideo ? '#15152F' : '' }, styles.localvideo]}
          onPress={() => setLocalVideo(true)}
        >
          <Text style={{ color: localVideo ? 'white' : '' }}>Local Video</Text>
        </TouchableOpacity>
      </View>

      <View>
        {
          localVideo ? <LocalVideo videoUri={videoUri} /> : <CameraIp />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: '#000',
  },
  newProjectContainer: {
    marginTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  toggleMode: {
    flex: 1,
    minWidth: 350,
    maxWidth: 350,
    height: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    fontWeight: 'bold'
  },
  cameraIP: {
    paddingHorizontal: 40,
    paddingVertical: 6,
    flex: 1,
    borderRadius: 12,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  localvideo: {
    paddingHorizontal: 40,
    paddingVertical: 6,
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
  },
});

export default UploadBoard;
