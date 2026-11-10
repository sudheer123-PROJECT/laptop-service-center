import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";
import Notification from "../components/Notification";


function SearchCustomer() {

  // =========================================================
  // STATE
  // =========================================================

  const [searchText, setSearchText] = useState("");

  const [customers, setCustomers] = useState([]);

  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState("");


  // =========================================================
  // LOAD ALL CUSTOMERS WHEN PAGE OPENS
  // =========================================================

  useEffect(() => {
    loadAllCustomers();
  }, []);


  // =========================================================
  // GET ALL CUSTOMERS FROM FASTAPI
  // =========================================================

  const loadAllCustomers = async () => {

    try {

      setLoading(true);

      setNotification("");

      const response = await API.get("/customers");

      console.log(
        "GET /customers response:",
        response.data
      );

      const customerList =
        response.data?.customers || [];

      setCustomers(customerList);

      setSearchResults(customerList);

    } catch (error) {

      console.error(
        "Load customers error:",
        error
      );

      setNotification(
        "Unable to load customer records. Make sure FastAPI is running."
      );

      setCustomers([]);

      setSearchResults([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // SEARCH CUSTOMER FROM FASTAPI
  // =========================================================

  const handleSearch = async () => {

    const value = searchText.trim();

    // Empty search → get all customers
    if (!value) {

      await loadAllCustomers();

      return;
    }

    try {

      setLoading(true);

      setNotification("");

      const response =
        await API.get("/customers/search", {
          params: {
            query: value,
          },
        });

      console.log(
        "Search response:",
        response.data
      );

      const customerList =
        response.data?.customers || [];

      setSearchResults(customerList);

      // If no results
      if (customerList.length === 0) {

        setNotification(
          "No customer found."
        );

      }

    } catch (error) {

      console.error(
        "Search customer error:",
        error
      );

      setNotification(
        "Unable to search customer. Please check the backend."
      );

      setSearchResults([]);

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      handleSearch();

    }

  };


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClear = () => {

    setSearchText("");

    setNotification("");

    loadAllCustomers();

  };


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {

    setSearchText("");

    setNotification("");

    loadAllCustomers();

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
  // UI
  // =========================================================

  return (

    <div className="search-page">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">

        <div className="d-flex justify-content-between align-items-center">

          <div>

            <h1 className="page-title">
              Search Customer
            </h1>

            <p className="text-muted">
              Search customer using name or phone number
            </p>

          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleRefresh}
            disabled={loading}
          >

            <i className="bi bi-arrow-clockwise me-2"></i>

            Refresh

          </button>

        </div>

      </div>


      {/* =====================================================
          SEARCH CARD
      ====================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-2">

            {/* SEARCH INPUT */}

            <div className="col-md-9">

              <input
                type="text"
                className="form-control search-input"
                placeholder="Enter customer name or phone number"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

            </div>


            {/* SEARCH BUTTON */}

            <div className="col-md-1">

              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleSearch}
                disabled={loading}
                title="Search"
              >

                {loading ? (

                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>

                ) : (

                  <i className="bi bi-search"></i>

                )}

              </button>

            </div>


            {/* CLEAR BUTTON */}

            <div className="col-md-1">

              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={handleClear}
                disabled={loading}
                title="Clear Search"
              >

                <i className="bi bi-x-circle"></i>

              </button>

            </div>


            {/* REFRESH BUTTON */}

            <div className="col-md-1">

              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={handleRefresh}
                disabled={loading}
                title="Refresh"
              >

                <i className="bi bi-arrow-clockwise"></i>

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CUSTOMER RECORDS
      ====================================================== */}

      <div className="card shadow-sm">

        <div className="card-header bg-white">

          <div className="d-flex justify-content-between align-items-center">

            <div>

              <h5 className="mb-1">
                Customer Records
              </h5>

              <small className="text-muted">

                Total Records: {searchResults.length}

              </small>

            </div>


            <span className="badge bg-primary">

              {searchResults.length}

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

              <p className="mt-3 text-muted">
                Loading customer records...
              </p>

            </div>

          ) : searchResults.length === 0 ? (

            /* =================================================
               NO CUSTOMER
            ================================================== */

            <div className="text-center py-5">

              <i
                className="bi bi-person-x"
                style={{
                  fontSize: "55px",
                  color: "#6c757d",
                }}
              ></i>

              <h5 className="mt-3">
                No Customer Found
              </h5>

              <p className="text-muted">
                No customer matches your search.
              </p>

            </div>

          ) : (

            /* =================================================
               CUSTOMER TABLE
            ================================================== */

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">

                  <tr>

                    <th>S.No</th>

                    <th>Customer Name</th>

                    <th>Phone Number</th>

                    <th>Laptop Type / Brand</th>

                    <th>Laptop Issue</th>

                    <th>Estimated Amount</th>

                    <th>Submitted Date & Time</th>

                    <th>Status</th>

                    <th>Action</th>

                  </tr>

                </thead>


                <tbody>

                  {searchResults.map(
                    (customer, index) => (

                      <tr key={customer.id}>

                        {/* S.NO */}

                        <td>
                          {index + 1}
                        </td>


                        {/* CUSTOMER NAME */}

                        <td>

                          <strong>
                            {customer.customerName}
                          </strong>

                        </td>


                        {/* PHONE */}

                        <td>
                          {customer.phoneNumber}
                        </td>


                        {/* LAPTOP TYPE */}

                        <td>
                          {customer.laptopType}
                        </td>


                        {/* LAPTOP ISSUE */}

                        <td>
                          {customer.laptopIssue}
                        </td>


                        {/* ESTIMATED AMOUNT */}

                        <td>
                          {formatAmount(
                            customer.estimatedAmount
                          )}
                        </td>


                        {/* SUBMITTED DATE */}

                        <td>

                          {customer.submittedDateTime ||
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

export default SearchCustomer;