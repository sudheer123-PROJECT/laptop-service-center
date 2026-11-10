import { useState } from "react";

import Notification from "../components/Notification";
import API from "../services/api";


function AddCustomer() {

  // =========================================================
  // NOTIFICATION
  // =========================================================

  const [notification, setNotification] = useState("");

  // =========================================================
  // LOADING
  // =========================================================

  const [loading, setLoading] = useState(false);

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    laptopType: "",
    laptopIssue: "",
    estimatedAmount: "",
    laptopGivenToClient: "Yes",
    chargerGivenToClient: "Yes",
  });

  // =========================================================
  // OTHER LAPTOP TYPE
  // =========================================================

  const [otherLaptopType, setOtherLaptopType] = useState("");


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Clear custom laptop type
    // when user selects another brand
    if (
      name === "laptopType" &&
      value !== "Other"
    ) {

      setOtherLaptopType("");

    }
  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {

    setFormData({
      customerName: "",
      phoneNumber: "",
      laptopType: "",
      laptopIssue: "",
      estimatedAmount: "",
      laptopGivenToClient: "Yes",
      chargerGivenToClient: "Yes",
    });

    setOtherLaptopType("");
  };


  // =========================================================
  // SUBMIT CUSTOMER TO FASTAPI
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // -------------------------------------------------------
    // CUSTOMER NAME VALIDATION
    // -------------------------------------------------------

    if (
      formData.customerName.trim().length < 2
    ) {

      setNotification(
        "Please enter a valid customer name."
      );

      return;
    }


    // -------------------------------------------------------
    // PHONE NUMBER VALIDATION
    // -------------------------------------------------------

    if (
      !/^[0-9]{10}$/.test(
        formData.phoneNumber
      )
    ) {

      setNotification(
        "Please enter a valid 10-digit phone number."
      );

      return;
    }


    // -------------------------------------------------------
    // LAPTOP TYPE VALIDATION
    // -------------------------------------------------------

    if (!formData.laptopType) {

      setNotification(
        "Please select laptop type / brand."
      );

      return;
    }


    // -------------------------------------------------------
    // OTHER LAPTOP TYPE
    // -------------------------------------------------------

    let finalLaptopType =
      formData.laptopType;

    if (
      formData.laptopType === "Other"
    ) {

      if (!otherLaptopType.trim()) {

        setNotification(
          "Please enter the laptop brand / type."
        );

        return;
      }

      finalLaptopType =
        otherLaptopType.trim();
    }


    // -------------------------------------------------------
    // LAPTOP ISSUE VALIDATION
    // -------------------------------------------------------

    if (
      !formData.laptopIssue.trim()
    ) {

      setNotification(
        "Please enter the laptop issue."
      );

      return;
    }


    // -------------------------------------------------------
    // ESTIMATED AMOUNT VALIDATION
    // -------------------------------------------------------

    if (
      !formData.estimatedAmount ||
      Number(formData.estimatedAmount) <= 0
    ) {

      setNotification(
        "Please enter a valid estimated amount."
      );

      return;
    }


    // =======================================================
    // DATA TO SEND TO FASTAPI
    // =======================================================

    const customerData = {

      customerName:
        formData.customerName.trim(),

      phoneNumber:
        formData.phoneNumber,

      laptopType:
        finalLaptopType,

      laptopIssue:
        formData.laptopIssue.trim(),

      estimatedAmount:
        Number(formData.estimatedAmount),

      laptopGivenToClient:
        formData.laptopGivenToClient,

      chargerGivenToClient:
        formData.chargerGivenToClient,
    };


    console.log(
      "Sending customer to FastAPI:",
      customerData
    );


    // =======================================================
    // API REQUEST
    // =======================================================

    try {

      setLoading(true);

      const response =
        await API.post(
          "/customers",
          customerData
        );


      console.log(
        "FastAPI response:",
        response.data
      );


      // =====================================================
      // SUCCESS
      // =====================================================

      if (
        response.data?.status === "success"
      ) {

        setNotification(
          "Customer details submitted successfully!"
        );

        resetForm();

      } else {

        setNotification(
          "Customer could not be saved."
        );

      }

    }

    // ========================================================
    // API ERROR
    // ========================================================

    catch (error) {

      console.error(
        "Customer API Error:",
        error
      );


      // FastAPI validation error
      if (
        error.response?.status === 422
      ) {

        setNotification(
          "Invalid customer data. Please check the form."
        );

      }

      // FastAPI server error
      else if (
        error.response?.status === 500
      ) {

        setNotification(
          "Server error. Customer was not saved."
        );

      }

      // Backend not running / connection error
      else if (
        error.request &&
        !error.response
      ) {

        setNotification(
          "Cannot connect to FastAPI. Make sure the backend is running."
        );

      }

      // Other errors
      else {

        setNotification(
          "Something went wrong. Please try again."
        );

      }

    }

    finally {

      setLoading(false);

    }
  };


  // =========================================================
  // CLEAR BUTTON
  // =========================================================

  const handleClear = () => {

    resetForm();

    setNotification("");

  };


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="customer-page">


      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-header">

        <h1 className="page-title">
          Add Customer Details
        </h1>

        <p className="text-muted">
          Enter customer and laptop service information
        </p>

      </div>


      {/* =====================================================
          FORM CARD
      ====================================================== */}

      <div className="card shadow-sm customer-form-card">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">


              {/* =================================================
                  CUSTOMER NAME
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Customer Name{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  name="customerName"
                  className="form-control"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>


              {/* =================================================
                  PHONE NUMBER
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Phone Number{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  disabled={loading}
                />

              </div>


              {/* =================================================
                  LAPTOP TYPE / BRAND
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Laptop Type / Brand{" "}

                  <span className="required">
                    *
                  </span>

                </label>


                <select
                  name="laptopType"
                  className="form-select"
                  value={formData.laptopType}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="">
                    Select Laptop Brand
                  </option>

                  <option value="Dell">
                    Dell
                  </option>

                  <option value="HP">
                    HP
                  </option>

                  <option value="Lenovo">
                    Lenovo
                  </option>

                  <option value="Asus">
                    Asus
                  </option>

                  <option value="Acer">
                    Acer
                  </option>

                  <option value="MSI">
                    MSI
                  </option>

                  <option value="Apple">
                    Apple
                  </option>

                  <option value="Samsung">
                    Samsung
                  </option>

                  <option value="Microsoft">
                    Microsoft
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>


                {/* CUSTOM OTHER INPUT */}

                {formData.laptopType ===
                  "Other" && (

                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Enter laptop brand / type"
                    value={otherLaptopType}
                    onChange={(e) =>
                      setOtherLaptopType(
                        e.target.value
                      )
                    }
                    disabled={loading}
                  />

                )}

              </div>


              {/* =================================================
                  LAPTOP ISSUE
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Laptop Issue{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  name="laptopIssue"
                  className="form-control"
                  placeholder="Example: Not turning on"
                  value={formData.laptopIssue}
                  onChange={handleChange}
                  disabled={loading}
                />

              </div>


              {/* =================================================
                  ESTIMATED AMOUNT
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Estimated Amount{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <input
                  type="number"
                  name="estimatedAmount"
                  className="form-control"
                  placeholder="Enter estimated amount"
                  value={formData.estimatedAmount}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                />

              </div>


              {/* =================================================
                  LAPTOP GIVEN TO CLIENT
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Laptop Given to Client{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <select
                  name="laptopGivenToClient"
                  className="form-select"
                  value={
                    formData.laptopGivenToClient
                  }
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="Yes">
                    Yes
                  </option>

                  <option value="No">
                    No
                  </option>

                </select>

              </div>


              {/* =================================================
                  CHARGER GIVEN TO CLIENT
              ================================================== */}

              <div className="col-md-6 mb-3">

                <label className="form-label">

                  Charger Given to Client{" "}

                  <span className="required">
                    *
                  </span>

                </label>

                <select
                  name="chargerGivenToClient"
                  className="form-select"
                  value={
                    formData.chargerGivenToClient
                  }
                  onChange={handleChange}
                  disabled={loading}
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
                BUTTONS
            ================================================== */}

            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>

                    Saving...

                  </>

                ) : (

                  <>
                    <i className="bi bi-check-circle me-2"></i>

                    Submit
                  </>

                )}

              </button>


              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={loading}
              >

                <i className="bi bi-arrow-counterclockwise me-2"></i>

                Clear

              </button>

            </div>

          </form>

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

export default AddCustomer;