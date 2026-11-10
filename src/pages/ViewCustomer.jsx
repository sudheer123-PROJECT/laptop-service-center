import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import Notification from "../components/Notification";


function ViewCustomer() {
  // =========================================================
  // CUSTOMER ID FROM URL
  // =========================================================

  const { id } = useParams();

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [notification, setNotification] = useState("");


  // =========================================================
  // LOAD CUSTOMER FROM FASTAPI
  // =========================================================

  useEffect(() => {
    loadCustomer();
  }, [id]);


  const loadCustomer = async () => {
    try {

      setLoading(true);

      setErrorMessage("");

      // =====================================================
      // GET CUSTOMER BY ID
      // =====================================================

      const response = await API.get(
        `/customers/${id}`
      );

      console.log(
        "View Customer API Response:",
        response.data
      );

      // =====================================================
      // GET CUSTOMER OBJECT
      // =====================================================

      const customerData =
        response.data?.customer;

      if (!customerData) {

        setErrorMessage(
          "Customer record was not found."
        );

        setCustomer(null);

        return;
      }

      setCustomer(customerData);

    } catch (error) {

      console.error(
        "View Customer Error:",
        error
      );

      setCustomer(null);

      if (error.response?.status === 404) {

        setErrorMessage(
          "Customer record was not found."
        );

      } else if (
        error.request &&
        !error.response
      ) {

        setErrorMessage(
          "Cannot connect to FastAPI. Make sure the backend is running."
        );

      } else {

        setErrorMessage(
          "Unable to load customer details."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount = (amount) => {

    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {

      return "-";

    }

    return `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;
  };


  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {

    return (
      <div className="customer-details-page">

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <p className="text-muted mt-3 mb-0">
              Loading customer details...
            </p>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // ERROR SCREEN
  // =========================================================

  if (!customer) {

    return (
      <div className="customer-details-page">

        <div className="card shadow-sm">

          <div className="card-body text-center py-5">

            <i
              className="bi bi-person-x"
              style={{
                fontSize: "60px",
                color: "#dc3545",
              }}
            ></i>

            <h3 className="mt-3">
              Customer Not Found
            </h3>

            <p className="text-muted">
              {errorMessage}
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                navigate("/search-customer")
              }
            >

              <i className="bi bi-arrow-left me-2"></i>

              Back to Search

            </button>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="customer-details-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h1 className="page-title">
              Customer Details
            </h1>

            <p className="text-muted mb-0">
              View customer service information
            </p>

          </div>

          <Link
            to="/search-customer"
            className="btn btn-outline-primary"
          >

            <i className="bi bi-arrow-left me-2"></i>

            Back to Search

          </Link>

        </div>

      </div>


      {/* =====================================================
          CUSTOMER INFORMATION
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">

          <div className="d-flex justify-content-between align-items-center">

            <h5 className="mb-0">

              <i className="bi bi-person-circle me-2"></i>

              Customer Information

            </h5>

            <span className="badge bg-light text-primary">

              ID: {customer.id}

            </span>

          </div>

        </div>


        <div className="card-body">

          <div className="row">

            {/* =================================================
                CUSTOMER NAME
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Customer Name
              </label>

              <div className="details-value">

                <i className="bi bi-person me-2"></i>

                {customer.customerName}

              </div>

            </div>


            {/* =================================================
                PHONE NUMBER
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Phone Number
              </label>

              <div className="details-value">

                <i className="bi bi-telephone me-2"></i>

                {customer.phoneNumber}

              </div>

            </div>


            {/* =================================================
                LAPTOP TYPE
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Laptop Type / Brand
              </label>

              <div className="details-value">

                <i className="bi bi-laptop me-2"></i>

                {customer.laptopType}

              </div>

            </div>


            {/* =================================================
                LAPTOP ISSUE
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Laptop Issue
              </label>

              <div className="details-value">

                <i className="bi bi-tools me-2"></i>

                {customer.laptopIssue}

              </div>

            </div>


            {/* =================================================
                ESTIMATED AMOUNT
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Estimated Amount
              </label>

              <div className="details-value">

                <i className="bi bi-currency-rupee me-2"></i>

                {formatAmount(
                  customer.estimatedAmount
                )}

              </div>

            </div>


            {/* =================================================
                LAPTOP GIVEN TO CLIENT
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Laptop Given to Client
              </label>

              <div className="details-value">

                {customer.laptopGivenToClient ===
                "Yes" ? (

                  <span className="badge bg-success">

                    <i className="bi bi-check-circle me-1"></i>

                    Yes

                  </span>

                ) : (

                  <span className="badge bg-secondary">

                    No

                  </span>

                )}

              </div>

            </div>


            {/* =================================================
                CHARGER GIVEN TO CLIENT
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Charger Given to Client
              </label>

              <div className="details-value">

                {customer.chargerGivenToClient ===
                "Yes" ? (

                  <span className="badge bg-success">

                    <i className="bi bi-check-circle me-1"></i>

                    Yes

                  </span>

                ) : (

                  <span className="badge bg-secondary">

                    No

                  </span>

                )}

              </div>

            </div>


            {/* =================================================
                SUBMITTED DATE & TIME
            ================================================== */}

            <div className="col-md-6 mb-4">

              <label className="details-label">
                Submitted Date & Time
              </label>

              <div className="details-value">

                <i className="bi bi-calendar-event me-2"></i>

                {customer.submittedDateTime ||
                  "Not Available"}

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SERVICE STATUS
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1">
                Service Status
              </h5>

              <p className="text-muted mb-0">
                Current status of this customer's laptop service
              </p>

            </div>


            <div>

              {customer.status ===
              "Completed" ? (

                <span className="badge bg-success fs-6 p-2">

                  <i className="bi bi-check-circle-fill me-2"></i>

                  Completed

                </span>

              ) : (

                <span className="badge bg-warning text-dark fs-6 p-2">

                  <i className="bi bi-hourglass-split me-2"></i>

                  Activated (In Progress)

                </span>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          COMPLETION INFORMATION
      ====================================================== */}

      {customer.status === "Completed" && (

        <div className="card shadow-sm mb-4">

          <div className="card-header bg-success text-white">

            <h5 className="mb-0">

              <i className="bi bi-check-circle me-2"></i>

              Completed Service Details

            </h5>

          </div>


          <div className="card-body">

            <div className="row">

              {/* FINAL AMOUNT */}

              <div className="col-md-6 mb-4">

                <label className="details-label">
                  Final Amount
                </label>

                <div className="details-value">

                  <i className="bi bi-currency-rupee me-2"></i>

                  {formatAmount(
                    customer.finalAmount
                  )}

                </div>

              </div>


              {/* LAPTOP GIVEN TO CUSTOMER */}

              <div className="col-md-6 mb-4">

                <label className="details-label">
                  Laptop Given to Customer
                </label>

                <div className="details-value">

                  {customer.laptopGivenToCustomer ===
                  "Yes" ? (

                    <span className="badge bg-success">

                      <i className="bi bi-check-circle me-1"></i>

                      Yes

                    </span>

                  ) : (

                    <span className="badge bg-secondary">
                      No
                    </span>

                  )}

                </div>

              </div>


              {/* CHARGER GIVEN TO CUSTOMER */}

              <div className="col-md-6 mb-4">

                <label className="details-label">
                  Charger Given to Customer
                </label>

                <div className="details-value">

                  {customer.chargerGivenToCustomer ===
                  "Yes" ? (

                    <span className="badge bg-success">

                      <i className="bi bi-check-circle me-1"></i>

                      Yes

                    </span>

                  ) : (

                    <span className="badge bg-secondary">
                      No
                    </span>

                  )}

                </div>

              </div>


              {/* COMPLETED DATE */}

              <div className="col-md-6 mb-4">

                <label className="details-label">
                  Completed Date & Time
                </label>

                <div className="details-value">

                  <i className="bi bi-calendar-check me-2"></i>

                  {customer.completedDateTime ||
                    "Not Available"}

                </div>

              </div>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          COMPLETE SERVICE ACTION
      ====================================================== */}

      {customer.status !== "Completed" && (

        <div className="card shadow-sm">

          <div className="card-body">

            <h5>
              Complete Service
            </h5>

            <p className="text-muted">

              After the technician finishes the laptop
              repair, enter the final amount and confirm
              that the laptop and charger were returned
              to the customer.

            </p>

            <Link
              to={`/complete-service/${customer.id}`}
              className="btn btn-success"
            >

              <i className="bi bi-check-circle me-2"></i>

              Enter Final Amount & Complete

            </Link>

          </div>

        </div>

      )}


      {/* =====================================================
          NOTIFICATION
      ====================================================== */}

      {notification && (

        <Notification
          message={notification}
          onClose={() =>
            setNotification("")
          }
        />

      )}

    </div>
  );
}

export default ViewCustomer;