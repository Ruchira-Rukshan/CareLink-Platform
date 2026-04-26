import pandas as pd
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sklearn.ensemble import RandomForestClassifier
import uvicorn
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

# Initialize FastAPI
app = FastAPI(title="CareLink AI Healthcare Assistant")

# Manually set as requested to avoid environment variable issues
GEMINI_API_KEY = "AIzaSyDUPOvQ8NEkGhtb8DJk0Kp-Ni_gGCQMJeE"
EMAIL_USER = "ruchirauks@gmail.com"
EMAIL_PASS = "nbisyzkvqmqsgiqf"

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    history: List[ChatMessage]
    message: str

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and features
model = None
feature_columns = []

def load_and_train():
    global model, feature_columns
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "Training.csv")
        df = pd.read_csv(csv_path)
        
        # Drop any trailing columns that might be empty (common in some medical CSVs)
        if df.columns[-1].startswith("Unnamed"):
            df = df.iloc[:, :-1]
        
        # Clean column names (strip whitespace)
        df.columns = [c.strip() for c in df.columns]
        
        # Separate features and target
        X = df.drop("prognosis", axis=1)
        y = df["prognosis"]
        
        # Store feature list for prediction mapping
        feature_columns = list(X.columns)
        
        # Train model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        print(f"Successfully trained on {len(df)} samples with {len(feature_columns)} symptoms.")
    except Exception as e:
        print(f"Error during startup: {e}")

# Load model data on startup
load_and_train()

class PredictionRequest(BaseModel):
    symptoms: List[str]

# Mapping of diseases to medical specialists
DISEASE_SPECIALIST_MAP = {
    "(vertigo) Paroymsal  Positional Vertigo": "ENT Specialist",
    "AIDS": "Infectious Disease Specialist",
    "Acne": "Dermatologist",
    "Alcoholic hepatitis": "Hepatologist",
    "Allergy": "Allergist / Immunologist",
    "Arthritis": "Rheumatologist",
    "Bronchial Asthma": "Pulmonologist",
    "Cervical spondylosis": "Orthopedic Specialist",
    "Chicken pox": "Pediatrician",
    "Chronic cholestasis": "Hepatologist",
    "Common Cold": "General Physician",
    "Dengue": "Infectious Disease Specialist",
    "Diabetes ": "Endocrinologist",
    "Dimorphic hemmorhoids(piles)": "Proctologist / General Surgeon",
    "Drug Reaction": "Allergist / Immunologist",
    "Fungal infection": "Dermatologist",
    "GERD": "Gastroenterologist",
    "Gastroenteritis": "Gastroenterologist",
    "Heart attack": "Cardiologist",
    "Hepatitis B": "Hepatologist",
    "Hepatitis C": "Hepatologist",
    "Hepatitis D": "Hepatologist",
    "Hepatitis E": "Hepatologist",
    "Hypertension ": "Cardiologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    "Hypothyroidism": "Endocrinologist",
    "Impetigo": "Dermatologist",
    "Jaundice": "Gastroenterologist",
    "Malaria": "Infectious Disease Specialist",
    "Migraine": "Neurologist",
    "Osteoarthristis": "Rheumatologist",
    "Paralysis (brain hemorrhage)": "Neurologist",
    "Peptic ulcer diseae": "Gastroenterologist",
    "Pneumonia": "Pulmonologist",
    "Psoriasis": "Dermatologist",
    "Tuberculosis": "Pulmonologist",
    "Typhoid": "Infectious Disease Specialist",
    "Urinary tract infection": "Urologist",
    "Varicose veins": "Vascular Surgeon",
    "hepatitis A": "Hepatologist"
}

@app.post("/predict")
async def predict(request: PredictionRequest):
    if model is None:
        return {"error": "Model not trained. Check Training.csv presence."}
    
    # Prepare input vector (binary encoding)
    input_vector = [0] * len(feature_columns)
    
    # Normalize input symptoms
    normalized_input = [s.strip().replace(" ", "_").lower() for s in request.symptoms]
    
    for symptom in normalized_input:
        if symptom in feature_columns:
            # Map index
            idx = feature_columns.index(symptom)
            input_vector[idx] = 1
            
    # Predict
    result = model.predict([input_vector])
    disease = str(result[0])
    
    # Get recommendation
    specialist = DISEASE_SPECIALIST_MAP.get(disease, "General Physician")
    
    return {
        "prediction": disease,
        "recommended_specialist": specialist
    }

@app.get("/symptoms")
async def get_symptoms():
    return {"symptoms": feature_columns}

# --- Sentiment Analysis Integration ---
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
import html
import pymysql
import os

try:
    sentiment_model = tf.keras.models.load_model('sentiment_lstm_model.keras')
    with open('tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
except FileNotFoundError:
    # Fallback to script directory if run from another path
    model_dir = os.path.dirname(__file__) or '.'
    sentiment_model = tf.keras.models.load_model(os.path.join(model_dir, 'sentiment_lstm_model.keras'))
    with open(os.path.join(model_dir, 'tokenizer.pickle'), 'rb') as handle:
        tokenizer = pickle.load(handle)
except Exception as e:
    print(f"Failed to load ML models: {e}")
    sentiment_model = None
    tokenizer = None

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="Ruchira@123",
        database="carelink",
        cursorclass=pymysql.cursors.DictCursor
    )

class FeedbackRequest(BaseModel):
    user_id: str = None
    user_name: str = None
    feedback_text: str

@app.post("/api/feedback")
async def process_feedback(request: FeedbackRequest):
    if not request.feedback_text:
        return {"error": "Feedback text is required"}

    if sentiment_model is None or tokenizer is None:
        return {"error": "Sentiment models not initialized"}

    # Clean the input text
    cleaned_text = html.unescape(request.feedback_text)

    # Convert the cleaned input text to lowercase
    lower_text = cleaned_text.lower()

    # Convert the text to a sequence
    sequence = tokenizer.texts_to_sequences([lower_text])

    # Pad the sequence
    padded_sequence = pad_sequences(sequence, maxlen=150, padding='post', truncating='post')

    # Predict rating (1-5)
    prediction = sentiment_model.predict(padded_sequence)
    stars = int(np.argmax(prediction[0])) + 1

    # Map rating to labels
    if stars >= 4:
        label = "Positive"
    elif stars <= 2:
        label = "Negative"
    else:
        label = "Neutral"

    # Save to database
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Create table if not exists
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS feedback_sentiment (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id VARCHAR(255),
                    user_name VARCHAR(255),
                    feedback_text TEXT,
                    sentiment_score FLOAT,
                    sentiment_label VARCHAR(50),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            sql = "INSERT INTO feedback_sentiment (user_id, user_name, feedback_text, sentiment_score, sentiment_label) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (request.user_id, request.user_name, request.feedback_text, stars, label))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")
        return {"error": f"Database error: {str(e)}"}

    return {
        "message": "Feedback submitted successfully!",
        "sentiment_label": label,
        "stars": stars,
        "show_celebration": label == "Positive",
        "feedback_text": request.feedback_text
    }

@app.get("/api/sentiment-stats")
async def get_sentiment_stats():
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # Check if table exists
            cursor.execute("SHOW TABLES LIKE 'feedback_sentiment'")
            if not cursor.fetchone():
                return {"stats": []}

            # Count by label
            cursor.execute("""
                SELECT sentiment_label as name, COUNT(*) as value 
                FROM feedback_sentiment 
                GROUP BY sentiment_label
            """)
            stats = cursor.fetchall()
        conn.close()
        return {"stats": stats}
    except Exception as e:
        print(f"Stats fetch error: {e}")
        return {"error": str(e)}

from google import genai
from google.genai import types

# Configure Client
client = genai.Client(api_key="AIzaSyDUPOvQ8NEkGhtb8DJk0Kp-Ni_gGCQMJeE")

# --- AI Healthcare Chatbot Integration ---
SYSTEM_PROMPT = """
You are CareBot, an empathetic and professional AI Healthcare Assistant for the CareLink system. Your job is to help patients understand basic health concepts, explain medical terms, and provide general lifestyle advice. 

STRICT RULES:
1. You are NOT a doctor. 
2. You cannot diagnose or prescribe medication. 
3. Always advise the user to consult a qualified physician for severe symptoms or accurate diagnosis. 
4. Keep your answers concise, friendly, and easy to understand for someone without medical knowledge.
"""

@app.post("/api/ai-chat")
async def ai_chat(request: ChatRequest):
    try:
        if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
            return {"reply": "I'm sorry, I'm currently in 'offline mode' as no API key was configured."}

        # Convert history format (Map role assistant -> model)
        contents = []
        for m in request.history:
            mapped_role = "model" if m.role == "assistant" else m.role
            contents.append(types.Content(role=mapped_role, parts=[types.Part(text=m.content)]))
        
        # Add current message
        contents.append(types.Content(role="user", parts=[types.Part(text=request.message)]))

        # Use gemini-2.5-flash
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT
            )
        )
        
        return {"reply": response.text}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process chat: {str(e)}")

# --- Appointment Cancellation & Email Integration ---

def send_cancellation_emails(patient_email, patient_name, doctor_email, doctor_name, appt_id, appt_time_str):
    """
    Sends 3 separate emails for appointment cancellation with detailed logging.
    """
    print(f"\n[EMAIL DEBUG] Starting email task for Appt ID: {appt_id}")
    admin_email = os.getenv("ADMIN_EMAIL", "admin@carelink.lk")
    sender_email = EMAIL_USER
    sender_password = EMAIL_PASS
    
    print(f"[EMAIL DEBUG] Using sender: {sender_email}")
    print(f"[EMAIL DEBUG] Target Patient: {patient_email}")

    # Calculate Refund Policy
    try:
        # Robust time parsing
        clean_time = appt_time_str.split('.')[0] if '.' in appt_time_str else appt_time_str
        appt_time = datetime.fromisoformat(clean_time.replace('Z', ''))
        now = datetime.now()
        diff = appt_time - now
        hours_diff = diff.total_seconds() / 3600
        refund_msg = "You will receive a 100% full refund." if hours_diff > 24 else "A 20% cancellation fee applies to your refund."
    except Exception as e:
        print(f"[EMAIL DEBUG] Time parsing error: {e}")
        refund_msg = "Refund details will be processed shortly."

    emails = [
        {"to": patient_email, "subject": "CareLink: Appointment Cancellation Confirmed", "body": f"Dear {patient_name},\n\nYour appointment (ID: {appt_id}) with {doctor_name} scheduled for {appt_time_str} has been cancelled.\n\nRefund Policy: {refund_msg}\n\nThank you for using CareLink."},
        {"to": doctor_email, "subject": "CareLink: Appointment Cancelled by Patient", "body": f"Dear {doctor_name},\n\nThe appointment with patient {patient_name} scheduled for {appt_time_str} has been cancelled. This slot is now available.\n\nRegard, CareLink Team."},
        {"to": admin_email, "subject": "CareLink SYSTEM ALERT: Appointment Cancellation", "body": f"System Alert: Appointment ID {appt_id} has been cancelled.\n\nPatient: {patient_name} ({patient_email})\nDoctor: {doctor_name}\nScheduled Time: {appt_time_str}"}
    ]

    try:
        print("[EMAIL DEBUG] Connecting to SMTP Server...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.set_debuglevel(1) # Enable verbose SMTP logging
        server.starttls()
        server.login(sender_email, sender_password)
        print("[EMAIL DEBUG] Login Successful!")
        
        for email in emails:
            print(f"[EMAIL DEBUG] Sending to {email['to']}...")
            msg = MIMEMultipart()
            msg['From'] = f"CareLink Assistant <{sender_email}>"
            msg['To'] = email['to']
            msg['Subject'] = email['subject']
            msg.attach(MIMEText(email['body'], 'plain'))
            server.send_message(msg)
            
        server.quit()
        print(f"[EMAIL DEBUG] SUCCESSFULLY sent all 3 emails for Appt {appt_id}")
    except Exception as e:
        print(f"[EMAIL DEBUG] SMTP ERROR: {e}")

@app.put("/api/appointments/{id}/cancel")
async def cancel_appointment_api(id: int, background_tasks: BackgroundTasks):
    """
    Cancels an appointment in the DB and triggers 3 background emails.
    """
    try:
        conn = get_db_connection()
        with conn.cursor() as cursor:
            # 1. Fetch details first
            cursor.execute("""
                SELECT a.id, a.appointment_date, 
                       u_doc.email as doctor_email, u_doc.first_name as doctor_fname, u_doc.last_name as doctor_lname, 
                       u_pat.email as patient_email, u_pat.first_name as patient_fname, u_pat.last_name as patient_lname
                FROM appointments a
                JOIN users u_doc ON a.doctor_id = u_doc.id
                JOIN users u_pat ON a.patient_id = u_pat.id
                WHERE a.id = %s
            """, (id,))
            appt = cursor.fetchone()
            
            if not appt:
                conn.close()
                raise HTTPException(status_code=404, detail="Appointment not found")

            # 2. Update status
            cursor.execute("UPDATE appointments SET status = 'CANCELLED' WHERE id = %s", (id,))
            conn.commit()
            conn.close()

            # 3. Trigger Emails in Background
            background_tasks.add_task(
                send_cancellation_emails,
                appt['patient_email'],
                f"{appt['patient_fname']} {appt['patient_lname']}",
                appt['doctor_email'],
                f"Dr. {appt['doctor_fname']} {appt['doctor_lname']}",
                appt['id'],
                str(appt['appointment_date'])
            )

        return {"message": "Appointment cancelled and emails queued."}
    except Exception as e:
        print(f"Cancellation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- TEST EMAIL ENDPOINT ---
@app.get("/test-email")
async def test_email():
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS) 
        
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_USER # Sending to yourself to test
        msg['Subject'] = "CareLink Test Email"
        msg.attach(MIMEText("This is a test to see if SMTP works.", 'plain'))
        
        server.send_message(msg)
        server.quit()
        return {"status": "Success, email sent!"}
    except Exception as e:
        return {"status": "Failed", "error": str(e)}

# --- SERVER STARTUP ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)



