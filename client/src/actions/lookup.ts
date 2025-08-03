"use server";

import { DecodedToken } from "@/types/decoded-token";
import { ErrorResponse } from "@/types/error-response";
import { Lookup } from "@/types/lookup";
import { RecordNumberResponse } from "@/types/record-number-response";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
const baseUrl = process.env.API_BASE_URL!;

export async function getLookupsAction() {
  const res = await fetch(`${baseUrl}/api/Lookup`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: Lookup[] = await res.json();
  return data;
}

export async function createNumberRecordAction(formData: {
  no: string;
  direction: number;
  notes: string;
  personName: string;
}): Promise<RecordNumberResponse | ErrorResponse> {
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

  const res = await fetch(`${baseUrl}/api/Lookup`, {
    method: "POST",
    body: JSON.stringify({
      numara: formData.no,
      yonu: formData.direction,
      personelId: decodedToken.personalId,
      notlar: formData.notes,
      yeniKisiAdi: formData.personName,
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

  const data: RecordNumberResponse = await res.json();

  return {
    success: true,
    id: data.id,
  };
}
