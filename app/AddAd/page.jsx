"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import Image from "next/image";

const initialState = {
  name: "",
  photo: "",
};

const CLOUDINARY_CLOUD_NAME = "dwq5xfmci";
const UPLOAD_PRESET = "iguide_past_papers";

const CreateAd = () => {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access denied</p>;

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;
    if (type === "file") {
      setState({ ...state, [name]: files[0] });
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const uploadImage = async () => {
    if (!state.photo) return null;

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

      const data = await res.json();
      return {
        id: data.public_id,
        url: data.secure_url,
      };
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, photo } = state;

    if (!name || !photo) {
      setError("Please fill out all required fields.");
      return;
    }

    if (photo.size > 5 * 1024 * 1024) {
      setError("File size is too large. Max 5MB allowed.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const image = await uploadImage();
      if (!image) {
        setError("Failed to upload image.");
        return;
      }

      const newAd = { name, image };

      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(newAd),
      });

      if (response.status === 201) {
        setSuccess("Ad created successfully.");
        setTimeout(() => {
          router.refresh();
          router.push("/news");
        }, 1500);
      } else {
        setError("Error occurred while creating the ad.");
      }
    } catch (error) {
      console.error("Create Ad Error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container max-w-3xl">
      <h2 className="mb-5">
        <span className="special-word">Create</span> Ad
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Name"
          type="text"
          name="name"
          placeholder="Enter ad title..."
          onChange={handleChange}
          value={state.name}
        />

        <div>
          <label className="block mb-2 text-sm font-medium">Upload Image</label>
          <input
            onChange={handleChange}
            type="file"
            name="photo"
            accept="image/*"
          />

          {state.photo && (
            <div>
              <Image
                src={URL.createObjectURL(state.photo)}
                alt="Ad Preview"
                width={150}
                height={150}
                className="mt-4 rounded-md"
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <button type="submit" className="btn">
          {isLoading ? "Submitting..." : "Create Ad"}
        </button>
      </form>
    </section>
  );
};

export default CreateAd;
