// AddPost.jsx
import React, { useState } from "react";
import { db, storage } from "../config/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAuth } from "../Contexts/authContext";
import { Link } from "react-router-dom";

const AddPost = ({ onNewPost }) => {
  const { userLoggedIn, currentUser } = useAuth();
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const displayName = currentUser?.displayName || "Anonymous";

  const handleTextChange = (e) => setPostText(e.target.value);
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAddingPost) return;

    setIsAddingPost(true);
    const postData = {
      title: displayName,
      content: postText,
      date: new Date().toISOString(),
      userId: currentUser.uid,
      userImage: currentUser.photoURL,
    };

    try {
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `postImages/${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Image upload error:", error);
              setErrorMessage("Failed to upload image.");
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                imageUrl = url;
                resolve();
              });
            }
          );
        });
      }

      const newPost = { ...postData, image: imageUrl };
      await addDoc(collection(db, "Posts"), newPost);

      onNewPost({ ...newPost });
      setPostText("");
      setImage(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding new post:", error);
      setErrorMessage("Failed to add post.");
    } finally {
      setIsAddingPost(false);
    }
  };

  return (
    <>
      {userLoggedIn ? (
        <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add New Post</h2>
          <form onSubmit={handleSubmit}>
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
                Image
              </label>
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              disabled={isAddingPost}
              className="w-full py-2 px-4 bg-cyan-400 text-white font-semibold rounded-md shadow-md hover:bg-cyan-600 transition duration-200"
            >
              {isAddingPost ? "Adding..." : "Post"}
            </button>
          </form>
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-col">
          <h1>You're Not Logged in..</h1>
          <Link to="/Login" className="text-cyan-600 focus:ring-cyan-500">
            Login Now!
          </Link>
        </div>
      )}
    </>
  );
};

export default AddPost;
