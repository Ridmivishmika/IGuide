// app/addnote/AddNoteClient.jsx
"use client";

import dynamic from "next/dynamic";

const AddNoteForm = dynamic(() => import("@/components/AddNoteForm"), { ssr: false });

export default function AddNoteClient() {
  return <AddNoteForm />;
}
