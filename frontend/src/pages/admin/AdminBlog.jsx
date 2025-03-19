import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEye, FiEyeOff, FiEdit, FiTrash } from "react-icons/fi";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios"; // ✅ Import Axios

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedBlog, setExpandedBlog] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch all blogs
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blog/view-all")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Error fetching blogs", err));
  }, []);

  // ✅ Toggle Publish Status
  const togglePublish = async (blogID) => {
    try {
      await axios.put(`http://localhost:5000/api/blog/toggle-publish/${blogID}`);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === blogID ? { ...blog, isPublished: !blog.isPublished } : blog
        )
      );
    } catch (error) {
      console.error("Error toggling publish status", error);
    }
  };

  // ✅ Delete Blog
  const handleDelete = async (blogID) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/blog/delete/${blogID}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogID));
    } catch (error) {
      console.error("Error deleting blog", error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-teal-800">Manage Blogs</h1>
          <button
            onClick={() => navigate("/admin/blog/create")}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            <FiPlus size={18} />
            Add Blog
          </button>
        </div>

        {/* Blog List */}
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-5 rounded-lg mb-4 border-2 relative">
              {/* Action Buttons (Top Right) */}
              <div className="absolute top-4 right-4 flex gap-2">
                {/* Toggle Publish */}
                <button
                  onClick={() => togglePublish(blog.id)}
                  className={`p-2 rounded-full text-white transition ${
                    blog.isPublished ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {blog.isPublished ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>

                {/* Edit Blog */}
                <button
                  onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                  className="p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition"
                >
                  <FiEdit size={18} />
                </button>

                {/* Delete Blog */}
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                >
                  <FiTrash size={18} />
                </button>
              </div>

              {/* Blog Title & Date */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>
                <p className="text-gray-500 text-sm mt-1">{new Date(blog.publishedAt).toLocaleDateString()}</p>
              </div>

              {/* Blog Content */}
              <div className="text-gray-700 mt-3">
                <div
                  dangerouslySetInnerHTML={{
                    __html: expandedBlog === blog.id ? blog.content : blog.content.substring(0, 300),
                  }}
                ></div>

                {/* Read More / Read Less */}
                {blog.content.length > 100 && (
                  <button
                    onClick={() => setExpandedBlog(expandedBlog === blog.id ? null : blog.id)}
                    className="text-blue-600 font-medium mt-2"
                  >
                    {expandedBlog === blog.id ? "View Less" : "View More"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No blogs available</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
