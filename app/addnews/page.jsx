"use client";
import React, { useState } from "react";
import './page.css'

const News = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("id", formData.id);
    data.append("name", formData.name);
    data.append("description", formData.description);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        alert("News added successfully!");
        console.log(result);
      } else {
        console.error("Failed to add news");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div>
      <h2>Add News</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="name"
          placeholder="News Title"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Add News</button>
      </form>
    </div>
  );
};

export default News;
