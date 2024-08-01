import React, { useState } from "react";
import Logo from "./../assets/Images/Logo.png";
import { MdSearch } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../config/firebase/auth";
import { useAuth } from "../Contexts/authContext/index";
import { FaChevronDown } from "react-icons/fa";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { IoCloseOutline } from "react-icons/io5";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") return;

    const postsQuery = query(
      collection(db, "Posts"),
      where("title", ">=", searchQuery),
      where("title", "<=", searchQuery + "\uf8ff")
    );

    const profilesQuery = query(
      collection(db, "users"),
      where("displayName", ">=", searchQuery),
      where("displayName", "<=", searchQuery + "\uf8ff")
    );

    try {
      const postsSnapshot = await getDocs(postsQuery);
      const posts = postsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const profilesSnapshot = await getDocs(profilesQuery);
      const profiles = profilesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      navigate(`/search?query=${searchQuery}`, { state: { posts, profiles } });
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#4a2c77] to-[#7f4f9b] text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img width={70} className="cursor-pointer" src={Logo} alt="Logo" />
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <Link to="/" className="hover:text-yellow-300 transition-colors">
            Home
          </Link>
          <Link
            to="/AboutUs"
            className="hover:text-yellow-300 transition-colors"
          >
            About Us
          </Link>
          <div className="relative">
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              className="text-white text-2xl transition-transform transform hover:scale-110"
            >
              <MdSearch />
            </button>
            <form
              onSubmit={handleSearch}
              className={`absolute top-full right-0 mt-2 bg-white text-black p-4 rounded-lg shadow-lg transition-transform ${
                searchVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-200%] opacity-0"
              } transition-all duration-300`}
            >
              <div className="flex items-center">
                <input
                  className="outline-none border-none flex-grow"
                  type="text"
                  placeholder="Search For Posts and Profiles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="text-blue-500 text-lg ml-2">
                  <MdSearch />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchVisible(false)}
                  className="text-red-500 text-lg ml-2"
                >
                  <IoCloseOutline />
                </button>
              </div>
            </form>
          </div>
          {userLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white hover:text-yellow-300"
              >
                {currentUser?.displayName || "Profile"}
                <FaChevronDown className="ml-2" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg border border-gray-300">
                  <Link
                    to={`/profile/${currentUser.uid}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:opacity-80 transition-opacity">
              <Link to="/login">LOGIN/REGISTER</Link>
            </button>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>
      {dropdownOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-r from-[#4a2c77] to-[#7f4f9b] text-white shadow-lg p-4 z-10">
          <Link
            to="/"
            className="block py-2 hover:text-yellow-300 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/AboutUs"
            className="block py-2 hover:text-yellow-300 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            About Us
          </Link>
          <div className="relative">
            <button
              onClick={() => setSearchVisible(!searchVisible)}
              className="text-white text-2xl transition-transform transform hover:scale-110"
            >
              <MdSearch />
            </button>
            <form
              onSubmit={handleSearch}
              className={`absolute top-full right-0 mt-2 bg-white text-black p-4 rounded-lg shadow-lg transition-transform ${
                searchVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[-200%] opacity-0"
              } transition-all duration-300`}
            >
              <div className="flex items-center">
                <input
                  className="outline-none border-none flex-grow"
                  type="text"
                  placeholder="Search For Posts and Profiles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="text-blue-500 text-lg ml-2">
                  <MdSearch />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchVisible(false)}
                  className="text-red-500 text-lg ml-2"
                >
                  <IoCloseOutline />
                </button>
              </div>
            </form>
          </div>
          {userLoggedIn ? (
            <>
              <Link
                to={`/profile/${currentUser.uid}`}
                className="block py-2 hover:text-yellow-300 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full py-2 hover:text-yellow-300 text-left transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setDropdownOpen(false)}
              className="block w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:opacity-80 transition-opacity"
            >
              <Link to="/login">LOGIN/REGISTER</Link>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
