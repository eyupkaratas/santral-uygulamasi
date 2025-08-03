import { SignInForm } from "@/components/sign-in-form";
import ThemeToggler from "@/components/theme-toggler";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <Image src="/logo.png" alt="Manisa Belediyesi Logo" width={150} height={150} />
          <p className="text-base font-semibold">Santral Operasyon Uygulaması</p>
        </div>
        <SignInForm />
        <div className="flex w-full justify-center">
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
}
