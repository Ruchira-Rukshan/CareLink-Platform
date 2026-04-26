<div align="center">
  <img src="frontend/src/assets/logo.png" alt="CareLink Logo" width="200"/>
  <h1>🏥 CareLink Platform</h1>
  <p>A Next-Generation Integrated Healthcare Management System</p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
</div>

---

## 🌟 Overview

**CareLink** is a comprehensive, multi-role healthcare platform designed to bridge the gap between patients, medical professionals, and medical institutions. By leveraging a robust backend architecture combined with independent microservice-like AI processing and a dynamic React frontend, CareLink provides a seamless digital healthcare experience. 

It natively connects Doctors, Patients, Laboratories, Pharmacies, and Suppliers under one centralized umbrella, utilizing Artificial Intelligence for disease prediction and sentiment analysis to maximize medical efficiency and patient satisfaction.

## 🚀 Key Modules & Features

The platform is meticulously designed around strict Role-Based Access Control (RBAC). The following key actors constitute the CareLink ecosystem:

| Module | Core Functionalities |
| ------ | -------------------- |
| 🧑‍⚕️ **Doctors** | Schedule management, online appointments, write digital prescriptions, and review patient logs. |
| 🤒 **Patients** | Book online appointments, log symptoms, use AI Chatbots for predictions, and evaluate doctors. |
| 🧪 **Laboratory** | Manage lab tests, schedule lab bookings, and upload medical reports securely. |
| 💊 **Pharmacy** | Full inventory management, prescription fulfillment, POS sales tracking, and low-stock alerts. |
| 📦 **Supplier** | Supply chains for medical equipment and drug distribution with purchase order tracking. |
| 🚑 **Emergency** | SOS feature, real-time geolocation tracking, and Ambulance dispatch dashboard. |
| 🧠 **AI Service** | Deep Learning-empowered disease predictions based on symptoms, and LSTM Sentiment Analysis on reviews. |
| 👑 **Admin** | System-wide broadcasts, finance analytics, platform notices, user management, and governance. |

## 🛠️ Technology Stack

Our platform is constructed using modern, scalable, and robust technologies:
* **Frontend:** React (JSX), Vite, Tailwind CSS, Context API.
* **Backend:** Java 17, Spring Boot, Spring Security (JWT), Spring Data JPA.
* **AI Microservice:** Python 3, Flask, TensorFlow/Keras, Joblib.
* **Database:** MySQL.
* **Authentication:** Secure JWT-based Token Auth.

## 🗂️ Project Structure

The repository is modularized into feature-specific components. Each fundamental service is neatly decoupled:
```text
CareLink-Platform/
├── 📁 frontend/       # React User Interfaces (Dashboards & Portals)
├── 📁 backend/        # Spring Boot Core REST API Servers
├── 📁 ai-service/     # Python ML Models for Neural Disease Prediction
└── 📄 README.md       # Project documentation
```

## ⚙️ Getting Started

To run the full suite locally, you will need to construct the environment and spin up all three servers.

### 1️⃣ Database Setup
1. Create a local MySQL database named `carelink`.
2. Ensure your MySQL configurations match the connection details specified inside `backend/src/main/resources/application.properties`.

### 2️⃣ Backend Execution (Spring Boot)
Ensure you have Maven and Java 17+ installed.
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The server will boot up and handle API traffic via `http://localhost:8080/`.

### 3️⃣ AI Microservice Execution (Python/Flask)
You will need Python 3.9+ to run the AI engine which serves the ML API endpoints to the backend.
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
The AI app will run seamlessly on `http://localhost:5000/`.

### 4️⃣ Frontend Execution (Vite + React)
Fire up the dynamic UI interfaces.
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible via your browser at `http://localhost:5173/`.

---

<div align="center">
  <i>Developed and Maintained by the SLIIT DS-02-PG19 Team. © 2026.</i>
</div>
