from app.routes import create_app
from flask import send_from_directory
import os
from app.upload import upload_bp


app = create_app()

# Route to serve the processed video from the uploads folder
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)

if __name__ == '__main__':
    app.run(port=8000)
