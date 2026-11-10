import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";
import Notification from "../components/Notification";


function ServiceRecords() {

  // =========================================================
  // STATE
  // =========================================================

  const [customers, setCustomers] = useState([]);

  const [filteredCustomers, setFilteredCustomers] =
    useState([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState("");


  // =========================================================
  // LOAD RECORDS WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadRecords();
  }, []);


  // =========================================================
  // GET RECORDS FROM FASTAPI
  // =========================================================

  const loadRecords = async () => {

    try {

      setLoading(true);

      setNotification("");

      const response =
        await API.get("/customers");

      console.log(
        "Service Records API Response:",
        response.data
      );

      const records =
        response.data?.customers || [];

      setCustomers(records);

      setFilteredCustomers(records);

    } catch (error) {

      console.error(
        "Service Records Error:",
        error
      );

      setCustomers([]);

      setFilteredCustomers([]);

      if (
        error.request &&
        !error.response
      ) {

        setNotification(
          "Cannot connect to FastAPI. Make sure the backend is running."
        );

      } else {

        setNotification(
          "Unable to load service records."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // SEARCH RECORDS
  // =========================================================

  const handleSearch = (e) => {

    const value =
      e.target.value.toLowerCase();

    setSearchText(value);

    if (!value.trim()) {

      setFilteredCustomers(customers);

      return;

    }

    const results = customers.filter(
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

    setFilteredCustomers(results);

  };


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClear = () => {

    setSearchText("");

    setFilteredCustomers(customers);

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
  // SUMMARY COUNTS
  // =========================================================

  const totalCustomers =
    customers.length;

  const completedCustomers =
    customers.filter(
      (customer) =>
        customer.status === "Completed"
    ).length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.status !== "Completed"
    ).length;


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="service-records-page">


      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h1 className="page-title">
              Service Records
            </h1>

            <p className="text-muted mb-0">
              View all customer laptop service records
            </p>

          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={loadRecords}
            disabled={loading}
          >

            <i className="bi bi-arrow-clockwise me-2"></i>

            Refresh

          </button>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="row g-3 mb-4">


        {/* TOTAL */}

        <div className="col-md-4">

          <div className="card summary-card">

            <div className="card-body">

              <div className="summary-icon total-icon">

                <i className="bi bi-people-fill"></i>

              </div>

              <div>

                <div className="summary-label">
                  Total Customers
                </div>

                <div className="summary-number">
                  {totalCustomers}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="col-md-4">

          <div className="card summary-card">

            <div className="card-body">

              <div className="summary-icon active-icon">

                <i className="bi bi-hourglass-split"></i>

              </div>

              <div>

                <div className="summary-label">
                  Activated / In Progress
                </div>

                <div className="summary-number">
                  {activeCustomers}
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* COMPLETED */}

        <div className="col-md-4">

          <div className="card summary-card">

            <div className="card-body">

              <div className="summary-icon completed-icon">

                <i className="bi bi-check-circle-fill"></i>

              </div>

              <div>

                <div className="summary-label">
                  Completed
                </div>

                <div className="summary-number">
                  {completedCustomers}
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-2">

            <div className="col-md-10">

              <input
                type="text"
                className="form-control"
                placeholder="Search by customer name, phone, laptop, issue or status"
                value={searchText}
                onChange={handleSearch}
              />

            </div>

            <div className="col-md-2">

              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={handleClear}
              >

                <i className="bi bi-x-circle me-2"></i>

                Clear

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RECORDS TABLE
      ====================================================== */}

      <div className="card shadow-sm">

        <div className="card-header bg-white">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1">
                Customer Service Records
              </h5>

              <small className="text-muted">
                Showing {filteredCustomers.length} record(s)
              </small>

            </div>

            <span className="badge bg-primary">
              {filteredCustomers.length}
            </span>

          </div>

        </div>


        <div className="card-body">


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
                Loading service records...
              </p>

            </div>

          ) : filteredCustomers.length === 0 ? (

            /* =================================================
               NO RECORDS
            ================================================== */

            <div className="text-center py-5">

              <i
                className="bi bi-folder-x"
                style={{
                  fontSize: "55px",
                  color: "#6c757d",
                }}
              ></i>

              <h5 className="mt-3">
                No Service Records Found
              </h5>

              <p className="text-muted">
                No records match your search.
              </p>

            </div>

          ) : (

            /* =================================================
               TABLE
            ================================================== */

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-light">

                  <tr>

                    <th>S.No</th>

                    <th>Customer Name</th>

                    <th>Phone Number</th>

                    <th>Laptop Type / Brand</th>

                    <th>Laptop Issue</th>

                    <th>Estimated Amount</th>

                    <th>Laptop Given to Client</th>

                    <th>Charger Given to Client</th>

                    <th>Submitted Date & Time</th>

                    <th>Final Amount</th>

                    <th>Laptop Given to Customer</th>

                    <th>Charger Given to Customer</th>

                    <th>Completed Date & Time</th>

                    <th>Status</th>

                    <th>Action</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredCustomers.map(
                    (customer, index) => (

                      <tr key={customer.id}>

                        {/* S.NO */}

                        <td>
                          {index + 1}
                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <strong>
                            {customer.customerName}
                          </strong>

                        </td>


                        {/* PHONE */}

                        <td>
                          {customer.phoneNumber}
                        </td>


                        {/* LAPTOP */}

                        <td>
                          {customer.laptopType}
                        </td>


                        {/* ISSUE */}

                        <td>
                          {customer.laptopIssue}
                        </td>


                        {/* ESTIMATED */}

                        <td>

                          {formatAmount(
                            customer.estimatedAmount
                          )}

                        </td>


                        {/* LAPTOP GIVEN TO CLIENT */}

                        <td>

                          {customer.laptopGivenToClient ===
                          "Yes" ? (

                            <span className="badge bg-success">
                              Yes
                            </span>

                          ) : (

                            <span className="badge bg-secondary">
                              No
                            </span>

                          )}

                        </td>


                        {/* CHARGER GIVEN TO CLIENT */}

                        <td>

                          {customer.chargerGivenToClient ===
                          "Yes" ? (

                            <span className="badge bg-success">
                              Yes
                            </span>

                          ) : (

                            <span className="badge bg-secondary">
                              No
                            </span>

                          )}

                        </td>


                        {/* SUBMITTED DATE */}

                        <td>

                          {customer.submittedDateTime ||
                            "-"}

                        </td>


                        {/* FINAL AMOUNT */}

                        <td>

                          {formatAmount(
                            customer.finalAmount
                          )}

                        </td>


                        {/* LAPTOP GIVEN TO CUSTOMER */}

                        <td>

                          {customer.laptopGivenToCustomer ? (

                            customer.laptopGivenToCustomer ===
                            "Yes" ? (

                              <span className="badge bg-success">
                                Yes
                              </span>

                            ) : (

                              <span className="badge bg-secondary">
                                No
                              </span>

                            )

                          ) : (

                            "-"

                          )}

                        </td>


                        {/* CHARGER GIVEN TO CUSTOMER */}

                        <td>

                          {customer.chargerGivenToCustomer ? (

                            customer.chargerGivenToCustomer ===
                            "Yes" ? (

                              <span className="badge bg-success">
                                Yes
                              </span>

                            ) : (

                              <span className="badge bg-secondary">
                                No
                              </span>

                            )

                          ) : (

                            "-"

                          )}

                        </td>


                        {/* COMPLETED DATE */}

                        <td>

                          {customer.completedDateTime ||
                            "-"}

                        </td>


                        {/* STATUS */}

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


                        {/* VIEW */}

                        <td>

                          <Link
                            to={`/view-customer/${customer.id}`}
                            className="btn btn-primary btn-sm"
                          >

                            <i className="bi bi-eye me-1"></i>

                            View

                          </Link>

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

export default ServiceRecords;