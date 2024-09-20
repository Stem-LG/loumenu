"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [success, setSuccess] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset/update",
    });
    if (error) {
      toast.error(error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <Card className="z-10 mx-auto w-96 max-w-sm bg-card/50">
      <CardHeader>
        {success ? (
          <>
            <CardTitle className="text-2xl">Request sent</CardTitle>
            <CardDescription>
              Check your email for instructions on how to reset your password.
            </CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-2xl">Forgot Your Password ?</CardTitle>
            <CardDescription>
              Enter your email and we will send you instructions on how to reset
              your password.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {success ? (
          <Link title="login" href="/login">
            <Button className="w-full">Back</Button>
          </Link>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  autoFocus
                  placeholder="example@mail.com"
                  required
                />
              </div>
              <SubmitButton />
              <Link title="login" href="/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-grafiko hover:text-grafiko -mt-2 w-full"
                >
                  Back
                </Button>
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const pending = false;

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Reset password"}
    </Button>
  );
}
