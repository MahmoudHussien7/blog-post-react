import React from "react";
import { auth } from "./config/firebase.config";
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
import AddPost from "./Components/AddPost";
import Profile from "./Pages/Profile";
import SearchResults from "./Pages/SearchResults";
import AboutUs from "./Pages/AboutUs";

function App() {
  const location = useLocation();

  return (
    <FlipTransition location={location}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/AddPost" element={<AddPost />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/profile/:userId" element={<Profile />} />

        <Route path="/searchresults" element={<SearchResults />} />
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
