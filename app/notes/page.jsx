"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import styles from './page.css'

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1); // default to 1st Year

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/note", {
          cache: "no-store"
        });

        if (!res.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes by selected level
  const filteredNotes = notes.filter((note) => note.level === selectedLevel);

  return (
    <div className="notes-container">
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
          {filteredNotes.map((note) => (
            <div key={note._id} className="card">
              <h2>{note.name}</h2>
              <p><strong>Year:</strong> {note.year}</p>
              <p><strong>Level:</strong> {note.level}</p>

              <div className={styles.cardButtons}>
                <a
                  href={note.notePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btn} ${styles.preview}`}
                >
                  <Eye size={18} style={{ marginRight: "0.5rem" }} />
                </a>
                <a
                  href={note.notePdfUrl}
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

export default Notes;
