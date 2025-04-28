<img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=gradient&text=Chikitsakalaya&reversal=false&textBg=false&fontSize=89&fontAlignY=41" />

Chikitssakalya is a comprehensive doctor appointment system designed to simplify the process of managing and scheduling appointments between patients and healthcare providers. The application utilizes OCR technology to automate patient profile generation and provides intelligent doctor suggestions based on patient needs.

## Features

- **Patient Profile Generation with OCR**: The system can scan documents and automatically populate patient profiles, minimizing manual data entry.
- **Doctor Recommendations**: Provides doctor suggestions based on the patient's health profile and symptoms.
- **Appointment Scheduling**: Patients can book appointments with the recommended doctor or choose a doctor manually.
- **Admin & Doctor Dashboard**: Includes separate dashboards for doctors and admins to manage appointments and patient records.

## Technology Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MySQL
- **OCR Library**: Tesseract


### Prerequisites

- Node.js (v14 or above)
- MySQL

### 1. Clone the Repository and Install Dependencies

```bash
git clone https://github.com/your-username/chikitsakalaya.git
cd chikitsakalaya
```
# Backend Setup
```bash
cd backend
npm install
```

# Frontend Setup
```bash
cd ../frontend
npm install
```

# Create a .env file inside backend/ with the following content:
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=chikitsakalaya

# Running the Project
```bash
cd backend
npm run dev
```
```bash
cd frontend
npm run dev
```

# 🖥️ Accessing the Application
Frontend (React App): http://localhost:5173

Backend (API Server): http://localhost:5000

# Folder structure

chikitsakalaya/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hook/
│       ├── services/
│       └── App.jsx
├── package.json
├── README.md
└── package.json