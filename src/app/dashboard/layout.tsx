"use client";
import { useUser } from "../(auth)/_hooks/use-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user, isError, isFetching } = useUser();

  if (user && !isError) {
    return children;
  }

  if (isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      Unauthorized please
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}
