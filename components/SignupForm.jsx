"use client";

import React, { useEffect, useState } from "react";
import Input from './Input';
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from './SignupForm.module.css';

const initialState = {
  name: "",
  email: "",
  user_name: "",
  password: ""
};

const SignupForm = () => {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    const { name, email, user_name, password } = state;

    if (!name || !email || !user_name || !password) {
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
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, user_name, password })
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess("Registration successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['signup-page-container']}>
      <h2>Sign Up</h2>
      <section className={styles['signup-form-section']}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            type="text"
            name="name"
            onChange={handleChange}
            value={state.name}
          />
          <Input
            label="Email"
            type="text"
            name="email"
            onChange={handleChange}
            value={state.email}
          />
          <Input
            label="User Name"
            type="text"
            name="user_name"
            onChange={handleChange}
            value={state.user_name}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={state.password}
          />

          {error && <p className={styles["signup-error-message"]}>{error}</p>}
          {success && <p className={styles["signup-success-message"]}>{success}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Signup"}
          </button>

          <p>
            Already a user?{" "}
            <Link href="/login" className={styles.link}>Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
};

export default SignupForm;
