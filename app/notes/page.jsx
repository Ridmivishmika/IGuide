"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, Pencil, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";
import Footer from "@/components/footer";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("Sinhala");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/note`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/note/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note.");
    }
  };

  const editNote = (id) => {
    router.push(`/addnote?editId=${id}`);
  };

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

  // Close sidebar on mobile after selecting level or language
  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setSelectedLanguage("Sinhala");
    setSidebarOpen(false);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setSidebarOpen(false);
  };

  return (
    <div>
      {/* Hamburger button - mobile only */}
      <div className="hamburger-wrapper">
        <div
          className="hamburger-icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSidebarOpen(true);
          }}
        >
          <Menu size={28} />
        </div>
      </div>

      <div className="pastpapers-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "visible" : ""}`}>
          {/* Close button inside sidebar (mobile only) */}
          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar menu"
          >
            ✕ Close
          </button>

          {[1, 2, 3].map((level) => (
            <div key={level}>
              <div
                className={`sidebar-item ${
                  selectedLevel === level ? "active" : ""
                }`}
                onClick={() => handleLevelSelect(level)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLevelSelect(level);
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
                      onClick={() => handleLanguageSelect(language)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLanguageSelect(language);
                      }}
                    >
                      {language}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>

        {/* Main Area */}
        <main className="main-area">
          <div className="cardsGrid">
            {filteredNotes.length === 0 && selectedLanguage && (
              <p style={{ marginTop: "2rem" }}>
                No notes found for this criteria.
              </p>
            )}

            {filteredNotes.map((note) => {
              const previewUrl = note.note?.url;
              const downloadUrl = getDownloadUrl(previewUrl);

              return (
                <div key={note._id} className="card custom-card">
                  <p className="watermark">iGuide Notes</p>

                  <div className="card-header">
                    <span className="card-name">{note.name}</span>
                    <span className="card-year">{note.year}</span>
                  </div>

                  <div className="cardButtons">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn preview"
                      title="Preview Note"
                    >
                      <Eye size={18} />
                    </a>
                    <a
                      href={downloadUrl}
                      className="btn download"
                      download
                      title="Download Note"
                    >
                      <Download size={18} />
                    </a>

                    {isLoggedIn && (
                      <>
                        <button
                          className="btn delete"
                          onClick={() => deleteNote(note._id)}
                          title="Delete Note"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          className="btn edit"
                          onClick={() => editNote(note._id)}
                          title="Edit Note"
                        >
                          <Pencil size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Notes;
