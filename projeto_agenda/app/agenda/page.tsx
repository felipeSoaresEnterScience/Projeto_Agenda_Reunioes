// /app/agenda/page.tsx

"use client";

import React from "react";
import AgendaClient from "@/components/agenda/AgendaClient";

export default function AgendaPage() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Agenda</h1>
      <AgendaClient />
    </div>
  );
}
