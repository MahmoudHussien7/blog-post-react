// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";

export default function Posts(props) {
  // eslint-disable-next-line react/prop-types
  const { posts } = props;
  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex justify-start items-start gap-3 m-10 border border-gray-300 rounded-lg"
        >
          <img width={300} className="rounded-lg" src={post.image} />
          <div className="flex flex-col gap-2 p-3">
            <span className="text-2xl font-semibold text-gray-900">
              {post.title}
            </span>
            <p className="font-medium text-gray-500">{post.content}</p>
          </div>
        </div>
      ))}
    </>
  );
}
