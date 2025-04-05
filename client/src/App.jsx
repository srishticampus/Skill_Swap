
import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import Admin from "./components/pages/admin";
import About from "./components/pages/about";
import Layout from "./components/pages/layout";
import Contact from "./components/pages/contact";


function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      </Route>

    </Routes>
  );
}

export default App;
