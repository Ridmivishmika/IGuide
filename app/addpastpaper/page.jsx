"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const initialState = {
  name: "",
  year: "",
  level: "",
  pdf: null,
};

const AddPastPaper = () => {
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
      setState({ ...state, pdf: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadPdf = async () => {
    const formData = new FormData();
    formData.append("file", state.pdf);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      return { id: data.public_id, url: data.secure_url };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload PDF");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.name || !state.year || !state.level || !state.pdf) {
      setError("All fields including the PDF are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const pdf = await uploadPdf();

      const response = await fetch("/api/pastpaper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          name: state.name,
          level: Number(state.level),
          year: state.year,
          pdf,
        }),
      });

      if (response.status === 201) {
        setSuccess("Past paper added successfully");
        setTimeout(() => {
          router.refresh();
          router.push("/pastpapers");
        }, 1500);
      } else {
        setError("Failed to add past paper");
      }
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h2>Add Past Paper</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Name" type="text" name="name" onChange={handleChange} value={state.name} />
        <Input label="Level" type="number" name="level" onChange={handleChange} value={state.level} />
        <Input label="Year" type="text" name="year" onChange={handleChange} value={state.year} />

        <label>Upload PDF</label>
        <input onChange={handleChange} type="file" name="pdf" accept=".pdf" />

        {state.pdf && <p>Selected file: {state.pdf.name}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Add"}
        </button>
      </form>
    </div>
  );
};

export default AddPastPaper;
