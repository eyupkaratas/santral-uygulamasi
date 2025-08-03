"use client";

import SearchBar from "@/components/search-bar";
import { Lookup } from "@/types/lookup";
import { useState } from "react";
import LookupListItem from "./lookup-list-item";

type LookupListProps = {
  lookups: Lookup[];
};

export default function LookupList({ lookups }: LookupListProps) {
  const [query, setQuery] = useState("");

  const filteredLookups = lookups.filter(
    (l) =>
      l.numara.toString().toLowerCase().includes(query.toLowerCase()) ||
      l.yonu.toLowerCase().includes(query.toLowerCase()) ||
      l.kisiAdSoyad.toLowerCase().includes(query.toLowerCase()) ||
      l.aramaZamani.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <SearchBar value={query} onChange={setQuery} />
      {filteredLookups.map((lookup) => (
        <LookupListItem key={lookup.id} lookup={lookup} />
      ))}
    </div>
  );
}
