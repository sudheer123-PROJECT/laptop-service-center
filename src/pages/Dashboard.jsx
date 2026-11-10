import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div>
      <h1 className="page-title">
        Laptop Service Center
      </h1>

      <p className="text-muted">
        Customer Service Management Dashboard
      </p>

      <div className="row g-4 mt-3">

        <div className="col-md-4">
          <Link
            to="/add-customer"
            className="dashboard-card customer-card"
          >
            <i className="bi bi-person-plus-fill"></i>

            <h4>Add Customer</h4>

            <p>
              Add customer and laptop service details
            </p>
          </Link>
        </div>

        <div className="col-md-4">
          <Link
            to="/search-customer"
            className="dashboard-card search-card"
          >
            <i className="bi bi-search"></i>

            <h4>Search Customer</h4>

            <p>
              Search using customer name or phone number
            </p>
          </Link>
        </div>

        <div className="col-md-4">
          <Link
            to="/service-records"
            className="dashboard-card service-card"
          >
            <i className="bi bi-file-earmark-text"></i>

            <h4>Service Records</h4>

            <p>
              View completed and active service records
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;