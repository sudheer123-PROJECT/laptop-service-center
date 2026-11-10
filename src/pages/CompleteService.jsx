import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../services/api";
import Notification from "../components/Notification";

function CompleteService() {
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

  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [notification, setNotification] = useState("");

  const [finalAmount, setFinalAmount] = useState("");

  const [laptopGivenToCustomer, setLaptopGivenToCustomer] =
    useState("Yes");

  const [chargerGivenToCustomer, setChargerGivenToCustomer] =
    useState("Yes");

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

      const response = await API.get(`/customers/${id}`);

      console.log(
        "Complete Service - Customer Response:",
        response.data
      );

      const customerData = response.data?.customer;

      if (!customerData) {
        setCustomer(null);
        setErrorMessage("Customer record was not found.");
        return;
      }

      setCustomer(customerData);

      // Load existing completion details if available
      if (
        customerData.finalAmount !== null &&
        customerData.finalAmount !== undefined
      ) {
        setFinalAmount(
          String(customerData.finalAmount)
        );
      }

      if (customerData.laptopGivenToCustomer) {
        setLaptopGivenToCustomer(
          customerData.laptopGivenToCustomer
        );
      }

      if (customerData.chargerGivenToCustomer) {
        setChargerGivenToCustomer(
          customerData.chargerGivenToCustomer
        );
      }

    } catch (error) {
      console.error(
        "Complete Service Load Error:",
        error
      );

      setCustomer(null);

      if (error.response?.status === 404) {
        setErrorMessage(
          "Customer ID does not exist in Excel."
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

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // =========================================================
  // COMPLETE SERVICE
  // =========================================================

  const handleComplete = async (e) => {
    e.preventDefault();

    if (!customer) {
      setNotification(
        "Customer record was not found."
      );
      return;
    }

    // Final amount validation
    if (
      !finalAmount ||
      Number(finalAmount) <= 0
    ) {
      setNotification(
        "Please enter a valid final amount."
      );
      return;
    }

    try {
      setSaving(true);
      setNotification("");

      const completionData = {
        finalAmount: Number(finalAmount),

        laptopGivenToCustomer:
          laptopGivenToCustomer,

        chargerGivenToCustomer:
          chargerGivenToCustomer,
      };

      console.log(
        "Sending completion data:",
        completionData
      );

      // =====================================================
      // PUT REQUEST TO FASTAPI
      // =====================================================

      const response = await API.put(
        `/customers/${id}/complete`,
        completionData
      );

      console.log(
        "Complete Service Response:",
        response.data
      );

      // =====================================================
      // SUCCESS
      // =====================================================

      if (
        response.data?.status === "success"
      ) {
        setNotification(
          "Service completed successfully!"
        );

        // Reload customer from FastAPI
        await loadCustomer();
      }

    } catch (error) {
      console.error(
        "Complete Service Error:",
        error
      );

      if (error.response?.status === 404) {
        setNotification(
          "Customer record was not found."
        );
      } else if (error.response?.status === 422) {
        setNotification(
          "Invalid completion details."
        );
      } else if (
        error.request &&
        !error.response
      ) {
        setNotification(
          "Cannot connect to FastAPI. Make sure the backend is running."
        );
      } else {
        setNotification(
          "Unable to complete the service."
        );
      }

    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="complete-service-page">

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
  // CUSTOMER NOT FOUND
  // =========================================================

  if (!customer) {
    return (
      <div className="complete-service-page">

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

            <Link
              to="/search-customer"
              className="btn btn-primary"
            >

              <i className="bi bi-arrow-left me-2"></i>

              Back to Search

            </Link>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="complete-service-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="page-header">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h1 className="page-title">
              Enter Final Amount & Complete
            </h1>

            <p className="text-muted mb-0">
              Complete the customer's laptop service
            </p>

          </div>

          <Link
            to={`/view-customer/${customer.id}`}
            className="btn btn-outline-primary"
          >

            <i className="bi bi-arrow-left me-2"></i>

            Back to Customer

          </Link>

        </div>

      </div>

      {/* =====================================================
          CUSTOMER SUMMARY
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-header bg-primary text-white">

          <h5 className="mb-0">
            <i className="bi bi-person-circle me-2"></i>
            Customer Summary
          </h5>

        </div>

        <div className="card-body">

          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="details-label">
                Customer Name
              </label>

              <div className="details-value">
                {customer.customerName}
              </div>

            </div>

            <div className="col-md-6 mb-3">

              <label className="details-label">
                Phone Number
              </label>

              <div className="details-value">
                {customer.phoneNumber}
              </div>

            </div>

            <div className="col-md-6 mb-3">

              <label className="details-label">
                Laptop Type / Brand
              </label>

              <div className="details-value">
                {customer.laptopType}
              </div>

            </div>

            <div className="col-md-6 mb-3">

              <label className="details-label">
                Laptop Issue
              </label>

              <div className="details-value">
                {customer.laptopIssue}
              </div>

            </div>

            <div className="col-md-6 mb-3">

              <label className="details-label">
                Estimated Amount
              </label>

              <div className="details-value">
                {formatAmount(
                  customer.estimatedAmount
                )}
              </div>

            </div>

            <div className="col-md-6 mb-3">

              <label className="details-label">
                Current Status
              </label>

              <div className="details-value">

                {customer.status === "Completed" ? (

                  <span className="badge bg-success">

                    <i className="bi bi-check-circle me-1"></i>

                    Completed

                  </span>

                ) : (

                  <span className="badge bg-warning text-dark">

                    <i className="bi bi-hourglass-split me-1"></i>

                    Activated (In Progress)

                  </span>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          COMPLETE SERVICE FORM
      ====================================================== */}

      <div className="card shadow-sm">

        <div className="card-header bg-success text-white">

          <h5 className="mb-0">

            <i className="bi bi-check-circle me-2"></i>

            Complete Service

          </h5>

        </div>

        <div className="card-body">

          <form onSubmit={handleComplete}>

            <div className="row">

              {/* FINAL AMOUNT */}

              <div className="col-md-6 mb-4">

                <label className="form-label">

                  Final Amount{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="Enter final service amount"
                  value={finalAmount}
                  onChange={(e) =>
                    setFinalAmount(
                      e.target.value
                    )
                  }
                  min="1"
                  disabled={
                    saving ||
                    customer.status === "Completed"
                  }
                />

              </div>

              {/* LAPTOP GIVEN TO CUSTOMER */}

              <div className="col-md-6 mb-4">

                <label className="form-label">

                  Laptop Given to Customer{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <select
                  className="form-select form-select-lg"
                  value={laptopGivenToCustomer}
                  onChange={(e) =>
                    setLaptopGivenToCustomer(
                      e.target.value
                    )
                  }
                  disabled={
                    saving ||
                    customer.status === "Completed"
                  }
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>

              {/* CHARGER GIVEN TO CUSTOMER */}

              <div className="col-md-6 mb-4">

                <label className="form-label">

                  Charger Given to Customer{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <select
                  className="form-select form-select-lg"
                  value={chargerGivenToCustomer}
                  onChange={(e) =>
                    setChargerGivenToCustomer(
                      e.target.value
                    )
                  }
                  disabled={
                    saving ||
                    customer.status === "Completed"
                  }
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                COMPLETE BUTTON
            ================================================== */}

            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={
                saving ||
                customer.status === "Completed"
              }
            >

              {saving ? (

                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>

                  Completing...

                </>

              ) : customer.status === "Completed" ? (

                <>
                  <i className="bi bi-check-circle me-2"></i>

                  Service Completed
                </>

              ) : (

                <>
                  <i className="bi bi-check-circle me-2"></i>

                  Complete Service
                </>

              )}

            </button>

            <Link
              to={`/view-customer/${customer.id}`}
              className="btn btn-secondary btn-lg ms-2"
            >

              Cancel

            </Link>

          </form>

        </div>

      </div>

      {/* =====================================================
          COMPLETION RESULT
      ====================================================== */}

      {customer.status === "Completed" && (

        <div className="card shadow-sm mt-4">

          <div className="card-body">

            <div className="d-flex align-items-center">

              <i
                className="bi bi-check-circle-fill text-success me-3"
                style={{
                  fontSize: "35px",
                }}
              ></i>

              <div>

                <h5 className="text-success mb-1">
                  Service Completed Successfully
                </h5>

                <p className="mb-0 text-muted">

                  Completed Date & Time:
                  {" "}

                  <strong>
                    {customer.completedDateTime || "-"}
                  </strong>

                </p>

              </div>

            </div>

            <hr />

            <div className="row">

              <div className="col-md-4">

                <strong>
                  Final Amount
                </strong>

                <div className="mt-1">
                  {formatAmount(
                    customer.finalAmount
                  )}
                </div>

              </div>

              <div className="col-md-4">

                <strong>
                  Laptop Given to Customer
                </strong>

                <div className="mt-1">
                  {customer.laptopGivenToCustomer || "-"}
                </div>

              </div>

              <div className="col-md-4">

                <strong>
                  Charger Given to Customer
                </strong>

                <div className="mt-1">
                  {customer.chargerGivenToCustomer || "-"}
                </div>

              </div>

            </div>

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

export default CompleteService;