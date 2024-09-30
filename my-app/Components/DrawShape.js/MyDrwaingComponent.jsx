import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const MyDrawingComponent = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);

  const handleGestureEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    const newPoint = [translationX, translationY];
    
    if (currentLine.length === 0) {
      setCurrentLine([newPoint]);
    } else {
      setCurrentLine([...currentLine, newPoint]);
    }
  };

  const handleStateChange = (event) => {
    if (event.nativeEvent.state === 5) { // ENDED
      setLines([...lines, currentLine]);
      setCurrentLine([]);
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleStateChange}
      >
        <View style={styles.canvas}>
          <Svg height={height} width={width}>
            {lines.map((line, index) => (
              <Line
                key={index}
                x1={line[0][0]}
                y1={line[0][1]}
                x2={line[line.length - 1][0]}
                y2={line[line.length - 1][1]}
                stroke="black"
                strokeWidth="2"
              />
            ))}
            {currentLine.length > 0 && (
              <Line
                x1={currentLine[0][0]}
                y1={currentLine[0][1]}
                x2={currentLine[currentLine.length - 1][0]}
                y2={currentLine[currentLine.length - 1][1]}
                stroke="red"
                strokeWidth="2"
              />
            )}
          </Svg>
        </View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});

export default MyDrawingComponent;
