import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios
import PatientLayout from "../../layouts/PatientLayout"; // ✅ Import PatientLayout

const BlogDetail = () => {
  const { blogID } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    // Fetch blog details using Axios
    axios
      .get(`http://localhost:5000/api/blog/view/${blogID}`)
      .then((res) => setBlog(res.data))
      .catch((error) => console.error("Error fetching blog", error));
  }, [blogID]);

  if (!blog) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <PatientLayout>
    <div className="flex justify-center mb-8 mt-6">
      <div className="bg-white p-8 shadow-2xl max-w-3xl w-full">
        <div>
          <h1 className="text-4xl font-bold font-serif text-gray-900 text-center">
            {blog.title}
          </h1>
          <p className="text-gray-500 text-sm float-right mt-5">
            Published on:{" "}
            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="mt-16">
          {blog.image && (
            <img
              src={`http://localhost:5000/uploads/${blog.image}`}
              alt={blog.title}
              className="w-full rounded-lg shadow-md mb-6"
            />
          )}
          <div
            className="text-gray-800 text-lg leading-relaxed font-sans text-justify"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </div>
    </PatientLayout>
  );
};

export default BlogDetail;
