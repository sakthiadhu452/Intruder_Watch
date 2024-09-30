import os
import cv2
import numpy as np
import logging
from flask import Blueprint, request, jsonify
from Intruder_Detection.detection import PersonDetection



# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a Flask Blueprint for uploads
upload_bp = Blueprint('upload', __name__)

# Function to check allowed file extensions
def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

# Function to detect red elements from the reference image
def detect_red_from_image(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_red1 = np.array([0, 70, 50])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 70, 50])
    upper_red2 = np.array([180, 255, 255])
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    red_mask = mask1 | mask2
    return red_mask

# Function to blur black regions in video frames using reference red mask
def blur_black_regions(frame, red_mask):
    red_mask_resized = cv2.resize(red_mask, (frame.shape[1], frame.shape[0]))
    black_mask = cv2.bitwise_not(red_mask_resized)
    black_frame = np.zeros_like(frame)
    red_part = cv2.bitwise_and(frame, frame, mask=red_mask_resized)
    black_part = cv2.bitwise_and(black_frame, black_frame, mask=black_mask)
    final_frame = cv2.addWeighted(red_part, 1, black_part, 1, 0)
    return final_frame

@upload_bp.route('/upload', methods=['POST'])
def upload_files():
    if 'video' not in request.files or 'image' not in request.files:
        return jsonify({'error': 'Both video and image files are required'}), 400

    video = request.files['video']
    image = request.files['image']

    if video.filename == '' or image.filename == '':
        return jsonify({'error': 'No selected files'}), 400

    # Validate and save video file
    if video and allowed_file(video.filename, ALLOWED_VIDEO_EXTENSIONS):
        video_filename = video.filename
        video_path = os.path.join(UPLOAD_FOLDER, video_filename)
        video.save(video_path)
        logger.info(f"Video file saved: {video_path}")
    else:
        return jsonify({'error': 'Invalid video file type'}), 400

    # Validate and save image file
    if image and allowed_file(image.filename, ALLOWED_IMAGE_EXTENSIONS):
        image_filename = image.filename
        image_path = os.path.join(UPLOAD_FOLDER, image_filename)
        image.save(image_path)
        logger.info(f"Image file saved: {image_path}")
    else:
        return jsonify({'error': 'Invalid image file type'}), 400

    # Process video with the provided image
    logger.info(f"Processing video with reference image: {image_path}")
    reference_image = cv2.imread(image_path)
    red_mask = detect_red_from_image(reference_image)
    
    input_video_path = video_path
    output_video_filename = f"processed_{video_filename}"
    output_video_path = os.path.join(UPLOAD_FOLDER, output_video_filename)
    
    cap = cv2.VideoCapture(input_video_path)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = None

    logger.info(f"Starting video processing. Output will be saved to: {output_video_path}")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            logger.info("Finished processing video.")
            break
        
        processed_frame = blur_black_regions(frame, red_mask)
        
        if out is None:
            height, width, _ = processed_frame.shape
            out = cv2.VideoWriter(output_video_path, fourcc, 20.0, (width, height))
            logger.info("Initialized video writer.")

        out.write(processed_frame)

    cap.release()
    out.release()
    logger.info("Released video capture and writer objects.")
    detector = PersonDetection(videoPath="E:/Intern_Punchbiz/Intruder-Watch/Backend/uploads/processed_video.mp4")
    detector()
    return jsonify({
        'message': 'Files uploaded and processed successfully',
        'video_filename': video_filename,
        'image_filename': image_filename,
        'output_video_filename': output_video_filename
    }), 200



# import os
# from flask import Blueprint, request, jsonify

# # Configure the upload folder and allowed extensions
# UPLOAD_FOLDER = 'uploads'
# ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'avi', 'mov'}  # Add other video extensions as needed
# ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}  # Add other image extensions as needed

# # Ensure the upload folder exists
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)

# # Create a Flask Blueprint for uploads
# upload_bp = Blueprint('upload', __name__)

# # Function to check allowed file extensions
# def allowed_file(filename, allowed_extensions):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

# @upload_bp.route('/upload', methods=['POST'])
# def upload_files():
#     # Check if video and image are part of the request
#     if 'video' not in request.files or 'image' not in request.files:
#         return jsonify({'error': 'Both video and image files are required'}), 400

#     video = request.files['video']
#     image = request.files['image']

#     # Check if filenames are provided
#     if video.filename == '' or image.filename == '':
#         return jsonify({'error': 'No selected files'}), 400

#     # Validate video file type
#     if video and allowed_file(video.filename, ALLOWED_VIDEO_EXTENSIONS):
#         video_filename = video.filename  # Use original video filename or modify as needed
#         video_path = os.path.join(UPLOAD_FOLDER, video_filename)
#         video.save(video_path)
#     else:
#         return jsonify({'error': 'Invalid video file type'}), 400

#     # Validate image file type
#     if image and allowed_file(image.filename, ALLOWED_IMAGE_EXTENSIONS):
#         image_filename = image.filename  # Use original image filename or modify as needed
#         image_path = os.path.join(UPLOAD_FOLDER, image_filename)
#         image.save(image_path)
#     else:
#         return jsonify({'error': 'Invalid image file type'}), 400

#     return jsonify({
#         'message': 'Files uploaded successfully',
#         'video_filename': video_filename,
#         'image_filename': image_filename
#     }), 200


