
# Laptop Service Center Management System

A desktop-based Laptop Service Center Management System built using React, FastAPI, and Python.

The application helps laptop service centers manage customer details, service requests, repair status, and payment records. Customer information is maintained in an Excel workbook.

## Features

- Customer registration and service management
- Customer search by name and phone number
- View individual customer records
- Track laptop and charger handover details
- Record estimated and final service amounts
- Update service completion status
- Automatic date and time tracking
- Excel-based data storage
- Windows desktop installer
- Local operation without requiring an internet connection

## Technology Stack

### Frontend
- React
- JavaScript
- HTML5
- CSS3
- Bootstrap
- Axios
- Vite

### Backend
- Python
- FastAPI
- Pydantic
- OpenPyXL

### Desktop Packaging
- PyInstaller
- Inno Setup

## Project Structure

```text
Laptop-Service-Center/
│
├── backend/
│   ├── main.py
│   ├── schemas.py
│   ├── excel_service.py
│   ├── run_app.py
│   ├── requirements.txt
│   └── LaptopServiceCenter.spec
│
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│
├── .gitignore
├── LaptopServiceCenter.iss
├── package.json
├── package-lock.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd laptop-service-center
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up the Python backend

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend API documentation:

```text
http://127.0.0.1:8000/docs
```

### 4. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

## Data Storage

Customer service records are stored in an Excel workbook.

- Development: `backend/data/`
- Installed application: Windows Local AppData

Customer records and generated Excel files are excluded from Git using `.gitignore`.

## Purpose

This project was developed to simplify daily operations in a laptop service center by digitizing customer registration, repair tracking, and service completion.

## Developer

Sudheer Putti

Python Developer | FastAPI | React | SQL

