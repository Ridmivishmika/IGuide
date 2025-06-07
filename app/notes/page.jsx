"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import "./page.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1); // Default to 1st year
  const [selectedLanguage, setSelectedLanguage] = useState("Sinhala"); // Default to Sinhala
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/note", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch notes");

        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      Number(note.level) === Number(selectedLevel) &&
      note.language?.toLowerCase() === selectedLanguage.toLowerCase() &&
      note.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDownloadUrl = (url) => {
    if (!url) return "#";
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return url;
    return (
      url.slice(0, uploadIndex + 8) +
      "fl_attachment/" +
      url.slice(uploadIndex + 8)
    );
  };

  return (
    <div className="pastpapers-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {[1, 2, 3].map((level) => (
          <div key={level}>
            <div
              className={`sidebar-item ${selectedLevel === level ? "active" : ""}`}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedLanguage("Sinhala"); // Default language to Sinhala on level change
              }}
            >
              {level === 1 ? "1st Year" : level === 2 ? "2nd Year" : "3rd Year"}
            </div>

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

      {/* Main */}
      <main className="main-area">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="cardsGrid">
          {filteredNotes.length === 0 && selectedLanguage && (
            <p style={{ marginTop: "2rem" }}>No notes found for this criteria.</p>
          )}

          {filteredNotes.map((note) => {
            const previewUrl = note.note?.url;
            const downloadUrl = getDownloadUrl(previewUrl);

            return (
              <div key={note._id} className="card">
                <h2>{note.name}</h2>
                <p><strong>Year:</strong> {note.year}</p>
                <p><strong>Level:</strong> {note.level}</p>
                <p><strong>Language:</strong> {note.language}</p>

                <div className="cardButtons">
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn preview"
                    title="Preview Note"
                  >
                    <Eye size={18} style={{ marginRight: "0.5rem" }} />
                    Preview
                  </a>

                  <a
                    href={downloadUrl}
                    className="btn download"
                    download
                    title="Download Note"
                  >
                    <Download size={18} style={{ marginRight: "0.5rem" }} />
                    Download
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Notes;
