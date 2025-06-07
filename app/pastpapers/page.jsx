"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import "./page.css";

const Pastpapers = () => {
  const [pastpapers, setPastpapers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1); // Default to 1st Year
  const [selectedLanguage, setSelectedLanguage] = useState("Sinhala"); // Default to Sinhala

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

  const filteredPapers = pastpapers.filter(
    (paper) =>
      Number(paper.level) === Number(selectedLevel) &&
      paper.language?.toLowerCase() === selectedLanguage.toLowerCase()
  );

  return (
    <div className="pastpapers-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Level + Languages (Nested) */}
        {[1, 2, 3].map((level) => (
          <div key={level}>
            <div
              className={`sidebar-item ${selectedLevel === level ? "active" : ""}`}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedLanguage(""); // Reset language on level change
              }}
            >
              {level === 1 ? "1st Year" : level === 2 ? "2nd Year" : "3rd Year"}
            </div>

            {/* Show languages only for selected level */}
            {selectedLevel === level && (
              <div className="language-submenu">
                {["Sinhala", "English", "Tamil"].map((language) => (
                  <div
                    key={language}
                    className={`sidebar-subitem ${
                      selectedLanguage === language ? "active" : ""
                    }`}
                    onClick={() => setSelectedLanguage(language)}
                  >
                    {language}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="main-area">
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        <div className="cardsGrid">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <div key={paper._id} className="card">
                <h2>{paper.name}</h2>
                <p><strong>Year:</strong> {paper.year}</p>
                <p><strong>Level:</strong> {paper.level}</p>
                <p><strong>Language:</strong> {paper.language}</p>

                <div className="cardButtons">
                  <a
                    href={paper.pdf?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn preview"
                    title="Preview PDF"
                  >
                    <Eye size={18} style={{ marginRight: "0.5rem" }} />
                  </a>
                  <a
                    href={
                      paper.pdf?.url
                        ? paper.pdf.url.replace("/upload/", "/upload/fl_attachment/")
                        : "#"
                    }
                    download
                    className="btn download"
                    title="Download PDF"
                  >
                    <Download size={18} style={{ marginRight: "0.5rem" }} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            selectedLanguage && (
              <p style={{ padding: "1rem" }}>
                No papers found for the selected level and language.
              </p>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default Pastpapers;
