import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/blog/view-all") // Fetch all blogs, including unpublished ones
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error("Error fetching blogs", err));
  }, []);

  const togglePublish = async (blogID) => {
    try {
      const res = await fetch(`http://localhost:5000/blog/toggle-publish/${blogID}`, { method: "PUT" });
      if (res.ok) {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id === blogID ? { ...blog, isPublished: !blog.isPublished } : blog))
        );
      }
    } catch (error) {
      console.error("Error toggling publish status", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <button
          onClick={() => navigate("/admin/blog/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Blog
        </button>
      </div>

      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <div key={blog.id} className="border-b pb-4 mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">{blog.title}</h2>
              <p className="text-gray-600">{blog.publishedAt}</p>
              <p className="text-gray-800">{blog.content.substring(0, 100)}...</p>
            </div>
            <button
              onClick={() => togglePublish(blog.id)}
              className={`px-4 py-2 rounded ${blog.isPublished ? "bg-green-500" : "bg-gray-400"} text-white`}
            >
              {blog.isPublished ? "Published" : "Unpublished"}
            </button>
          </div>
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  );
};

export default AdminBlog;
