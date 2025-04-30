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
https://github.com/SankalpaGit/FYP_Chikitsakalaya.git
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

# Django model Setup
```bash
cd ai_model
python -m venv venv

# for MAacOS
source venv/bin/activate

# for window
venv\Scripts\activate

```
# Package installation
```bash
pip install django djangorestframework mysqlclient
pip install django-cors-headers
pip install 
```

# Configure MySQL in ai_model/settings.py
inside the DATABASE
```bash
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_db_name',
        'USER': 'your_mysql_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
```
# for middleware
```bash
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🔑 Add this first
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```
# Create a .env file inside backend/ with the following content:
```bash
DB_PORT=3306
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=chikitsakalaya
```


# App port
```bash
PORT=5000

# Frontend URL (Vite runs on 5173 by default)
FRONTEND_URL=http://localhost:5173
```

# Running the Project

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

# Migration and setup  
```bash
cd ai_model

python manage.py makemigrations recommendation
python manage.py migrate

python manage.py runserver
```

# 🖥️ Accessing the Application
Frontend (React App): http://localhost:5173

Backend (API Server): http://localhost:5000

Django server : http://127.0.0.1:8000/

# Folder structure

```bash
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
├── ai_model/
│   ├── ai_model/
│   ├── recommendation/
│   └── manage.py
├── package.json
├── README.md
└── package.json
```