"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import "./page.css";

const ReferenceBooks = () => {
  const [referenceBooks, setReferenceBooks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);

  useEffect(() => {
    const fetchReferenceBooks = async () => {
      try {
        const res = await fetch("/api/referencebook", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch reference books");
        const data = await res.json();
        setReferenceBooks(data);
      } catch (error) {
        console.error("Error fetching reference books:", error);
      }
    };
    fetchReferenceBooks();
  }, []);

  // Filter by level only
  const filteredBooks = referenceBooks.filter(
    (book) => Number(book.level) === Number(selectedLevel)
  );

  return (
    <div className="pastpapers-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {[1, 2, 3].map((level) => (
          <div key={level}>
            <div
              className={`sidebar-item ${selectedLevel === level ? "active" : ""}`}
              onClick={() => setSelectedLevel(level)}
            >
              {level === 1 ? "1st Year" : level === 2 ? "2nd Year" : "3rd Year"}
            </div>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="main-area">
        <div className="cardsGrid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book._id} className="card">
                <div className="card-header">
                  <span className="card-name">{book.name}</span>
                  <span className="card-year">{book.year}</span>
                </div>

                <p className="watermark">iGuide Reference Books</p>

                <div className="cardButtons">
                  <a
                    href={book.referenceBook?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn preview"
                    title="Preview PDF"
                  >
                    <Eye color="#640259" size={18} style={{ marginRight: "0.5rem" }} />
                  </a>
                  <a
                    href={
                      book.referenceBook?.url
                        ? book.referenceBook.url.replace("/upload/", "/upload/fl_attachment/")
                        : "#"
                    }
                    download
                    className="btn download"
                    title="Download PDF"
                  >
                    <Download color="#640259" size={18} style={{ marginRight: "0.5rem" }} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: "1rem" }}>
              No reference books found for the selected level.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReferenceBooks;
