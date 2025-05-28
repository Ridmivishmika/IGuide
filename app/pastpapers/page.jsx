"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import "./page.css"; // Assuming CSS modules are not being used

const Pastpapers = () => {
  const [pastpapers, setPastpapers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1); // Default to Level 1

  useEffect(() => {
    const fetchPastpapers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/pastpaper", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setPastpapers(data);
      } catch (error) {
        console.error("Error fetching past papers:", error);
      }
    };

    fetchPastpapers();
  }, []);

  // Filter based on selected year level
  const filteredPapers = pastpapers.filter(
    (paper) => paper.level === selectedLevel
  );

  return (
    <div className="pastpapers-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`sidebar-item ${
              selectedLevel === level ? "active" : ""
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level === 1
              ? "1st Year"
              : level === 2
              ? "2nd Year"
              : "3rd Year"}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="main-area">
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="cardsGrid">
          {filteredPapers.map((paper) => (
            <div key={paper._id} className="card">
              <h2>{paper.name}</h2>
              <p>
                <strong>Year:</strong> {paper.year}
              </p>
              <p>
                <strong>Level:</strong> {paper.level}
              </p>

              <div className="cardButtons">
                {/* Preview button */}
                <a
                  href="https://res.cloudinary.com/dwq5xfmci/raw/upload/v1748432896/pzdzainuwzgiynesiquo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn preview"
                  title="Preview PDF"
                >
                  <Eye size={18} style={{ marginRight: "0.5rem" }} />
                  Preview
                </a>

                {/* Download button */}
                <a
                  href="https://res.cloudinary.com/dwq5xfmci/raw/upload/fl_attachment/v1748432896/pzdzainuwzgiynesiquo.pdf"
                  download
                  className="btn download"
                  title="Download PDF"
                >
                  <Download size={18} style={{ marginRight: "0.5rem" }} />
                  Download
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
