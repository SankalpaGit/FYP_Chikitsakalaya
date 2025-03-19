import React, { lazy, Suspense, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUpload, FiSend } from "react-icons/fi";
import "react-quill/dist/quill.snow.css";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios"; // ✅ Import Axios

const ReactQuill = lazy(() => import("react-quill"));

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const { blogID } = useParams(); // Get blog ID from URL if editing

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null); // Store current image URL for editing

  useEffect(() => {
    if (blogID) {
      // Fetch blog details if editing
      axios
        .get(`http://localhost:5000/api/blog/view/${blogID}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setExistingImage(res.data.image); // Keep existing image
        })
        .catch((err) => console.error("Error fetching blog", err));
    }
  }, [blogID]);

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // Handle Blog Submission (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const url = blogID
      ? `http://localhost:5000/api/blog/edit/${blogID}`
      : "http://localhost:5000/api/blog/create";
    const method = blogID ? "PUT" : "POST";

    try {
      const res = await axios({
        method,
        url,
        data: formData,
      });

      if (res.status === 200 || res.status === 201) {
        navigate("/admin/blog"); // Redirect after success
      }
    } catch (error) {
      console.error("Error saving blog", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl p-6 mt-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          {blogID ? "✏️ Edit Blog" : "📝 Write Your Blog"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Blog Title */}
          <input
            type="text"
            placeholder="Enter Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Quill Editor */}
          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              style={{ height: "180px", marginBottom: "70px" }}
            />
          </Suspense>

          {/* Image Upload */}
          <label className="flex items-center gap-4 cursor-pointer p-3 border rounded-lg text-gray-700">
            <FiUpload size={20} />
            <span>{image ? image.name : "Upload Image"}</span>
            <input type="file" onChange={handleImageChange} className="hidden" />
          </label>

          {/* Show Existing Image if Editing */}
          {existingImage && !image && (
            <div className="mt-3">
              <img
                src={`http://localhost:5000/uploads/${existingImage}`}
                alt="Existing Blog"
                className="max-h-48 rounded-lg border"
              />
            </div>
          )}

          {/* Image Preview */}
          {image && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(image)}
                alt="New Preview"
                className="max-h-48 rounded-lg border"
              />
            </div>
          )}

          {/* Publish Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FiSend size={20} />
            {blogID ? "Update Blog" : "Publish"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateBlog;
