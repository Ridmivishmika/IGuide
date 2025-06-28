"use client";

import React, { useEffect, useState } from "react";
import styles from "./ManageAccess.module.css";
import { FaTrash, FaCheckCircle } from "react-icons/fa";

const ManageAccess = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      setError("You must be logged in as owner to view this page.");
      return;
    }

    setToken(storedToken);
    loadUsers(storedToken);
  }, []);

  const loadUsers = async (jwt) => {
    try {
      const res = await fetch("/api/all-users", {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) throw new Error("Not authorized");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load users or not authorized");
    }
  };

  const grantAccess = async (email) => {
    setError("");
    setSuccess("");

    const res = await fetch("/api/grant-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ delegateEmail: email }),
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess(`Access granted to ${email}`);
      loadUsers(token);
    } else {
      setError(result.error || "Failed to grant access");
    }
  };

  const deleteUser = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;

    setError("");
    setSuccess("");

    const res = await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess(`User ${email} deleted`);
      loadUsers(token);
    } else {
      setError(result.error || "Failed to delete user");
    }
  };

  const approvedUsers = users.filter((u) => u.isApproved);
  const pendingUsers = users.filter((u) => !u.isApproved);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage User Access</h2>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {/* ✅ Approved Users */}
      <h3 className={styles.sectionTitle}>✅ All Admins</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`${styles.status} ${styles.approved}`}>
                    In work
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => deleteUser(u.email)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ❌ Pending Approval */}
      <h3 className={styles.sectionTitle}>❌ Waiting for Approval</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`${styles.status} ${styles.pending}`}>
                    Pendin Approval
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => grantAccess(u.email)}
                      title="Grant Access"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className={styles.iconBtn}
                      onClick={() => deleteUser(u.email)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAccess;
