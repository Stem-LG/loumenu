"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../(auth)/_hooks/use-user";
import { createClient } from "@/lib/supabase/client";

export function AppBar() {
  const supabase = createClient();

  const { data: user, refetch, isError, isRefetching } = useUser();

  async function logout() {
    await supabase.auth.signOut();
    refetch();
  }

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
      {isError || !user ? (
        <Link href="/login">
          <Button className="dark:bg-foreground" disabled={isRefetching}>
            Login
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/dashboard">
            <Button disabled={isRefetching}>
              <span className="-md:hidden">Go to&nbsp;</span> Dashboard
            </Button>
          </Link>
          <Button
            className="md:hidden"
            size="icon"
            variant="outline"
            onClick={logout}
            disabled={isRefetching}
          >
            <LogOut />
          </Button>
          <Button
            className="-md:hidden"
            variant="outline"
            onClick={logout}
            disabled={isRefetching}
          >
            Logout
          </Button>
        </>
      )}
    </header>
  );
}
