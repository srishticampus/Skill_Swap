
import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import AdminLayout from "./components/pages/admin/layout";
import About from "./components/pages/about";
import Layout from "./components/pages/layout";
import Contact from "./components/pages/contact";
import Dashboard from "./components/pages/admin/dashboard";
import Signup from "./components/pages/signup";


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
