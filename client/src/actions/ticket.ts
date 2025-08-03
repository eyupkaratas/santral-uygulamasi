"use server";

import { DecodedToken } from "@/types/decoded-token";
import { ErrorResponse } from "@/types/error-response";
import { RecordTicketResponse } from "@/types/record-ticket-response";
import { Ticket } from "@/types/ticket";
import { decodeJwt } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const baseUrl = process.env.API_BASE_URL!;

export async function getTicketsAction() {
  const res = await fetch(`${baseUrl}/api/Tickets`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: Ticket[] = await res.json();
  return data;
}

export async function updateTicketAction(
  formData: { personnelId: string; status: string; priority: string },
  ticketId: number
) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const res = await fetch(`${baseUrl}/api/Tickets/${ticketId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
    body: JSON.stringify({
      atananPersonelId: Number(formData.personnelId),
      durum: Number(formData.status),
      oncelik: Number(formData.priority),
    }),
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    return {
      success: false,
      status: error.status,
      message: error.message,
    };
  }

  revalidatePath("/talepler");

  return {
    success: true,
    message: "Talep başarıyla güncellendi.",
  };
}
export async function createTicketAction(formData: {
  subject: string;
  description: string;
  requesterName: string;
  requesterNumber: string;
  assignedPersonnelId: number;
}): Promise<RecordTicketResponse | ErrorResponse> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const decodedToken: DecodedToken = decodeJwt(token.value);

  const res = await fetch(`${baseUrl}/api/Tickets`, {
    method: "POST",
    body: JSON.stringify({
      konu: formData.subject,
      aciklama: formData.description,
      talebiYapanKisiAdi: formData.requesterName,
      talebiYapanKisiNumarasi: formData.requesterNumber,
      atananPersonelId: formData.assignedPersonnelId,
      olusturanPersonelId: decodedToken.personalId,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token?.value}`,
    },
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    return {
      success: false,
      status: error.status,
      message: error.message,
    };
  }

  const data: Ticket = await res.json();

  return {
    success: true,
    ticket: data,
  };
}
