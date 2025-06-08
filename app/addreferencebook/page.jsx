"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import './page.css'

const initialState = {
  name: "",
  description: "",
  level: "",
  referenceBook: null,
};

const AddReferenceBook = () => {
  const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
  const UPLOAD_PRESET = "iguide_past_papers";

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
      setState({ ...state, referenceBook: files[0] }); // Fixed key here
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadReferenceBook = async () => {
    const formData = new FormData();
    formData.append("file", state.referenceBook);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      return { id: data.public_id, url: data.secure_url };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload PDF");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name || !state.level || !state.description || !state.referenceBook) {
      setError("All fields including the reference book PDF are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const referenceBook = await uploadReferenceBook();

      const response = await fetch("/api/referencebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          name: state.name.trim(),
          level: Number(state.level),
          description: state.description.trim(),
          referenceBook,
        }),
      });

      if (response.status === 201) {
        setSuccess("Reference book added successfully");
        setTimeout(() => {
          router.refresh();
          router.push("/referencebooks"); // Fixed typo here
        }, 1500);
      } else {
        setError("Failed to add reference book");
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h2>Add Reference Book</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={state.name}
        />
        <Input
          label="Level"
          type="number"
          name="level"
          onChange={handleChange}
          value={state.level}
        />
        <Input
          label="Description"
          type="text"
          name="description"
          onChange={handleChange}
          value={state.description}
        />

        <label>Upload Reference Book (PDF)</label>
        <input
          onChange={handleChange}
          type="file"
          name="referenceBook"
          accept=".pdf"
        />

        {state.referenceBook && <p>Selected file: {state.referenceBook.name}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddReferenceBook;
