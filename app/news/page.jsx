"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./page.css";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [adsList, setAdsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/news", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setNewsList(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/ads", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch ads");
        const data = await res.json();
        setAdsList(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchNews();
    fetchAds();
  }, []);

  const filteredNews = newsList.filter(
    (news) =>
      news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="news-page">
      {/* Main news content */}
      <main className="news-main">
        <div className="news-search">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news._id} className="news-card">
                <h2>{news.name}</h2>
                <p>
                  <strong>Description:</strong> {news.description}
                </p>
                <p>
                  <strong>Date:</strong> {news.date || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="no-data">No news found.</p>
          )}
        </div>
      </main>

      {/* Sidebar with Ads */}
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
