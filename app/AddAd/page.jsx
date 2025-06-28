"use client";

import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import './page.css';

const initialState = {
  name: "",
  photo: null,
  _id: null,
};

const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
const UPLOAD_PRESET = "iguide_past_papers";

const AdManager = () => {
  const [state, setState] = useState(initialState);
  const [ads, setAds] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editIdFromQuery = searchParams.get("editId");

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length > 0 && editIdFromQuery) {
      const toEdit = ads.find((ad) => ad._id === editIdFromQuery);
      if (toEdit) {
        setState({
          name: toEdit.name,
          photo: toEdit.image?.url || null,
          _id: toEdit._id,
        });
      }
    }
  }, [ads, editIdFromQuery]);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      if (!res.ok) throw new Error("Failed to fetch ads");
      const data = await res.json();
      setAds(data);
    } catch {
      setError("Failed to fetch ads.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setError("");
    if (type === "file") {
      setState((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async () => {
    if (!state.photo || typeof state.photo === "string") return null;
    const formData = new FormData();
    formData.append("file", state.photo);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Cloudinary upload failed");
      const data = await res.json();
      return { id: data.public_id, url: data.secure_url };
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!state.name || !state.photo) {
      setError("Please fill out all fields.");
      return;
    }

    if (state.photo.size > 5 * 1024 * 1024) {
      setError("Max file size is 5MB.");
      return;
    }

    setIsLoading(true);

    try {
      const image = await uploadImage();
      if (!image && !state._id) {
        setError("Failed to upload image.");
        setIsLoading(false);
        return;
      }

      const adData = {
        name: state.name,
        image: image || (typeof state.photo === "string" ? { url: state.photo } : null),
      };

      const response = await fetch(
        state._id ? `/api/ads/${state._id}` : "/api/ads",
        {
          method: state._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adData),
        }
      );

      if (response.ok) {
        setSuccess(state._id ? "Ad updated." : "Ad created.");
        setState(initialState);
        setTimeout(() => {
          router.push("/news"); // ✅ Navigate to news page
        }, 1000);
      } else {
        setError("Submission failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container max-w-4xl">
      <h2>
        {state._id ? "Update" : "Create"} <span className="special-word">Ad</span>
      </h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          name="name"
          placeholder="Enter ad title..."
          value={state.name}
          onChange={handleChange}
        />

        <label htmlFor="photo">Upload Image</label>
        <input type="file" name="photo" accept="image/*" onChange={handleChange} />
        {state.photo && typeof state.photo !== "string" && (
          <img
            src={URL.createObjectURL(state.photo)}
            alt="Preview"
            style={{ maxWidth: "200px", marginTop: "10px" }}
          />
        )}
        {typeof state.photo === "string" && (
          <img
            src={state.photo}
            alt="Existing"
            style={{ maxWidth: "200px", marginTop: "10px" }}
          />
        )}

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? "Submitting..." : state._id ? "Update Ad" : "Create Ad"}
        </button>
      </form>
    </section>
  );
};

export default AdManager;
export const dynamic = "force-dynamic";
