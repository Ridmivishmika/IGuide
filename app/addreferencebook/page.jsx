// app/addreferencebook/page.jsx (server component)
import React, { Suspense } from "react";
import AddReferenceBookForm from "@/components/AddReferenceBookForm";

export default function ReferenceBookPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddReferenceBookForm />
    </Suspense>
  );
}
