import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Styles for Quill editor
import { FiUpload, FiSend } from "react-icons/fi"; // Icons for upload and publish
import AdminLayout from "../../layouts/AdminLayout";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"], // Bold, Italic, Underline, Strikethrough
    [{ color: [] }, { background: [] }], // Text and background color
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    ["link", "image"], // Link and Image
    ["clean"], // Remove formatting
  ],
};

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/blog/create", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        navigate("/admin/blog"); // Redirect to blog management page after creation
      }
    } catch (error) {
      console.error("Error creating blog", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl  p-8 mt-6 bg-white ">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 ">📰 Write Your Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* ReactQuill Editor with Increased Height */}
          <div className=" bg-gray-100">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              className="h-40 bg-red-50"
            />
          </div>

          {/* File Upload with Icon */}
          <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg text-gray-700 hover:bg-gray-100">
            <FiUpload size={20} />
            <span>{image ? image.name : "Upload Image"}</span>
            <input type="file" onChange={handleImageChange} className="hidden" />
          </label>

          {/* Image Preview */}
          {image && (
            <div className="mt-3 flex justify-center">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-h-48 rounded-lg border shadow-sm"
              />
            </div>
          )}

          {/* Publish Button with Icon */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <FiSend size={20} />
            <span>Publish</span>
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateBlog;
