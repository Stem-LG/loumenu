"use client";
import { redirect } from "next/navigation";
import { useUser } from "../(auth)/_hooks/use-user";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: user, isError, isFetching } = useUser();

  if ((user && !isError) || isFetching) {
    return children;
  }

  return redirect("/login");
}
