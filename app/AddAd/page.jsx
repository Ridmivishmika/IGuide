"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './page.css';

const AddAds = () => {
  const [formData, setFormData] = useState({ name: "", image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL; // Make sure this is set in your .env.local

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("editId");
    setEditId(id);

    const fetchAdDetails = async () => {
      if (id) {
        try {
          const res = await fetch(`${backendUrl}/api/ads/${id}`);
          if (!res.ok) throw new Error("Failed to fetch ad details");
          const data = await res.json();
          setFormData({ name: data.name || "", image: null });
          setPreviewImage(data.image?.url || null);
          setIsUpdating(true);
        } catch (error) {
          console.error("Error loading ad:", error);
        }
      }
    };

    fetchAdDetails();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    if (formData.image) form.append("image", formData.image);

    try {
      const res = await fetch(`${backendUrl}/api/ads${isUpdating ? `/${editId}` : ""}`, {
        method: isUpdating ? "PUT" : "POST",
        body: form, // ❌ No Authorization header
      });

      if (!res.ok) throw new Error("Failed to submit ad");

      router.push("/ad"); // ✅ Redirect after submit
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="form-container">
      <h1>{isUpdating ? "Update Ad" : "Add Ad"}</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Ad Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{ marginTop: "1rem", maxWidth: "100%", borderRadius: "8px" }}
          />
        )}

        <button type="submit">{isUpdating ? "Update" : "Add"}</button>
      </form>
    </div>
  );
};

export default AddAds;
