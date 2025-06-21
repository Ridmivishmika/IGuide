"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./AddReferenceBookForm.module.css";

const initialState = {
  name: "",
  description: "",
  level: "",
  referenceBook: null,
};

const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
const UPLOAD_PRESET = "iguide_past_papers";

const ReferenceBookPage = () => {
  const [state, setState] = useState(initialState);
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdFromParams = searchParams.get("editId");

  useEffect(() => {
    if (editIdFromParams) {
      fetchReferenceBookById(editIdFromParams);
      setEditingId(editIdFromParams);
    }
    fetchBooks();
  }, [editIdFromParams]);

  const fetchBooks = async () => {
    const res = await fetch("/api/referencebook");
    const data = await res.json();
    setBooks(data);
  };

  const fetchReferenceBookById = async (id) => {
    try {
      const res = await fetch(`/api/referencebook/${id}`);
      const data = await res.json();
      setState({
        name: data.name,
        level: data.level,
        description: data.description,
        referenceBook: null,
      });
    } catch (error) {
      setError("Failed to load reference book data for editing.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setState({ ...state, referenceBook: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadReferenceBook = async () => {
    const formData = new FormData();
    formData.append("file", state.referenceBook);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return { id: data.public_id, url: data.secure_url };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name || !state.level || !state.description || (!state.referenceBook && !editingId)) {
      setError("All fields including the reference book PDF are required.");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let uploaded = null;
      if (state.referenceBook) {
        uploaded = await uploadReferenceBook();
      }

      const payload = {
        name: state.name.trim(),
        level: Number(state.level),
        description: state.description.trim(),
      };

      if (uploaded) payload.referenceBook = uploaded;

      const res = await fetch(editingId ? `/api/referencebook/${editingId}` : "/api/referencebook", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(editingId ? "Reference book updated!" : "Reference book added!");
        setState(initialState);
        setEditingId(null);
        fetchBooks();
        router.push("/referencebooks");
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.referencebookPage}>
      <div className={styles.referencebookFormCard}>
        <h2>{editingId ? "Update Reference Book" : "Add Reference Book"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Name"
            type="text"
            name="name"
            onChange={handleChange}
            value={state.name}
            className={styles.input}
          />
          <Input
            label="Level"
            type="number"
            name="level"
            onChange={handleChange}
            value={state.level}
            className={styles.input}
          />
          <Input
            label="Description"
            type="text"
            name="description"
            onChange={handleChange}
            value={state.description}
            className={styles.input}
          />
          <label className={styles.fileLabel}>Upload Reference Book (PDF)</label>
          <input
            type="file"
            name="referenceBook"
            accept=".pdf"
            onChange={handleChange}
            className={styles.fileInput}
          />
          {state.referenceBook && (
            <p className={styles.selectedFile}>
              Selected file: {state.referenceBook.name}
            </p>
          )}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? "Processing..." : editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReferenceBookPage;
