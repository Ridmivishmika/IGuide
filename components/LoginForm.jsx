"use client";

import React, { useEffect, useState } from "react";
import Input from "./Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

const initialState = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleChange = (event) => {
    setError("");
    setSuccess("");
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = state;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!pattern.test(email)) {
      setError("Enter a valid email");
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // ✅ Store JWT in localStorage
      localStorage.setItem("accessToken", data.token);

      // ✅ Dispatch event so other components (like Navbar) can respond
      window.dispatchEvent(new Event("storage"));

      setSuccess("Login successful!");
      router.push("/addnote");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["note-page-container"]}>
      <h2>Login</h2>
      <section>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="text"
            name="email"
            onChange={handleChange}
            value={state.email}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={state.password}
          />

          {error && <p className={styles["error-message"]}>{error}</p>}
          {success && <p className={styles["success-message"]}>{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>

          <p>
            Haven't Account?{" "}
            <Link href="/signup" className={styles.link}>
              Signup
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default LoginForm;
