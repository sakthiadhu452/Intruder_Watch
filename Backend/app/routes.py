# app/routes.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import auth
from app.auth import generate_token, decode_token
from app.upload import upload_bp  # Import the upload blueprint

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register the upload blueprint
    app.register_blueprint(upload_bp)

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

    return app
