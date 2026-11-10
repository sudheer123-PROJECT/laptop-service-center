from pathlib import Path
from openpyxl import Workbook, load_workbook
import os
import sys


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent


# Development:
# E:\laptop-service-center\backend\data
#
# Installed EXE:
# C:\Users\<User>\AppData\Local\Laptop Service Center
if getattr(sys, "frozen", False):

    LOCAL_APP_DATA = os.environ.get(
        "LOCALAPPDATA",
        str(Path.home() / "AppData" / "Local")
    )

    DATA_DIR = (
        Path(LOCAL_APP_DATA)
        / "Laptop Service Center"
    )

else:

    DATA_DIR = BASE_DIR / "data"


EXCEL_FILE = DATA_DIR / "Laptop_Service_Center.xlsx"


# =========================================================
# EXCEL HEADERS
# =========================================================

HEADERS = [
    "S.No",
    "Customer Name",
    "Phone Number",
    "Laptop Type / Brand",
    "Laptop Issue",
    "Estimated Amount",
    "Laptop Given to Client",
    "Charger Given to Client",
    "Submitted Date & Time",
    "Final Amount",
    "Laptop Given to Customer",
    "Charger Given to Customer",
    "Completed Date & Time",
    "Status",
]


# =========================================================
# CREATE EXCEL FILE
# =========================================================

def create_excel_file():

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    if not EXCEL_FILE.exists():

        workbook = Workbook()

        worksheet = workbook.active

        worksheet.title = "Service Records"

        worksheet.append(HEADERS)

        workbook.save(EXCEL_FILE)

        print(
            f"Excel file created: {EXCEL_FILE}"
        )

    else:

        print(
            f"Excel file already exists: {EXCEL_FILE}"
        )


# =========================================================
# LOAD WORKBOOK
# =========================================================

def get_workbook():

    create_excel_file()

    return load_workbook(EXCEL_FILE)


# =========================================================
# GET WORKSHEET
# =========================================================

def get_worksheet(workbook):

    return workbook["Service Records"]


# =========================================================
# TEST
# =========================================================

if __name__ == "__main__":

    create_excel_file()

    print(
        f"Excel location: {EXCEL_FILE}"
    )