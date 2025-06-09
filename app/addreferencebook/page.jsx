"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import "./page.css";

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

  const { data: session, status } = useSession();

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
        referenceBook: null, // PDF won't be refilled
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

      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/referencebook/${editingId}` : "/api/referencebook";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
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

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access denied</p>;

  return (
    <div className="referencebook-page">
      <div className="referencebook-form-card">
        <h2 className="section-title">
          {editingId ? "Update Reference Book" : "Add Reference Book"}
        </h2>
        <form onSubmit={handleSubmit} className="form-container">
          <Input label="Name" type="text" name="name" onChange={handleChange} value={state.name} />
          <Input label="Level" type="number" name="level" onChange={handleChange} value={state.level} />
          <Input label="Description" type="text" name="description" onChange={handleChange} value={state.description} />
          <label>Upload Reference Book (PDF)</label>
          <input type="file" name="referenceBook" accept=".pdf" onChange={handleChange} />
          {state.referenceBook && <p>Selected file: {state.referenceBook.name}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : editingId ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReferenceBookPage;
