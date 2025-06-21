"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("Sinhala");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL;

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
      });

      if (!res.ok) throw new Error("Delete failed");

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
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

  return (
    <div className="pastpapers-container">
      {/* Sidebar */}
      <aside className="sidebar">
        {[1, 2, 3].map((level) => (
          <div key={level}>
            <div
              className={`sidebar-item ${
                selectedLevel === level ? "active" : ""
              }`}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedLanguage("Sinhala");
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

      {/* Main Area */}
      <main className="main-area">
        {/* <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "1rem" }}
        /> */}

        <div className="cardsGrid">
          {filteredNotes.length === 0 && selectedLanguage && (
            <p style={{ marginTop: "2rem" }}>No notes found for this criteria.</p>
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
