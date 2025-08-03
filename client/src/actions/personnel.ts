"use server";

import { ErrorResponse } from "@/types/error-response";
import { Personnel } from "@/types/personnel";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const baseUrl = process.env.API_BASE_URL!;

export async function getPersonnelsAction(birimId?: string) {
  const params = new URLSearchParams();

  if (birimId) params.append("birimId", birimId.toString());

  const res = await fetch(`${baseUrl}/api/Personeller?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: Personnel[] = await res.json();
  return data;
}

export async function createPersonnelAction(formData: {
  personnelName: string;
  position: string;
  personnelId: string;
  email: string;
  password: string;
  unitId: string;
  role: string;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const res = await fetch(`${baseUrl}/api/Personeller/`, {
    method: "POST",
    body: JSON.stringify({
      adSoyad: formData.personnelName,
      unvan: formData.position,
      dahili: formData.personnelId,
      eposta: formData.email,
      sifre: formData.password,
      birimId: Number(formData.unitId),
      rol: formData.role,
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

  revalidatePath("/personeller");

  return {
    success: true,
    message: "Personel başarıyla oluşturuldu.",
  };
}

export async function deletePersonnelAction(personnelId: number) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const res = await fetch(`${baseUrl}/api/Personeller/${personnelId}`, {
    method: "DELETE",
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

  revalidatePath("/personeller");

  return {
    success: true,
    message: "Personel başarıyla silindi.",
  };
}
