import React, { useState } from "react";
import { useAuth } from "../Contexts/authContext";

const AddPost = ({ onNewPost }) => {
  const { userLoggedIn } = useAuth();

  const [postText, setPostText] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(""); // Assuming you want to allow adding an image

  const handleTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a new ID (you might want to handle IDs more robustly in a real app)
    const newId = Math.floor(Math.random() * 10000).toString();

    // Create a new post object
    const newPost = {
      id: newId,
      image: image || "", // Use provided image or empty string
      title: title,
      content: postText,
      date: new Date().toISOString(), // Assuming you want to add a timestamp
    };

    // Mock API call to add the new post
    // In a real app, replace this with your actual fetch call
    // Make sure your server/API can handle this format
    fetch("http://localhost:3000/Posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        onNewPost(newPost); // Notify parent component of new post
        setPostText(""); // Clear input after successful post
        setTitle(""); // Clear title input
        setImage(""); // Clear image input
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      {userLoggedIn ? (
        <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add New Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter title"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="postText"
                className="block text-sm font-medium text-gray-700"
              >
                Post Text
              </label>
              <textarea
                id="postText"
                rows="4"
                value={postText}
                onChange={handleTextChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="What's on your mind?"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                id="image"
                type="text"
                value={image}
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Optional: Enter image URL"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-cyan-400 text-white font-semibold rounded-md shadow-md hover:bg-cyan-600 transition duration-200"
            >
              Post
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
};

export default AddPost;
