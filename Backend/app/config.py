# app/config.py

import firebase_admin
from firebase_admin import credentials

# Initialize Firebase Admin SDK with your service account key file
cred = credentials.Certificate('./configpy.json')
firebase_admin.initialize_app(cred)

# Configuration settings
SECRET_KEY = 'team_intruderWatch123'
