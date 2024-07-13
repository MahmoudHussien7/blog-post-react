// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Posts from "../Components/Posts";
import Login from "../Pages/Login";

export default function Home() {
  const [posts, setPosts] = useState([]);

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
      <Navbar />
      <Posts posts={posts} />
    </>
  );
}
