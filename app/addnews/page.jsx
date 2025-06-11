"use client";
import React, { useState, useEffect } from "react";
import "./page.css";

const News = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  const [newsList, setNewsList] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        setNewsList(data);
      } else {
        console.error("Failed to fetch news");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    }
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
        alert("News added successfully!");
        setFormData({ id: "", name: "", description: "" });
        fetchNews(); // refresh list
      } else {
        console.error("Failed to add news");
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="news-container">
      <h2>Add News</h2>
      <form onSubmit={handleSubmit}>
        {/* <input
          type="number"
          name="id"
          placeholder="ID"
          value={formData.id}
          onChange={handleChange}
          required
        />
        <br /> */}
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

      <div className="news-list">
        <h2>Existing News</h2>
        {newsList.length === 0 ? (
          <p className="no-news">No news added yet.</p>
        ) : (
          newsList.map((news) => (
            <div key={news._id} className="news-card">
              <h3>{news.name}</h3>
              <p>{news.description}</p>
              <span className="news-id">ID: {news.id}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default News;
export const dynamic = "force-dynamic";
