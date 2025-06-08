"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/ads");
      const data = await res.json();
      setAds(data);
    } catch (err) {
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
        { method: "POST", body: formData }
      );
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
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify(adData),
        }
      );

      if (response.ok) {
        setSuccess(state._id ? "Ad updated." : "Ad created.");
        setState(initialState);
        fetchAds();
      } else {
        setError("Submission failed.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Delete this ad?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      if (res.ok) {
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      } else {
        setError("Failed to delete.");
      }
    } catch (err) {
      setError("Delete error.");
    }
  };

  const handleEdit = (ad) => {
    setState({
      name: ad.name,
      photo: ad.image?.url || null,
      _id: ad._id,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "loading") return <p>Loading session...</p>;
  if (status === "unauthenticated") return <p>Access denied</p>;

  return (
    <section className="container max-w-4xl">
      <h2>{state._id ? "Update" : "Create"} <span className="special-word">Ad</span></h2>
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
          <img src={URL.createObjectURL(state.photo)} alt="Preview" />
        )}
        {typeof state.photo === "string" && (
          <img src={state.photo} alt="Existing" />
        )}

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button type="submit" className="btn">
          {isLoading ? "Submitting..." : state._id ? "Update Ad" : "Create Ad"}
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Existing <span className="special-word">Ads</span></h2>
      {ads.length === 0 ? (
        <p>No ads found.</p>
      ) : (
        <div className="ad-list">
          {ads.map((ad) => (
            <div className="ad-card" key={ad._id}>
              <img src={ad.image?.url || "/no-img.png"} alt={ad.name} />
              <div className="ad-details">
                <p className="font-semibold">{ad.name}</p>
                <p className="text-sm">{ad.image?.url}</p>
              </div>
              <div className="ad-actions">
                <button onClick={() => handleEdit(ad)} className="btn">Edit</button>
                <button onClick={() => handleDelete(ad._id)} className="btn" style={{ backgroundColor: "#d11a2a" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdManager;
