// Components/Skeleton.js
import React from "react";

const Skeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {Array(6)
        .fill("")
        .map((_, index) => (
          <div
            key={index}
            className="flex w-full  gap-4 animate-pulse p-4 bg-gray-100 rounded-lg"
          >
            {" "}
            <div className="skeleton h-96 w-1/2 bg-gray-300"></div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col mb-6 gap-6">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full bg-gray-300"></div>
                <div className="skeleton h-4 w-20 bg-gray-300"></div>
                <div className="skeleton h-4 w-28 bg-gray-300"></div>{" "}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Skeleton;
