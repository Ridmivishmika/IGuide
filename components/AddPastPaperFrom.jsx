"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import styles from './AddPastPaperForm.module.css';

const initialState = {
  name: "",
  year: "",
  level: "",
  language: "",
  pdfFile: null,
};

const AddPastPaper = () => {
  const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
  const UPLOAD_PRESET = "iguide_past_papers";

  const [state, setState] = useState(initialState);
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdFromQuery = searchParams.get("editId");

  // Removed token
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    if (papers.length > 0 && editIdFromQuery) {
      const paperToEdit = papers.find((p) => p._id === editIdFromQuery);
      if (paperToEdit) {
        startEditing(paperToEdit);
      }
    }
  }, [papers, editIdFromQuery]);

  const fetchPapers = async () => {
    try {
      const res = await fetch("/api/pastpaper");
      if (!res.ok) throw new Error("Failed to fetch past papers");
      const data = await res.json();
      setPapers(data);
    } catch (err) {
      setError("Failed to load past papers");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setState({ ...state, pdfFile: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadPdf = async () => {
    const formData = new FormData();
    formData.append("file", state.pdfFile);
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
      setError("Please fill in all required fields.");
      return;
    }

    if (!editingId && !state.pdfFile) {
      setError("PDF file is required for new past papers.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let pdfData = null;
      if (state.pdfFile && typeof state.pdfFile !== "string") {
        pdfData = await uploadPdf();
      }

      const payload = {
        name: state.name,
        level: Number(state.level),
        year: Number(state.year),
        language: state.language,
        pdf: pdfData ? pdfData : editingId ? undefined : null,
      };

      const res = await fetch(editingId ? `/api/pastpaper/${editingId}` : "/api/pastpaper", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          // Removed Authorization header
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(editingId ? "Past paper updated successfully" : "Past paper added successfully");
        setState(initialState);
        setEditingId(null);
        fetchPapers();
        setTimeout(() => router.refresh(), 1500);
      } else {
        setError("Failed to save past paper");
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  const startEditing = (paper) => {
    setEditingId(paper._id);
    setState({
      name: paper.name,
      year: paper.year,
      level: String(paper.level),
      language: paper.language,
      pdfFile: paper.pdf?.url || null,
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

  // Removed access denied check, so always show form

return (
  <div className={styles.container}>
    <div className={styles.formSection}>
      <h2 className={styles.heading}>{editingId ? "Update Past Paper" : "Add Past Paper"}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={state.name}
          className={styles.input}
        />

        <label htmlFor="level" className={styles.label}>Level</label>
        <select
          name="level"
          value={state.level}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select level</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>

        <Input
          label="Year"
          type="number"
          name="year"
          onChange={handleChange}
          value={state.year}
          className={styles.input}
        />

        <label htmlFor="language" className={styles.label}>Language</label>
        <select
          name="language"
          value={state.language}
          onChange={handleChange}
          required
          className={styles.select}
        >
          <option value="">Select Language</option>
          <option value="Sinhala">Sinhala</option>
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
        </select>

        <label className={styles.label}>
          Upload PDF {editingId ? "(leave empty to keep current)" : ""}
        </label>
        <input
          onChange={handleChange}
          type="file"
          name="pdfFile"
          accept=".pdf"
          className={styles.fileInput}
        />

        {state.pdfFile && typeof state.pdfFile !== "string" && (
          <p className={styles.message}>Selected file: {state.pdfFile.name}</p>
        )}
        {editingId && typeof state.pdfFile === "string" && (
          <p className={styles.message}>
            Current PDF: <a href={state.pdfFile} target="_blank" rel="noopener noreferrer">View PDF</a>
          </p>
        )}

        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
        {success && <p className={`${styles.message} ${styles.success}`}>{success}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? (editingId ? "Updating..." : "Uploading...") : editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button type="button" onClick={cancelEditing} className={styles.cancelButton}>
            Cancel
          </button>
        )}
      </form>
    </div>
  </div>
);


};

export default AddPastPaper;
