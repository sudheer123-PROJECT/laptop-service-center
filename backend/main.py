from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import CustomerCreate,CustomerComplete
from excel_service import (
    create_excel_file,
    get_workbook,
    get_worksheet,
    EXCEL_FILE,
)


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="Laptop Service Center API",
    description="Backend API for Laptop Service Center Management",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# CREATE EXCEL FILE WHEN BACKEND STARTS
# =========================================================

create_excel_file()


# =========================================================
# HELPER — CONVERT EXCEL ROW TO CUSTOMER DICTIONARY
# =========================================================

def row_to_customer(row):
    return {
        "id": row[0],
        "customerName": row[1] or "",
        "phoneNumber": row[2] or "",
        "laptopType": row[3] or "",
        "laptopIssue": row[4] or "",
        "estimatedAmount": row[5] or 0,
        "laptopGivenToClient": row[6] or "",
        "chargerGivenToClient": row[7] or "",
        "submittedDateTime": row[8] or "",
        "finalAmount": row[9],
        "laptopGivenToCustomer": row[10] or "",
        "chargerGivenToCustomer": row[11] or "",
        "completedDateTime": row[12] or "",
        "status": row[13] or "",
    }


# =========================================================
# ROOT
# =========================================================

@app.get("/api")
def root():
    return {
        "message": "Laptop Service Center API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():
    return {
        "status": "success",
        "message": "Backend is working correctly",
    }


# =========================================================
# CREATE CUSTOMER
# =========================================================

@app.post("/customers")
def create_customer(customer: CustomerCreate):

    workbook = None

    try:
        # -----------------------------------------------------
        # OPEN EXCEL
        # -----------------------------------------------------

        workbook = get_workbook()

        worksheet = get_worksheet(workbook)

        # -----------------------------------------------------
        # GENERATE SERIAL NUMBER
        # -----------------------------------------------------

        serial_number = worksheet.max_row

        # -----------------------------------------------------
        # SUBMITTED DATE & TIME
        # -----------------------------------------------------

        submitted_date_time = datetime.now().strftime(
            "%d/%m/%Y, %I:%M:%S %p"
        )

        # -----------------------------------------------------
        # INITIAL STATUS
        # -----------------------------------------------------

        status = "Activated (In Progress)"

        # -----------------------------------------------------
        # ADD CUSTOMER ROW
        # -----------------------------------------------------

        worksheet.append([
            serial_number,
            customer.customerName,
            customer.phoneNumber,
            customer.laptopType,
            customer.laptopIssue,
            customer.estimatedAmount,
            customer.laptopGivenToClient,
            customer.chargerGivenToClient,
            submitted_date_time,
            None,
            None,
            None,
            None,
            status,
        ])

        # -----------------------------------------------------
        # SAVE EXCEL
        # -----------------------------------------------------

        workbook.save(EXCEL_FILE)

        # -----------------------------------------------------
        # RESPONSE
        # -----------------------------------------------------

        return {
            "status": "success",
            "message": "Customer details submitted successfully!",
            "customer": {
                "id": serial_number,
                "customerName": customer.customerName,
                "phoneNumber": customer.phoneNumber,
                "laptopType": customer.laptopType,
                "laptopIssue": customer.laptopIssue,
                "estimatedAmount":
                    customer.estimatedAmount,
                "laptopGivenToClient":
                    customer.laptopGivenToClient,
                "chargerGivenToClient":
                    customer.chargerGivenToClient,
                "submittedDateTime":
                    submitted_date_time,
                "finalAmount": None,
                "laptopGivenToCustomer": "",
                "chargerGivenToCustomer": "",
                "completedDateTime": "",
                "status": status,
            },
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save customer: {str(error)}"
        )

    finally:

        if workbook is not None:
            workbook.close()


# =========================================================
# GET ALL CUSTOMERS
# =========================================================

@app.get("/customers")
def get_customers():

    workbook = None

    try:
        # -----------------------------------------------------
        # OPEN EXCEL
        # -----------------------------------------------------

        workbook = get_workbook()

        worksheet = get_worksheet(workbook)

        customers = []

        # -----------------------------------------------------
        # READ ALL ROWS
        # -----------------------------------------------------

        for row in worksheet.iter_rows(
            min_row=2,
            values_only=True
        ):

            if not row[0]:
                continue

            customer = row_to_customer(row)

            customers.append(customer)

        return {
            "status": "success",
            "count": len(customers),
            "customers": customers,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to read customers: {str(error)}"
        )

    finally:

        if workbook is not None:
            workbook.close()


# =========================================================
# SEARCH CUSTOMER
# =========================================================

@app.get("/customers/search")
def search_customers(query: str):

    workbook = None

    try:

        query = query.strip().lower()

        if not query:
            return {
                "status": "success",
                "count": 0,
                "customers": [],
            }

        workbook = get_workbook()

        worksheet = get_worksheet(workbook)

        customers = []

        # -----------------------------------------------------
        # SEARCH NAME / PHONE
        # -----------------------------------------------------

        for row in worksheet.iter_rows(
            min_row=2,
            values_only=True
        ):

            if not row[0]:
                continue

            customer = row_to_customer(row)

            name = str(
                customer["customerName"]
            ).lower()

            phone = str(
                customer["phoneNumber"]
            ).lower()

            if (
                query in name
                or query in phone
            ):

                customers.append(customer)

        return {
            "status": "success",
            "count": len(customers),
            "customers": customers,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to search customers: {str(error)}"
        )

    finally:

        if workbook is not None:
            workbook.close()


# =========================================================
# GET CUSTOMER BY ID
# =========================================================

@app.get("/customers/{customer_id}")
def get_customer(customer_id: int):

    workbook = None

    try:

        workbook = get_workbook()

        worksheet = get_worksheet(workbook)

        # -----------------------------------------------------
        # FIND CUSTOMER
        # -----------------------------------------------------

        for row in worksheet.iter_rows(
            min_row=2,
            values_only=True
        ):

            if not row[0]:
                continue

            if int(row[0]) == customer_id:

                customer = row_to_customer(row)

                return {
                    "status": "success",
                    "customer": customer,
                }

        # -----------------------------------------------------
        # NOT FOUND
        # -----------------------------------------------------

        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to get customer: {str(error)}"
        )

    finally:

        if workbook is not None:
            workbook.close()
# =========================================================
# COMPLETE CUSTOMER SERVICE
# =========================================================

@app.put("/customers/{customer_id}/complete")
def complete_customer(
    customer_id: int,
    completion: CustomerComplete
):

    workbook = None

    try:
        # -----------------------------------------------------
        # OPEN EXCEL
        # -----------------------------------------------------

        workbook = get_workbook()

        worksheet = get_worksheet(workbook)

        customer_found = False

        # -----------------------------------------------------
        # FIND CUSTOMER ROW
        # -----------------------------------------------------

        for row_number in range(
            2,
            worksheet.max_row + 1
        ):

            current_id = worksheet.cell(
                row=row_number,
                column=1
            ).value

            if current_id is None:
                continue

            if int(current_id) == customer_id:

                customer_found = True

                # -------------------------------------------------
                # UPDATE FINAL AMOUNT
                # -------------------------------------------------

                worksheet.cell(
                    row=row_number,
                    column=10
                ).value = completion.finalAmount

                # -------------------------------------------------
                # LAPTOP GIVEN TO CUSTOMER
                # -------------------------------------------------

                worksheet.cell(
                    row=row_number,
                    column=11
                ).value = (
                    completion.laptopGivenToCustomer
                )

                # -------------------------------------------------
                # CHARGER GIVEN TO CUSTOMER
                # -------------------------------------------------

                worksheet.cell(
                    row=row_number,
                    column=12
                ).value = (
                    completion.chargerGivenToCustomer
                )

                # -------------------------------------------------
                # COMPLETED DATE & TIME
                # -------------------------------------------------

                completed_date_time = datetime.now().strftime(
                    "%d/%m/%Y, %I:%M:%S %p"
                )

                worksheet.cell(
                    row=row_number,
                    column=13
                ).value = completed_date_time

                # -------------------------------------------------
                # STATUS
                # -------------------------------------------------

                worksheet.cell(
                    row=row_number,
                    column=14
                ).value = "Completed"

                # -------------------------------------------------
                # SAVE EXCEL
                # -------------------------------------------------

                workbook.save(EXCEL_FILE)

                return {
                    "status": "success",
                    "message": "Service completed successfully!",
                    "customer": {
                        "id": customer_id,
                        "finalAmount":
                            completion.finalAmount,
                        "laptopGivenToCustomer":
                            completion.laptopGivenToCustomer,
                        "chargerGivenToCustomer":
                            completion.chargerGivenToCustomer,
                        "completedDateTime":
                            completed_date_time,
                        "status": "Completed",
                    },
                }

        # -----------------------------------------------------
        # CUSTOMER NOT FOUND
        # -----------------------------------------------------

        if not customer_found:

            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to complete service: {str(error)}"
        )

    finally:

        if workbook is not None:
            workbook.close()