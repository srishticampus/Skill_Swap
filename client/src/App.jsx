import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import HomePage from "./components/pages/home"; // Import the new HomePage component
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
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth
import ProtectedRoute from "./components/ProtectedRoute";
import MentorRequests from "./components/pages/admin/MentorRequests";
import CategoryManagement from "./components/pages/admin/CategoryManagement";
import ContactSubmissions from "./components/pages/admin/ContactSubmissions";
import SkillSwappersPage from "./components/pages/admin/SkillSwappersPage";
import SkillSwapperDetailsPage from "./components/pages/admin/SkillSwapperDetailsPage"; // Import the new component
import SwapRequestForm from "./components/pages/SwapRequestForm";
import SwapRequests from "./components/pages/SwapRequests";
import EditSwapRequest from "./components/pages/EditSwapRequest";
import ExchangeSkills from "./components/pages/ExchangeSkills";
import SwapRequestDetails from "./components/pages/SwapRequestDetails"; // Import the new component
import AddMember from "./components/pages/organization/add-member";
import ViewAllSwaps from "./components/pages/organization/ViewAllSwaps";
import ViewReviews from "./components/pages/organization/ViewReviews";
import Complaints from "./components/pages/organization/Complaints";
import OrganizationCategoryManagement from "./components/pages/organization/CategoryManagement"; // Import the new component
import OrganizationRequests from "./components/pages/admin/OrganizationRequests";
import Organizations from "./components/pages/admin/Organizations";
import OrganizationDetails from "./components/pages/admin/OrganizationDetails";
import OrganizationReviews from "./components/pages/admin/OrganizationReviews";
import AdminComplaints from "./components/pages/admin/complaints";
import SentSwapRequests from "./components/pages/SentSwapRequests";
import ReceivedSwapRequests from "./components/pages/ReceivedSwapRequests";
import ApprovedSwapRequests from "./components/pages/ApprovedSwapRequests";
import AddReview from "./components/pages/AddReview"; // Import the new component
import AddComplaint from "./components/pages/AddComplaint"; // Import the new component
import SwapRequestDetailsPage from "./components/pages/SwapRequestDetailsPage";

// Helper component to determine root page based on auth state
const RootRouteHandler = () => {
  const { token } = useAuth(); // Assuming 'token' indicates logged-in status
  return token ? <HomePage /> : <Landing />;
};


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RootRouteHandler />} /> {/* Use the handler for the root path */}
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
          <Route path="/sent-swap-requests" element={<SentSwapRequests />} />
          <Route path="/received-swap-requests" element={<ReceivedSwapRequests />} />
          <Route path="/edit-swap-request/:id" element={<EditSwapRequest />} />
          <Route path="/exchange-skills" element={<ExchangeSkills />} />
          <Route path="/exchange-skills/:id" element={<SwapRequestDetails />} /> {/* Add the route for details page */}
          <Route path="/approved-swap-requests" element={<ApprovedSwapRequests />} />
          <Route path="/swap-requests/:id" element={<SwapRequestDetailsPage />} />
          <Route path="/add-review/:userId" element={<AddReview />} /> {/* Add the route for add swap review page */}
          <Route path="/add-complaint" element={<AddComplaint />} /> {/* Add the route for add complaint page */}
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
          <Route path="/admin/organizations/details/:organizationId/reviews" element={<OrganizationReviews />} />
          <Route path="/admin/skill-swappers" element={<SkillSwappersPage />} />
          <Route path="/admin/skill-swappers/:id" element={<SkillSwapperDetailsPage />} /> {/* Add the new route for details */}
          <Route path="/admin/complaints" element={<AdminComplaints />} />
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
          <Route path="/organization/categories" element={<OrganizationCategoryManagement />} /> {/* Add the new route */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
