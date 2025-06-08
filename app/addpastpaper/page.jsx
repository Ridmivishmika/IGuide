"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "./page.css";

const initialState = {
  name: "",
  year: "",
  level: "",
  language: "",
  pdf: null,
};

const AddPastPaper = () => {
  const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
  const UPLOAD_PRESET = "iguide_past_papers";

  const [state, setState] = useState(initialState);
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null); // <-- Track editing paper ID

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") fetchPapers();
  }, [status]);

  const fetchPapers = async () => {
    try {
      const res = await fetch("/api/pastpaper");
      const data = await res.json();
      setPapers(data);
    } catch (err) {
      console.error("Fetch papers error:", err);
      setError("Failed to load past papers");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setState({ ...state, pdf: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadPdf = async () => {
    const formData = new FormData();
    formData.append("file", state.pdf);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Failed to upload PDF");

    const data = await res.json();
    return { id: data.public_id, url: data.secure_url };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name || !state.year || !state.language || !state.level) {
      setError("Name, Year, Language, and Level are required.");
      return;
    }

    // For adding, PDF is required. For editing, PDF is optional (only upload if changed)
    if (!editingId && !state.pdf) {
      setError("PDF file is required for new past papers.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let pdfData = null;
      // Upload PDF only if new file selected (for editing, it's optional)
      if (state.pdf && typeof state.pdf !== "string") {
        pdfData = await uploadPdf();
      }

      const payload = {
        name: state.name,
        level: Number(state.level),
        year: state.year,
        language: state.language,
        pdf: pdfData ? pdfData : editingId ? undefined : null, // If editing and no new PDF, keep existing
      };

      let response;

      if (editingId) {
        // PATCH request to update existing past paper
        response = await fetch(`/api/pastpaper/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // POST request to add new past paper
        response = await fetch("/api/pastpaper", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        setSuccess(editingId ? "Past paper updated successfully" : "Past paper added successfully");
        setState(initialState);
        setEditingId(null);
        fetchPapers();
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(editingId ? "Failed to update past paper" : "Failed to add past paper");
      }
    } catch (err) {
      setError(err.message);
      console.error("Submit error:", err);
    }

    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/pastpaper/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });

      if (res.ok) {
        setSuccess("Past paper deleted successfully");
        fetchPapers();
      } else {
        setError("Failed to delete past paper");
      }
    } catch (err) {
      setError("An error occurred while deleting");
      console.error(err);
    }

    setDeletingId(null);
  };

  const startEditing = (paper) => {
    setEditingId(paper._id);
    setState({
      name: paper.name,
      year: paper.year,
      level: String(paper.level),
      language: paper.language,
      pdf: paper.pdf.url, // Keep current pdf URL as string (not a File)
    });
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setState(initialState);
    setError("");
    setSuccess("");
  };

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access denied</p>;

  return (
    <div className="container">
      <div className="form-section">
        <h2>{editingId ? "Update Past Paper" : "Add Past Paper"}</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Name" type="text" name="name" onChange={handleChange} value={state.name} />

          <label htmlFor="level">Level</label>
          <select name="level" value={state.level} onChange={handleChange} required>
            <option value="">Select level</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <Input label="Year" type="text" name="year" onChange={handleChange} value={state.year} />

          <label htmlFor="language">Language</label>
          <select name="language" value={state.language} onChange={handleChange} required>
            <option value="">Select Language</option>
            <option value="Sinhala">Sinhala</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
          </select>

          <label>Upload PDF {editingId ? "(leave empty to keep current)" : ""}</label>
          <input onChange={handleChange} type="file" name="pdf" accept=".pdf" />

          {/* Show file name or existing PDF link */}
          {state.pdf && typeof state.pdf !== "string" && <p>Selected file: {state.pdf.name}</p>}
          {editingId && typeof state.pdf === "string" && (
            <p>
              Current PDF:{" "}
              <a href={state.pdf} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </p>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? (editingId ? "Updating..." : "Uploading...") : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEditing}
              style={{
                marginLeft: "1rem",
                padding: "0.4rem 0.8rem",
                backgroundColor: "#666",
                color: "white",
                border: "none",
                borderRadius: "0.4rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="list-section">
        <h3>Existing Past Papers</h3>
        <ul>
          {papers.map((paper) => (
            <li key={paper._id}>
              <b>{paper.name}</b> ({paper.year})<br />
              Level: {paper.level}<br/> Language: {paper.language}<br />
              <a href={paper.pdf.url} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
              <br />
              <button
                onClick={() => handleDelete(paper._id)}
                disabled={deletingId === paper._id}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#640259",
                  color: "white",
                  border: "none",
                  borderRadius: "0.4rem",
                  cursor: "pointer",
                  marginRight: "0.5rem",
                }}
              >
                {deletingId === paper._id ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => startEditing(paper)}
                disabled={isLoading}
                style={{
                  marginTop: "0.5rem",
                  padding: "0.4rem 0.8rem",
                  backgroundColor: "#640259",
                  color: "white",
                  border: "none",
                  borderRadius: "0.4rem",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddPastPaper;
