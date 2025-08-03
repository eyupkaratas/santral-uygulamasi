"use client";

import SearchBar from "@/components/search-bar";
import { Ticket } from "@/types/ticket";
import { useState } from "react";
import TicketListItem from "./ticket-list-item";

type TicketListProps = {
  tickets: Ticket[];
};

export default function TicketList({ tickets }: TicketListProps) {
  const [query, setQuery] = useState("");

  const filteredTickets = tickets.filter(
    (t) =>
      t.id.toString().toLowerCase().includes(query.toLowerCase()) ||
      t.konu.toLowerCase().includes(query.toLowerCase()) ||
      t.talebiYapanKisi.toLowerCase().includes(query.toLowerCase()) ||
      t.atananPersonel.toLowerCase().includes(query.toLowerCase()) ||
      t.durum.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <SearchBar value={query} onChange={setQuery} />
      {filteredTickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
