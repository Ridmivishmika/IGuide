"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [adsList, setAdsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch news and ads
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
        console.log(data)
        setAdsList(data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchNews();
    fetchAds();
  }, []);

  // Filtered news based on search
  const filteredNews = newsList.filter(
    (news) =>
      news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Main news content */}
      <main className="flex-1">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news._id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">{news.name}</h2>
                <p className="mb-2">
                  <strong>Description:</strong> {news.description}
                </p>
                <p>
                  <strong>Date:</strong> {news.date || "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p>No news found.</p>
          )}
        </div>
      </main>

      {/* Sidebar with Ads */}
      <aside className="w-full md:w-72 space-y-4">
        <h3 className="text-lg font-bold mb-2">Sponsored Ads</h3>
        {adsList.length > 0 ? (
          adsList.map((ad) => (
            <div key={ad._id} className="border p-3 rounded shadow">
              <h4 className="font-semibold mb-2">{ad.name}</h4>
              {ad.image?.url ? (
                <Image
                  src={ad.image.url}
                  alt={ad.name}
                  width={300}
                  height={200}
                  className="rounded object-cover w-full h-auto"
                />
              ) : (
                <p className="text-sm text-gray-500">No image available</p>
              )}
            </div>
          ))
        ) : (
          <p>No ads available.</p>
        )}
      </aside>
    </div>
  );
};

export default News;
