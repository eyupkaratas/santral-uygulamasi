"use client";

import SearchBar from "@/components/search-bar";
import { Appointment } from "@/types/appointment";
import { useState } from "react";
import AppointmentListItem from "./appointment-list-item";

type AppointmentListProps = {
  appointments: Appointment[];
};

export default function AppointmentsList({ appointments }: AppointmentListProps) {
  const [query, setQuery] = useState("");

  const filteredAppointments = appointments.filter(
    (a) =>
      a.id.toString().toLowerCase().includes(query.toLowerCase()) ||
      a.konu.toLowerCase().includes(query.toLowerCase()) ||
      a.personelAdi.toLowerCase().includes(query.toLowerCase()) ||
      a.kisiAdi.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <SearchBar value={query} onChange={setQuery} />
      {filteredAppointments.map((appointment) => (
        <AppointmentListItem key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
}
