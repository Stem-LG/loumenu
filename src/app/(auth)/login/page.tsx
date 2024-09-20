"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { GoogleIcon } from "../_icons";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "../_hooks/use-user";

export default function LoginPage() {
  const supabase = createClient();

  const [hidePass, setHidePass] = useState(true);

  const { refetch } = useUser();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      refetch();
    }
  }

  async function googleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      toast.error(error.message);
    } else {
      refetch();
    }
  }

  return (
    <Card className="z-10 mx-auto w-96 max-w-sm bg-card/50">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
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

            <div className="grid gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  onClick={() => setHidePass(!hidePass)}
                  size="sm"
                  type="button"
                  variant="ghost"
                  className="h-6 p-2"
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

            <div className="-my-4 text-right">
              <Link className="text-sm" href="/reset">
                Need Help?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="-my-1 flex items-center justify-between">
              <Separator className="w-[45%] bg-slate-400" />
              or
              <Separator className="w-[45%] bg-slate-400" />
            </div>
            <Button
              onClick={googleLogin}
              type="button"
              variant="outline"
              className="w-full"
            >
              <GoogleIcon className="mr-2" /> Login with Google
            </Button>
            {/* <Button
              // onClick={async () => await signInWithFacebook()}
              type="button"
              variant="outline"
              className="-mt-1 w-full"
            >
              <FacebookIcon className="mr-2" /> Login with Facebook
            </Button>
            {facebook_error && (
              <p className="-mt-3 ml-1 text-sm text-red-500">
                unknown error, please try again
              </p>
            )} */}
          </div>
        </form>
        <div className="mt-4 text-sm">
          No account ?
          <Link href="/register" className="ml-2 font-medium underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
