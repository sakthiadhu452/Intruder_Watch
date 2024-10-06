import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator
} from "react-native";
import { SVG, Polygon, Rect, Path } from "react-native-svg";
import { Video } from "expo-av";
import { VideoContext } from "@/Context/videoProvider";
import BackGround from "@/Components/BackGround/BackGround.";
import { RiRectangleFill } from "react-icons/ri";
import { IoTriangleOutline } from "react-icons/io5";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigation } from "@react-navigation/native";
import WatchPage from "../WatchPage/WatchPage";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const { width, height } = Dimensions.get("window");

const VideoProcess = () => {
  const navigation = useNavigation();
  const [shapeType, setShapeType] = useState("rectangle");
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [pngDataUrl, setPngDataUrl] = useState(null); // State to hold PNG data URL
  const svgRef = useRef(null);
  const { videoUri } = useContext(VideoContext);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [videoSendForProcessing, setvideoSendForProcessing] = useState(false);

  const handleMouseDown = (e) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = clientX - svgRect.left;
    const y = clientY - svgRect.top;

    setCurrentShape({
      type: shapeType,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      vertices: [{ x, y }],
    });
  };

  const handleMouseMove = (e) => {
    if (currentShape) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;
      const x = clientX - svgRect.left;
      const y = clientY - svgRect.top;

      if (shapeType === "freeform") {
        const updatedShape = {
          ...currentShape,
          vertices: [...currentShape.vertices, { x, y }],
        };
        setCurrentShape(updatedShape);
      } else {
        setCurrentShape({ ...currentShape, endX: x, endY: y });
      }
    }
  };

  const handleMouseUp = () => {
    if (currentShape) {
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(shapes))]);
      setRedoStack([]); // Clear redo stack on new action
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
    }
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const lastState = undoStack[undoStack.length - 1];
      setRedoStack([JSON.parse(JSON.stringify(shapes)), ...redoStack]);
      setShapes(lastState);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(shapes))]);
      setShapes(nextState);
      setRedoStack(redoStack.slice(1));
    }
  };

  const drawShape = (shape, isSelected) => {
    const { type, startX, startY, endX, endY, vertices } = shape;

    const commonProps = {
      fill: "rgba(255, 99, 71, 0.4)",
      stroke: isSelected ? "blue" : "black", // Highlight selected shape with blue stroke
      strokeWidth: isSelected ? 4 : 2, // Increase stroke width for selected shape
    };

    if (type === "rectangle") {
      const width = endX - startX;
      const height = endY - startY;
      return (
        <Rect
          x={startX}
          y={startY}
          width={width}
          height={height}
          {...commonProps}
        />
      );
    } else if (type === "triangle") {
      const points = [
        { x: startX, y: endY },
        { x: endX, y: endY },
        { x: (startX + endX) / 2, y: startY },
      ]
        .map((p) => `${p.x},${p.y}`)
        .join(" ");
      return <Polygon points={points} {...commonProps} />;
    } else if (type === "polygon") {
      const points = vertices.map((v) => `${v.x},${v.y}`).join(" ");
      return <Polygon points={points} {...commonProps} />;
    } else if (type === "freeform") {
      const pathData = `M ${vertices
        .map((v) => `${v.x} ${v.y}`)
        .join(" L ")} Z`;
      return <Path d={pathData} {...commonProps} />;
    }
  };

  const makeImage = () => {
    const svgElement = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svgElement);

    const canvas = document.createElement("canvas");
    const canvasWidth = svgElement.clientWidth;
    const canvasHeight = svgElement.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svgData);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      const pngFile = canvas.toDataURL("image/png");
      setPngDataUrl(pngFile); // Update state with PNG data URL

      // Prepare the video and image to send to backend
      const formData = new FormData();

      // Assuming `videoUri` is a local URI. If it's a blob, you may need to convert it accordingly.
      fetch(videoUri)
        .then((res) => res.blob())
        .then((videoBlob) => {
          // Append the video to the formData
          formData.append("video", videoBlob, "video.mp4");

          // Convert the PNG base64 data to a Blob and append to formData
          const pngBlob = dataURLtoBlob(pngFile); // Helper function to convert base64 to Blob
          formData.append("image", pngBlob, "image.png");

          // Now send the formData to the backend
          fetch("http://127.0.0.1:8000/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              response.json();
            })
            .then((result) => {
              navigation.navigate("WatchPage");
              console.log("Upload successful:", result);
            })
            .catch((error) => {
              console.error("Error uploading:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching video blob:", error);
        });
    };
  };

  // Helper function to convert base64 to Blob
  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  const deleteShape = () => {
    if (selectedShapeIndex !== null) {
      // Update the undo stack
      setUndoStack([...undoStack, JSON.parse(JSON.stringify(shapes))]);

      // Remove the selected shape
      const updatedShapes = shapes.filter(
        (_, index) => index !== selectedShapeIndex
      );

      // Update state with the remaining shapes
      setShapes(updatedShapes);

      // Clear the selection
      setSelectedShapeIndex(null);
    }
  };

  
  return (
    <>
      <BackGround />
      <div style={styles.container}>
        <div
          style={styles.toolsContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div style={styles.toolbar}>
            <button
              onClick={() => setShapeType("rectangle")}
              style={
                shapeType === "rectangle"
                  ? { ...styles.button, backgroundColor: "#3f3178" }
                  : styles.button
              }
            >
              <RiRectangleFill className="ShapeIcons" />
            </button>
            <button
              onClick={() => setShapeType("triangle")}
              style={
                shapeType === "triangle"
                  ? { ...styles.button, backgroundColor: "#3f3178" }
                  : styles.button
              }
            >
              <IoTriangleOutline />
            </button>
            <button
              onClick={() => setShapeType("freeform")}
              style={
                shapeType === "freeform"
                  ? { ...styles.button, backgroundColor: "#3f3178" }
                  : styles.button
              }
            >
              <FaPencilAlt />
            </button>
            {selectedShapeIndex !== null && (
              <button onClick={() => deleteShape()} style={styles.button}>
                <MdDelete />
              </button>
            )}
          </div>

          <div style={styles.drawingArea}>
            <svg
              ref={svgRef}
              style={styles.canvas}
              onClick={() => setSelectedShapeIndex(null)}
            >
              {shapes.map((shape, index) => (
                <React.Fragment key={index}>
                  <g
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the svg click handler from deselecting immediately
                      setSelectedShapeIndex(index);
                    }}
                  >
                    {drawShape(shape, index === selectedShapeIndex)}
                  </g>
                </React.Fragment>
              ))}
              {currentShape && drawShape(currentShape)}
            </svg>

            <div style={styles.videoContainer}>
              <video
                src={videoUri || ""}
                loop={Infinity}
                autoPlay
                muted={true}
                style={styles.video}
              />
            </div>
            {videoSendForProcessing ? (
              <View style={styles.videoProcessLoading}>
                <ActivityIndicator size="large" />
                <>Hold on We are processing...</>
              </View>
            ) : null}
            <button
              onClick={() => {
                makeImage();
                setvideoSendForProcessing(true);
              }}
              style={styles.button}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
  },
  toolsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: "60%",
    marginTop: -20,
  },
  toolbar: {
    display: "flex",
    marginBottom: "10px",
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  drawingArea: {
    width: "80%",
    height: "100%",
    position: "relative",
  },
  canvas: {
    width: "100%",
    height: "100%",
    top: 0,
    border: "3px solid black",
  },
  video: {
    width: "100%",
    height: "100%",
    transform: [{ scale: 3 }],
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    top: 0,
    position: "absolute",
    zIndex: -2,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "transparent",
    padding: 8,
    display: "flex",
    margin: 5,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    cursor: "pointer",
  },
  imageContainer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
  ShapeIcons: {
    width: 10,
    height: 10,
    backgroundColor: "#ffffff",
    color: "#ffffff",
  },
  videoProcessLoading: {
    position: "absolute",
    // backgroundColor:"#ffffff",
    opacity: 0.7,
    width: "100%",
    height: "100%",
    zIndex: 12,
    top: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingWheel: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: "#3498db",
    borderRadius: 25,
    borderTopColor: "transparent", // Create the loader spinner effect
  },
};

export default VideoProcess;
