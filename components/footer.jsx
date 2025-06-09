"use client";

import React, { useEffect, useState } from "react";
import Input from "./Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./LoginForm.module.css";



const Footer = () => {
  
 
  return (
    <div>
        <p>Facebook</p>
        <p>Youtube</p>
        <p>design by : ..... @copyright 2025 june</p>

    </div>
    

  );
};

export default Footer;
