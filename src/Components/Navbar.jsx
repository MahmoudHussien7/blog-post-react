// eslint-disable-next-line no-unused-vars
import React from "react";
import Logo from "./../assets/Images/Logo.png";
import { MdSearch } from "react-icons/md";
import Login from "../Pages/Login";
import { Link } from "react-router-dom";
import Home from "../Pages/Home";

function Navbar() {
  return (
    <>
      <div className="flex justify-between items-center shadow-lg p-4">
        <Link to="/">
          {" "}
          <img width={70} className="cursor-pointer" src={Logo} />
        </Link>

        <div className="bg-white shadow-lg py-4 px-16 rounded-lg flex items-center">
          <MdSearch className="text-[20px] text-gray-500" />
          <input
            className="outline-none"
            type="text"
            placeholder="Search For Posts"
          />
        </div>

        <button className="ml-2 rounded-xl bg-cyan-400 p-3 hover:bg-purple-200 transition-all">
          <Link to="/Login">LOGIN/REGISTER</Link>
        </button>
      </div>
    </>
  );
}

export default Navbar;
