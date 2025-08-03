"use client";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight, Loader2, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import ThemeToggler from "./theme-toggler";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

const navLinks = [
  { href: "/birimler", label: "Birimler" },
  { href: "/personeller", label: "Personeller" },
  {
    label: "Talep",
    submenu: true,
    items: [
      { href: "/talepler", label: "Talepler" },
      { href: "/talep-olustur", label: "Talep Oluştur" },
    ],
  },
  {
    label: "Kargo",
    submenu: true,
    items: [
      { href: "/kargolar", label: "Kargolar" },
      { href: "/kargo-girisi", label: "Kargo Girişi" },
    ],
  },
  {
    label: "Randevu",
    submenu: true,
    items: [
      { href: "/randevularim", label: "Randevular" },
      { href: "/randevu-olustur", label: "Randevu Oluştur" },
    ],
  },
  {
    label: "Numara",
    submenu: true,
    items: [
      { href: "/numara-kaydi", label: "Numara Kaydı" },
      { href: "/numara-arama", label: "Numara Arama" },
    ],
  },
];

export default function Header() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleLogout(e: React.FormEvent) {
    startTransition(async () => {
      e.preventDefault();
      await logoutAction();
      router.push("/anasayfa");
    });
  }

  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/profil" className="text-sm font-semibold md:text-base">
          <div className="text-center">
            Santral Operasyon
            <br />
            Uygulaması
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden gap-2 md:flex" viewport={false}>
          <NavigationMenuList className="gap-2">
            {navLinks.map((navLink, index) => (
              <NavigationMenuItem key={index}>
                {navLink.submenu ? (
                  <>
                    <NavigationMenuTrigger className="px-2 py-1.5 font-medium">{navLink.label}</NavigationMenuTrigger>
                    <NavigationMenuContent className="data-[motion=from-end]:slide-in-from-right-16! data-[motion=from-start]:slide-in-from-left-16! data-[motion=to-end]:slide-out-to-right-16! data-[motion=to-start]:slide-out-to-left-16! z-50 p-1">
                      <ul className="min-w-36">
                        {navLink.items.map((item, index) => (
                          <li key={index}>
                            <NavigationMenuLink href={item.href} className="py-1.5 font-medium">
                              {item.label}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink href={navLink.href} className="px-2 py-1.5 font-medium">
                    {navLink.label}
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>

          <ThemeToggler />

          <form onSubmit={handleLogout}>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Çıkış Yap"}
            </Button>
          </form>
        </NavigationMenu>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="flex w-64 flex-col justify-between p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2">
                  <SheetTitle>Menü</SheetTitle>
                  <ThemeToggler />
                </div>

                <div className="space-y-2">
                  {navLinks.map((navLink, index) => (
                    <div key={index}>
                      {navLink.submenu ? (
                        <details className="group">
                          <summary className="flex items-center justify-between rounded px-2 py-1.5 font-medium">
                            {navLink.label}
                            <span className="transition-transform group-open:rotate-90">
                              <ChevronRight width={16} height={16} />
                            </span>
                          </summary>

                          <ul className="mt-2 ml-4 space-y-1">
                            {navLink.items.map((item, idx) => (
                              <li key={idx}>
                                <Link href={item.href} className="block rounded px-2 py-1 font-medium">
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ) : (
                        <Link href={navLink.href!} className="block rounded px-2 py-1.5 font-medium">
                          {navLink.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleLogout}>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="animate-spin" /> : "Çıkış Yap"}
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
