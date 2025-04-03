import { useState } from "react";
import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router";

import Landing from "./components/pages/landing";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
    </Routes>
  );
}

export default App;
