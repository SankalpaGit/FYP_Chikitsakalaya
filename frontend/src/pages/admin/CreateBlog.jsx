import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Styles for Quill editor

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Create Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <ReactQuill value={content} onChange={setContent} className="bg-white" />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
