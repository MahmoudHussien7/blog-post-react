// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Posts from "../Components/Posts";
import Login from "../Pages/Login";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/authContext";
import AddPost from "../Components/AddPost";
import { FaPlus } from "react-icons/fa6";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/Posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        // console.log(data); // Log fetched data to check
      })
      .catch((error) => console.error("Error fetching the data", error));
  }, []);

  return (
    <>
      <Navbar className="sticky top-0" />
      <Posts post={posts} />
      {userLoggedIn ? (
        <Link
          to="/AddPost"
          className="fixed bottom-10 right-1 w-20 h-20 rounded-full bg-cyan-500 flex items-center justify-center"
        >
          <FaPlus />
        </Link>
      ) : null}
    </>
  );
}
