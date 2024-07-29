import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Posts from "../Components/Posts";
import Sidebar from "../Components/Sidebar";
import Skeleton from "../Components/Skeleton";
import { useAuth } from "../Contexts/authContext";
import { FaPlus } from "react-icons/fa";
import AddPost from "../Components/AddPost";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userLoggedIn } = useAuth();
  const [showAddPost, setShowAddPost] = useState(false);

  const toggleAddPost = () => setShowAddPost(!showAddPost);
  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowAddPost(false);
  };

  useEffect(() => {
    // Simulate fetching posts
    setTimeout(() => {
      setPosts([
        // Sample posts
        { id: 1, title: "Post 1", content: "Content 1" },
        { id: 2, title: "Post 2", content: "Content 2" },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar className="" />

      {userLoggedIn ? (
        <div className="flex flex-grow">
          <Sidebar />
          <div className="flex-grow p-6 lg:p-8 bg-white shadow-md rounded-lg m-4">
            {loading ? <Skeleton /> : <Posts post={posts} />}
            <button
              onClick={toggleAddPost}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full w-14 h-14 flex justify-center items-center cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <FaPlus className="text-3xl" />
            </button>
            {showAddPost && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
                  <button
                    onClick={toggleAddPost}
                    className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
                  >
                    &times;
                  </button>
                  <AddPost onNewPost={handleNewPost} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-teal-400">
          <img
            className="mask mask-heart mb-14"
            src="https://img.daisyui.com/images/stock/photo-1567653418876-5bb0e566e1c2.webp"
          />
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our Community
          </h1>

          <Link
            to="/login"
            className="bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg text-lg font-semibold transition-transform transform hover:scale-105 hover:bg-gray-100"
          >
            Login Now
          </Link>
        </div>
      )}
    </div>
  );
}
