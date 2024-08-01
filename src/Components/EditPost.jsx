import React, { useState } from "react";

const EditPostForm = ({ post, onSave, onClose }) => {
  const [content, setContent] = useState(post.content || "");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(post.image || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...post, content, img });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg"
          rows="4"
          placeholder="Edit post content..."
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto object-cover rounded-lg"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPostForm;
