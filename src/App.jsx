import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./Contexts/authContext";

import FlipTransition from "./Components/FlipTransition";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";

function App() {
  const location = useLocation();

  return (
    <FlipTransition location={location}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </FlipTransition>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}
