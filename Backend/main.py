from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import datetime
import firebase_admin
from firebase_admin import credentials, auth
from app.routes import create_app
from flask import send_from_directory
import os
from app.upload import upload_bp

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK with your service account key file
cred = credentials.Certificate('./configpy.json')

# Check if the Firebase app has already been initialized
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

SECRET_KEY = 'team_intruderWatch123'

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expires in 1 hour
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        return jsonify({"message": "User created successfully", "uid": user.uid}), 201
    except firebase_admin.auth.EmailAlreadyExistsError:
        return jsonify({"error": "Email already exists"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:
        user = auth.get_user_by_email(email)
        # Generate a custom token with the Firebase UID
        token = generate_token(user.uid)
        return jsonify({"message": "Login successful", "token": token}), 200
    except firebase_admin.auth.AuthError as e:
        return jsonify({"error": "Authentication failed", "details": str(e)}), 400

@app.route('/protected', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"error": "Token is missing"}), 401

    try:
        decoded = decode_token(token)
        return jsonify({"message": "Access granted", "user_id": decoded['user_id']}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 403

# Initialize the application routes
app = create_app()

# Route to serve the processed video from the uploads folder
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)

if __name__ == '__main__':
    app.run(port=8000)
