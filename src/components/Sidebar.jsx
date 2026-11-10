import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <i className="bi bi-laptop"></i>
        <h4>Laptop Service Center</h4>
      </div>

      <nav>
        <NavLink to="/" className="nav-item">
          <i className="bi bi-house"></i>
          Dashboard
        </NavLink>

        <NavLink to="/add-customer" className="nav-item">
          <i className="bi bi-person-plus"></i>
          Add Customer
        </NavLink>

        <NavLink to="/search-customer" className="nav-item">
          <i className="bi bi-search"></i>
          Search Customer
        </NavLink>

        <NavLink to="/service-records" className="nav-item">
          <i className="bi bi-file-earmark-text"></i>
          Service Records
        </NavLink>

        <NavLink to="/reports" className="nav-item">
          <i className="bi bi-bar-chart"></i>
          Reports
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;