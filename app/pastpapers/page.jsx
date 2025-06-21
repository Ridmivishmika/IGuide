"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import "./page.css";

const Pastpapers = () => {
  const [pastpapers, setPastpapers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("Sinhala");
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    fetchPastpapers();
  }, []);

  const fetchPastpapers = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/pastpaper`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setPastpapers(data);
    } catch (error) {
      console.error("Error fetching past papers:", error);
    }
  };

  const deletePaper = async (id) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/pastpaper/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setPastpapers((prev) => prev.filter((paper) => paper._id !== id));
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  const editPaper = (id) => {
    router.push(`/addpastpaper?editId=${id}`);
  };

  const filteredPapers = pastpapers.filter(
    (paper) =>
      Number(paper.level) === Number(selectedLevel) &&
      paper.language?.toLowerCase() === selectedLanguage.toLowerCase()
  );

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

      {/* Main content */}
      <main className="main-area">
        <div className="cardsGrid">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper) => (
              <div key={paper._id} className="card">
                <div className="card-header">
                  <span className="card-name">{paper.name}</span>
                  <span className="card-year">{paper.year}</span>
                </div>

                <p className="watermark">iGuide Past Papers</p>

                <div className="cardButtons">
                  <a
                    href={paper.pdf?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn preview"
                    title="Preview PDF"
                  >
                    <Eye color="#640259" size={18} style={{ marginRight: "0.5rem" }} />
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
                    <Download color="#640259" size={18} style={{ marginRight: "0.5rem" }} />
                  </a>

                  <button
                    className="btn delete"
                    onClick={() => deletePaper(paper._id)}
                    title="Delete Paper"
                  >
                    <Trash2 size={18} />
                  </button>

                  <button
                    className="btn edit"
                    onClick={() => editPaper(paper._id)}
                    title="Edit Paper"
                  >
                    <Pencil size={18} />
                  </button>
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
