"use client";

import SearchBar from "@/components/search-bar";
import { Personnel } from "@/types/personnel";
import { useState } from "react";
import PersonnelListItem from "./personnel-list-item";

type PersonnelListProps = {
  personnels: Personnel[];
};

export default function PersonnelList({ personnels }: PersonnelListProps) {
  const [query, setQuery] = useState("");

  const filteredPersonnels = personnels.filter(
    (p) =>
      p.adSoyad.toLowerCase().includes(query.toLowerCase()) || p.unvan.toLocaleLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <SearchBar value={query} onChange={setQuery} />
      {filteredPersonnels.map((personnel) => (
        <PersonnelListItem key={personnel.id} personnel={personnel} />
      ))}
    </div>
  );
}
