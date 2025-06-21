"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
// import './page.css'
// Dynamically import the form as a client-only component
const AddPastPaperForm = dynamic(() => import("@/components/AddPastPaperFrom"), {
  ssr: false,
});

export default function AddPastPaper() {
  return (
    <div>
      
      <Suspense fallback={<p>Loading form...</p>}>
      
        <AddPastPaperForm />
      </Suspense>
    </div>
  );
}
