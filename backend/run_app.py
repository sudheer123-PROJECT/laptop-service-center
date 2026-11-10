import os
import sys

# Fix for PyInstaller --windowed / --noconsole
if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")

if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")


from pathlib import Path
import threading
import time

import uvicorn
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from main import app
from excel_service import create_excel_file


HOST = "127.0.0.1"
PORT = 8000
APP_URL = f"http://{HOST}:{PORT}"


BASE_DIR = Path(__file__).resolve().parent


# React frontend location
if getattr(sys, "frozen", False):
    FRONTEND_DIR = Path(sys._MEIPASS) / "frontend"
else:
    FRONTEND_DIR = BASE_DIR.parent / "dist"


INDEX_FILE = FRONTEND_DIR / "index.html"
ASSETS_DIR = FRONTEND_DIR / "assets"


# Check frontend
if not FRONTEND_DIR.exists():
    raise RuntimeError(
        f"Frontend folder not found: {FRONTEND_DIR}"
    )

if not INDEX_FILE.exists():
    raise RuntimeError(
        f"index.html not found: {INDEX_FILE}"
    )


# Serve React assets
if ASSETS_DIR.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=ASSETS_DIR),
        name="assets",
    )


# Serve React application
@app.get("/{full_path:path}", include_in_schema=False)
def serve_react(full_path: str):

    requested_file = FRONTEND_DIR / full_path

    try:
        requested_file = requested_file.resolve()
        frontend_root = FRONTEND_DIR.resolve()

        if (
            requested_file.is_file()
            and frontend_root in requested_file.parents
        ):
            return FileResponse(requested_file)

    except Exception:
        pass

    # React Router fallback
    return FileResponse(INDEX_FILE)


# Open default Windows browser automatically
def open_browser():

    time.sleep(3)

    try:
        os.startfile(APP_URL)
    except Exception as error:
        print(f"Could not open browser: {error}")


# Start application
if __name__ == "__main__":

    create_excel_file()

    browser_thread = threading.Thread(
        target=open_browser,
        daemon=True,
    )

    browser_thread.start()

    uvicorn.run(
        app,
        host=HOST,
        port=PORT,
        reload=False,
    )