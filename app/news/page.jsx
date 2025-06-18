"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [adsList, setAdsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL; // Make sure this is defined in .env

  useEffect(() => {
    // Get token from localStorage once on mount
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken || "");

    fetchNews();
    fetchAds();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/news`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/ads`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch ads");
      const data = await res.json();
      setAdsList(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  const handleDeleteNews = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this news?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${backendUrl}/api/news/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete news");

      setNewsList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteAd = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this ad?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${backendUrl}/api/ads/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete ad");

      setAdsList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete ad error:", error);
    }
  };

  const handleEditNews = (id) => {
    router.push(`/addnews?editId=${id}`);
  };

  const handleEditAd = (id) => {
    router.push(`/addad?editId=${id}`);
  };

  const filteredNews = newsList.filter(
    (news) =>
      news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="news-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* News Section */}
      <main className="news-main">
        <h2>News</h2>
        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news._id} className="news-card">
                <h3>{news.name}</h3>
                <p>{news.description}</p>

                {token && (
                  <div className="news-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditNews(news._id)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteNews(news._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="no-data">No news found.</p>
          )}
        </div>
      </main>

      {/* Ads Section */}
      <aside className="news-ads">
        <h3>Sponsored Ads</h3>
        {adsList.length > 0 ? (
          adsList.map((ad) => (
            <div key={ad._id} className="ad-card">
              <h4>{ad.name}</h4>
              {ad.image?.url ? (
                <Image
                  src={ad.image.url}
                  alt={ad.name}
                  width={300}
                  height={200}
                  className="rounded object-cover w-full h-auto"
                />
              ) : (
                <p className="no-data">No image available</p>
              )}

              {token && (
                <div className="news-actions">
                  {/* Uncomment if edit ad button is needed */}
                  {/* <button
                    className="edit-btn"
                    onClick={() => handleEditAd(ad._id)}
                    title="Edit Ad"
                  >
                    <Pencil size={16} />
                  </button> */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteAd(ad._id)}
                    title="Delete Ad"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-data">No ads available.</p>
        )}
      </aside>
    </div>
  );
};

export default News;
