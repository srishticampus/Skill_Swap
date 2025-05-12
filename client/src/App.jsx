import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import AdminLayout from "./components/pages/admin/layout";
import Organization from "./components/pages/organization/layout";
import About from "./components/pages/about";
import Layout from "./components/pages/layout";
import Contact from "./components/pages/contact";
import AdminDashboard from "./components/pages/admin/dashboard";
import OrganizationDashboard from "./components/pages/organization/dashboard";
import OrganizationProfile from "./components/pages/organization/profile";
import OrganizationMembers from "./components/pages/organization/members";
import MemberDetails from "./components/pages/organization/member-details";
import Signup from "./components/pages/auth/signup";
import Login from "./components/pages/auth/login";
import OrgLogin from "./components/pages/auth/OrgLogin";
import OrgSignup from "./components/pages/auth/OrgSignup";
import OrgForgotPassword from "./components/pages/auth/OrgForgotPassword";
import OrgResetPassword from "./components/pages/auth/OrgResetPassword";
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
import AddMember from "./components/pages/organization/add-member";
import ViewAllSwaps from "./components/pages/organization/ViewAllSwaps";
import ViewReviews from "./components/pages/organization/ViewReviews";
import Complaints from "./components/pages/organization/Complaints";
import OrganizationRequests from "./components/pages/admin/OrganizationRequests";
import Organizations from "./components/pages/admin/Organizations";
import OrganizationDetails from "./components/pages/admin/OrganizationDetails";
import OrganizationReviews from "./components/pages/admin/OrganizationReviews";

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
          <Route path="/organization/signup" element={<OrgSignup />} />
          <Route path="/organization/login" element={<OrgLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/organization/forgot-password" element={<OrgForgotPassword />} />
          <Route path="/organization/reset-password/:token" element={<OrgResetPassword />} />
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
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/mentor-requests" element={<MentorRequests />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/contact-submissions" element={<ContactSubmissions />} />
          <Route path="/admin/organization-requests" element={<OrganizationRequests />} />
          <Route path="/admin/organizations" element={<Organizations />} />
          <Route path="/admin/organizations/details/:id" element={<OrganizationDetails />} />
          <Route path="/admin/organizations/details/:id/reviews" element={<OrganizationReviews />} />
        </Route>
        <Route path="/organization" element={<Organization />}>
          <Route index element={<OrganizationDashboard />} />
          <Route path="/organization/profile" element={<OrganizationProfile />} />
          <Route path="/organization/members" element={<OrganizationMembers />} />
          <Route path="/organization/members/details/:id" element={<MemberDetails />} />
          <Route path="/organization/members/add" element={<AddMember />} />
          <Route path="/organization/swaps" element={<ViewAllSwaps />} />
          <Route path="/organization/reviews" element={<ViewReviews />} />
          <Route path="/organization/complaints" element={<Complaints />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
