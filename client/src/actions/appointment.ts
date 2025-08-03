"use server";

import { Appointment } from "@/types/appointment";
import { ErrorResponse } from "@/types/error-response";
import { RecordAppointmentResponse } from "@/types/record-appointment-response";
import { cookies } from "next/headers";

const baseUrl = process.env.API_BASE_URL!;

export async function getAppointmentsAction() {
  const res = await fetch(`${baseUrl}/api/Randevular`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: Appointment[] = await res.json();
  return data;
}

export async function createAppointmentAction(formData: {
  subject: string;
  baslangicZamani: Date;
  bitisZamani: Date;
  personnelId: number;
  kisiId: number;
}): Promise<RecordAppointmentResponse | ErrorResponse> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Yetkisiz erişim.",
    };
  }

  const res = await fetch(`${baseUrl}/api/Randevular`, {
    method: "POST",
    body: JSON.stringify({
      konu: formData.subject,
      baslangicZamani: formData.baslangicZamani,
      bitisZamani: formData.bitisZamani,
      personelId: formData.personnelId,
      kisiId: formData.kisiId,
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

  const data: Appointment = await res.json();

  return {
    success: true,
    appointment: data,
  };
}
