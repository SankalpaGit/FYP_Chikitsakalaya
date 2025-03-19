import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios
import PatientLayout from "../../layouts/PatientLayout"; // ✅ Import PatientLayout

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blogs using Axios
    axios
      .get("http://localhost:5000/api/blog/view")
      .then((res) => setBlogs(res.data))
      .catch((error) => console.error("Error fetching blogs", error));
  }, []);

  return (
    <PatientLayout>
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      {blogs.length === 0 ? (
        <p>No published blogs available.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="mb-6 border p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-500 text-sm mt-1">Published on: {blog.publishedAt.split("T")[0]}</p>

            {/* Blog Content Preview */}
            <div
              className="text-gray-700 mt-3 text-justify"
              dangerouslySetInnerHTML={{
                __html: blog.content.length > 100
                  ? blog.content.slice(0, 422) 
                  : blog.content,
              }}
            ></div>

            {/* Read More Link */}
            <Link
              to={`/blog/${blog.id}`}
              className="text-blue-500 mt-2 inline-block ml-4"
            >
              Read Full →
            </Link>
          </div>
        ))
      )}
    </div>
    </PatientLayout>
  );
};

export default Blog;
