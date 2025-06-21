"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [leftAdsList, setLeftAdsList] = useState([]);
  const [rightAdsList, setRightAdsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

  useEffect(() => {
    fetchNews();
    fetchLeftAds();
    fetchRightAds();
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

  // For demo, using same ads API but split into left/right
  // You can change API or filter ads differently
  const fetchLeftAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/ads?position=left`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch left ads");
      const data = await res.json();
      setLeftAdsList(data);
    } catch (error) {
      console.error("Error fetching left ads:", error);
    }
  };

  const fetchRightAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/ads?position=right`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch right ads");
      const data = await res.json();
      setRightAdsList(data);
    } catch (error) {
      console.error("Error fetching right ads:", error);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete news");
      setNewsList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteAd = async (id, side) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/ads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete ad");
      if (side === "left") {
        setLeftAdsList((prev) => prev.filter((item) => item._id !== id));
      } else {
        setRightAdsList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Delete ad error:", error);
    }
  };

  const handleEditNews = (id) => {
    router.push(`/addnews?editId=${id}`);
  };

  const handleEditAd = (id, side) => {
    router.push(`/addad?editId=${id}`);
  };

  const filteredNews = newsList.filter(
    (news) =>
      news.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="news-page">
      {/* Left Sidebar Ads */}
      <aside className="news-ads left-ads">
        {/* <h3>Left Ads</h3> */}
        {leftAdsList.length > 0 ? (
          leftAdsList.map((ad) => (
            <div key={ad._id} className="ad-card">
              <h4>{ad.name}</h4>
              {ad.image?.url ? (
                <Image src={ad.image.url} alt={ad.name} width={150} height={100} className="rounded object-cover" />
              ) : (
                <p className="no-data">No image available</p>
              )}
              <div className="news-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditAd(ad._id, "left")}
                  title="Edit Ad"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAd(ad._id, "left")}
                  title="Delete Ad"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No ads available.</p>
        )}
      </aside>

      {/* Main News Section */}
      <main className="news-main">
        {/* <div className="news-search">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
        <h2>News</h2>
        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <div key={news._id} className="news-card">
                <h2>{news.name}</h2>
                <p>{news.description}</p>
                <div className="news-actions">
                  <button className="edit-btn" onClick={() => handleEditNews(news._id)} title="Edit">
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
              </div>
            ))
          ) : (
            <p className="no-data">No news found.</p>
          )}
        </div>
      </main>

      {/* Right Sidebar Ads */}
      <aside className="news-ads right-ads">
        {/* <h3>Right Ads</h3> */}
        {rightAdsList.length > 0 ? (
          rightAdsList.map((ad) => (
            <div key={ad._id} className="ad-card">
              <h4>{ad.name}</h4>
              {ad.image?.url ? (
                <Image src={ad.image.url} alt={ad.name} width={150} height={100} className="rounded object-cover" />
              ) : (
                <p className="no-data">No image available</p>
              )}
              <div className="news-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditAd(ad._id, "right")}
                  title="Edit Ad"
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteAd(ad._id, "right")}
                  title="Delete Ad"
                >
                  <Trash2 size={16} />
                </button>
              </div>
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
