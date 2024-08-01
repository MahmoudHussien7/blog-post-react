// src/Components/Posts.jsx
import React, { useState, useEffect, useCallback } from "react";
import { db, storage } from "../config/firebase.config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FaRegHeart, FaHeart, FaEllipsisV } from "react-icons/fa";
import { useAuth } from "../Contexts/authContext";
import Modal from "./Modal";
import EditPostForm from "./EditPost";

const Posts = React.memo(() => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const { currentUser } = useAuth();
  const postsListRef = collection(db, "Posts");

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsSnapshot = await getDocs(postsListRef);
        const postsWithUserImages = await Promise.all(
          postsSnapshot.docs.map(async (postDoc) => {
            const postData = postDoc.data();
            const userRef = doc(db, "users", postData.userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();

            const userImageRef = ref(
              storage,
              `profileImages/${postData.userId}`
            );
            let userImageUrl; // Default image
            try {
              userImageUrl = await getDownloadURL(userImageRef);
            } catch (error) {
              console.error(
                `Error fetching user image for ${postData?.userId}:`,
                error
              );
            }

            const commentsWithUserImages = await Promise.all(
              (postData.comments || []).map(async (comment) => {
                const commentUserRef = doc(db, "users", comment?.userId);
                const commentUserSnapshot = await getDoc(commentUserRef);
                const commentUserData = commentUserSnapshot.data();

                const commentUserImageRef = ref(
                  storage,
                  `profileImages/${comment?.userId}`
                );
                let commentUserImageUrl = "/path/to/placeholder-image.jpg"; // Default image
                try {
                  commentUserImageUrl = await getDownloadURL(
                    commentUserImageRef
                  );
                } catch (error) {
                  console.error(
                    `Error fetching comment user image for ${comment?.userId}:`,
                    error
                  );
                }

                return {
                  ...comment,
                  userImage: commentUserImageUrl,
                  displayName: commentUserData?.displayName,
                };
              })
            );

            return {
              ...postData,
              id: postDoc.id,
              userImage: userImageUrl,
              userDisplayName: userData.displayName,
              comments: commentsWithUserImages,
            };
          })
        );
        postsWithUserImages.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(postsWithUserImages);
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    getPosts();
  }, [posts]);

  const handleLike = async (postId, isLiked) => {
    const postRef = doc(db, "Posts", postId);
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
      }
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((uid) => uid !== currentUser.uid)
                  : [...post.likes, currentUser.uid],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    const comment = {
      text: commentText,
      userId: currentUser?.uid,
      displayName: currentUser?.displayName,
      userImage:
        currentUser?.photoURL ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      date: new Date().toISOString(),
    };

    try {
      const postRef = doc(db, "Posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleEdit = async (postId, newContent, newImage) => {
    const postRef = doc(db, "Posts", postId);
    try {
      const updatedPost = { content: newContent, edited: true };

      if (newImage) {
        const imageRef = ref(storage, `postImages/${postId}/${newImage.name}`);
        await uploadBytes(imageRef, newImage);
        const newImageUrl = await getDownloadURL(imageRef);
        updatedPost.image = newImageUrl;
      }

      await updateDoc(postRef, updatedPost);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                content: newContent,
                image: updatedPost.image || post.image,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleDelete = async (postId) => {
    const postRef = doc(db, "Posts", postId);
    try {
      await deleteDoc(postRef);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {posts?.map((post) => {
        const isLiked = post.likes?.includes(currentUser.uid);
        const isAuthor = post.userId === currentUser.uid;

        return (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-4 mb-6 hover:shadow-lg transition-shadow relative border border-gray-200 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src={post?.image}
                    alt={post?.title}
                    onError={(e) => {
                      e.target.src = "/path/to/placeholder-image.jpg";
                      console.error("Image failed to load:", e.target.src);
                    }}
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {post.userDisplayName}
                  </h2>
                  <p className="text-gray-600">
                    {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(post.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaEllipsisV />
                  </button>
                  {dropdownOpen[post.id] && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={() => setEditMode(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            {post.image && (
              <div className="w-full h-60 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-4 relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-contain"
                  // onError={(e) => {
                  //   e.target.src =
                  //     "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                  //   console.error("Post image failed to load:", e.target.src);
                  // }}
                />
              </div>
            )}
            <p className="text-gray-800 mb-4">{post.content}</p>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => handleLike(post.id, isLiked)}
                className={`text-2xl ${
                  isLiked ? "text-red-500" : "text-gray-400"
                } hover:text-red-500 transition-colors`}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
              <span>{post.likes?.length || 0}</span>
            </div>
            {post.comments?.length > 0 && (
              <div className="mb-4 max-h-40 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800">
                  Comments
                </h3>
                {post.comments?.map((comment, index) => (
                  <div key={index} className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
                      <img
                        src={comment.userImage || ""}
                        alt="CommentUserImage"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.displayName}
                      </p>
                      <p className="text-gray-700">{comment.text}</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(comment.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleInputChange(post.id, e.target.value)}
                className="flex-grow border border-gray-300 rounded-lg p-2"
              />
              <button
                onClick={() =>
                  handleAddComment(post.id, commentInputs[post.id])
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Comment
              </button>
            </div>
          </div>
        );
      })}
      <Modal isOpen={editMode !== null} onClose={() => setEditMode(null)}>
        {editMode && (
          <EditPostForm
            post={editMode}
            onSave={(updatedPost) => {
              handleEdit(updatedPost.id, updatedPost.content, updatedPost.img);
              setEditMode(null);
            }}
            onClose={() => setEditMode(null)}
          />
        )}
      </Modal>
    </div>
  );
});

export default Posts;
