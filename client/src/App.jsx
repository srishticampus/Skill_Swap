
import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";
import Admin from "./components/pages/admin";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
