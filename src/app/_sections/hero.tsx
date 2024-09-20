"use client";

import Image from "next/image";
import bgImage from "../_assets/custom-bg.svg";
import { Expletus_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { useUser } from "../(auth)/_hooks/use-user";

const expletus = Expletus_Sans({ subsets: ["latin"], display: "swap" });

export function HeroSection() {
  const { data: user, isError, isRefetching } = useUser();

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem)] items-center justify-center">
      <Image
        src={bgImage}
        alt="hero"
        className="pointer-events-none absolute h-full w-full object-cover"
      />

      <div
        className={cn(
          "z-10 space-y-2 text-center text-3xl sm:text-5xl md:space-y-10 md:text-6xl lg:text-7xl",
          expletus.className,
        )}
      >
        <p className="font-light text-muted-foreground">
          The best way to create
        </p>
        <p className="font-bold text-primary">Digital Menus</p>
        <p className="-md:pb-10 font-normal">for your restaurant</p>
        <Link href={user && !isError ? "/dashboard" : "/register"}>
          <Button
            className="relative mt-16 p-6 text-base"
            disabled={isRefetching}
          >
            <div
              className="absolute -right-3 -top-2.5 h-4 w-4 animate-bounce"
              style={{ animationDuration: "1s" }}
            >
              <Star
                className="h-full w-full animate-spin fill-primary stroke-primary"
                style={{ animationDuration: "3s" }}
              />
            </div>
            {user && !isError ? "Go to dashboard" : "Get started for free"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
