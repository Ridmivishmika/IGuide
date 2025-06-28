"use client";

import React from "react";
import styles from "./footer.module.css";
import { FaFacebookF, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>iGuide</h2>
      <p className={styles.subtitle}>
        Empowering the next generation of legal minds through quality academic resources.
      </p>
      <div className={styles.socialIcons}>
        <a href="https://www.facebook.com/iGuidelk?mibextid=ZbWKwL" aria-label="Facebook"><FaFacebookF /></a>
        <a href="https://youtube.com/@iguideelearning?si=VyLfhtsU1-j-oz4x" aria-label="YouTube"><FaYoutube /></a>
      </div>
      <p className={styles.copyright}>
        Design by  · © 2025 June
      </p>
    </footer>
  );
};

export default Footer;
