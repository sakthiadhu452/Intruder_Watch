import cv2
import numpy as np

# Function to detect red elements from the reference image
def detect_red_from_image(image):
    # Convert the image to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define red color range in HSV
    lower_red1 = np.array([0, 70, 50])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 70, 50])
    upper_red2 = np.array([180, 255, 255])
    
    # Create masks to detect red color in both ranges
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    
    # Combine both masks
    red_mask = mask1 | mask2
    
    return red_mask

# Function to blur black regions in video frames using reference red mask
def blur_black_regions(frame, red_mask):
    # Ensure the red mask has the same size as the frame
    red_mask_resized = cv2.resize(red_mask, (frame.shape[1], frame.shape[0]))

    # Invert the red mask to get black regions
    black_mask = cv2.bitwise_not(red_mask_resized)

    # Create a black frame (same size as the original frame)
    black_frame = np.zeros_like(frame)  # Black image with same dimensions as the frame

    # Keep the red regions from the original frame
    red_part = cv2.bitwise_and(frame, frame, mask=red_mask_resized)

    # Apply the black frame to black regions
    black_part = cv2.bitwise_and(black_frame, black_frame, mask=black_mask)

    # Combine the red regions and the black regions
    final_frame = cv2.addWeighted(red_part, 1, black_part, 1, 0)

    return final_frame


# Load the reference image to detect the regions
reference_image_path = './virtual_boundary.jpg'  # Replace with your image path
reference_image = cv2.imread(reference_image_path)

# Generate a red mask from the reference image
red_mask = detect_red_from_image(reference_image)

# Video input and output setup
input_video = './cameraFootage.mp4'  # Replace with your video file path
output_video = 'output_video.mp4'  # Output video file path

# Open the video
cap = cv2.VideoCapture(input_video)
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = None

# Loop through the video frames
while cap.isOpened():
    ret, frame = cap.read()
    
    if not ret:
        break
    
    # Apply the mask from the reference image to the video frame
    processed_frame = blur_black_regions(frame, red_mask)
    
    # Initialize the output video writer (only once)
    if out is None:
        height, width, _ = processed_frame.shape
        out = cv2.VideoWriter(output_video, fourcc, 20.0, (width, height))
    
    # Write the processed frame to the output video
    out.write(processed_frame)

# Release the video capture and writer objects
cap.release()
out.release()

print("Video processing completed. The video has been saved as:", output_video)



# import cv2
# import numpy as np

# # Function to detect red elements from the reference image
# def detect_red_from_image(image):
#     # Convert the image to HSV color space
#     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
#     # Define red color range in HSV
#     lower_red1 = np.array([0, 70, 50])
#     upper_red1 = np.array([10, 255, 255])
#     lower_red2 = np.array([170, 70, 50])
#     upper_red2 = np.array([180, 255, 255])
    
#     # Create masks to detect red color in both ranges
#     mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
#     mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    
#     # Combine both masks
#     red_mask = mask1 | mask2
    
#     return red_mask

# # Function to blur black regions in video frames using reference red mask
# def blur_black_regions(frame, red_mask):
#     # Ensure the red mask has the same size as the frame
#     red_mask_resized = cv2.resize(red_mask, (frame.shape[1], frame.shape[0]))

#     # Invert the red mask to get black regions
#     black_mask = cv2.bitwise_not(red_mask_resized)

#     # Blur the entire frame
#     blurred_frame = cv2.GaussianBlur(frame, (55, 55), 0)

#     # Keep the red regions from the original frame
#     red_part = cv2.bitwise_and(frame, frame, mask=red_mask_resized)

#     # Apply the blurred frame to black regions
#     black_part = cv2.bitwise_and(blurred_frame, blurred_frame, mask=black_mask)

#     # Combine the red regions and the blurred black regions
#     final_frame = cv2.addWeighted(red_part, 1, black_part, 1, 0)

#     return final_frame

# # Load the reference image to detect the regions
# reference_image_path = './virtual_boundary.jpg'  # Replace with your image path
# reference_image = cv2.imread(reference_image_path)

# # Generate a red mask from the reference image
# red_mask = detect_red_from_image(reference_image)

# # Video input and output setup
# input_video = './cameraFootage.mp4'  # Replace with your video file path
# output_video = 'output_video.mp4'  # Output video file path

# # Open the video
# cap = cv2.VideoCapture(input_video)
# fourcc = cv2.VideoWriter_fourcc(*'mp4v')
# out = None

# # Loop through the video frames
# while cap.isOpened():
#     ret, frame = cap.read()
    
#     if not ret:
#         break
    
#     # Apply the mask from the reference image to the video frame
#     processed_frame = blur_black_regions(frame, red_mask)
    
#     # Initialize the output video writer (only once)
#     if out is None:
#         height, width, _ = processed_frame.shape
#         out = cv2.VideoWriter(output_video, fourcc, 20.0, (width, height))
    
#     # Write the processed frame to the output video
#     out.write(processed_frame)

# # Release the video capture and writer objects
# cap.release()
# out.release()

# print("Video processing completed. The video has been saved as:", output_video)
