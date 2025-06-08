"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import './page.css'
const initialState = {
  name: "",
  year: "",
  level: "",
  language: "",
  noteFile: null,
};

const AddNote = () => {
  const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";      // Keep your cloud name
  const UPLOAD_PRESET = "iguide_past_papers";           // Change upload preset for notes

  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access denied</p>;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setState({ ...state, noteFile: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadNote = async () => {
    const formData = new FormData();
    formData.append("file", state.noteFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return { id: data.public_id, url: data.secure_url };
    } catch (error) {
      console.error(error, error);
      throw new Error("Failed to upload note");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name || !state.year ||!state.language || !state.level || !state.noteFile) {
      setError("All fields including the note file are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const note = await uploadNote();

      const response = await fetch("/api/note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          name: state.name,
          level: Number(state.level),
          year: Number(state.year),
          language:state.language,
          note,
        }),
      });

      if (response.status === 201) {
        setSuccess("Note added successfully");
        setTimeout(() => {
          router.refresh();
          router.push("/notes");
        }, 1500);
      } else {
        setError("Failed to add note");
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h2>Add Note</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Name" type="text" name="name" onChange={handleChange} value={state.name} />
 <select name="level" value={state.level} onChange={handleChange}>
    <option value="">Select level</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
  </select>       
   <Input label="Year" type="number" name="year" onChange={handleChange} value={state.year} />
<label htmlFor="Language">Language</label>
  <select name="language" value={state.language} onChange={handleChange}>
    <option value="">Select Language</option>
    <option value="1">Sinhala</option>
    <option value="2">English</option>
    <option value="3">Tamil</option>
  </select>
        <label>Upload Note (PDF)</label>
        <input onChange={handleChange} type="file" name="noteFile" accept=".pdf" />

        {state.noteFile && <p>Selected file: {state.noteFile.name}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddNote;
