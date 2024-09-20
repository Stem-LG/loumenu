"use client";
import Image from "next/image";
import Link from "next/link";
import bgImage from "../_assets/custom-bg.svg";
import { useUser } from "./_hooks/use-user";
import { redirect, usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user, isError } = useUser();

  const pathname = usePathname();

  if (user && !isError && pathname !== "/reset/update") {
    return redirect("/");
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden">
      {children}
      <Link href="/">
        <Image
          src="/assets/logo.svg"
          width={280}
          height={150}
          className="absolute left-0 top-2 z-10 mx-auto object-contain -md:-top-1 -md:h-20 -md:w-full"
          alt="logo"
        />
      </Link>

      <Image
        src={bgImage}
        alt="bg"
        className="pointer-events-none absolute h-full w-full object-cover"
      />
    </div>
  );
}
