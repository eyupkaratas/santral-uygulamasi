"use client";

import SearchBar from "@/components/search-bar";
import { Cargo } from "@/types/cargo";
import { useState } from "react";
import CargoListItem from "./cargo-list-item";

type CargoListProps = {
  cargos: Cargo[];
};

export default function CargoList({ cargos }: CargoListProps) {
  const [query, setQuery] = useState("");

  const filteredCargos = cargos.filter(
    (c) =>
      c.durum.toLowerCase().includes(query.toLowerCase()) ||
      c.gonderen.toLowerCase().includes(query.toLowerCase()) ||
      c.takipNumarasi.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <SearchBar value={query} onChange={setQuery} />
      {filteredCargos.map((cargo) => (
        <CargoListItem key={cargo.id} cargo={cargo} />
      ))}
    </div>
  );
}
