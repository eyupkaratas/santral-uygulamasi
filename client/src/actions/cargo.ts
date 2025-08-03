"use server";

import { Cargo } from "@/types/cargo";
import { ErrorResponse } from "@/types/error-response";
import { RecordCargoResponse } from "@/types/record-cargo-response";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const baseUrl = process.env.API_BASE_URL!;

export async function getCargosAction() {
  const res = await fetch(`${baseUrl}/api/Kargolar`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: Cargo[] = await res.json();
  return data;
}

export async function createCargoAction(formData: {
  senderName: string;
  description: string;
  trackingNumber: string;
  recipientPersonnelId: number;
}): Promise<RecordCargoResponse | ErrorResponse> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const res = await fetch(`${baseUrl}/api/Kargolar`, {
    method: "POST",
    body: JSON.stringify({
      gonderen: formData.senderName,
      aciklama: formData.description,
      takipNumarasi: formData.trackingNumber,
      teslimAlanPersonelId: formData.recipientPersonnelId,
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

  const data: Cargo = await res.json();

  return {
    success: true,
    cargo: data,
  };
}

export async function deliverCargoAction(cargoId: number) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const res = await fetch(`${baseUrl}/api/Kargolar/${cargoId}/teslimet`, {
    method: "PUT",
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

  revalidatePath("/kargolar");

  return {
    success: true,
    message: "Kargo teslim edildi olarak işaretlendi.",
  };
}
