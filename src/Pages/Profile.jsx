// src/pages/Profile.jsx

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/authContext";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../config/firebase.config";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        setUser(userSnapshot.data());
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }, []);

  const fetchUserPosts = useCallback(async () => {
    try {
      const postsQuery = query(
        collection(db, "Posts"),
        where("userId", "==", userId)
      );
      const postsSnapshot = await getDocs(postsQuery);
      const userPosts = postsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }, [userId]);

  const fetchUserImage = useCallback(async () => {
    try {
      const imageRef = ref(storage, `avatars/${userId}`);
      const url = await getDownloadURL(imageRef);
      setUserImage(url);
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
    fetchUserProfile();
    fetchUserPosts();
    fetchUserImage();
  }, [
    fetchUserProfile,
    fetchUserPosts,
    fetchUserImage,
    userId,
    currentUser,
    navigate,
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateUserImageInPostsAndComments = async (newImageUrl) => {
    try {
      // Fetch all posts from the database
      const postsSnapshot = await getDocs(collection(db, "Posts"));
      postsSnapshot.forEach(async (postDoc) => {
        const postData = postDoc.data();
        console.log("hassan hendawy: ", postData);
        let updateRequired = false;

        // Update user image in the post if the post author matches
        if (postData.userId === currentUser.uid) {
          updateRequired = true;
          postData.userImage = newImageUrl;
        }

        // Update user image in the comments if the commenter matches
        if (postData.comments) {
          postData.comments = postData.comments.map((comment) => {
            if (comment.userId === currentUser.uid) {
              updateRequired = true;
              return { ...comment, userImage: newImageUrl };
            }
            return comment;
          });
        }

        // If any update is required, update the post document
        if (updateRequired) {
          await updateDoc(doc(db, "Posts", postDoc.id), {
            ...postData,
            userImage: postData.userImage, // Ensure we do not change post image
            comments: postData.comments,
          });
        }
      });
    } catch (error) {
      console.error(
        "Error updating posts and comments with new image URL:",
        error
      );
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageRef = ref(storage, `avatars/${currentUser.uid}`);

    try {
      // Fetch the user's current photoURL from Firestore
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const oldImageUrl = userDoc.data().photoURL;

        // If there is an old image, delete it from storage
        if (oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef).catch((error) => {
            console.warn("Error deleting old image: ", error);
          });
        }
      }

      // Upload the new image
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setUserImage(url);

      // Update the user's photoURL in Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        photoURL: url,
      });

      // Update the user's image in posts and comments
      await updateUserImageInPostsAndComments(url);

      setUploading(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    const postRef = doc(db, "Posts", postId);
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(currentUser.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(currentUser.uid),
      });
    }
  };

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500 mr-6 relative">
              <img
                className="w-full h-full object-cover"
                src={userImage}
                alt="Profile"
              />
              {currentUser?.uid === userId && (
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                  Uploading...
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.displayName}
              </h1>
              <p className="text-lg text-gray-600">{user.email}</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            My Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => {
                const isLiked = post.likes?.includes(currentUser?.uid);
                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {post.image && (
                      <img
                        className="w-full h-48 object-cover"
                        src={post.image}
                        alt={post.title}
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-700">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mt-2">{post?.content}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-4">
                        <button
                          onClick={() => handleLike(post.id, isLiked)}
                          className={`flex items-center ${
                            isLiked ? "text-red-500" : "text-gray-500"
                          } hover:text-red-500`}
                        >
                          {isLiked ? <FaHeart /> : <FaRegHeart />}{" "}
                          <span className="ml-1">{post.likes?.length}</span>
                        </button>
                      </div>
                      <button
                        onClick={() => openModal(post)}
                        className="mt-2 text-cyan-500 hover:text-cyan-700"
                      >
                        View Comments
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600">No posts yet.</p>
            )}
          </div>
        </div>
      </div>

      {selectedPost && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          contentLabel="Post Details"
          className="flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedPost.title}
            </h2>
            <p className="text-gray-600 mt-2">{selectedPost.content}</p>
            {selectedPost.image && (
              <img
                className="w-full h-60 md:h-80 lg:h-96 object-contain mt-4"
                src={selectedPost.image}
                alt={selectedPost.title}
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-800">Comments</h3>
              {selectedPost.comments?.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {selectedPost.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 mt-4 max-w-md"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
                        <img
                          src={
                            comment.userImage ||
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                          }
                          alt="UserImage"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {comment.displayName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleString()}
                        </span>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No comments yet.</p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 text-cyan-500 hover:text-cyan-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
