// eslint-disable-next-line no-unused-vars
import React from "react";
import AddPost from "./AddPost";

export default function Posts(props) {
  // eslint-disable-next-line react/prop-types
  const { post } = props;
  return (
    <>
      {/* <AddPost onNewPost={handleNewPost} /> */}
      {post.map((post) => (
        <div
          key={post.id}
          className=" flex flex-col gap-3 p-4 m-32 bg-white shadow-lg border border-gray-300 rounded-lg"
        >
          <div className="flex justify-start items-start gap-3">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {post.title}{" "}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.date).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-3">
            <p className="font-medium text-gray-700">{post.content}</p>
            {post.image && (
              <img
                width="70%"
                className="rounded-lg mt-2"
                src={post.image}
                alt={post.title}
              />
            )}
          </div>
        </div>
      ))}
    </>
  );
}
