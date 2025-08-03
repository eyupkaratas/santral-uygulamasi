"use server";

import { Birim } from "@/types/personnel";

const baseUrl = process.env.API_BASE_URL!;

export async function getUnitsAction() {
  const res = await fetch(`${baseUrl}/api/Birimler`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data: Birim[] = await res.json();
  return data;
}
