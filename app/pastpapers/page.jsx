"use client";

import React, { useState, useEffect } from "react";
import styles from './page.css';
import { Eye, Download } from "lucide-react";
import Card from "@/components/card";

const Pastpapers = () => {
  const [pastpapers, setPastpapers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1); // ✅ Default to Level 1

  useEffect(() => {
    const fetchPastpapers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/pastpaper", {
          cache: "no-store"
        });
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setPastpapers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPastpapers();
  }, []);

  const filteredPapers = pastpapers.filter((paper) => paper.level === selectedLevel); // Always filter based on selectedLevel

  return (
    <div className="pastpapers-container">
      <aside className="sidebar">
        <div
          className={`sidebar-item ${selectedLevel === 1 ? "active" : ""}`}
          onClick={() => setSelectedLevel(1)}
        >
          1st Year
        </div>
        <div
          className={`sidebar-item ${selectedLevel === 2 ? "active" : ""}`}
          onClick={() => setSelectedLevel(2)}
        >
          2nd Year
        </div>
        <div
          className={`sidebar-item ${selectedLevel === 3 ? "active" : ""}`}
          onClick={() => setSelectedLevel(3)}
        >
          3rd Year
        </div>
      </aside>

      <main className="main-area">
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="cardsGrid">
          {filteredPapers.map((paper) => (
            <div key={paper._id} className="card">
              <h2>{paper.name}</h2>
              <p><strong>Year:</strong> {paper.year}</p>
              <p><strong>Level:</strong> {paper.level}</p>

              <div className={styles.cardButtons}>
                <a
                  href={paper.pastPaperPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btn} ${styles.preview}`}
                >
                  <Eye size={18} style={{ marginRight: "0.5rem" }} />
                </a>
                <a
                  href={paper.pastPaperPdfUrl}
                  download
                  className={`${styles.btn} ${styles.download}`}
                >
                  <Download size={18} style={{ marginRight: "0.5rem" }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pastpapers;
