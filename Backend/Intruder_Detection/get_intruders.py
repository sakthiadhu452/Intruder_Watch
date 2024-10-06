import cv2
import os
import numpy as np

def save_intruder_image(image_blob, intruder_id, timestamp):
    # Specify the directory where you want to save the images
    save_directory = r'E:\Intern_Punchbiz\Intruder-Watch\Backend\IntruderList'

    # Ensure the directory exists
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    # Convert the image blob (assuming it's in byte format) back to an image
    nparr = np.frombuffer(image_blob, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Save the image with a unique name based on intruder_id and timestamp
    image_path = os.path.join(save_directory, f'intruder_{intruder_id}_{timestamp}.jpg')
    cv2.imwrite(image_path, img)

    print(f"Saved image for intruder {intruder_id} at {timestamp}")

if __name__ == "__main__":
    # Example usage
    # Simulated intruder image as a blob (replace this with the actual image data)
    example_image_blob = b'\x89PNG\r\n\x1a\n...'  # Replace with actual image data
    intruder_id = 1
    timestamp = '2024-10-01_12-30-00'

    # Call the function to save the image
    save_intruder_image(example_image_blob, intruder_id, timestamp)
