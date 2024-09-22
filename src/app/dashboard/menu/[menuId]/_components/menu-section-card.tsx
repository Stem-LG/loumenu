"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function MenuSectionCard({ menuSection, changeSectionName }) {
  return (
    <div className="flex-1 rounded-xl border bg-card p-4 [&>label]:ml-1">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        value={menuSection.name}
        onChange={(e) => changeSectionName(menuSection.id, e.target.value)}
      />
      <div className="w-full border rounded-xl mt-4 p-4">

      </div>
    </div>
  );
}