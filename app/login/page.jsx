"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/addnote"); // redirect if already logged in
    }
  }, []);

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;
