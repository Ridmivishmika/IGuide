"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './page.css';

const AddNews = () => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("editId");
    setEditId(id);

    if (id) {
      const fetchNewsDetails = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/news/${id}`);
          if (!res.ok) throw new Error("Failed to fetch news details");
          const data = await res.json();
          setFormData({ name: data.name, description: data.description });
          setIsUpdating(true);
        } catch (error) {
          console.error("Error loading news:", error);
        }
      };

      fetchNewsDetails();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendUrl}/api/news${isUpdating ? `/${editId}` : ""}`, {
        method: isUpdating ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
          // ❌ No Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit news");

      router.push("/news"); // ✅ Redirect after submit
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="form-container">
      <h1>{isUpdating ? "Update News" : "Add News"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Title"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">{isUpdating ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default AddNews;
