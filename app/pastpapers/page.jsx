"use client";

import React, { useState, useEffect } from "react";
import { Eye, Download, Trash2, Pencil, Menu, X } from "lucide-react"; // added Menu and X icons
import { useRouter } from "next/navigation";
import "./page.css";
import Footer from "@/components/footer";

const Pastpapers = () => {
  const [pastpapers, setPastpapers] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("Sinhala");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // for mobile toggle

  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    fetchPastpapers();

    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const onStorage = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to delete a paper.");
        return;
      }

      const res = await fetch(`${backendUrl}/api/pastpaper/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setPastpapers((prev) => prev.filter((paper) => paper._id !== id));
    } catch (error) {
      console.error("Error deleting paper:", error);
      alert("Failed to delete paper.");
    }
  };

  const editPaper = (id) => {
    if (!isLoggedIn) {
      alert("You must be logged in to edit a paper.");
      return;
    }
    router.push(`/addpastpaper?editId=${id}`);
  };

  const filteredPapers = pastpapers.filter(
    (paper) =>
      Number(paper.level) === Number(selectedLevel) &&
      paper.language?.toLowerCase() === selectedLanguage.toLowerCase()
  );

  // Close sidebar on selecting level/language on mobile
  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setSelectedLanguage("Sinhala");
    if (window.innerWidth <= 767) setSidebarVisible(false);
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    if (window.innerWidth <= 767) setSidebarVisible(false);
  };

  return (
    <div>
      {/* Hamburger Button */}
      <div className="hamburger-wrapper" onClick={() => setSidebarVisible(true)} aria-label="Open menu" role="button" tabIndex={0}>
        <Menu color="#640259" size={24} />
      </div>

      <div className="pastpapers-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
          {/* Close button visible on mobile inside sidebar */}
          <button
            className="close-btn"
            onClick={() => setSidebarVisible(false)}
            aria-label="Close menu"
            title="Close Menu"
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
              {selectedLevel === level && (
                <div className="language-submenu">
                  {["Sinhala", "English", "Tamil"].map((language) => (
                    <div
                      key={language}
                      className={`sidebar-subitem ${selectedLanguage === language ? "active" : ""}`}
                      onClick={() => handleLanguageClick(language)}
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
                        paper.pdf?.url ? paper.pdf.url.replace("/upload/", "/upload/fl_attachment/") : "#"
                      }
                      download
                      className="btn download"
                      title="Download PDF"
                    >
                      <Download color="#640259" size={18} style={{ marginRight: "0.5rem" }} />
                    </a>

                    {isLoggedIn && (
                      <>
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
                      </>
                    )}
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
      <Footer />
    </div>
  );
};

export default Pastpapers;
