"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../(auth)/_hooks/use-user";
import { UserButton } from "../(auth)/_components/user-button";

export function AppBar() {

  const { data: user, isError, isRefetching } = useUser();

  return (
    <header className="sticky flex h-14 items-center gap-2 bg-background pr-2 shadow-sm">
      <Link href="/">
        <Image
          src="/assets/logo.svg"
          alt="logo"
          width={150}
          height={56}
          className="object-cover"
        />
      </Link>
      <div className="grow" />
      {!isError && user && (
        <Link href="/dashboard">
          <Button disabled={isRefetching}>
            <span className="-md:hidden">Go to&nbsp;</span> Dashboard
          </Button>
        </Link>
      )}
      <UserButton />
    </header>
  );
}
