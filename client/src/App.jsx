
import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import AdminLayout from "./components/pages/admin/layout";
import About from "./components/pages/about";
import Layout from "./components/pages/layout";
import Contact from "./components/pages/contact";
import Dashboard from "./components/pages/admin/dashboard";
import Signup from "./components/pages/signup";
import Login from "./components/pages/login";
import ForgotPassword from "./components/pages/forgot-password";
import ResetPassword from "./components/pages/reset-password";
import UpdatePersonalInfo from "./components/pages/update-personal-info";
import AuthLanding from "./components/pages/landing/authLanding";
import ProfilePage from "./components/pages/profile";


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-personal-info" element={<UpdatePersonalInfo />} />
        <Route path="/authlanding" element={<AuthLanding />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
