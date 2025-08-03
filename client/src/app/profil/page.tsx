import Profile from "@/components/profile";
import { DecodedToken } from "@/types/decoded-token";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token");

  if (!token?.value) {
    throw new Error("Yetkisiz erişim: Token bulunamadı.");
  }

  const decodedToken: DecodedToken = decodeJwt(token?.value);

  return (
    <div className="w-full max-w-sm">
      <Profile decodedToken={decodedToken} />
    </div>
  );
}
