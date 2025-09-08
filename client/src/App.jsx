import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import HomePage from "./components/pages/home"; // Import the new HomePage component
import Organization from "./components/pages/organization/layout";
import About from "./components/pages/about";
import Layout from "./components/pages/layout";
import Contact from "./components/pages/contact";
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
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth
import ProtectedRoute from "./components/ProtectedRoute";
import ViewUserProfile from "./components/pages/profile/ViewUserProfile";
import AISkillMatching from "./components/pages/learn-more/AISkillMatching";
import RealtimeChat from "./components/pages/learn-more/RealtimeChat";
import ProgressTracking from "./components/pages/learn-more/ProgressTracking";

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
          <Route path="/learn-more/ai-skill-matching" element={<AISkillMatching />} />
          <Route path="/learn-more/realtime-chat" element={<RealtimeChat />} />
          <Route path="/learn-more/progress-tracking" element={<ProgressTracking />} />
        </Route>
        <Route path="/organization" element={<Organization />}>
          <Route path="/organization/users/:id" element={<ProtectedRoute><ViewUserProfile /></ProtectedRoute>} /> {/* New route for general user profile details */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
