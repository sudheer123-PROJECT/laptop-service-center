import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import AddCustomer from "./pages/AddCustomer";
import SearchCustomer from "./pages/SearchCustomer";
import ViewCustomer from "./pages/ViewCustomer";
import CompleteService from "./pages/CompleteService";
import ServiceRecords from "./pages/ServiceRecords";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <Sidebar />

        <main className="main-content">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route
              path="/add-customer"
              element={<AddCustomer />}
            />

            <Route
              path="/search-customer"
              element={<SearchCustomer />}
            />

            <Route
              path="/view-customer/:id"
              element={<ViewCustomer />}
            />

            <Route
              path="/complete-service/:id"
              element={<CompleteService />}
            />

            <Route
              path="/service-records"
              element={<ServiceRecords />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;