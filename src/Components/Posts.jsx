import React, { useState, useEffect } from "react";
import { db, storage } from "../config/firebase.config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FaUser, FaRegHeart, FaHeart, FaEllipsisH } from "react-icons/fa";
import { useAuth } from "../Contexts/authContext";
import EditPostForm from "../Components/EditPost";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
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
            let userImageUrl = "/path/to/placeholder-image.jpg"; // Default image
            try {
              userImageUrl = await getDownloadURL(userImageRef);
            } catch (error) {
              console.error("Error fetching user image:", error);
            }

            const commentsWithUserImages = await Promise.all(
              (postData.comments || []).map(async (comment) => {
                const commentUserRef = doc(db, "users", comment.userId);
                const commentUserSnapshot = await getDoc(commentUserRef);
                const commentUserData = commentUserSnapshot.data();

                const commentUserImageRef = ref(
                  storage,
                  `profileImages/${comment.userId}`
                );
                let commentUserImageUrl = "/path/to/placeholder-image.jpg"; // Default image
                try {
                  commentUserImageUrl = await getDownloadURL(
                    commentUserImageRef
                  );
                } catch (error) {
                  console.error("Error fetching comment user image:", error);
                }

                return {
                  ...comment,
                  userImage: commentUserImageUrl,
                  displayName: commentUserData.displayName,
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
  }, []);

  const handleLike = async (postId, isLiked) => {
    const postRef = doc(db, "Posts", postId);
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser?.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser?.uid),
        });
      }
      setPosts((prevPosts) =>
        prevPosts?.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes?.filter((uid) => uid !== currentUser.uid)
                  : [...post?.likes, currentUser?.uid],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return; // Validate empty input

    const comment = {
      text: commentText,
      userId: currentUser?.uid,
      displayName: currentUser?.displayName,
      date: new Date().toISOString(),
    };

    try {
      const postRef = doc(db, "Posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: [...(post.comments || []), comment] };
        }
        return post;
      });
      setPosts(updatedPosts);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleSaveEdit = async (updatedPost) => {
    try {
      const postRef = doc(db, "Posts", updatedPost.id);
      await updateDoc(postRef, {
        content: updatedPost.content,
        image: updatedPost.img
          ? await uploadImage(updatedPost.img)
          : updatedPost.image,
      });
      setPosts(
        posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `postImages/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  };

  const handleEditPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    setEditingPost(postToEdit);
  };

  const handleCloseModal = () => {
    setEditingPost(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "Posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {posts.map((post) => {
        const isLiked = post.likes?.includes(currentUser.uid);

        return (
          <div
            key={post.id}
            className="bg-white shadow-lg rounded-lg p-4 mb-6 hover:shadow-xl transition-shadow relative border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row">
              {post.image && (
                <div className="flex-none w-full sm:w-1/2 overflow-hidden rounded-lg">
                  <img
                    className="w-full h-auto object-cover rounded-lg"
                    src={post.image}
                    alt={post.title}
                    onError={(e) => {
                      e.target.src = "/path/to/placeholder-image.jpg";
                      console.error("Image failed to load:", e.target.src);
                    }}
                  />
                </div>
              )}
              <div className="flex-1 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
                    <img
                      src={post?.userImage}
                      alt="ProfileImage"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {post.userId === currentUser.uid && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() =>
                          setShowDropdown(
                            showDropdown === post.id ? null : post.id
                          )
                        }
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <FaEllipsisH className="text-xl" />
                      </button>
                      {showDropdown === post.id && (
                        <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <button
                            onClick={() => handleEditPost(post.id)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="mb-4 text-gray-800">{post.content}</p>
                {post.comments && post.comments.length > 0 && (
                  <div className="mb-4">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full overflow-hidden">
                          <img
                            src={comment.userImage}
                            alt="CommentUserImage"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{comment.displayName}</p>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleLike(post.id, isLiked)}
                    className={`flex items-center gap-2 ${
                      isLiked ? "text-red-600" : "text-gray-600"
                    } hover:text-red-600 transition-colors`}
                  >
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => handleInputChange(post.id, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2"
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
            </div>
            {editingPost && editingPost.id === post.id && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
                  >
                    &times;
                  </button>
                  <EditPostForm
                    post={editingPost}
                    onSave={handleSaveEdit}
                    onClose={handleCloseModal}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
