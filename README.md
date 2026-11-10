<div align="center">

# Laptop Service Center Management System

**A local-first service management application for laptop repair centers.**

Manage customer registrations, repair records, handovers, service progress, and payments through a React interface powered by a Python FastAPI backend, with Excel-based local data storage.

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

</div>

---

## Overview

Laptop Service Center Management System is a Windows-oriented application designed to help a laptop service center manage its day-to-day repair workflow. Staff can register a customer and their device, search existing records, track device and charger handovers, and update a service record when the repair is complete.

The React frontend communicates with a FastAPI backend. The backend uses **OpenPyXL** to store service records in an Excel workbook, keeping the application usable in a local environment without a hosted database.

## Key Features

- **Customer registration** — capture customer contact details, laptop information, reported issue, and estimated service amount.
- **Customer search** — find records using a customer name or phone number.
- **Service record view** — retrieve and review an individual customer's service details.
- **Handover tracking** — record whether the laptop and charger were received from the customer and returned to them.
- **Service completion** — enter the final amount and update the service status to completed.
- **Date and time tracking** — record service submission and completion timestamps.
- **Excel data storage** — maintain service records in a local `.xlsx` workbook.
- **Windows packaging** — includes PyInstaller and Inno Setup configuration for packaging the application as a Windows executable and installer.

## Application Architecture

```mermaid
flowchart LR
    A[React UI] -->|HTTP requests| B[FastAPI Backend]
    B --> C[OpenPyXL]
    C --> D[(Local Excel Workbook)]
```

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML, CSS, Bootstrap, Axios, Vite |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Data handling | OpenPyXL, Excel workbook (`.xlsx`) |
| Desktop packaging | PyInstaller, Inno Setup |
| Development tools | Git, GitHub, VS Code |

## Project Structure

```text
laptop-service-center/
├── backend/
│   ├── excel_service.py       # Excel workbook creation and access
│   ├── main.py                # FastAPI application and API routes
│   ├── schemas.py             # Request validation models
│   ├── run_app.py             # Local desktop application launcher
│   ├── requirements.txt      # Python dependencies
│   └── LaptopServiceCenter.spec
├── public/                    # Public frontend assets
├── src/
│   ├── components/            # Reusable React components
│   ├── pages/                 # Application pages
│   ├── services/              # Frontend API integration
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── LaptopServiceCenter.iss    # Inno Setup installer script
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Getting Started — Development Setup

### Prerequisites

Install the following on your Windows development machine:

- Python
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sudheer123-PROJECT/laptop-service-center.git
cd laptop-service-center
```

### 2. Set up the backend

Open a terminal in the project folder and run:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The FastAPI server runs at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Set up the frontend

Open a **second terminal** in the project root (`laptop-service-center`) and run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite in the terminal (typically `http://localhost:5173`). Keep both the backend and frontend terminals running during development.

### 4. Create a frontend production build

From the project root, run:

```bash
npm run build
```

The generated frontend build is written to `dist/`.

## API Overview

The backend currently exposes these service endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api` | API welcome/status message |
| `GET` | `/health` | Backend health check |
| `POST` | `/customers` | Create a customer service record |
| `GET` | `/customers` | Retrieve customer records |
| `GET` | `/customers/search?query=...` | Search by customer name or phone number |
| `GET` | `/customers/{customer_id}` | Retrieve one customer record |
| `PUT` | `/customers/{customer_id}/complete` | Record service completion details |

## Data Storage and Privacy

- Service records are stored in an Excel workbook managed by the backend.
- In development, the workbook is created under `backend/data/`.
- In the packaged Windows application, the workbook is stored under the current user's Local AppData folder in `Laptop Service Center`.
- Generated workbooks, customer data, virtual environments, build output, and installer files are excluded from version control by `.gitignore`.

**Do not commit real customer names, phone numbers, device details, or service records to this repository.** Use sample or anonymized data for demonstrations and screenshots.

## Desktop Packaging

The repository includes:

- `backend/LaptopServiceCenter.spec` — PyInstaller build configuration.
- `LaptopServiceCenter.iss` — Inno Setup script for creating a Windows installer.
- `backend/run_app.py` — launcher that starts the local FastAPI server and opens the application in the browser.

The installer itself is not committed to the source repository. Publish a distributable installer separately through GitHub Releases only after confirming you have permission to distribute it.

## Future Improvements

Potential enhancements for a future version include automated tests, database-backed storage, configurable backups, and documented release/build automation.

## Author

**Sudheer Putti**  
Python Developer | FastAPI | React | Backend Development

GitHub: [@sudheer123-PROJECT](https://github.com/sudheer123-PROJECT)

---

<div align="center">

Built to simplify laptop service-center operations.

</div>
