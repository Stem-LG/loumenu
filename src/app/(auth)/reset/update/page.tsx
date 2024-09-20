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

import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "../../_hooks/use-user";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const params = useSearchParams();
  const code = params.get("code");

  const [hidePass, setHidePass] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!code) return;

    supabase.auth
      .exchangeCodeForSession("44c74f09-2442-4bfd-8658-01791431b5df")
      .then((res) => {
        if (res.error) {
          throw res.error;
        }

        toast.success("Login successful");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }, []);

  const { isError, isFetching } = useUser();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <Card className="z-10 mx-auto w-96 max-w-sm">
      <CardHeader>
        {success ? (
          <>
            <CardTitle className="text-2xl">Success</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </>
        ) : isError ? (
          <>
            <CardTitle className="text-2xl">Invalid link</CardTitle>
            <CardDescription>The link you followed is invalid.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-2xl">New password</CardTitle>
            <CardDescription>Please choose your new password.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent>
        {success ? (
          <Link title="login" href="/login">
            <Button className="w-full">Back</Button>
          </Link>
        ) : isError ? (
          <Link href="/reset" title="reset" className="text-grafiko">
            <Button className="w-full">Request another link</Button>
          </Link>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    onClick={() => setHidePass(!hidePass)}
                    size="sm"
                    type="button"
                    variant="ghost"
                    className="h-6 p-2"
                    disabled={isFetching}
                  >
                    <div className="mr-1">
                      {hidePass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                    {hidePass ? "Show" : "Hide"}
                  </Button>
                </div>
                <Input
                  type={hidePass ? "password" : "text"}
                  name="password"
                  id="password"
                  placeholder="•••••••••"
                  minLength={8}
                  required
                />
              </div>
              <SubmitButton />
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : "Reset password"}
    </Button>
  );
}
