import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfile from "./pages/UserProfile";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard.jsx";
import Users from "./pages/Users.jsx";
import Roles from "./pages/Roles";
import Campuses from "./pages/Campuses";
import Countries from "./pages/Countries";
import Constituencies from "./pages/Constituencies";
import SubLocations from "./pages/SubLocations";
import Wards from "./pages/Wards";
import Universities from "./pages/Universities";
import Villages from "./pages/Villages";
import Counties from "./pages/Counties";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import { PublicRoutes } from "./utils/PublicRoutes";
import ResetPassword from "./pages/ResetPassword";
import Locations from "./pages/Locations";
import Pos from "./pages/Pos.jsx";
import PosTypes from "./pages/PosTypes";
import NotFound from "./pages/NotFound.jsx";
import Customers from "./pages/Customers";
import Register from "./pages/Register.jsx";
import Merchants from "./pages/Merchants";
import Accounts from "./pages/Accounts";
import LoanManagement from "./pages/Loan";
import MerchantRegistration from "./pages/MerchantRegistration.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/"
          element={
            <PublicRoutes>
              <Signin />
            </PublicRoutes>
          }
        />
        {/* register is for admin to use to register for testing*/}
        <Route
          path="/register"
          element={
            <PublicRoutes>
              {" "}
              <Register />{" "}
            </PublicRoutes>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoutes>
              <ForgotPassword />
            </PublicRoutes>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoutes>
              <VerifyOtp />
            </PublicRoutes>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoutes>
              <ResetPassword />
            </PublicRoutes>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoutes>
              <MainLayout />
            </PrivateRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <PublicRoutes>
              
              <Signin />
            </PublicRoutes>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoutes>
              {" "}
              <ForgotPassword />{" "}
            </PublicRoutes>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoutes>
              {" "}
              <VerifyOtp />{" "}
            </PublicRoutes>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoutes>
              {" "}
              <ResetPassword />
            </PublicRoutes>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoutes>
              {" "}
              <MainLayout />
            </PrivateRoutes>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user-profile" element={<UserProfile />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="customers" element={<Customers />} />
          <Route path="countries" element={<Countries />} />
          <Route path="counties" element={<Counties />} />
          <Route path="constituencies" element={<Constituencies />} />
          <Route path="location" element={<Locations />} />
          <Route path="sub-locations" element={<SubLocations />} />
          <Route path="wards" element={<Wards />} />
          <Route path="villages" element={<Villages />} />
          <Route path="universities" element={<Universities />} />
          <Route path="campuses" element={<Campuses />} />
          <Route path="pos-types" element={<PosTypes />} />
          <Route path="pos" element={<Pos />} />
          <Route path="merchants" element={<Merchants />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="loans" element={<LoanManagement />} />
          <Route
            path="loans/merchants/create-merchant"
            element={<MerchantRegistration mode="create" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
