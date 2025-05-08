import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import AdminLayout from "./components/pages/admin/layout";
import About from "./components/pages/about";
import Layout from "./components/pages/layout";
import Contact from "./components/pages/contact";
import Dashboard from "./components/pages/admin/dashboard";
import Signup from "./components/pages/auth/signup";
import Login from "./components/pages/auth/login";
import ForgotPassword from "./components/pages/forgot-password";
import ResetPassword from "./components/pages/reset-password";
import UpdatePersonalInfo from "./components/pages/update-personal-info";
import AuthLanding from "./components/pages/landing/authLanding";
import ProfilePage from "./components/pages/profile/profile";
import UserManagement from "./components/pages/admin/UserManagement";
import Marketplace from "./components/pages/Marketplace";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MentorRequests from "./components/pages/admin/MentorRequests";
import CategoryManagement from "./components/pages/admin/CategoryManagement";
import ContactSubmissions from "./components/pages/admin/ContactSubmissions";
import SwapRequestForm from "./components/pages/SwapRequestForm";
import SwapRequests from "./components/pages/SwapRequests";
import EditSwapRequest from "./components/pages/EditSwapRequest";
import ExchangeSkills from "./components/pages/ExchangeSkills";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/update-personal-info" element={<UpdatePersonalInfo />} />
          <Route path="/authlanding" element={<AuthLanding />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/swap-request-form" element={<SwapRequestForm />} />
          <Route path="/swap-requests" element={<SwapRequests />} />
          <Route path="/edit-swap-request/:id" element={<EditSwapRequest />} />
          <Route path="/exchange-skills" element={<ExchangeSkills />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/mentor-requests" element={<MentorRequests />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/contact-submissions" element={<ContactSubmissions />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
