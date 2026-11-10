import { useEffect, useMemo, useState } from "react";

import API from "../services/api";
import Notification from "../components/Notification";


function Reports() {

  // =========================================================
  // STATE
  // =========================================================

  const [customers, setCustomers] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState("");


  // =========================================================
  // LOAD REPORT DATA
  // =========================================================

  useEffect(() => {
    loadCustomers();
  }, []);


  const loadCustomers = async () => {

    try {

      setLoading(true);

      setNotification("");

      const response =
        await API.get("/customers");

      console.log(
        "Reports API Response:",
        response.data
      );

      const records =
        response.data?.customers || [];

      setCustomers(records);

    } catch (error) {

      console.error(
        "Reports Error:",
        error
      );

      setCustomers([]);

      if (
        error.request &&
        !error.response
      ) {

        setNotification(
          "Cannot connect to FastAPI. Make sure the backend is running."
        );

      } else {

        setNotification(
          "Unable to load report data."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // REPORT CALCULATIONS
  // =========================================================

  const totalCustomers =
    customers.length;


  const completedCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Completed"
    );


  const activatedCustomers =
    customers.filter(
      (customer) =>
        customer.status !== "Completed"
    );


  const totalCompleted =
    completedCustomers.length;


  const totalActivated =
    activatedCustomers.length;


  const totalEstimatedAmount =
    customers.reduce(
      (total, customer) =>
        total +
        Number(
          customer.estimatedAmount || 0
        ),
      0
    );


  const totalFinalAmount =
    completedCustomers.reduce(
      (total, customer) =>
        total +
        Number(
          customer.finalAmount || 0
        ),
      0
    );


  const averageFinalAmount =
    totalCompleted > 0
      ? totalFinalAmount / totalCompleted
      : 0;


  const completionRate =
    totalCustomers > 0
      ? (totalCompleted / totalCustomers) * 100
      : 0;


  // =========================================================
  // FILTER REPORTS
  // =========================================================

  const filteredCustomers = useMemo(() => {

    const value =
      searchText.trim().toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter(
      (customer) => {

        const name =
          customer.customerName
            ?.toLowerCase() || "";

        const phone =
          customer.phoneNumber
            ?.toLowerCase() || "";

        const laptop =
          customer.laptopType
            ?.toLowerCase() || "";

        const issue =
          customer.laptopIssue
            ?.toLowerCase() || "";

        const status =
          customer.status
            ?.toLowerCase() || "";

        return (
          name.includes(value) ||
          phone.includes(value) ||
          laptop.includes(value) ||
          issue.includes(value) ||
          status.includes(value)
        );
      }
    );

  }, [customers, searchText]);


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
  // FORMAT PERCENTAGE
  // =========================================================

  const formatPercentage = (value) => {

    return `${value.toFixed(1)}%`;

  };


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {

    setSearchText("");

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="reports-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="page-header">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h1 className="page-title">
              Reports & Summary
            </h1>

            <p className="text-muted mb-0">
              Customer service and completion overview
            </p>

          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={loadCustomers}
            disabled={loading}
          >

            <i className="bi bi-arrow-clockwise me-2"></i>

            Refresh Report

          </button>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="row g-4 mb-4">

        {/* TOTAL CUSTOMERS */}

        <div className="col-xl-3 col-md-6">

          <div className="card report-card total-report-card">

            <div className="card-body">

              <div className="report-icon">

                <i className="bi bi-people-fill"></i>

              </div>

              <div>

                <div className="report-label">
                  Total Customers
                </div>

                <div className="report-number">
                  {totalCustomers}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ACTIVATED */}

        <div className="col-xl-3 col-md-6">

          <div className="card report-card active-report-card">

            <div className="card-body">

              <div className="report-icon">

                <i className="bi bi-hourglass-split"></i>

              </div>

              <div>

                <div className="report-label">
                  Activated / In Progress
                </div>

                <div className="report-number">
                  {totalActivated}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="col-xl-3 col-md-6">

          <div className="card report-card completed-report-card">

            <div className="card-body">

              <div className="report-icon">

                <i className="bi bi-check-circle-fill"></i>

              </div>

              <div>

                <div className="report-label">
                  Completed
                </div>

                <div className="report-number">
                  {totalCompleted}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* COMPLETION RATE */}

        <div className="col-xl-3 col-md-6">

          <div className="card report-card rate-report-card">

            <div className="card-body">

              <div className="report-icon">

                <i className="bi bi-graph-up"></i>

              </div>

              <div>

                <div className="report-label">
                  Completion Rate
                </div>

                <div className="report-number">
                  {formatPercentage(
                    completionRate
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          AMOUNT SUMMARY
      ====================================================== */}

      <div className="row g-4 mb-4">

        {/* ESTIMATED */}

        <div className="col-md-4">

          <div className="card shadow-sm amount-card">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Total Estimated Amount
                  </p>

                  <h3 className="mb-0">
                    {formatAmount(
                      totalEstimatedAmount
                    )}
                  </h3>

                </div>

                <div className="amount-icon estimated-icon">

                  <i className="bi bi-calculator"></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* FINAL */}

        <div className="col-md-4">

          <div className="card shadow-sm amount-card">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Total Final Amount
                  </p>

                  <h3 className="mb-0 text-success">
                    {formatAmount(
                      totalFinalAmount
                    )}
                  </h3>

                </div>

                <div className="amount-icon final-icon">

                  <i className="bi bi-currency-rupee"></i>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* AVERAGE */}

        <div className="col-md-4">

          <div className="card shadow-sm amount-card">

            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>

                  <p className="text-muted mb-1">
                    Average Final Amount
                  </p>

                  <h3 className="mb-0">
                    {formatAmount(
                      averageFinalAmount
                    )}
                  </h3>

                </div>

                <div className="amount-icon average-icon">

                  <i className="bi bi-bar-chart-fill"></i>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SERVICE STATUS SUMMARY
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-header bg-white">

          <h5 className="mb-0">
            Service Status Summary
          </h5>

        </div>

        <div className="card-body">

          <div className="row">

            {/* ACTIVATED */}

            <div className="col-md-6">

              <div className="status-summary-box activated-box">

                <div className="status-summary-header">

                  <span>

                    <i className="bi bi-hourglass-split me-2"></i>

                    Activated / In Progress

                  </span>

                  <strong>
                    {totalActivated}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    className="progress-bar bg-warning"
                    style={{
                      width:
                        totalCustomers > 0
                          ? `${(
                              totalActivated /
                              totalCustomers
                            ) * 100}%`
                          : "0%",
                    }}
                  ></div>

                </div>

              </div>

            </div>


            {/* COMPLETED */}

            <div className="col-md-6">

              <div className="status-summary-box completed-box">

                <div className="status-summary-header">

                  <span>

                    <i className="bi bi-check-circle me-2"></i>

                    Completed

                  </span>

                  <strong>
                    {totalCompleted}
                  </strong>

                </div>

                <div className="progress">

                  <div
                    className="progress-bar bg-success"
                    style={{
                      width:
                        totalCustomers > 0
                          ? `${(
                              totalCompleted /
                              totalCustomers
                            ) * 100}%`
                          : "0%",
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CUSTOMER REPORT
      ====================================================== */}

      <div className="card shadow-sm">

        <div className="card-header bg-white">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1">
                Customer Report
              </h5>

              <small className="text-muted">
                {filteredCustomers.length} record(s)
              </small>

            </div>

            <span className="badge bg-primary">
              {filteredCustomers.length}
            </span>

          </div>

        </div>


        <div className="card-body">

          {/* SEARCH */}

          <div className="row g-2 mb-4">

            <div className="col-md-10">

              <input
                type="text"
                className="form-control"
                placeholder="Search name, phone, laptop, issue or status"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />

            </div>

            <div className="col-md-2">

              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={handleClearSearch}
              >

                <i className="bi bi-x-circle me-2"></i>

                Clear

              </button>

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary"
                role="status"
              ></div>

              <p className="text-muted mt-3">
                Loading report data...
              </p>

            </div>

          ) : filteredCustomers.length === 0 ? (

            /* =================================================
               NO DATA
            ================================================== */

            <div className="text-center py-5">

              <i
                className="bi bi-bar-chart"
                style={{
                  fontSize: "55px",
                  color: "#6c757d",
                }}
              ></i>

              <h5 className="mt-3">
                No Report Data
              </h5>

              <p className="text-muted">
                No customer records are available.
              </p>

            </div>

          ) : (

            /* =================================================
               REPORT TABLE
            ================================================== */

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-light">

                  <tr>

                    <th>S.No</th>

                    <th>Customer Name</th>

                    <th>Phone</th>

                    <th>Laptop</th>

                    <th>Issue</th>

                    <th>Estimated</th>

                    <th>Final Amount</th>

                    <th>Status</th>

                    <th>Submitted Date & Time</th>

                    <th>Completed Date & Time</th>

                  </tr>

                </thead>

                <tbody>

                  {filteredCustomers.map(
                    (customer, index) => (

                      <tr key={customer.id}>

                        <td>
                          {index + 1}
                        </td>

                        <td>

                          <strong>
                            {customer.customerName}
                          </strong>

                        </td>

                        <td>
                          {customer.phoneNumber}
                        </td>

                        <td>
                          {customer.laptopType}
                        </td>

                        <td>
                          {customer.laptopIssue}
                        </td>

                        <td>
                          {formatAmount(
                            customer.estimatedAmount
                          )}
                        </td>

                        <td>

                          {customer.finalAmount !==
                          null &&
                          customer.finalAmount !==
                          undefined &&
                          customer.finalAmount !==
                          "" ? (

                            formatAmount(
                              customer.finalAmount
                            )

                          ) : (

                            "-"

                          )}

                        </td>

                        <td>

                          {customer.status ===
                          "Completed" ? (

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

                        </td>

                        <td>

                          {customer.submittedDateTime ||
                            "-"}

                        </td>

                        <td>

                          {customer.completedDateTime ||
                            "-"}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


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

export default Reports;