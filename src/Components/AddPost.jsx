// src/Components/AddPost.jsx
import React, { useState } from "react";
import { storage, db } from "../config/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../Contexts/authContext";

const AddPost = ({ onNewPost }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const { currentUser } = useAuth();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    if (content) {
      let imageURL = "";

      if (image) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `postImages/${Date.now()}_${image.name}`);
        try {
          await uploadBytes(imageRef, image);
          imageURL = await getDownloadURL(imageRef);
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }

      // Create a new post
      const newPost = {
        title: currentUser.displayName || "Anonymous",
        content,
        image: imageURL,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName,
        userImage: currentUser.photoURL || "",
        date: new Date().toISOString(),
        likes: [],
        comments: [],
      };

      // Add post to Firestore
      try {
        const docRef = await addDoc(collection(db, "Posts"), newPost);
        onNewPost({ ...newPost, id: docRef.id });
        setContent("");
        setImage(null);
      } catch (error) {
        console.error("Error adding post:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 text-white bg-cyan-400 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Add Post
      </button>
    </form>
  );
};

export default AddPost;
