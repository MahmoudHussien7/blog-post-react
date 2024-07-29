import React, { useState } from "react";

const EditPostForm = ({ post, onSave, onCancel }) => {
  const [content, setContent] = useState(post.content);
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(post.image || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...post, content, img });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border border-gray-300 rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

      {imgPreview && (
        <div className="mb-4">
          <img
            src={imgPreview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg mb-2"
          />
        </div>
      )}

      <label className="block mb-4">
        Content:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-2 py-1"
          rows="4"
          required
        />
      </label>
      <label className="block mb-4">
        Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
        />
      </label>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPostForm;
