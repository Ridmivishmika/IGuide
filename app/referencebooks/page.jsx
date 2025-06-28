"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, Pencil, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";
import Footer from "@/components/footer";

const ReferenceBooks = () => {
  const [referenceBooks, setReferenceBooks] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    fetchReferenceBooks();

    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const onStorage = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const fetchReferenceBooks = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/referencebook`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch reference books");
      const data = await res.json();
      setReferenceBooks(data);
    } catch (error) {
      console.error("Error fetching reference books:", error);
    }
  };

  const deleteReferenceBook = async (id) => {
    if (!confirm("Are you sure you want to delete this reference book?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to delete a reference book.");
        return;
      }

      const res = await fetch(`${backendUrl}/api/referencebook/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setReferenceBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== id)
      );
    } catch (error) {
      console.error("Error deleting reference book:", error);
      alert("Failed to delete reference book.");
    }
  };

  const editReferenceBook = (id) => {
    if (!isLoggedIn) {
      alert("You must be logged in to edit a reference book.");
      return;
    }
    router.push(`/addreferencebook?editId=${id}`);
  };

  const filteredBooks = referenceBooks.filter(
    (book) => Number(book.level) === Number(selectedLevel)
  );

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    if (window.innerWidth <= 767) setSidebarVisible(false);
  };

  return (
    <div>
      {/* Hamburger Button */}
      <div
        className="hamburger-wrapper"
        onClick={() => setSidebarVisible(true)}
        aria-label="Open sidebar"
      >
        <Menu color="#640259" size={24} />
      </div>

      <div className="pastpapers-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
          {/* Close Button for mobile */}
          <button
            className="close-btn"
            onClick={() => setSidebarVisible(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>

          {[1, 2, 3].map((level) => (
            <div key={level}>
              <div
                className={`sidebar-item ${selectedLevel === level ? "active" : ""}`}
                onClick={() => handleLevelClick(level)}
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

                  <p className="watermark">
                    iGuide <br /> Reference Books
                  </p>

                  <div className="cardButtons">
                    <a
                      href={book.referenceBook?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn preview"
                      title="Preview PDF"
                    >
                      <Eye size={18} />
                    </a>

                    <a
                      href={
                        book.referenceBook?.url
                          ? book.referenceBook.url.replace(
                              "/upload/",
                              "/upload/fl_attachment/"
                            )
                          : "#"
                      }
                      download
                      className="btn download"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </a>

                    {isLoggedIn && (
                      <>
                        <button
                          className="btn delete"
                          onClick={() => deleteReferenceBook(book._id)}
                          title="Delete Reference Book"
                        >
                          <Trash2 size={18} />
                        </button>

                        <button
                          className="btn edit"
                          onClick={() => editReferenceBook(book._id)}
                          title="Edit Reference Book"
                        >
                          <Pencil size={18} />
                        </button>
                      </>
                    )}
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
      <Footer />
    </div>
  );
};

export default ReferenceBooks;
